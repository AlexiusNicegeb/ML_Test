export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    let packages = await prisma.coursePackage.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        mediaUrl: true,
        price: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const packageCourses = await prisma.coursePackageCourse.findMany({
      select: {
        coursePackageId: true,
        courseId: true,
      },
    });

    packages = packages.map((pkg) => {
      return {
        ...pkg,
        courseIds: packageCourses
          .filter((pc) => pc.coursePackageId === pkg.id)
          .map((pc) => pc.courseId),
      };
    });

    return NextResponse.json(packages, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/all-courses Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
