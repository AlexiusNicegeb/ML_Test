export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  const decoded = verifyAuth(request);
  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 403 });
  }

  const { email, password, firstName, lastName } = await request.json();
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Ungültige Nutzlast." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Benutzer mit dieser E-Mail existiert bereits." },
      { status: 409 }
    );
  }

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        firstName,
        lastName,
        role: "ADMIN",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/admin/save-admin-user Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
