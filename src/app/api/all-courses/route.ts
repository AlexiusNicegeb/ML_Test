export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    console.error("GET /api/all-courses Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
