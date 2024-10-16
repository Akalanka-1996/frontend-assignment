"use server";

import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { signIn, signUp, logoutUser } from "@/actions/auth";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "secret123";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload | undefined) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7 days")
    .sign(key);
}

export async function decrypt(input: string): Promise<Session> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload as Session;
}

export const register = async (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const res = await signUp(data);

  if (res.status === "FAIL") {
    return res;
  }

  const user = {
    token: res.data?.access_token,
    refreshToken: res.data?.refresh_token,
  };

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const createdAt = new Date(Date.now());
  const session = await encrypt({ user, expires, createdAt });

  cookies().set("session", session, { expires });

  return res;
};

export type Session = {
  user: {
    token: string;
    refreshToken: string;
  };
  expires: Date;
  createdAt: Date;
};

export async function login(data: { email: string; password: string }) {
  const res = await signIn(data.email, data.password);

  if (res.status === "FAIL") {
    return res;
  }

  const user = {
    token: res.data?.access_token,
    refreshToken: res.data?.refresh_token,
  };

  // Create the session
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const createdAt = new Date(Date.now());
  const session = await encrypt({ user, expires, createdAt });

  // Save the session in a cookie
  cookies().set("session", session, { expires });

  return res;
}

export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) return null;

  const decrypted = await decrypt(sessionCookie);

  return decrypted;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();

  return response;
}


export async function logout() {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) return null;

  await logoutUser()

  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });

}