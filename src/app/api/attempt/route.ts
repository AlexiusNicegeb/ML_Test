import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    const { round, task, answers, evaluation, subMetrics } = body;
    const courseId = +body.courseId;

    if (!task || !answers || !evaluation || !subMetrics || !courseId) {
      console.error("❌ Missing required fields in body");
      return NextResponse.json(
        { error: "Missing fields", body },
        { status: 400 }
      );
    }

    const existing = await prisma.userModuleResult.findUnique({
      where: {
        userId_courseId_round: { userId, courseId, round },
      },
    });

    const newEval = {
      task,
      round,
      submittedAt: new Date(),
      total: evaluation.total,
      grade: evaluation.grade,
      sub: subMetrics,
      breakdown: {
        Aufbau: evaluation.Aufbau,
        Formales: evaluation.Formales,
        Inhalt: evaluation.Inhalt,
        Sprachstil: evaluation.Sprachstil,
      },
    };

    let updatedHistory = [newEval];

    //@ts-ignore
    if (existing?.evaluation?.history) {
      //@ts-ignore
      const filtered = existing.evaluation.history.filter(
        (e: any) => e.task !== task
      );

      updatedHistory = [...filtered, newEval];
    }
    const attempt = await prisma.userModuleResult.upsert({
      where: {
        userId_courseId_round: { userId, courseId, round },
      },
      update: {
        contents: existing?.contents
          ? {
              ...(existing.contents as any),
              ...answers,
            }
          : {
              ...answers,
            },
        evaluation: {
          history: updatedHistory,
        },
        courseId,
        submitted: true,
        submittedAt: new Date(),
      },
      create: {
        userId,
        contents: answers,
        courseId,
        round,
        evaluation: {
          history: [newEval],
        },
        watched: false,
        submitted: true,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, attempt }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error in /api/attempt", err.message);
    return NextResponse.json(
      { error: "DB error", message: err.message, stack: err.stack },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  let session;
  try {
    session = verifyAuth(request);
  } catch (res) {
    return res;
  }

  const courseId = searchParams.get("courseId");
  const userIdQuery = searchParams.get("userId");
  const round = searchParams.get("round");
  const userId = userIdQuery || session.sub;

  try {
    if (courseId && round) {
      const result = await prisma.userModuleResult.findMany({
        where: {
          userId,
          courseId: +courseId,
          round: +round,
        },
        select: {
          id: true,
          userId: true,
          courseId: true,
          submittedAt: true,
          evaluation: true,
        },
      });

      if (result.length === 0) {
        return NextResponse.json(
          { error: "Result not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(result[0]);
    }

    const results = await prisma.userModuleResult.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        courseId: true,
        round: true,
        userId: true,
        submittedAt: true,
        evaluation: true,
      },
    });

    return NextResponse.json(results);
  } catch (err: any) {
    console.error("❌ Error in GET /api/attempt(s)", err.message);
    return NextResponse.json(
      { error: "Database error", message: err.message },
      { status: 500 }
    );
  }
}
