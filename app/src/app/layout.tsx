import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "URL Scraper",
  description: "URL Scraper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex justify-end h-[100dvh] w-[100dvw] flex flex-col items-stretch">
            <nav className="flex justify-end py-4 px-2 md:px-4 z-10 h-16 shrink-0">
              <ThemeToggle />
            </nav>
            <div className="flex-1 overflow-y-scroll pb-16">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
