export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { tmpdir } from "os";

export async function POST(req: Request): Promise<Response> {
  const { text } = await req.json();

  const tmpPath = path.join(tmpdir(), `vale-check-${Date.now()}.txt`);
  await fs.writeFile(tmpPath, text, "utf8");

  return new Promise((resolve) => {
    const vale = spawn("vale", [
      "--config=vale/.vale.ini",
      "--output=JSON",
      tmpPath,
    ]);

    let stdout = "";
    let stderr = "";

    vale.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    vale.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    vale.on("close", async (code) => {
      await fs.unlink(tmpPath);

      if (code !== 0 || stderr) {
        resolve(
          NextResponse.json({ error: stderr || "Vale failed" }, { status: 500 })
        );
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(NextResponse.json({ result }));
      } catch (err) {
        resolve(
          NextResponse.json({ error: "Invalid Vale output" }, { status: 500 })
        );
      }
    });
  });
}
