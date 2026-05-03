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

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const { message, history } = await req.json();

    // Construct contents from history
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach((m: any) => {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        });
      });
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Fallback to Flash-Lite if Flash fails or hits quota
      if (response.status === 404 || response.status === 429) {
        const fallbackResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              contents: contents,
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              }
            }),
          }
        );
        const fallbackData = await fallbackResponse.json();
        if (fallbackResponse.ok) {
          const text = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text;
          return NextResponse.json({ reply: text });
        }
      }
      
      console.error("Gemini API Error:", data);
      return NextResponse.json({ 
        error: `Gemini API Error: ${data.error?.message || response.statusText}` 
      }, { status: response.status });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    console.error("Internal Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
