"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
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

  useEffect(() => {
    let active = true;
    fetchMetrics().then((res) => {
      if (!active) return;
      setMetrics(res.metrics);
      setIsLive(res.isLive);
    });
    return () => {
      active = false;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/12">
          {PIPELINE_STEPS.map((item, idx) => (
            <Reveal
              key={item.step}
              delay={idx * 0.07}
              className="border-r border-b border-white/12 p-6 sm:p-7 flex flex-col justify-between bg-white/[0.015] hover:bg-white/[0.04] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bebas text-4xl text-sage leading-none">
                    {item.step}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono text-alabaster/75">
                    {item.artifact}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-alabaster/70 leading-relaxed">
                  {item.detail}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-alabaster/45">
                <span>Stage {item.step}</span>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-sage/70 hidden lg:block" />
                )}
              </div>
            </Reveal>
          ))}
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
                className={`h-3.5 w-3.5 ${
                  isLive ? "text-emerald-400" : "text-sage"
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
