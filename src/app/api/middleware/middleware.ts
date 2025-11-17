import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/api/login", "/api/register"];
const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const auth = req.headers.get("authorization")?.split(" ")[1];
  if (!auth) {
    return new NextResponse(JSON.stringify({ error: "No token" }), {
      status: 401,
    });
  }
  try {
    jwt.verify(auth, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }
}
