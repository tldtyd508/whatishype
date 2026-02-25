import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "What is Hype? — 지금 인터넷이 뜨거워하는 것들",
  description:
    "Google Trends, 나무위키, DC인사이드, Reddit — 지금 이 순간 인터넷에서 가장 핫한 키워드와 트렌드를 한눈에.",
  keywords: ["트렌드", "실시간", "인기", "hype", "Google Trends", "나무위키", "DC인사이드", "Reddit"],
  openGraph: {
    title: "What is Hype?",
    description: "지금 이 순간, 인터넷이 뜨거워하는 것들",
    type: "website",
  },
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
      </body>
    </html>
  );
}
