import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const key = new TextEncoder().encode(process.env.JWT_SECRET);

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as "lax",
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000,
};

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(key);
}

export async function decrypt(session: string | Uint8Array) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: {id: string, tenantId: string, isAdmin: boolean}) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({
    userId: user.id,
    tenantId: user.tenantId,
    isAdmin: user.isAdmin,
    expires,
  });

  (await cookies()).set(cookie.name, session, { ...cookie.options, expires });
}

export async function verifySession(): Promise<{
  userId: string;
  isAdmin: boolean;
  tenantId: string;
} | null> {
  const sessionCookie = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(sessionCookie!);
  if (!session?.userId) {
    return null;
  }
  return {
    userId: session.userId as string,
    isAdmin: session.isAdmin as boolean,
    tenantId: session.tenantId as string,
  };
}

export async function deleteSession() {
  (await cookies()).delete(cookie.name);
}
