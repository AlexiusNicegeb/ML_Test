export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // 1. Authenticate
  let session;
  try {
    session = verifyAuth(request);
  } catch (res) {
    return res;
  }
  const userId = session.sub;

  // 2. Fetch the user record
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // 3. Handle missing user
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 4. Return clean payload
  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role, // if you need the raw role
      isAdmin: user.role === "ADMIN", // convenience flag
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    },
    { status: 200 }
  );
}
