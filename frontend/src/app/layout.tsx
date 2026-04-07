import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "最適経路提案アプリ | Route Planner",
  description: "複数の目的地を効率的に回る最適経路を検索・表示するアプリケーションです。",
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
