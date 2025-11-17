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

  const { coursePackageId, baseUrl } = payload;
  if (!coursePackageId) {
    return NextResponse.json(
      { error: "CoursePackage ID is required." },
      { status: 400 }
    );
  }

  try {
    const course = await prisma.coursePackage.findUnique({
      where: { id: coursePackageId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

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
            unit_amount: (course.price?.toNumber?.() || 0) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: baseUrl + "/my-courses",
      cancel_url: baseUrl,
      metadata: {
        userId: userId.toString(),
        packageId: course.id.toString(),
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
