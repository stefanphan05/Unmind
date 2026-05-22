"use client";

import Link from "next/link";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import {
  Ban,
  LineChart,
  Lock,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

const TYPEWRITER_WORDS = ["anxious", "overwhelmed", "stuck", "not okay"];
const TYPEWRITER_RESOLUTION = "...and that's okay.";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-section ${inView ? "reveal-section--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function TypewriterLine() {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting" | "resolution">(
    "typing"
  );
  const [display, setDisplay] = useState("");
  const [showResolution, setShowResolution] = useState(false);

  useEffect(() => {
    if (phase === "resolution") {
      const word = TYPEWRITER_RESOLUTION;
      if (charIndex < word.length) {
        const t = setTimeout(() => {
          setDisplay(word.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 55);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setShowResolution(true);
        setCharIndex(0);
        setWordIndex(0);
        setPhase("typing");
        setShowResolution(false);
        setDisplay("");
      }, 3200);
      return () => clearTimeout(t);
    }

    const currentWord = TYPEWRITER_WORDS[wordIndex];

    if (phase === "typing") {
      if (charIndex < currentWord.length) {
        const t = setTimeout(() => {
          setDisplay(currentWord.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 72);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pause"), 1400);
      return () => clearTimeout(t);
    }

    if (phase === "pause") {
      const t = setTimeout(() => setPhase("deleting"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        const t = setTimeout(() => {
          setCharIndex((c) => c - 1);
          setDisplay(currentWord.slice(0, charIndex - 1));
        }, 38);
        return () => clearTimeout(t);
      }
      if (wordIndex < TYPEWRITER_WORDS.length - 1) {
        setWordIndex((i) => i + 1);
        setPhase("typing");
        return;
      }
      setCharIndex(0);
      setPhase("resolution");
      setDisplay("");
      return;
    }
  }, [charIndex, phase, wordIndex]);

  return (
    <p
      className={`typewriter-line font-medium text-[var(--color-sage-deep)] mb-4 min-h-[1.75rem] ${
        showResolution ? "typewriter-line--resolution" : ""
      }`}
      aria-live="polite"
    >
      <span>{display}</span>
      <span className="typewriter-cursor" aria-hidden="true" />
    </p>
  );
}

function AmbientBlobs() {
  return (
    <div className="ambient-blobs" aria-hidden="true">
      <div className="ambient-blob ambient-blob--1" />
      <div className="ambient-blob ambient-blob--2" />
      <div className="ambient-blob ambient-blob--3" />
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="icon-badge" aria-hidden="true">
      <Icon size={22} strokeWidth={1.75} />
    </span>
  );
}

function LaptopMockup() {
  return (
    <div className="laptop-mockup hero-stagger hero-stagger--4">
      <div className="laptop-mockup__glow" aria-hidden="true" />
      <div className="laptop-mockup__device">
        <div className="laptop-mockup__lid">
          <div className="laptop-mockup__camera" aria-hidden="true" />
          <div className="laptop-mockup__browser">
            <div className="laptop-mockup__chrome">
              <div className="browser-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="browser-url">unmind.app/chat</div>
            </div>
            <div className="laptop-mockup__app">
              <aside className="laptop-sidebar" aria-hidden="true">
                <div className="laptop-sidebar__brand">
                  <Sparkles size={14} strokeWidth={2} />
                  <span>Unmind</span>
                </div>
                <div className="laptop-sidebar__item laptop-sidebar__item--active">
                  Tonight&apos;s check-in
                </div>
                <div className="laptop-sidebar__item">Morning reflection</div>
                <div className="laptop-sidebar__item">Work stress</div>
              </aside>
              <main className="laptop-chat">
                <header className="laptop-chat__header">
                  <IconBadge icon={Sparkles} />
                  <div>
                    <p className="laptop-chat__title">Tonight&apos;s check-in</p>
                    <p className="laptop-chat__status">Here with you</p>
                  </div>
                </header>
                <div className="laptop-chat__messages">
                  <div className="laptop-bubble laptop-bubble--user">
                    I can&apos;t seem to quiet my thoughts tonight.
                  </div>
                  <div className="laptop-bubble laptop-bubble--ai">
                    That sounds exhausting. Would it help to name one thought that
                    keeps returning?
                  </div>
                  <div className="laptop-bubble laptop-bubble--user">
                    Maybe the fear that I&apos;m falling behind everyone else.
                  </div>
                  <div className="laptop-bubble laptop-bubble--ai laptop-bubble--typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="laptop-chat__input">
                  <span>Share what&apos;s on your mind…</span>
                  <span className="laptop-chat__send">
                    <Send size={14} strokeWidth={2.25} />
                  </span>
                </div>
              </main>
            </div>
          </div>
        </div>
        <div className="laptop-mockup__hinge" aria-hidden="true" />
        <div className="laptop-mockup__base" aria-hidden="true" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <header className="hero relative min-h-screen flex items-center px-5 sm:px-8 lg:px-12 pt-24 pb-16 overflow-hidden">
      <div className="hero__inner max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="hero__copy z-10">
          <div className="hero-stagger hero-stagger--1">
            <TypewriterLine />
          </div>
          <h1 className="hero-stagger hero-stagger--2 font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] text-[var(--color-ink)] tracking-tight">
            A safe space to talk, anytime.
          </h1>
          <p className="hero-stagger hero-stagger--3 mt-5 text-lg sm:text-xl text-[var(--color-ink-soft)] max-w-lg leading-relaxed">
            Always-available AI therapy support — thoughtful, private, and here
            when you need someone to listen.
          </p>
          <div className="hero-stagger hero-stagger--4 mt-8">
            <Link href="/signin" className="btn-primary">
              Start a conversation →
            </Link>
          </div>
        </div>
        <div className="hero__visual flex justify-center lg:justify-end z-10">
          <LaptopMockup />
        </div>
      </div>
    </header>
  );
}

function TrustBar() {
  return (
    <RevealSection className="trust-bar">
      <p className="trust-bar__text">
        <span>256-bit encrypted</span>
        <span className="trust-bar__dot" aria-hidden="true">
          ·
        </span>
        <span>Anonymous by default</span>
        <span className="trust-bar__dot" aria-hidden="true">
          ·
        </span>
        <span>HIPAA-aligned</span>
        <span className="trust-bar__dot" aria-hidden="true">
          ·
        </span>
        <span>No data sold. Ever.</span>
      </p>
    </RevealSection>
  );
}

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: MessageCircle,
    title: "Share what's on your mind",
    desc: "Open up at your own pace — no pressure, no performance.",
  },
  {
    icon: Sparkles,
    title: "Get thoughtful, evidence-based responses",
    desc: "CBT-informed guidance that meets you where you are.",
  },
  {
    icon: LineChart,
    title: "Track your emotional journey over time",
    desc: "Notice patterns, celebrate progress, understand yourself better.",
  },
];

function HowItWorks() {
  return (
    <RevealSection className="section how-it-works px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title font-display text-3xl sm:text-4xl text-center text-[var(--color-ink)]">
          How it works
        </h2>
        <p className="section-subtitle text-center mt-3 max-w-xl mx-auto">
          Three gentle steps toward feeling a little more understood.
        </p>
        <div className="how-steps mt-14">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
            <div key={step.title} className="how-step">
              <div className="how-step__card tilt-card">
                <span className="how-step__icon" aria-hidden="true">
                  <StepIcon size={26} strokeWidth={1.75} />
                </span>
                <span className="how-step__number">{i + 1}</span>
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__desc">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="how-step__connector" aria-hidden="true" />
              )}
            </div>
          );
          })}
        </div>
      </div>
    </RevealSection>
  );
}

