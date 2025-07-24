import "./globals.css";
import type { ReactNode } from "react";
import Header from "./components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Poppins } from "next/font/google";

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
  const clientId = process.env.CLIENT_ID;

  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased leading-8 overflow-x-hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}
      >
        <GoogleOAuthProvider clientId={clientId!}>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
