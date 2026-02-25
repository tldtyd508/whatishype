import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "What is Hype? — DC인사이드 × Reddit 실시간 트렌드",
  description:
    "디시인사이드 실시간 베스트와 Reddit Hot 게시글을 한눈에. 두 거대 커뮤니티의 실시간 트렌드를 한 화면에서 비교하세요.",
  keywords: ["DC인사이드", "디시인사이드", "Reddit", "트렌드", "실시간", "인기글", "hype"],
  openGraph: {
    title: "What is Hype?",
    description: "DC인사이드 × Reddit 실시간 트렌드 대시보드",
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
