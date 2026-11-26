"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export interface WordSegment {
  text: string;
  className?: string;
  breakAfter?: boolean;
}

export interface WordPullUpProps {
  segments: WordSegment[];
  className?: string;
  /** Delay before the first word starts, in seconds. */
  delay?: number;
  /** Stagger between words, in seconds. */
  stagger?: number;
  /** Duration of each word pull-up, in seconds. */
  duration?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * WordPullUp — editorial word-by-word upward reveal triggered when scrolled into view.
 */
export default function WordPullUp({
  segments,
  className = "",
  delay = 0.08,
  stagger = 0.11,
  duration = 0.85,
}: WordPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();

  let wordIndex = 0;

  return (
    <span ref={ref} className={className}>
      {segments.map((segment, segIdx) => {
        const words = segment.text.split(" ").filter(Boolean);
        return (
          <span key={segIdx} className={segment.className}>
            {words.map((word, wIdx) => {
              const currentIdx = wordIndex++;
              const isLastInSegment = wIdx === words.length - 1;
              return (
                <span
                  key={`${segIdx}-${wIdx}`}
                  className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
                >
                  <motion.span
                    className="inline-block"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: "105%" }
                    }
                    animate={
                      inView || shouldReduceMotion
                        ? { opacity: 1, y: "0%" }
                        : undefined
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            duration,
                            delay: delay + currentIdx * stagger,
                            ease: EASE,
                          }
                    }
                  >
                    {word}
                  </motion.span>
                  {!(isLastInSegment && segment.breakAfter) && "\u00A0"}
                </span>
              );
            })}
            {segment.breakAfter && <br />}
          </span>
        );
      })}
    </span>
  );
}
