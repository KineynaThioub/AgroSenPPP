// /lib/session.ts
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "default_dev_secret";

export interface UserSession {
  userId: number;
  username: string;
  type_utilisateur: string;
  iat?: number;  // Ajouté automatiquement par JWT
  exp?: number;  // Ajouté automatiquement par JWT
}


export function createSessionToken(user: {
  id: number;
  username: string;
  type_utilisateur: string;
}) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      type: user.type_utilisateur,
    },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): UserSession {
  return jwt.verify(token, SECRET_KEY) as UserSession;
}

export async function getUserSession(request: NextRequest): Promise<UserSession | null> {
  const token = request.cookies.get("authToken")?.value;

  if (!token) return null;

  try {
    return verifyToken(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export function destroySession() {
  return new NextResponse(null, {
    headers: {
      "Set-Cookie": "authToken=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
    },
  });
}