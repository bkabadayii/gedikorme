import { NextResponse } from "next/server";

// Phase 0: proves POST route handlers run on Workers. Delivery is not
// configured yet, so valid input gets an honest 503 — never a fake success.
type Body = Record<string, unknown>;

const isString = (v: unknown, max: number): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = body.email;
  const valid =
    isString(body.name, 200) &&
    isString(email, 320) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    isString(body.message, 5000) &&
    // Honeypot: real users never fill this field.
    (body.website === undefined || body.website === "");

  if (!valid) {
    return NextResponse.json({ error: "invalid_input" }, { status: 422 });
  }

  return NextResponse.json({ error: "delivery_not_configured" }, { status: 503 });
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
