export const dynamic = "force-dynamic";

import { getCourseParticipants } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      console.error("❌ Missing courseId", req.url);
      return NextResponse.json(
        { message: "Invalid course ID" },
        { status: 400 }
      );
    }

    console.log("ℹ️ Fetching participants for courseId:", courseId);
    const participants = await getCourseParticipants(courseId);
    console.log("✅ Participants fetched:", participants.length);

    return NextResponse.json(participants);
  } catch (error: any) {
    console.error("🔥 GET /api/get-participants error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
