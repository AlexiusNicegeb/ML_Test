import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Verify JWT from the Authorization header.
export function verifyAuth(req: NextRequest): AuthPayload {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new NextResponse(
      JSON.stringify({ error: "Kein Token bereitgestellt." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (err) {
    throw new NextResponse(
      JSON.stringify({ error: "Ungültiges oder abgelaufenes Token." }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
}

export function getToken(): string {
  if (typeof window === "undefined") {
    throw new Error("getToken() can only be called in the browser");
  }
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found—user is not logged in");
  }
  return token;
}

/**
 * Helper to format an Authorization header.
 */
export function createBearerToken(token: string): string {
  return `Bearer ${token}`;
}
