import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Route | 最短ルートを、1秒で。",
  description: "複数の訪問先を最も効率よく回る最適経路提案アプリ「Best Route」。旅行計画や営業の外回りルートを一瞬で最適化します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} antialiased h-full`}>
      <body className="flex flex-col min-h-full">
        {children}
      </body>
    </html>
  );
}
