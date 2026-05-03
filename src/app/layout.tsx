import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ElectSmart – AI Election Guide",
  description:
    "An interactive AI-powered assistant to help citizens understand the election process, timelines, voter registration, and voting steps clearly and confidently.",
  keywords: [
    "election guide",
    "voting assistant",
    "AI election helper",
    "election process",
    "how to vote",
    "voter registration India",
    "ECI",
    "EPIC card",
    "polling booth",
  ],
  authors: [{ name: "ElectSmart" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "ElectSmart – AI Election Guide",
    description:
      "Understand the entire election process with an interactive AI assistant powered by Google Gemini.",
    type: "website",
    locale: "en_IN",
    siteName: "ElectSmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectSmart – AI Election Guide",
    description:
      "AI-powered civic assistant for Indian elections. Know your rights, registration process, and voting timeline.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ELECTSMART01"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ELECTSMART01', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.variable}>
        <a
          href="#main-content"
          className="skip-link"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            zIndex: 9999,
            background: "#fff",
            color: "#000",
            padding: "8px 16px",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
