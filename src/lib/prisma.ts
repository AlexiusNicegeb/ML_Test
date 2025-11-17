// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Erweiterung des globalen Namespace, damit in Dev ein Singleton genutzt wird
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing PrismaClient in Development to prevent creating too many
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

// In Dev in den globalen Namespace speichern
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}
