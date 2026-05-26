import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Financial Control",
  description: "Personal platform for financial control",
};

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./dashboard.scss";

import { PrivacyProvider } from "@/contexts/PrivacyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="dashboard">
        <PrivacyProvider>
          <Header />
          {children}
          <Footer />
        </PrivacyProvider>
      </body>
    </html>
  );
}
