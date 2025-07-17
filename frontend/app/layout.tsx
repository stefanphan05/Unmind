import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Unmind",
  description: "",
  icons: {
    // Add logo image
    icon: "random",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased leading-8 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
