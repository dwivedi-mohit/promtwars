import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are ElectSmart, a friendly and highly knowledgeable AI Election Guide Assistant. Your SOLE purpose is to help citizens understand the democratic election process, voting timelines, steps to register and vote, election terminology, and civic duties.

RULES:
1. ONLY answer questions about elections, voting, civic processes, democracy, political systems, voter registration, polling booths, ballot counting, election timelines, and related civic topics.
2. If asked anything unrelated, politely redirect the user back to election-related topics.
3. Keep answers clear, concise, and accessible to all citizens including first-time voters.
4. Use simple language — avoid complex jargon unless explaining a term.
5. When listing steps, use numbered lists.
6. Be non-partisan: never favor any political party, candidate, or ideology.
7. Always encourage civic participation.
8. For India-specific questions, use Indian election context (ECI, EVMs, EPIC card, etc.).
9. For general questions, provide universally applicable information.
10. Format responses with clear structure using bold headings where helpful.

You are warm, encouraging, and empowering. Your goal is to make every citizen feel confident about participating in democracy.`;

// Simple in-memory rate limiter (per IP, 20 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

function sanitizeInput(input: string): string {
  // Remove HTML tags and limit length to prevent prompt injection
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1000);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const message = sanitizeInput(body.message ?? "");
    const history: Array<{ role: string; content: string }> = Array.isArray(body.history)
      ? body.history
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // Construct contents from validated history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    history.slice(-10).forEach((m) => {
      const role = m.role === "assistant" ? "model" : "user";
      const text = sanitizeInput(m.content ?? "");
      if (text) {
        contents.push({ role, parts: [{ text }] });
      }
    });

    contents.push({ role: "user", parts: [{ text: message }] });

    const requestBody = {
      contents,
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    // Primary: Gemini 2.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Fallback: Gemini 2.5 Flash Lite
      if (response.status === 404 || response.status === 429) {
        const fallbackResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
        const fallbackData = await fallbackResponse.json();
        if (fallbackResponse.ok) {
          const text =
            fallbackData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          return NextResponse.json(
            { reply: text },
            {
              headers: {
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
              },
            }
          );
        }
      }

      console.error("Gemini API Error:", data?.error?.message);
      return NextResponse.json(
        { error: `AI service error. Please try again.` },
        { status: 502 }
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json(
      { reply: text },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Internal Server Error:", message);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
