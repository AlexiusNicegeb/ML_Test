import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let session;
  try {
    session = verifyAuth(request);
  } catch (res) {
    return res;
  }

  const courseId = searchParams.get("courseId");
  const userId = session.sub;

  try {
    const results = await prisma.userModuleResult.findMany({
      where: {
        userId,
        courseId: +courseId,
      },
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        userId: true,
        courseId: true,
        round: true,
        watched: true,
        submittedAt: true,
        evaluation: true,
        contents: true,
      },
    });

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("❌ Error in GET /api/course-type-results", err.message);
    return NextResponse.json(
      { error: "Database error", message: err.message },
      { status: 500 }
    );
  }
}
