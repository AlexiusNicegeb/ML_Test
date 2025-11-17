export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { Buffer } from "buffer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // 1. Verify Stripe signature
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    // Read raw body as buffer
    const buf = Buffer.from(await request.arrayBuffer());
    const stripe = new Stripe(stripeSecret);
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 2. Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const meta = session.metadata || {};

    const userId = meta.userId as string;
    const courseId = meta.courseId ? +meta.courseId : undefined;
    const packageId = meta.packageId ? +meta.packageId : undefined;
    const couponId = (meta.couponId as string) || "";

    // Prices in cents
    const originalPriceCents = parseInt(meta.originalPrice || "0", 10);
    const discountedPriceCents = parseInt(meta.discountedPrice || "0", 10);
    const pricePaid = (session.amount_total ?? discountedPriceCents) / 100;

    // Compute actual discount percentage
    const discountApplied =
      originalPriceCents > 0
        ? Math.round(
            ((originalPriceCents - discountedPriceCents) / originalPriceCents) *
              100
          )
        : 0;

    if (!userId || (!courseId && !packageId)) {
      console.error(session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { redeemed: true, redeemedAt: new Date() },
        });
      }

      if (courseId) {
        // 4. Upsert CoursePurchase record
        await prisma.coursePurchase.upsert({
          where: { userId_courseId: { userId, courseId } },
          create: {
            userId,
            courseId,
            couponId: couponId || null,
            pricePaid,
            discountApplied,
          },
          update: {
            couponId: couponId || null,
            pricePaid,
            discountApplied,
          },
        });
      }

      if (packageId) {
        await prisma.coursePackagePurchase.upsert({
          where: {
            userId_packageId: { userId, packageId },
          },
          create: {
            userId,
            packageId,
          },
          update: {
            userId,
            packageId,
          },
        });
      }
    } catch (dbErr: any) {
      console.error("❌ Database error in Stripe webhook:", dbErr);
      // swallow the error so Stripe still gets a 200 ACK
    }
  }

  // 5. Return a 200 response to acknowledge receipt
  return NextResponse.json({ received: true }, { status: 200 });
}
