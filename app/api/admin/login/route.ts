import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_token";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(sigBuf);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(value: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "change-me";
  const sig = await hmacHex(secret, value);
  return `${value}.${sig}`;
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({ username: "", password: "" }));
  const envUser = process.env.ADMIN_USERNAME || "";
  const envPass = process.env.ADMIN_PASSWORD || "";

  if (!envUser || !envPass) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
  }

  if (username !== envUser || password !== envPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const tokenValue = `${username}:${Date.now()}`;
  const token = await signToken(tokenValue);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}


