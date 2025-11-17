// Datei: app/api/admin/helpers-azure.ts

import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;

const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;
const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;

const client = jwksClient({
  jwksUri,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  if (!header.kid) {
    return callback(new Error("Kein Key-ID (kid) im JWT-Header"), undefined);
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err, undefined);
    }
    if (!key) {
      return callback(new Error("Öffentlicher Schlüssel nicht gefunden"), undefined);
    }
    const publicKey = key.getPublicKey();
    callback(null, publicKey);
  });
}


/**
 * Validates an incoming Bearer token from a NextRequest and returns the decoded claims.
 * @param req NextRequest (API route)
 * @throws Error if the token is missing or invalid
 */
export async function verifyAzureToken(req: NextRequest): Promise<JwtPayload> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Kein Bearer-Token im Header");
  }

  const token = authHeader.substring("Bearer ".length);

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: clientId,
        issuer,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return reject(new Error("Unauthorized: " + err.message));
        }
        if (!decoded || typeof decoded === "string") {
          return reject(new Error("Unauthorized: Ungültige Token-Claims"));
        }
        resolve(decoded as JwtPayload);
      }
    );
  });
}

/**
 * Checks for admin privileges (claim 'roles' contains 'Admin' or claim 'admin' is true).
 * If the user is not an admin, a 403 error is returned.
 * @param claims The decoded JWT claims
 * @param userMustBeAdmin Boolean flag indicating whether admin privileges are required
 */
export function checkAdminClaim(claims: JwtPayload, userMustBeAdmin = true) {
  if (!userMustBeAdmin) {
    return;
  }
  const roles: string[] = Array.isArray(claims.roles) ? (claims.roles as string[]) : [];
  const isAdmin = roles.includes("Admin") || claims["admin"] === true;
  if (!isAdmin) {
    throw new Error("Forbidden: Admin-Rechte erforderlich");
  }
}