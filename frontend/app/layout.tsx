import "./globals.css";
import type { ReactNode } from "react";

import { Poppins } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

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
      <body
        className={`${poppins.className} antialiased leading-8 overflow-x-hidden min-h-screen bg-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
