"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Cpu, Layers } from "lucide-react";
import BottomUpLetters from "@/components/ui/bottom-up-letters";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mansionY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-[100dvh] min-h-[680px] max-h-[1180px] overflow-hidden select-none flex flex-col justify-between pt-20 sm:pt-24"
    >
      {/* Background Sky Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-sky-bg.png"
          alt="Clear architectural sky backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-charcoal/30 pointer-events-none" />
      </div>

      {/* Typography Layer (z-10: sits behind the mansion cutout z-20) */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full flex-1 flex flex-col justify-start pointer-events-none"
      >
        {/* Desktop Layout (>= md) */}
        <div className="hidden md:flex flex-col w-full max-w-[1680px] mx-auto px-[4.5vw] pt-[1.2vw]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mb-1"
          >
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-semibold text-teal-deep/85">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-deep" />
              Architectural Valuation Intelligence
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-teal-deep/80">
              Scikit-Learn · FastAPI · Next.js
            </span>
          </motion.div>

          <h1 className="font-bebas text-teal-deep uppercase tracking-normal leading-[0.86] text-[clamp(3.6rem,9.4vw,168px)] whitespace-nowrap">
            <BottomUpLetters delay={80} stagger={32}>
              Predict your next
            </BottomUpLetters>
          </h1>

          <div className="flex items-start justify-end gap-3 lg:gap-4 w-full mt-[0.2vw]">
            <span className="font-serif-display italic text-white text-shadow-dream text-[clamp(2.2rem,5.2vw,92px)] leading-[0.9] pt-[0.4vw] whitespace-nowrap">
              <BottomUpLetters delay={360} stagger={45}>
                Dream
              </BottomUpLetters>
            </span>
            <span className="font-bebas text-white text-shadow-house uppercase tracking-normal leading-[0.84] text-[clamp(4.6rem,13.2vw,240px)] whitespace-nowrap text-right">
              <BottomUpLetters delay={480} stagger={35}>
                house price
              </BottomUpLetters>
            </span>
          </div>
        </div>

        {/* Mobile Layout (< md) */}
        <div className="flex md:hidden flex-col w-full px-6 pt-4">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-teal-deep/85 mb-2">
            Property Valuation Engine
          </span>
          <h1 className="font-bebas text-teal-deep uppercase leading-[0.88] text-[clamp(2.8rem,14vw,64px)]">
            <BottomUpLetters delay={80} stagger={32}>
              Predict your
            </BottomUpLetters>
            <br />
            <BottomUpLetters delay={260} stagger={40}>
              next
            </BottomUpLetters>
          </h1>
          <span className="font-serif-display italic text-white text-shadow-dream text-[clamp(2rem,9.5vw,44px)] leading-[0.95] mt-1">
            <BottomUpLetters delay={380} stagger={45}>
              Dream
            </BottomUpLetters>
          </span>
          <span className="font-bebas text-white text-shadow-house uppercase leading-[0.84] text-[clamp(3.1rem,15.5vw,76px)] whitespace-nowrap">
            <BottomUpLetters delay={480} stagger={35}>
              house price
            </BottomUpLetters>
          </span>
        </div>
      </motion.div>

      {/* Foreground Architecture Cutout Layer (z-20: cropped at bottom & shifted down so text stays clearly visible) */}
      <motion.div
        style={{ y: mansionY }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 -bottom-[5%] sm:-bottom-[6%] md:-bottom-[8%] z-20 pointer-events-none h-[68%] sm:h-[74%] md:h-[94%] w-full"
      >
        <Image
          src="/images/mansion-cutout.png"
          alt="Modern Tropical Mansion Architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[42%_bottom] md:object-bottom pointer-events-none"
        />
      </motion.div>

      {/* Bottom Floating Architectural Action Bar (z-30) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-30 w-full px-4 sm:px-8 pb-5 sm:pb-7"
      >
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl bg-charcoal/88 backdrop-blur-md border border-white/15 px-4 sm:px-6 py-3.5 text-alabaster shadow-2xl">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-sage" />
              <span className="text-alabaster/70">Model:</span>
              <span className="font-medium text-white">Linear Regression</span>
            </div>
            <span className="hidden sm:inline text-white/20">|</span>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sage" />
              <span className="text-alabaster/70">Inputs:</span>
              <span className="font-medium text-white">12 Property Attributes</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection("#how-it-works")}
              className="flex-1 sm:flex-none rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-alabaster transition-colors hover:bg-white/15 cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#prediction")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-alabaster px-4 py-2 text-xs sm:text-sm font-semibold text-charcoal transition-all hover:bg-sage hover:text-charcoal cursor-pointer"
            >
              <span>Predict Price</span>
              <ArrowDownRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