const CHAT_MESSAGES = [
  { role: "user" as const, text: "I've been feeling really anxious lately." },
  {
    role: "ai" as const,
    text: "Thank you for sharing that. Anxiety can feel so heavy — when did you first notice it picking up?",
  },
  {
    role: "user" as const,
    text: "Maybe a few weeks ago. Work has been overwhelming.",
  },
  {
    role: "ai" as const,
    text: "That makes a lot of sense. Overwhelm often shows up as anxiety. Would you like to explore one small thing that felt manageable this week?",
  },
];

function AnimatedChatMock() {
  const [visibleCount, setVisibleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView(0.3);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      (inViewRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [inViewRef]
  );

  useEffect(() => {
    if (!inView) return;
    if (visibleCount >= CHAT_MESSAGES.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 900);
    return () => clearTimeout(t);
  }, [inView, visibleCount]);

  useEffect(() => {
    if (!inView) {
      setVisibleCount(0);
    }
  }, [inView]);

  return (
    <div ref={setRefs} className="chat-mock">
      <div className="chat-mock__header">
        <IconBadge icon={Sparkles} />
        <span>Session · Just now</span>
      </div>
      <div className="chat-mock__body">
        {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`chat-mock__bubble chat-mock__bubble--${msg.role} chat-mock__bubble--enter`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureChat() {
  return (
    <RevealSection className="section feature-split px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <AnimatedChatMock />
        <div>
          <span className="feature-tag">AI Chat</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)] mt-3">
            Someone to talk to, always
          </h2>
          <ul className="feature-list mt-6 space-y-4">
            <li>
              <strong>24/7 availability</strong> — late nights, early mornings,
              whenever the weight feels heaviest.
            </li>
            <li>
              <strong>Judgment-free space</strong> — say the messy parts. There is
              no wrong way to feel.
            </li>
            <li>
              <strong>CBT-informed responses</strong> — grounded in evidence, delivered
              with warmth.
            </li>
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}

const PRIVACY_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Lock, label: "End-to-end encryption" },
  { icon: UserRound, label: "No account required to start" },
  { icon: Trash2, label: "Data deletion on request" },
  { icon: Ban, label: "No third-party sharing" },
];

function FeaturePrivacy() {
  return (
    <RevealSection className="section feature-privacy px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="feature-tag">Privacy & Safety</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)] mt-3">
            Your story stays yours
          </h2>
          <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
            We built Unmind so you can be honest without wondering who else might
            see. Your conversations are protected, never mined for ads, and never
            sold.
          </p>
        </div>
        <div className="privacy-grid mt-12">
          {PRIVACY_FEATURES.map((f) => {
            const PrivacyIcon = f.icon;
            return (
            <div key={f.label} className="privacy-card tilt-card">
              <span className="privacy-card__icon" aria-hidden="true">
                <PrivacyIcon size={28} strokeWidth={1.75} />
              </span>
              <p className="privacy-card__label">{f.label}</p>
            </div>
          );
          })}
        </div>
        <p className="privacy-never mt-10 text-center text-[var(--color-ink-soft)] max-w-2xl mx-auto leading-relaxed">
          Unmind will <em>never</em> sell your data, train unrelated models on your
          sessions without consent, share identifiable information with advertisers,
          or pressure you to disclose more than you&apos;re ready to share.
        </p>
      </div>
    </RevealSection>
  );
}

function PullQuote() {
  return (
    <RevealSection className="pull-quote-section" delay={100}>
      <blockquote className="pull-quote font-display">
        &ldquo;You don&apos;t have to have it all figured out. Just start talking.&rdquo;
      </blockquote>
    </RevealSection>
  );
}

function CTAFooter() {
  return (
    <RevealSection className="cta-footer px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
      <div className="cta-footer__inner max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-ink)]">
          Ready when you are.
        </h2>
        <Link href="/signin" className="btn-primary mt-8 inline-flex">
          Start a conversation →
        </Link>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          No sign-up required to begin
        </p>
      </div>
    </RevealSection>
  );
}

function LandingNav() {
  return (
    <nav className="landing-nav fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
      <span className="landing-nav__logo font-display text-xl text-[var(--color-ink)]">
        Unmind
      </span>
      <Link href="/signin" className="landing-nav__link">
        Sign in
      </Link>
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div
      className={`landing-page ${fraunces.variable} ${sourceSans.variable} min-h-screen`}
    >
      <style>{`
        .landing-page,
        .landing-page * {
          box-sizing: border-box;
        }
        .landing-page {
          --color-cream: #faf8f5;
          --color-off-white: #f5f2ed;
          --color-sage: #b8c9b0;
          --color-sage-light: #d4e0cf;
          --color-sage-deep: #6b7f63;
          --color-lavender: #d4cfe8;
          --color-lavender-deep: #9a92b8;
          --color-peach: #f0d9cc;
          --color-peach-warm: #e8c4b0;
          --color-ink: #3d3832;
          --color-ink-soft: #5c564e;
          --color-ink-muted: #8a837a;
          --shadow-soft: 0 4px 24px rgba(61, 56, 50, 0.06);
          --shadow-lift: 0 12px 40px rgba(61, 56, 50, 0.1);
          font-family: var(--font-body), "Source Sans 3", system-ui, sans-serif;
          background: var(--color-cream);
          color: var(--color-ink);
        }

        .landing-page .font-display {
          font-family: var(--font-display), "Fraunces", Georgia, serif;
        }

        @keyframes blob-drift-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 15px) scale(0.98);
          }
        }

        @keyframes blob-drift-2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-40px, 25px) rotate(8deg);
          }
        }

        @keyframes blob-drift-3 {
          0%,
          100% {
            transform: translate(0, 0);
          }
          40% {
            transform: translate(25px, 30px);
          }
          80% {
            transform: translate(-15px, -25px);
          }
        }

        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cursor-blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes typing-dots {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes chat-bubble-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ambient-blobs {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
        }

        .ambient-blob--1 {
          width: 420px;
          height: 420px;
          background: var(--color-sage-light);
          top: -10%;
          left: -8%;
          animation: blob-drift-1 28s ease-in-out infinite;
        }

        .ambient-blob--2 {
          width: 360px;
          height: 360px;
          background: var(--color-lavender);
          top: 40%;
          right: -5%;
          animation: blob-drift-2 34s ease-in-out infinite;
        }

        .ambient-blob--3 {
          width: 300px;
          height: 300px;
          background: var(--color-peach);
          bottom: 10%;
          left: 30%;
          animation: blob-drift-3 26s ease-in-out infinite;
        }

        .hero-stagger {
          opacity: 0;
          animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .hero-stagger--1 {
          animation-delay: 0.1s;
        }
        .hero-stagger--2 {
          animation-delay: 0.25s;
        }
        .hero-stagger--3 {
          animation-delay: 0.4s;
        }
        .hero-stagger--4 {
          animation-delay: 0.55s;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--color-sage-deep);
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: cursor-blink 1s step-end infinite;
        }

        .typewriter-line--resolution {
          color: var(--color-lavender-deep);
        }

        .reveal-section {
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .reveal-section--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.875rem 1.75rem;
          background: linear-gradient(
            135deg,
            var(--color-sage-deep) 0%,
            #5a6d54 100%
          );
          color: var(--color-cream);
          font-weight: 600;
          border-radius: 9999px;
          box-shadow: var(--shadow-soft);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .btn-primary:hover {
          transform: scale(1.04);
          box-shadow: var(--shadow-lift);
          background: linear-gradient(135deg, #5a6d54 0%, var(--color-sage-deep) 100%);
        }

        .btn-primary:active {
          transform: scale(0.98);
        }

        .tilt-card {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
          transform-style: preserve-3d;
        }

        .tilt-card:hover {
          transform: perspective(800px) rotateX(2deg) rotateY(-3deg) translateY(-4px);
          box-shadow: var(--shadow-lift);
        }

        .landing-nav {
          background: rgba(250, 248, 245, 0.72);
          backdrop-filter: blur(12px);
        }

        .landing-nav__link {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-ink-soft);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          transition:
            color 0.2s,
            background 0.2s;
        }

        .landing-nav__link:hover {
          color: var(--color-ink);
          background: var(--color-off-white);
        }

        .icon-badge {
          width: 2.25rem;
          height: 2.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          border-radius: 50%;
        }

        .laptop-mockup {
          position: relative;
          width: min(100%, 520px);
        }

        .laptop-mockup__device {
          position: relative;
          z-index: 1;
        }

        .laptop-mockup__lid {
          background: linear-gradient(160deg, #e8e3dc 0%, #f6f3ee 100%);
          border-radius: 0.85rem 0.85rem 0 0;
          padding: 0.55rem 0.55rem 0;
          box-shadow: var(--shadow-lift);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }

        .laptop-mockup__camera {
          width: 6px;
          height: 6px;
          background: rgba(61, 56, 50, 0.15);
          border-radius: 50%;
          margin: 0 auto 0.4rem;
        }

        .laptop-mockup__browser {
          background: var(--color-off-white);
          border-radius: 0.5rem 0.5rem 0 0;
          overflow: hidden;
          min-height: 300px;
        }

        .laptop-mockup__chrome {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.45rem 0.65rem;
          background: #ebe8e2;
          border-bottom: 1px solid rgba(61, 56, 50, 0.06);
        }

        .browser-dots {
          display: flex;
          gap: 5px;
        }

        .browser-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(61, 56, 50, 0.18);
        }

        .browser-dots span:nth-child(1) {
          background: #d4a5a5;
        }
        .browser-dots span:nth-child(2) {
          background: #e8d4a8;
        }
        .browser-dots span:nth-child(3) {
          background: #b8c9b0;
        }

        .browser-url {
          flex: 1;
          text-align: center;
          font-size: 0.65rem;
          color: var(--color-ink-muted);
          background: rgba(255, 255, 255, 0.65);
          padding: 0.3rem 0.75rem;
          border-radius: 0.35rem;
        }

        .laptop-mockup__app {
          display: flex;
          min-height: 280px;
        }

        .laptop-sidebar {
          width: 32%;
          min-width: 100px;
          padding: 0.65rem 0.5rem;
          background: rgba(255, 255, 255, 0.55);
          border-right: 1px solid rgba(61, 56, 50, 0.06);
        }

        .laptop-sidebar__brand {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--color-ink);
          margin-bottom: 0.65rem;
          padding: 0 0.25rem;
        }

        .laptop-sidebar__brand svg {
          color: var(--color-sage-deep);
        }

        .laptop-sidebar__item {
          font-size: 0.6rem;
          color: var(--color-ink-muted);
          padding: 0.4rem 0.45rem;
          border-radius: 0.4rem;
          margin-bottom: 0.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .laptop-sidebar__item--active {
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          font-weight: 600;
        }

        .laptop-chat {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0.65rem;
          min-width: 0;
        }

        .laptop-chat__header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(61, 56, 50, 0.06);
        }

        .laptop-chat__title {
          font-weight: 600;
          font-size: 0.72rem;
          color: var(--color-ink);
        }

        .laptop-chat__status {
          font-size: 0.58rem;
          color: var(--color-sage-deep);
        }

        .laptop-chat__messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding: 0.55rem 0;
          overflow: hidden;
        }

        .laptop-bubble {
          max-width: 92%;
          padding: 0.45rem 0.65rem;
          border-radius: 0.75rem;
          font-size: 0.62rem;
          line-height: 1.4;
        }

        .laptop-bubble--user {
          align-self: flex-end;
          background: var(--color-peach);
          color: var(--color-ink);
          border-bottom-right-radius: 0.2rem;
        }

        .laptop-bubble--ai {
          align-self: flex-start;
          background: white;
          color: var(--color-ink-soft);
          box-shadow: var(--shadow-soft);
          border-bottom-left-radius: 0.2rem;
        }

        .laptop-bubble--typing {
          display: flex;
          gap: 4px;
          padding: 0.55rem 0.75rem;
        }

        .laptop-bubble--typing span {
          width: 5px;
          height: 5px;
          background: var(--color-sage);
          border-radius: 50%;
          animation: typing-dots 1.2s ease-in-out infinite;
        }

        .laptop-bubble--typing span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .laptop-bubble--typing span:nth-child(3) {
          animation-delay: 0.3s;
        }

        .laptop-chat__input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.45rem 0.65rem;
          background: white;
          border-radius: 9999px;
          font-size: 0.58rem;
          color: var(--color-ink-muted);
          box-shadow: var(--shadow-soft);
        }

        .laptop-chat__send {
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          border-radius: 50%;
        }

        .laptop-mockup__hinge {
          height: 6px;
          background: linear-gradient(180deg, #d8d3cb, #c9c4bc);
          border-radius: 0 0 2px 2px;
        }

        .laptop-mockup__base {
          height: 10px;
          margin: 0 auto;
          width: 108%;
          margin-left: -4%;
          background: linear-gradient(180deg, #e0dbd4, #d0cbc3);
          border-radius: 0 0 1rem 1rem;
          box-shadow: 0 8px 24px rgba(61, 56, 50, 0.12);
        }

        .laptop-mockup__glow {
          position: absolute;
          inset: 5% -8%;
          background: radial-gradient(
            ellipse at center,
            var(--color-lavender) 0%,
            transparent 70%
          );
          opacity: 0.45;
          z-index: 0;
          filter: blur(24px);
        }

        @media (max-width: 480px) {
          .laptop-sidebar {
            display: none;
          }
        }

        .trust-bar {
          padding: 1.25rem 1.5rem;
          background: var(--color-off-white);
          border-block: 1px solid rgba(61, 56, 50, 0.05);
        }

        .trust-bar__text {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-ink-muted);
          letter-spacing: 0.02em;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.35rem 0.5rem;
        }

        .trust-bar__dot {
          opacity: 0.5;
        }

        .section-title {
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          color: var(--color-ink-soft);
        }

        .how-steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .how-steps {
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }
        }

        .how-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .how-step__card {
          background: linear-gradient(
            160deg,
            var(--color-off-white) 0%,
            white 100%
          );
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          text-align: center;
          width: 100%;
          max-width: 280px;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .how-step__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          margin: 0 auto 0.75rem;
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          border-radius: 1rem;
        }

        .how-step__number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 50%;
          margin-bottom: 0.75rem;
        }

        .how-step__title {
          font-weight: 600;
          color: var(--color-ink);
          font-size: 1rem;
          line-height: 1.35;
        }

        .how-step__desc {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-ink-soft);
          line-height: 1.5;
        }

        .how-step__connector {
          display: none;
        }

        @media (min-width: 768px) {
          .how-step__connector {
            display: block;
            position: absolute;
            top: 4.5rem;
            left: calc(50% + 140px);
            width: calc(100% - 280px);
            height: 2px;
            background-image: radial-gradient(
              circle,
              var(--color-sage) 1px,
              transparent 1px
            );
            background-size: 8px 2px;
            background-repeat: repeat-x;
            opacity: 0.6;
          }

          .how-step:last-child .how-step__connector {
            display: none;
          }
        }

        .feature-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-sage-deep);
          background: var(--color-sage-light);
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
        }

        .feature-list li {
          color: var(--color-ink-soft);
          line-height: 1.6;
          padding-left: 1.25rem;
          position: relative;
        }

        .feature-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.55em;
          width: 6px;
          height: 6px;
          background: var(--color-peach-warm);
          border-radius: 50%;
        }

        .feature-list strong {
          color: var(--color-ink);
        }

        .chat-mock {
          background: white;
          border-radius: 1.5rem;
          box-shadow: var(--shadow-lift);
          overflow: hidden;
          border: 1px solid rgba(61, 56, 50, 0.04);
        }

        .chat-mock__header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1rem 1.25rem;
          background: var(--color-off-white);
          font-size: 0.8rem;
          color: var(--color-ink-muted);
          border-bottom: 1px solid rgba(61, 56, 50, 0.05);
        }

        .chat-mock__body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-height: 280px;
        }

        .chat-mock__bubble {
          max-width: 90%;
          padding: 0.75rem 1rem;
          border-radius: 1.125rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .chat-mock__bubble--enter {
          animation: chat-bubble-in 0.5s ease forwards;
        }

        .chat-mock__bubble--user {
          align-self: flex-end;
          background: var(--color-peach);
          color: var(--color-ink);
          border-bottom-right-radius: 0.25rem;
        }

        .chat-mock__bubble--ai {
          align-self: flex-start;
          background: var(--color-sage-light);
          color: var(--color-ink);
          border-bottom-left-radius: 0.25rem;
        }

        .feature-privacy {
          background: linear-gradient(
            180deg,
            var(--color-sage-light) 0%,
            rgba(212, 207, 232, 0.35) 50%,
            var(--color-cream) 100%
          );
        }

        .privacy-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .privacy-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .privacy-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border-radius: 1.25rem;
          padding: 1.5rem 1rem;
          text-align: center;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(255, 255, 255, 0.9);
        }

        .privacy-card__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          margin: 0 auto 0.65rem;
          background: var(--color-sage-light);
          color: var(--color-sage-deep);
          border-radius: 50%;
        }

        .privacy-card__label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-ink);
          line-height: 1.35;
        }

        .privacy-never em {
          font-style: normal;
          font-weight: 600;
          color: var(--color-ink);
        }

        .pull-quote-section {
          padding: 5rem 1.5rem;
          background: linear-gradient(
            135deg,
            var(--color-lavender) 0%,
            var(--color-peach) 45%,
            var(--color-sage-light) 100%
          );
        }

        .pull-quote {
          max-width: 48rem;
          margin: 0 auto;
          text-align: center;
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          line-height: 1.35;
          color: var(--color-ink);
          font-weight: 500;
          letter-spacing: -0.02em;
        }

        .cta-footer__inner {
          background: var(--color-off-white);
          border-radius: 2rem;
          padding: 3rem 2rem;
          box-shadow: var(--shadow-soft);
        }
      `}</style>

      <AmbientBlobs />
      <LandingNav />
      <main className="relative z-10">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FeatureChat />
        <FeaturePrivacy />
        <PullQuote />
        <CTAFooter />
      </main>
    </div>
  );
}
