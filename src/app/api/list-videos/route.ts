import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  console.log("🚀 ~ file: route.ts:10 ~ GET ~ req.url:", req.url);
  const { searchParams } = new URL(req.url);
  const module = searchParams.get("module");

  if (!module) {
    return NextResponse.json(
      { message: "Missing module param" },
      { status: 400 }
    );
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${module}/`,
    });

    const response = await s3.send(command);
    const keys =
      response.Contents?.map((obj) => obj.Key!).filter((k) => k) || [];

    const base = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const urls = keys.map((k) => base + encodeURI(k));

    return NextResponse.json({ videos: urls });
  } catch (err) {
    console.error("S3 list error:", err);
    return NextResponse.json(
      { message: "Failed to list videos" },
      { status: 500 }
    );
  }
}
