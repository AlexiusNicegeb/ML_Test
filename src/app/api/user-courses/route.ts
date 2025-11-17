// app/api/user-courses/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // 1. Authenticate user
  let user;
  try {
    user = verifyAuth(request);
  } catch (res) {
    // verifyAuth throws a NextResponse if not authenticated
    return res;
  }
  const userId = user.sub;

  try {
    // 2. Fetch all purchases for this user
    const purchases = await prisma.coursePurchase.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            courseCode: true,
            title: true,
            description: true,
            mediaUrl: true, // cover/preview URL
            price: true, // Decimal
            discount: true, // Int? (0–100)
            discountExpiresAt: true, // Date?
            createdAt: true,
          },
        },
      },
      orderBy: { purchasedAt: "desc" },
    });

    // 3. Shape the response
    const now = new Date();
    const data = purchases.map((p) => {
      const c = p.course;
      const basePrice = parseFloat(c.price.toString());
      const isDiscounted =
        typeof c.discount === "number" &&
        c.discount > 0 &&
        (!c.discountExpiresAt || c.discountExpiresAt > now);

      return {
        id: c.id,
        code: c.courseCode,
        title: c.title,
        description: c.description,
        mediaUrl: c.mediaUrl,
        price: basePrice,
        isDiscounted,
        discountPercent: isDiscounted ? c.discount! : null,
        createdAt: c.createdAt.getTime(),

        // purchase-specific
        purchasedAt: p.purchasedAt.getTime(),
        pricePaid: parseFloat(p.pricePaid.toString()),
        discountApplied: p.discountApplied ?? 0,
      };
    });

    // 4. Return sorted list
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/user-courses error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
