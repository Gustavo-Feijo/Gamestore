import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import TopBar from "@/components/TopBar/TopBar";
import { cn } from "@/lib/utils";
import { ShoppingCartStateProvider } from "@/context/ContextProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameStore",
  description: "A Pseudo E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex flex-col min-h-screen", inter.className)}>
        <ShoppingCartStateProvider>
          <ThemeProvider
            defaultTheme="dark"
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            <TopBar />
            {children}
            <Toaster duration={2000} richColors={true} />
          </ThemeProvider>
        </ShoppingCartStateProvider>
      </body>
    </html>
  );
}
