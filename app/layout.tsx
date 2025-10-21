import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI 任務管理系統",
    template: "%s | AI 任務管理系統"
  },
  description: "智能任務管理與 AI 輔助功能，支援任務生成、內容優化和標籤管理",
  keywords: ['任務管理', 'AI', 'GPT', '生產力工具', '任務筆記', '智能助手'],
  authors: [{ name: 'AI Task Manager' }],
  creator: 'AI Task Manager',
  openGraph: {
    title: 'AI 任務管理系統',
    description: '智能任務管理與 AI 輔助功能，支援任務生成、內容優化和標籤管理',
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 任務管理系統',
    description: '智能任務管理與 AI 輔助功能',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
