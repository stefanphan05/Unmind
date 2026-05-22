import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";

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

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div
      className={`auth-page ${fraunces.variable} ${sourceSans.variable} min-h-screen relative`}
    >
      <AmbientBlobs />

      <header className="auth-page__header">
        <Link href="/" className="auth-page__logo font-display">
          Unmind
        </Link>
      </header>

      <div className="auth-page__inner">
        <aside className="auth-page__quote" aria-hidden="true">
          <blockquote className="auth-page__quote-text font-display">
            &ldquo;You don&apos;t have to have it all figured out. Just start
            talking.&rdquo;
          </blockquote>
        </aside>

        <div className="auth-page__form auth-form-swap">{children}</div>
      </div>
    </div>
  );
}
