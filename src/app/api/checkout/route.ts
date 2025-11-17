export const dynamic = "force-dynamic";

import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  // 1. Authenticate user
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.sub;
  const text = await request.text();
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const { courseId, couponId, baseUrl } = payload;
  if (!courseId) {
    return NextResponse.json(
      { error: "Course ID is required." },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { Coupon: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    let discountPercent = course.discount ?? 0;

    let coupon = null;
    if (couponId) {
      coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      const now = new Date();
      const isValidCoupon =
        coupon &&
        coupon.validFrom <= now &&
        (!coupon.validTo || coupon.validTo >= now) &&
        !coupon.redeemed &&
        coupon.courseId === course.id;

      if (isValidCoupon) {
        discountPercent = coupon.discountPercent;
      } else {
        return NextResponse.json(
          { error: "Invalid or expired coupon." },
          { status: 400 }
        );
      }
    }

    const originalPrice = course.price?.toNumber?.() || 0;
    const finalPrice = Math.round(
      originalPrice * (1 - discountPercent / 100) * 100
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description || "",
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      success_url: baseUrl + "/my-courses",
      cancel_url: baseUrl,
      metadata: {
        userId: userId.toString(),
        courseId: course.id.toString(),
        couponId: coupon?.id?.toString() || "",
        pricePaid: (finalPrice / 100).toFixed(2),
        discountApplied: discountPercent.toString(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Stripe session creation error:", err);
    return NextResponse.json(
      { error: "Server error: failed to create Stripe session." },
      { status: 500 }
    );
  }
}
