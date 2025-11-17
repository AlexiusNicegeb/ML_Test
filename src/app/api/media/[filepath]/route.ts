export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { filepath: string } }
) {
  let { filepath } = params;
  if (!filepath) {
    return NextResponse.json(
      { error: "Keine Datei angegeben." },
      { status: 400 }
    );
  }
  filepath = decodeURIComponent(filepath);
  if (filepath.startsWith("/")) {
    filepath = filepath.slice(1);
  }

  // serve any hard-coded public files without auth
  const hardcodedFiles: Record<string, string> = {
    "sample_video.mp4": "/sample_video.mp4",
  };
  if (hardcodedFiles[filepath]) {
    return NextResponse.json(
      { url: hardcodedFiles[filepath] },
      { status: 200 }
    );
  }

  try {
    verifyAuth(request);
  } catch (res: any) {
    return res;
  }

  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
    const containerName = process.env.AZURE_STORAGE_CONTAINER!;
    const blobService =
      BlobServiceClient.fromConnectionString(connectionString);

    const accountName = blobService.accountName;
    const accountKey = (blobService.credential as any).accountKey as string;
    const credential = new StorageSharedKeyCredential(accountName, accountKey);

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(filepath);

    const exists = await blobClient.exists();
    if (!exists) {
      return NextResponse.json(
        { error: "Datei nicht gefunden." },
        { status: 404 }
      );
    }

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: filepath,
        permissions: BlobSASPermissions.parse("r"),
        protocol: SASProtocol.Https,
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      credential
    ).toString();

    const url = `${blobClient.url}?${sasToken}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/media/[filepath] Fehler:", err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}
