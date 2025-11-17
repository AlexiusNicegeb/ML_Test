export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";
import { verifyAzureToken } from "../admin/helpers-azure";

export async function POST(request: NextRequest) {
  try {
    await verifyAzureToken(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filepath } = await request.json();
  if (!filepath) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING!;
    const containerName = process.env.AZURE_STORAGE_CONTAINER!;
    const blobService = BlobServiceClient.fromConnectionString(conn);

    const accountName = blobService.accountName;
    const accountKey = (blobService.credential as any).accountKey as string;
    const credential = new StorageSharedKeyCredential(accountName, accountKey);

    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(filepath);

    const exists = await blobClient.exists();
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
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
  } catch (error) {
    console.error("POST /api/get-file Fehler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
