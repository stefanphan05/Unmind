import "./globals.css";
import { Lato } from "next/font/google";
import type { ReactNode } from "react";
import Header from "./components/layout/Header";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
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
        className={`${lato.className} antialiased leading-8 overflow-x-hidden min-h-screen`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
