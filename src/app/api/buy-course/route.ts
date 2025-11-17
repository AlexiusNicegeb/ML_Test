// app/api/buy-courses/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const user = verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse & validate payload
  const { courseId: rawCourseId, couponCode } = (await req.json()) as {
    courseId: number | string;
    couponCode?: string;
  };
  const courseId =
    typeof rawCourseId === "string" ? parseInt(rawCourseId, 10) : rawCourseId;
  if (isNaN(courseId)) {
    return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
  }

  // 3. Load course & its potential site-wide discount
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      title: true,
      price: true, // Decimal
      discount: true, // Int? (0–100)
      discountExpiresAt: true,
    },
  });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  // 4. Compute basePrice (apply course.discount if still valid)
  const now = new Date();
  let basePrice = parseFloat(course.price.toString()); // e.g. 100.00
  if (
    typeof course.discount === "number" &&
    course.discount > 0 &&
    (course.discountExpiresAt === null ||
      new Date(course.discountExpiresAt) > now)
  ) {
    basePrice = +(basePrice * (1 - course.discount / 100)).toFixed(2);
  }

  // 5. If couponCode provided, load & apply it
  let couponId: string | null = null;
  let finalPrice = basePrice;
  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
        redeemed: false,
        validFrom: { lte: now },
        OR: [{ validTo: null }, { validTo: { gte: now } }],
      },
    });
    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon" },
        { status: 400 }
      );
    }
    couponId = coupon.id;
    finalPrice = +(basePrice * (1 - coupon.discountPercent / 100)).toFixed(2);
  }

  // 6. Create Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: course.title },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/my-courses?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/courses/${courseId}`,
      metadata: {
        userId: user.sub,
        courseId: courseId.toString(),
        couponId: couponId ?? "",
        originalPrice: Math.round(basePrice * 100).toString(),
        discountedPrice: Math.round(finalPrice * 100).toString(),
      },
    });

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST /api/buy-courses error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
