import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WindowControls } from "@/components/WindowControls";
import "./globals.css";

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Literary Clock",
  description: "A clock that tells time through literature. Each minute, a new quote from great novels, poems, and essays that mentions the current time.",
  keywords: ["literary clock", "time", "literature", "quotes", "novels", "poetry"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${crimsonPro.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <WindowControls />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
