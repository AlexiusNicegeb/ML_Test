

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { buildFolderStructure } from "@/app/helpers";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {

  let isServiceToken = false;
  let decoded: { sub: string; role: string } | null = null;

  try {
    decoded = verifyAuth(request);
    if (decoded.role !== "ADMIN") {

      return NextResponse.json(
        { error: "Nicht autorisiert." },
        { status: 403 }
      );
    }
  } catch (err: any) {
    const authHeader = request.headers.get("authorization") || "";
    const serviceToken = process.env.GET_FILES_TOKEN;
    if (authHeader === serviceToken) {
      isServiceToken = true;
    } else if (err instanceof NextResponse) {

      return err;
    } else {
      return NextResponse.json({ error: "Ungültiges Token." }, { status: 401 });
    }
  }

  try {
    const { listBlobs } = await import("@/lib/azure");
    const files = await listBlobs();
    const organized = buildFolderStructure(files).filter(
      (f) => f.name === "Home"
    );

    return NextResponse.json(organized, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/admin/get-files Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
