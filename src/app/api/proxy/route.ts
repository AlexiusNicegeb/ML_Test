export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest): Promise<Response> {
  try {
    verifyAuth(request);
  } catch (res: any) {
    return res;
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  if (!targetUrl) {
    return NextResponse.json(
      { error: "URL ist erforderlich." },
      { status: 400 }
    );
  }

  let body: any = undefined;
  if (request.method === "POST") {
    try {
      body = await request.json();
    } catch {
      // ignore parse errors; forward without body
    }
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Fehler beim Abrufen der URL." },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? undefined;
    const buffer = await upstream.arrayBuffer();
    return new Response(buffer, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    console.error("Proxy Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
