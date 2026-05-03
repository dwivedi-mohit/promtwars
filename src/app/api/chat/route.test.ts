import { NextRequest } from "next/server";
import { POST } from "@/app/api/chat/route";

// Mock fetch globally
global.fetch = jest.fn();

describe("POST /api/chat", () => {
  const mockApiKey = "test-api-key";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = mockApiKey;
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  function createRequest(body: object, ip = "127.0.0.1"): NextRequest {
    return new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    });
  }

  it("returns 400 for empty message", async () => {
    const req = createRequest({ message: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 503 when API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const req = createRequest({ message: "How do I vote?" });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it("returns AI reply on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          { content: { parts: [{ text: "To register, visit voters.eci.gov.in" }] } },
        ],
      }),
    });

    const req = createRequest({ message: "How do I register to vote?" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reply).toContain("voters.eci.gov.in");
  });

  it("sanitizes HTML in user input", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Safe response" }] } }],
      }),
    });

    const req = createRequest({
      message: "<script>alert('xss')</script>How do I vote?",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    // Verify fetch was called with sanitized content (no script tags)
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);
    const userMessage = requestBody.contents[0].parts[0].text;
    expect(userMessage).not.toContain("<script>");
  });

  it("includes security headers in response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Response" }] } }],
      }),
    });

    const req = createRequest({ message: "test" });
    const res = await POST(req);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});
