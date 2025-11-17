export const dynamic = "force-dynamic";

import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Authenticate
  let user;
  try {
    user = verifyAuth(request);
  } catch (res) {
    return res;
  }
  const userId = user.sub;

  const packagePurchases = await prisma.coursePackagePurchase.findMany({
    where: { userId },
    orderBy: { purchasedAt: "desc" },
  });

  const packagedIds = packagePurchases.map((p) => p.packageId);

  const packageCourses = await prisma.coursePackageCourse.findMany({
    where: {
      coursePackageId: { in: packagedIds },
    },
    select: {
      coursePackageId: true,
      courseId: true,
    },
  });

  // 2. Fetch all purchases for this user
  const purchases = await prisma.coursePurchase.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
    },
    orderBy: { purchasedAt: "desc" },
  });

  // We'll load all in one go by course IDs
  // const courseIds = purchases.map((p) => p.courseId);

  // 4. Shape the response
  const result = {
    packages: packageCourses,
    courses: purchases.map((p) => {
      const c = p.course;
      return {
        purchase: {
          purchasedAt: p.purchasedAt,
          pricePaid: parseFloat(p.pricePaid.toString()),
          discountApplied: p.discountApplied,
        },
        course: {
          id: c.id,
          code: c.courseCode,
          slug: c.slug,
          title: c.title,
          description: c.description,
          mediaUrl: c.mediaUrl,
          price: parseFloat(c.price.toString()),
          discount: c.discount,
          discountExpiresAt: c.discountExpiresAt,
          createdAt: c.createdAt,
        },
      };
    }),
  };

  return NextResponse.json(result, { status: 200 });
}
