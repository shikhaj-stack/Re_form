import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { SessionUser, Role } from "@/types";

const COOKIE_NAME = "reform_session";
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-reform-b2b-jwt-auth-key-32";
const EXPIRES_IN = "7d";

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  iat?: number;
  exp?: number;
}

export function signToken(user: SessionUser): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
    organizationName: user.organizationName,
  };
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = signToken(user);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  if (!tokenCookie?.value) return null;

  const payload = verifyToken(tokenCookie.value);
  if (!payload) return null;

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    organizationId: payload.organizationId,
    organizationName: payload.organizationName,
  };
}
