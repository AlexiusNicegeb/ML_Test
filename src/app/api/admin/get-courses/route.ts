export const dynamic = "force-dynamic";

import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const decoded = verifyAuth(request);
  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 403 });
  }

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        slug: true,
        courseCode: true,
        createdAt: true,
        title: true,
        description: true,
        mediaUrl: true,
        price: true,
        discount: true,
        discountExpiresAt: true,
        purchases: true,
        tags: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/admin/get-courses Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
