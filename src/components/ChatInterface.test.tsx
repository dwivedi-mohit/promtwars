import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatInterface from "@/components/ChatInterface";

// Mock fetch globally
global.fetch = jest.fn();

describe("ChatInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome message", () => {
    render(<ChatInterface />);
    expect(
      screen.getByText(/Welcome to ElectSmart/i)
    ).toBeInTheDocument();
  });

  it("renders suggested questions", () => {
    render(<ChatInterface />);
    expect(screen.getByText("How do I register to vote?")).toBeInTheDocument();
    expect(screen.getByText("Explain the election timeline.")).toBeInTheDocument();
  });

  it("renders the chat input textarea", () => {
    render(<ChatInterface />);
    const textarea = screen.getByRole("textbox", {
      name: /type your election question/i,
    });
    expect(textarea).toBeInTheDocument();
  });

  it("enables send button when input has text", () => {
    render(<ChatInterface />);
    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send message/i });

    expect(sendButton).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "How do I vote?" } });
    expect(sendButton).not.toBeDisabled();
  });

  it("sends a message and displays AI response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "To vote in India, you need an EPIC card." }),
    });

    render(<ChatInterface />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "How do I vote?" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(
        screen.getByText(/EPIC card/i)
      ).toBeInTheDocument();
    });
  });

  it("shows an error message when the API fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Service unavailable" }),
    });

    render(<ChatInterface />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
