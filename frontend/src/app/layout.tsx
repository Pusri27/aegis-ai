import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AegisAI - Autonomous Explainable AI Decision System",
  description: "Make smarter business decisions with multi-agent AI that researches, analyzes, assesses risks, and provides explainable recommendations.",
  keywords: ["AI", "Decision Support", "Multi-Agent", "Business Intelligence", "Explainable AI"],
  authors: [{ name: "AegisAI Team" }],
  openGraph: {
    title: "AegisAI - AI-Powered Decision Intelligence",
    description: "Make smarter business decisions with multi-agent AI that you can understand and trust.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
