"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export interface LetterFadeInProps {
  children: string;
  /** Whether the letter-by-letter fade-in should play. */
  active: boolean;
  className?: string;
  /** Delay before the first character starts fading in, in seconds. */
  delay?: number;
  /** Delay between consecutive characters, in seconds. */
  stagger?: number;
  /** Fade duration per character, in seconds. */
  duration?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * LetterFadeIn — smoothly fades text in character by character while
 * keeping words intact so line wrapping never splits mid-word.
 */
export default function LetterFadeIn({
  children,
  active,
  className = "",
  delay = 0,
  stagger = 0.01,
  duration = 0.32,
}: LetterFadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const wordGroups = useMemo(() => {
    const words = children.split(" ");
    let charOffset = 0;
    return words.map((word, wIdx) => {
      const chars = Array.from(word).map((char) => {
        const index = charOffset;
        charOffset += 1;
        return { char, index };
      });
      // Account for the space between words in the timing offset
      if (wIdx < words.length - 1) {
        charOffset += 1;
      }
      return chars;
    });
  }, [children]);

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span aria-label={children} className={className}>
      {wordGroups.map((chars, wordIdx) => (
        <span key={wordIdx} aria-hidden="true" className="inline">
          <span className="inline-block whitespace-nowrap">
            {chars.map(({ char, index }) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 3 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }}
                transition={{
                  duration,
                  delay: active ? delay + index * stagger : 0,
                  ease: EASE,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wordIdx < wordGroups.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
