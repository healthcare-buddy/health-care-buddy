import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "100", "200", "300", "800", "900"],
});

export const metadata: Metadata = {
  title: "HealthCare Buddy",
  description: "A healthcare companion app",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lexend.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">{children}</div>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
