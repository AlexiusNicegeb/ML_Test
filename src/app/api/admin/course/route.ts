// app/api/admin/course/route.ts

export const dynamic = "force-dynamic";

import { generateRandomString } from "@/app/helpers";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper to generate URL-friendly slug from title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// GET all courses with their modules, coupons and tags
export async function GET() {
  const courses = await prisma.course.findMany({
    include: {
      // include all coupons linked to this course
      Coupon: true,
      // include pivot table entries + the actual Tag object
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses, { status: 200 });
}

// Create a new course (admin only)
export async function POST(request: NextRequest) {
  const decodedUser = verifyAuth(request);
  if (decodedUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    title,
    description,
    mediaUrl,
    price,
    discount,
    discountExpiresAt,
    slug,
    tags,
  } = body as {
    title: string;
    description?: string;
    mediaUrl: string;
    price?: number;
    discount?: number;
    discountExpiresAt?: string;
    slug?: string;
    tags?: string[];
  };

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        mediaUrl,
        // generate a unique lookup code
        courseCode: generateRandomString(8),
        // either use passed slug or generate from title
        slug: slug || slugify(title),
        // price = 0 means free
        price: price != null ? Number(price) : undefined,
        // clamp discount between 0–100
        discount:
          discount != null ? Math.min(Math.max(discount, 0), 100) : undefined,
        discountExpiresAt: discountExpiresAt
          ? new Date(discountExpiresAt)
          : undefined,
        // connect or create tags via the pivot CourseTag table
        tags:
          tags && tags.length > 0
            ? {
                create: tags.map((name: string) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name },
                      create: { name },
                    },
                  },
                })),
              }
            : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        Coupon: true,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update an existing course (admin only)
export async function PUT(request: NextRequest) {
  const decodedUser = verifyAuth(request);
  if (decodedUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const {
    courseId,
    title,
    description,
    mediaUrl,
    price,
    discount,
    discountExpiresAt,
    slug,
    tags,
  } = body as {
    courseId: number;
    title: string;
    description?: string;
    mediaUrl: string;
    price?: number;
    discount?: number;
    discountExpiresAt?: string;
    slug?: string;
    tags?: string[];
  };

  // check existence
  const existing = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  try {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        mediaUrl,
        slug: slug || slugify(title),
        price: price != null ? Number(price) : undefined,
        discount:
          discount != null ? Math.min(Math.max(discount, 0), 100) : undefined,
        discountExpiresAt: discountExpiresAt
          ? new Date(discountExpiresAt)
          : undefined,
        // reset tags and attach new ones
        tags: tags
          ? {
              deleteMany: {},
              create: tags.map((name: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
        Coupon: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/admin/course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Delete a course (admin only)
export async function DELETE(request: NextRequest) {
  const decodedUser = verifyAuth(request);

  if (decodedUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = (await request.json()) as { courseId: number };
  if (!courseId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // check existence
  const existing = await prisma.course.findUnique({
    where: { id: courseId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  try {
    await prisma.course.delete({ where: { id: courseId } });
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/admin/course Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
