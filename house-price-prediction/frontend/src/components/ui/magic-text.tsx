"use client";

import * as React from "react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

export interface MagicTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  wordClassName?: string;
}

const Word: React.FC<WordProps> = ({
  children,
  progress,
  range,
  wordClassName = "",
}) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={`relative inline-block mr-[0.28em] ${wordClassName}`}>
      <span className="opacity-20">{children}</span>
      <motion.span className="absolute inset-0" style={{ opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className = "",
  wordClassName = "",
}) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.35"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            wordClassName={wordClassName}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default MagicText;
