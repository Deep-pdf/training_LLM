"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Reveal } from "@/components/ui/Reveal";
import LetterFadeIn from "@/components/ui/letter-fade-in";
import WordPullUp from "@/components/ui/word-pull-up";
import { FALLBACK_MODEL_METRICS, fetchMetrics } from "@/lib/api";
import { formatINR } from "@/lib/formatters";
import type { ModelMetrics } from "@/types/prediction";
import { Activity, ArrowRight } from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Property Specification",
    detail:
      "Twelve structural and location attributes—area, bedrooms, bathrooms, stories, parking, six binary amenities, and furnishing status—are validated via Pydantic schemas.",
    artifact: "PredictionRequest",
  },
  {
    step: "02",
    title: "Binary & One-Hot Encoding",
    detail:
      "Binary amenities ('yes'/'no') map to 1/0, while furnishing status is one-hot encoded and reindexed against the exact 14-column training feature order.",
    artifact: "features.pkl",
  },
  {
    step: "03",
    title: "StandardScaler Normalization",
    detail:
      "All 14 numerical features are transformed using the pre-fitted StandardScaler from training to preserve identical feature distributions.",
    artifact: "scaler.pkl",
  },
  {
    step: "04",
    title: "Linear Regression Inference",
    detail:
      "The scaled feature vector is evaluated by the trained Scikit-learn Linear Regression model to return an instant valuation in INR.",
    artifact: "linear_regression.pkl",
  },
];

