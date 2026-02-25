import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "What Is Hype | 요즘 뜨는 트렌드",
  description: "지금 당장 폼 미친, 가장 핫한 트렌드를 확인하세요.",
  keywords: ["트렌드", "실시간", "인기", "hype", "Google Trends", "나무위키", "DC인사이드", "Reddit"],
  openGraph: {
    title: "What Is Hype | 요즘 뜨는 트렌드",
    description: "지금 당장 폼 미친, 가장 핫한 트렌드를 확인하세요.",
    url: "https://whatishype.vercel.app",
    siteName: "What Is Hype",
    images: [{ url: "https://whatishype.vercel.app/og-image.png", width: 1200, height: 630 }],
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "Sird3DpODUzEWGCwmSNbfe5ceCKSSg3LXVmXkn0CUZk"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
