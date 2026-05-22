"use client";

import { Fraunces, Source_Sans_3 } from "next/font/google";
import HistoryPageContent from "@/components/features/history/HistoryPageContent";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

function AmbientBlobs() {
  return (
    <div className="ambient-blobs" aria-hidden="true">
      <div className="ambient-blob ambient-blob--1" />
      <div className="ambient-blob ambient-blob--2" />
      <div className="ambient-blob ambient-blob--3" />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div
      className={`history-page chat-page ${fraunces.variable} ${sourceSans.variable}`}
    >
      <AmbientBlobs />
      <HistoryPageContent />
    </div>
  );
}
