import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";

const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = process.env.AZURE_STORAGE_CONTAINER!;
const blobService = BlobServiceClient.fromConnectionString(connStr);

const accountKey = (blobService.credential as any).accountKey as string;
const accountName = blobService.accountName;
const credential = new StorageSharedKeyCredential(accountName, accountKey);
const containerClient = blobService.getContainerClient(containerName);

export async function listBlobs() {
  const out: { name: string; url: string }[] = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    const sas = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: blob.name,
        permissions: BlobSASPermissions.parse("r"),
        protocol: SASProtocol.Https,
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      credential
    ).toString();
    out.push({ name: blob.name, url: `${containerClient.url}/${blob.name}?${sas}` });
  }
  return out;
}

export async function getBlobUrl(filepath: string) {
  const blobClient = containerClient.getBlobClient(filepath);
  if (!(await blobClient.exists())) {
    throw new Error("File not found");
  }
  const sas = generateBlobSASQueryParameters(
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
  return `${blobClient.url}?${sas}`;
}
