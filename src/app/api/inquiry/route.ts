import { NextResponse } from "next/server";
import { listFabrics } from "@/content/catalog/repository";
import { getServerEnv } from "@/lib/server/env";
import { handleInquiry } from "@/lib/server/inquiry-handler";

export async function POST(request: Request) {
  const fabrics = listFabrics().map((f) => ({ id: f.id, code: f.code, name: f.name.tr }));
  return handleInquiry(request, { env: await getServerEnv(), fabrics });
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST" } });
}