export default function HowItWorksSection() {
  const [metrics, setMetrics] = useState<ModelMetrics>(FALLBACK_MODEL_METRICS);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();

  // One-time scroll-stepped reveal state for the 4 workflow cards (01 -> 04).
  const [revealedCount, setRevealedCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const cardsGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastStepTimeRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      setRevealedCount(PIPELINE_STEPS.length);
      setHasCompleted(true);
      setIsLocked(false);
    }
  }, [shouldReduceMotion]);

  // Trigger card 01 when entering the How It Works cards grid.
  useEffect(() => {
    if (hasCompleted || shouldReduceMotion) return;
    const gridEl = cardsGridRef.current;
    if (!gridEl) return;

    const checkEntry = () => {
      const rect = gridEl.getBoundingClientRect();
      const vh = window.innerHeight;

      // If user already scrolled past the cards (e.g. jumped via #prediction), reveal all immediately.
      if (rect.bottom < 80) {
        setRevealedCount(PIPELINE_STEPS.length);
        setHasCompleted(true);
        setIsLocked(false);
        return;
      }

      const fitsInViewport = rect.height <= vh * 0.92;

      if (fitsInViewport) {
        const enteredViewport =
          rect.bottom <= vh - 24 && rect.bottom >= vh * 0.25;

        if (enteredViewport) {
          setRevealedCount((prev) => (prev === 0 ? 1 : prev));
          setIsLocked(true);
        }
      } else {
        // Narrow/mobile viewports where stacked cards exceed viewport height:
        // reveal each card sequentially as it scrolls into view.
        let nextCount = 0;
        cardRefs.current.forEach((el, idx) => {
          if (!el) return;
          const cardRect = el.getBoundingClientRect();
          if (cardRect.top <= vh * 0.82) {
            nextCount = Math.max(nextCount, idx + 1);
          }
        });
        if (nextCount > 0) {
          setRevealedCount((prev) => {
            const updated = Math.max(prev, nextCount);
            if (updated >= PIPELINE_STEPS.length) {
              setHasCompleted(true);
            }
            return updated;
          });
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            checkEntry();
          }
        }
      },
      { threshold: [0.15, 0.35, 0.55, 0.85, 1] }
    );

    observer.observe(gridEl);
    window.addEventListener("scroll", checkEntry, { passive: true });
    checkEntry();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkEntry);
    };
  }, [hasCompleted, shouldReduceMotion]);

  // Keep the page still while stepping through cards 01 -> 04 on scroll.
  useEffect(() => {
    if (!isLocked || hasCompleted || shouldReduceMotion) {
      lenis?.start();
      return;
    }

    lenis?.stop();

    const STEP_COOLDOWN_MS = 420;

    const advanceCard = () => {
      const now = Date.now();
      if (now - lastStepTimeRef.current < STEP_COOLDOWN_MS) return;
      lastStepTimeRef.current = now;

      setRevealedCount((prev) => {
        const next = Math.min(PIPELINE_STEPS.length, prev + 1);
        if (next >= PIPELINE_STEPS.length) {
          // Brief pause so the 4th card lands before releasing scroll.
          window.setTimeout(() => {
            setHasCompleted(true);
            setIsLocked(false);
            lenis?.start();
          }, 360);
        }
        return next;
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        e.stopPropagation();
        if (Math.abs(e.deltaY) >= 6) {
          advanceCard();
        }
      } else if (e.deltaY < 0) {
        // Allow scrolling back up without trapping the user.
        lenis?.start();
        const rect = cardsGridRef.current?.getBoundingClientRect();
        if (rect && rect.top > window.innerHeight * 0.75) {
          setIsLocked(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const currentY = e.touches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - currentY;

      if (deltaY > 0) {
        e.preventDefault();
        if (deltaY >= 20) {
          touchStartYRef.current = currentY;
          advanceCard();
        }
      } else if (deltaY < -20) {
        lenis?.start();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        advanceCard();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        lenis?.start();
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      window.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      lenis?.start();
    };
  }, [isLocked, hasCompleted, shouldReduceMotion, lenis]);

  useEffect(() => {
    let active = true;
    let timerId: number | undefined;
    let attempts = 0;
    const MAX_RETRIES = 12;

    const load = async () => {
      const res = await fetchMetrics();
      if (!active) return;
      setMetrics(res.metrics);
      setIsLive(res.isLive);

      if (!res.isLive && attempts < MAX_RETRIES) {
        attempts += 1;
        timerId = window.setTimeout(load, 5000);
      }
    };

    load();

    return () => {
      active = false;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  const r2Percent = (metrics.r2_score * 100).toFixed(2);

  return (
    <section
      id="how-it-works"
      className="relative bg-charcoal bg-arch-grid-dark text-alabaster overflow-hidden"
    >
      {/* Top Open-Source Status Marquee */}
      <div className="border-y border-white/10 bg-teal-deep/70 py-2.5 overflow-hidden">
        <div className="animate-marquee text-xs uppercase tracking-[0.22em] text-alabaster/90 font-medium">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 pr-8">
              <span>This model is open-source and continuously refined</span>
              <span className="text-sage">◆</span>
              <span>Scikit-learn Linear Regression Pipeline</span>
              <span className="text-sage">◆</span>
              <span>FastAPI Real-Time Inference</span>
              <span className="text-sage">◆</span>
              <span>14 Encoded Property Features</span>
              <span className="text-sage">◆</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-24 sm:py-32 px-4 sm:px-8">
        {/* Section Header */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-sage block mb-3">
              02 / How It Works &amp; Model Performance
            </span>
            <h2 className="font-bebas text-[clamp(3rem,6.5vw,5.5rem)] leading-[0.9] uppercase text-white">
              <WordPullUp
                duration={0.55}
                stagger={0.07}
                segments={[
                  { text: "From raw" },
                  {
                    text: "blueprint",
                    className:
                      "font-serif-display italic font-normal lowercase text-sage",
                  },
                  { text: "to valuation" },
                ]}
              />
            </h2>
          </div>
          <p className="text-sm sm:text-base text-alabaster/70 max-w-md leading-relaxed">
            Every prediction executes the exact preprocessing, encoding, and
            scaling pipeline used during model training—ensuring consistent,
            reproducible inference.
          </p>
        </Reveal>

        {/* 4-Stage Architectural Workflow */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {PIPELINE_STEPS.map((item, idx) => {
            const isRevealed = idx < revealedCount;
            return (
              <motion.div
                key={item.step}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 44 }
                }
                animate={
                  isRevealed
                    ? { opacity: 1, y: 0 }
                    : shouldReduceMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 44 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                      type: "spring",
                      stiffness: 290,
                      damping: 19,
                      mass: 0.85,
                    }
                }
                className="rounded-xl border border-white/12 p-6 sm:p-7 flex flex-col justify-between bg-white/[0.015] hover:bg-white/[0.04] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-bebas text-4xl text-sage leading-none">
                      <LetterFadeIn
                        active={isRevealed}
                        delay={0.08}
                        stagger={0.025}
                      >
                        {item.step}
                      </LetterFadeIn>
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-alabaster/75">
                      <LetterFadeIn
                        active={isRevealed}
                        delay={0.1}
                        stagger={0.015}
                      >
                        {item.artifact}
                      </LetterFadeIn>
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2.5">
                    <LetterFadeIn
                      active={isRevealed}
                      delay={0.14}
                      stagger={0.014}
                    >
                      {item.title}
                    </LetterFadeIn>
                  </h3>
                  <p className="text-sm text-alabaster/70 leading-relaxed">
                    <LetterFadeIn
                      active={isRevealed}
                      delay={0.22}
                      stagger={0.007}
                      duration={0.35}
                    >
                      {item.detail}
                    </LetterFadeIn>
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-alabaster/45">
                  <span>
                    <LetterFadeIn
                      active={isRevealed}
                      delay={0.28}
                      stagger={0.016}
                    >
                      {`Stage ${item.step}`}
                    </LetterFadeIn>
                  </span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-sage/70 hidden lg:block" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Model Performance Telemetry Band */}
        <Reveal delay={0.15} className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white uppercase">
                <WordPullUp
                  duration={0.55}
                  stagger={0.07}
                  segments={[{ text: "Model Performance Metrics" }]}
                />
              </h3>
              <p className="text-sm text-alabaster/65 mt-1">
                Evaluation metrics saved from original Scikit-learn training (
                {metrics.model_name}).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs">
              <Activity
                className={`h-3.5 w-3.5 ${isLive ? "text-emerald-400" : "text-sage"
                  }`}
              />
              <span className="text-alabaster/80">
                {isLive === true
                  ? "Live from FastAPI /metrics"
                  : isLive === false
                    ? "Saved Baseline (Backend Offline)"
                    : "Connecting to /metrics..."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* R2 Score */}
            <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-teal-deep/50 to-white/[0.03] p-7">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sage font-semibold">
                <span>R² Score</span>
                <span>Coefficient of Determination</span>
              </div>
              <div className="mt-4 font-bebas text-5xl sm:text-6xl text-white tracking-tight">
                {r2Percent}%
              </div>
              <p className="mt-3 text-sm text-alabaster/70 leading-relaxed">
                Measures how well the model explains price variations across the
                evaluation split. Higher is better.
              </p>
            </div>

            {/* MAE */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sage font-semibold">
                <span>MAE</span>
                <span>Mean Absolute Error</span>
              </div>
              <div className="mt-4 font-bebas text-4xl sm:text-5xl text-white tracking-tight">
                {formatINR(metrics.mae)}
              </div>
              <p className="mt-3 text-sm text-alabaster/70 leading-relaxed">
                Average absolute difference between actual and predicted
                property prices. Lower is better.
              </p>
            </div>

            {/* RMSE */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sage font-semibold">
                <span>RMSE</span>
                <span>Root Mean Squared Error</span>
              </div>
              <div className="mt-4 font-bebas text-4xl sm:text-5xl text-white tracking-tight">
                {formatINR(metrics.rmse)}
              </div>
              <p className="mt-3 text-sm text-alabaster/70 leading-relaxed">
                Measures prediction errors while penalizing larger deviations
                more heavily. Lower is better.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
