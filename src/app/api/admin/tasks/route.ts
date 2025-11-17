import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //   const session = await getServerSession(authOptions);
  //   if (!session?.user || session.user.role !== "ADMIN") {
  //     return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  //   }

  const { tasks } = await req.json();

  try {
    const created = await prisma.$transaction(
      tasks.map((task: any) =>
        prisma.task.create({
          data: {
            title: task.title,
            position: task.position,
            type: "WRITING",
            config: task.config,
          },
        })
      )
    );

    return NextResponse.json({ message: "Tasks created", created });
  } catch (err) {
    console.error("💥 Error:", err);
    return NextResponse.json(
      { error: "Failed to create tasks" },
      { status: 500 }
    );
  }
}
