import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ElectSmart – AI Election Guide",
  description: "An interactive AI-powered assistant to help citizens understand the election process, timelines, and voting steps clearly and confidently.",
  keywords: ["election guide", "voting assistant", "AI election helper", "election process", "how to vote"],
  openGraph: {
    title: "ElectSmart – AI Election Guide",
    description: "Understand the entire election process with an interactive AI assistant powered by Google Gemini.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
