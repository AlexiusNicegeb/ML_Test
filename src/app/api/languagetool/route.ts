export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append("text", text);
    params.append("language", language || "en-US");

    const langToolResponse = await fetch(
      "https://api.languagetool.org/v2/check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!langToolResponse.ok) {
      const errorData = await langToolResponse.text();
      return NextResponse.json(
        { error: "LanguageTool API error", details: errorData },
        { status: 502 }
      );
    }

    const result = await langToolResponse.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("LanguageTool API handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
