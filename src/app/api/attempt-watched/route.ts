import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let session;
  try {
    session = verifyAuth(request);
  } catch (res) {
    return res;
  }

  const userId = session.sub;

  try {
    const body = await request.json();

    const { watched, round } = body;
    const courseId = +body.courseId;

    if (!watched) {
      console.error("❌ Missing required fields in body");
      return NextResponse.json(
        { error: "Missing fields", body },
        { status: 400 }
      );
    }

    const attempt = await prisma.userModuleResult.upsert({
      where: {
        userId_courseId_round: { userId, courseId, round },
      },
      update: {
        watched,
      },
      create: {
        userId,
        contents: {},
        courseId,
        round,
        evaluation: {
          history: [],
        },
        watched,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error in /api/attempt", err.message);
    return NextResponse.json(
      { error: "DB error", message: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}
