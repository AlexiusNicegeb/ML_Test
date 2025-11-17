export const dynamic = "force-dynamic";

import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const decodedUser = verifyAuth(request);
  if (decodedUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const { id, title, description, mediaUrl, price, slug, courseIds } = body as {
    id?: number;
    title: string;
    mediaUrl: string;
    price: number;
    description?: string;
    slug?: string;
    courseIds: string[];
  };

  if (!title || !mediaUrl || !price || !courseIds) {
    console.error("❌ Missing required fields in body");
    return NextResponse.json(
      { error: "Missing fields", body },
      { status: 400 }
    );
  }
  try {
    const coursePackage = await prisma.coursePackage.upsert({
      where: { id: id || 0 },
      create: {
        title,
        description,
        mediaUrl,
        price,
        slug: slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        courseLinks: {
          create: courseIds.map((courseId) => ({ courseId: +courseId })),
        },
      },
      update: {
        title,
        description,
        mediaUrl,
        price,
        slug: slug,
        updatedAt: new Date(),
        courseLinks: {
          deleteMany: {},
          create: courseIds.map((courseId) => ({ courseId: +courseId })),
        },
      },
    });

    return NextResponse.json(coursePackage, { status: 200 });
  } catch (err) {
    console.error("❌ Error in /api/course-package", err.message);
    return NextResponse.json(
      { error: "DB error", message: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}
