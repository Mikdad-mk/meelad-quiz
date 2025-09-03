import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "change-me";
  const [value, sig] = token.split(".");
  if (!value || !sig) return false;
  const expected = await hmacHex(secret, value);
  // timing-safe compare
  if (expected.length !== sig.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return ok === 0;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow login page and login API without token
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifyToken(token);

  if (ok) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};

export const __internal = { signToken, verifyToken, ADMIN_COOKIE };


