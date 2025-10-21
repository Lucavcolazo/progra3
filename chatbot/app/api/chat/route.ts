// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callOpenRouterStream } from "../../../lib/openrouter";
import { sanitizeInput } from "../../../utils/senitize";

// simple in-memory rate limit (for demo only)
const RATE_LIMIT_MAP = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 20;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const info = RATE_LIMIT_MAP.get(ip) ?? { count: 0, ts: now };
    if (now - info.ts > RATE_LIMIT_WINDOW) {
      info.count = 0;
      info.ts = now;
    }
    info.count++;
    RATE_LIMIT_MAP.set(ip, info);
    if (info.count > RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    // Sanitize messages server-side
    const sanitizedMessages = body.messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: sanitizeInput(String(m.content ?? "")),
    }));

    // Call OpenRouter and stream response back to client
    const stream = await callOpenRouterStream(sanitizedMessages, body.model);
    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    console.error("API /api/chat error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
