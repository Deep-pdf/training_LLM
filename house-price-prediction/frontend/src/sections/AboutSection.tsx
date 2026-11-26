"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const TECH_SPECS = [
  { label: "ML Engine", value: "Python · Scikit-learn · Linear Regression" },
  { label: "Feature Pipeline", value: "12 Inputs → 14 Scaled Features (StandardScaler)" },
  { label: "API Layer", value: "FastAPI · Pydantic v2 Validation · Uvicorn" },
  { label: "Valuation Unit", value: "Indian Rupee (INR)" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 bg-alabaster bg-arch-grid text-charcoal py-24 sm:py-32 px-4 sm:px-8 rounded-t-2xl sm:rounded-t-3xl shadow-[0_-24px_60px_rgba(0,0,0,0.22)] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        {/* Top Editorial Eyebrow */}
        <Reveal className="flex items-center justify-between border-b border-charcoal/15 pb-4 mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.22em] font-semibold text-teal-deep">
            01 / About This Project
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-charcoal/60">
            Property-Tech Intelligence
          </span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 flex flex-col">
            <Reveal delay={0.05}>
              <h2 className="font-bebas text-[clamp(3rem,6.5vw,5.75rem)] leading-[0.9] tracking-normal text-charcoal uppercase">
                Data-driven{" "}
                <span className="font-serif-display italic font-normal lowercase text-teal-deep tracking-tight">
                  precision
                </span>
                <br />
                for modern residential valuation
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-8 text-base sm:text-lg leading-relaxed text-charcoal/80 max-w-2xl">
                A Machine Learning-powered web application that predicts house
                prices based on property features. Built using Python,
                Scikit-learn, and Linear Regression, with a modern Next.js
                frontend and FastAPI backend, the application provides real-time
                price predictions and model performance insights through an
                intuitive interface.
              </p>
            </Reveal>

            {/* Architectural Spec Ledger (replaces generic 3-card grids) */}
            <Reveal delay={0.18}>
              <dl className="mt-10 border-t border-charcoal/15 divide-y divide-charcoal/15">
                {TECH_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                  >
                    <dt className="text-xs uppercase tracking-[0.18em] font-semibold text-teal-deep">
                      {spec.label}
                    </dt>
                    <dd className="text-sm sm:text-base font-medium text-charcoal">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Right Layered Architectural Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[440px] sm:h-[520px] w-full">
              {/* Primary Architectural Frame */}
              <motion.div
                initial={{ opacity: 0, y: 28, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="absolute top-0 right-0 w-[82%] h-[62%] rounded-2xl overflow-hidden border-4 border-white shadow-[0_24px_60px_rgba(0,57,72,0.16)] bg-limestone z-10 transition-shadow"
              >
                <Image
                  src="/images/modern-villa.jpg"
                  alt="Modern cantilevered villa with pool"
                  fill
                  sizes="(max-width: 1024px) 80vw, 35vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-charcoal/80 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-alabaster">
                  Exterior Architecture
                </div>
              </motion.div>

              {/* Secondary Interior Frame */}
              <motion.div
                initial={{ opacity: 0, y: 36, rotate: 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 2.5 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="absolute bottom-0 left-0 w-[68%] h-[56%] rounded-2xl overflow-hidden border-4 border-white shadow-[0_24px_60px_rgba(23,28,29,0.22)] bg-limestone z-20"
              >
                <Image
                  src="/images/luxury-interior.jpg"
                  alt="Double-height architectural living space"
                  fill
                  sizes="(max-width: 1024px) 70vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-charcoal/80 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-alabaster">
                  Furnished Interiors
                </div>
              </motion.div>

              {/* Accent Stone Villa Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="hidden sm:block absolute bottom-6 right-2 w-[38%] h-[32%] rounded-xl overflow-hidden border-4 border-white shadow-xl z-30"
              >
                <Image
                  src="/images/stone-villa.jpg"
                  alt="Contemporary stone facade villa"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
