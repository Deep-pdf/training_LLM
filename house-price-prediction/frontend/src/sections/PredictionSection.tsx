"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import WordPullUp from "@/components/ui/word-pull-up";
import { predictHousePrice } from "@/lib/api";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import type {
  FurnishingStatus,
  PredictionRequest,
  PredictionResponse,
  YesNo,
} from "@/types/prediction";

const DEFAULT_FORM: PredictionRequest = {
  area: 5000,
  bedrooms: 3,
  bathrooms: 2,
  stories: 2,
  parking: 1,
  mainroad: "yes",
  guestroom: "no",
  basement: "no",
  hotwaterheating: "no",
  airconditioning: "yes",
  prefarea: "yes",
  furnishingstatus: "furnished",
};

const PRESETS: { label: string; values: PredictionRequest }[] = [
  {
    label: "Compact Urban",
    values: {
      area: 2400,
      bedrooms: 2,
      bathrooms: 1,
      stories: 1,
      parking: 1,
      mainroad: "yes",
      guestroom: "no",
      basement: "no",
      hotwaterheating: "no",
      airconditioning: "no",
      prefarea: "no",
      furnishingstatus: "semi-furnished",
    },
  },
  {
    label: "Family Residence",
    values: DEFAULT_FORM,
  },
  {
    label: "Tropical Estate",
    values: {
      area: 9200,
      bedrooms: 4,
      bathrooms: 3,
      stories: 3,
      parking: 2,
      mainroad: "yes",
      guestroom: "yes",
      basement: "yes",
      hotwaterheating: "no",
      airconditioning: "yes",
      prefarea: "yes",
      furnishingstatus: "furnished",
    },
  },
];

type BinaryFeatureKey =
  | "mainroad"
  | "guestroom"
  | "basement"
  | "hotwaterheating"
  | "airconditioning"
  | "prefarea";

const BINARY_FEATURES: { key: BinaryFeatureKey; label: string; hint: string }[] = [
  { key: "mainroad", label: "Main Road Access", hint: "Direct frontage" },
  { key: "guestroom", label: "Guest Room", hint: "Dedicated suite" },
  { key: "basement", label: "Basement", hint: "Lower-level space" },
  { key: "hotwaterheating", label: "Hot Water Heating", hint: "Centralized" },
  { key: "airconditioning", label: "Air Conditioning", hint: "Climate control" },
  { key: "prefarea", label: "Preferred Area", hint: "Prime locality" },
];

const FURNISHING_OPTIONS: { value: FurnishingStatus; label: string }[] = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

type StepperFieldKey = "bedrooms" | "bathrooms" | "stories" | "parking";

const STEPPER_FIELDS: {
  key: StepperFieldKey;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "bedrooms", label: "Bedrooms", min: 1, max: 20 },
  { key: "bathrooms", label: "Bathrooms", min: 1, max: 10 },
  { key: "stories", label: "Stories", min: 1, max: 10 },
  { key: "parking", label: "Parking", min: 0, max: 10 },
];

export default function PredictionSection() {
  const [form, setForm] = useState<PredictionRequest>(DEFAULT_FORM);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStepper = (key: StepperFieldKey, delta: number, min: number, max: number) => {
    setForm((prev) => {
      const next = Math.min(max, Math.max(min, prev[key] + delta));
      return { ...prev, [key]: next };
    });
  };

  const toggleBinary = (key: BinaryFeatureKey) => {
    setForm((prev) => ({
      ...prev,
      [key]: (prev[key] === "yes" ? "no" : "yes") as YesNo,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!Number.isFinite(form.area) || form.area <= 0 || form.area > 100000) {
      setError("Property area must be between 1 and 100,000 sq. ft.");
      return;
    }

    setLoading(true);
    try {
      const response = await predictHousePrice(form);
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the FastAPI prediction server."
      );
    } finally {
      setLoading(false);
    }
  };

  const activeAmenityCount = BINARY_FEATURES.filter(
    (f) => form[f.key] === "yes"
  ).length;

  const pricePerSqFt =
    result && form.area > 0 ? result.predicted_price / form.area : null;

  return (
    <section
      id="prediction"
      className="relative bg-alabaster bg-arch-grid text-charcoal py-24 sm:py-32 px-4 sm:px-8 border-t border-soft-grey"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header & Presets */}
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-charcoal/15 pb-8 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-teal-deep block mb-3">
              03 / Valuation Studio
            </span>
            <h2 className="font-bebas text-[clamp(3rem,6.5vw,5.5rem)] leading-[0.9] uppercase text-charcoal">
              <WordPullUp
                duration={0.55}
                stagger={0.07}
                segments={[
                  { text: "Enter your" },
                  {
                    text: "property",
                    className:
                      "font-serif-display italic font-normal lowercase text-teal-deep",
                  },
                  { text: "requirements" },
                ]}
              />
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-[0.16em] text-charcoal/55 mr-1">
              Presets:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setForm(preset.values);
                  setError(null);
                }}
                className="rounded-full border border-charcoal/20 bg-white px-3.5 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-teal-deep hover:bg-teal-deep hover:text-alabaster cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Form Column */}
          <Reveal className="lg:col-span-7 flex">
            <form
              onSubmit={handleSubmit}
              className="w-full rounded-3xl border border-soft-grey bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,57,72,0.06)]"
            >
              {/* Area Input + Slider */}
              <div className="pb-7 border-b border-soft-grey">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <label
                      htmlFor="area-input"
                      className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-deep"
                    >
                      Total Property Area
                    </label>
                    <p className="text-xs text-charcoal/60 mt-0.5">
                      Square footage between 1 and 100,000 sq. ft.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-soft-grey bg-alabaster px-3.5 py-2">
                    <input
                      id="area-input"
                      type="number"
                      min={1}
                      max={100000}
                      step="any"
                      value={form.area || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          area: e.target.value === "" ? 0 : Number(e.target.value),
                        }))
                      }
                      className="w-24 bg-transparent text-right font-bebas text-2xl text-charcoal focus:outline-none"
                    />
                    <span className="text-xs font-medium text-charcoal/60">
                      sq. ft.
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  aria-label="Property area slider"
                  min={500}
                  max={16000}
                  step={100}
                  value={Math.min(16000, Math.max(500, form.area || 500))}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      area: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-teal-deep cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-charcoal/45 mt-1 font-medium">
                  <span>500 sq. ft.</span>
                  <span>8,000 sq. ft.</span>
                  <span>16,000+ sq. ft.</span>
                </div>
              </div>

              {/* Numeric Steppers */}
              <div className="py-7 border-b border-soft-grey">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep block mb-4">
                  Structural Layout
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STEPPER_FIELDS.map((field) => (
                    <div
                      key={field.key}
                      className="rounded-2xl border border-soft-grey bg-alabaster/60 p-3.5 flex flex-col justify-between"
                    >
                      <span className="text-xs font-medium text-charcoal/70">
                        {field.label}
                      </span>
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            updateStepper(field.key, -1, field.min, field.max)
                          }
                          disabled={form[field.key] <= field.min}
                          aria-label={`Decrease ${field.label}`}
                          className="h-7 w-7 rounded-lg border border-soft-grey bg-white flex items-center justify-center text-charcoal hover:border-teal-deep disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-bebas text-2xl text-charcoal leading-none">
                          {form[field.key]}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateStepper(field.key, 1, field.min, field.max)
                          }
                          disabled={form[field.key] >= field.max}
                          aria-label={`Increase ${field.label}`}
                          className="h-7 w-7 rounded-lg border border-soft-grey bg-white flex items-center justify-center text-charcoal hover:border-teal-deep disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Features (6 binary attributes) */}
              <div className="py-7 border-b border-soft-grey">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
                    Additional Features
                  </span>
                  <span className="text-xs text-charcoal/55">
                    {activeAmenityCount} of 6 selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BINARY_FEATURES.map((feat) => {
                    const active = form[feat.key] === "yes";
                    return (
                      <button
                        key={feat.key}
                        type="button"
                        onClick={() => toggleBinary(feat.key)}
                        aria-pressed={active}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                          active
                            ? "border-teal-deep bg-teal-deep text-alabaster shadow-sm"
                            : "border-soft-grey bg-alabaster/50 text-charcoal hover:border-charcoal/30"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold leading-tight">
                            {feat.label}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              active ? "text-alabaster/75" : "text-charcoal/55"
                            }`}
                          >
                            {feat.hint}
                          </div>
                        </div>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                            active
                              ? "border-alabaster/30 bg-white/15 text-white"
                              : "border-charcoal/20 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Furnishing Status */}
              <div className="py-7">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep block mb-3">
                  Furnishing Status
                </span>
                <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-alabaster p-1.5 border border-soft-grey">
                  {FURNISHING_OPTIONS.map((opt) => {
                    const selected = form.furnishingstatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            furnishingstatus: opt.value,
                          }))
                        }
                        className={`rounded-xl py-2.5 px-2 text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                          selected
                            ? "bg-charcoal text-alabaster shadow-sm"
                            : "text-charcoal/70 hover:text-charcoal"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      <p className="text-xs text-red-700/80 mt-0.5">
                        Ensure the FastAPI server is running on{" "}
                        <code className="font-mono">localhost:8000</code>.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-deep px-6 py-4 text-sm sm:text-base font-semibold text-alabaster transition-all hover:bg-charcoal disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Running Inference...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Predict House Price</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(DEFAULT_FORM);
                    setResult(null);
                    setError(null);
                  }}
                  title="Reset parameters"
                  aria-label="Reset parameters"
                  className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-soft-grey bg-alabaster text-charcoal hover:border-charcoal/40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </form>
          </Reveal>

          {/* Right Architectural Showcase & Valuation Output */}
          <Reveal delay={0.1} className="lg:col-span-5 flex">
            <div className="w-full flex flex-col rounded-3xl overflow-hidden border border-charcoal/15 bg-charcoal text-alabaster shadow-2xl">
              {/* Architectural Image Header */}
              <div className="relative h-64 sm:h-72 lg:h-auto lg:flex-1 lg:min-h-[340px] w-full">
                <Image
                  src="/images/villa-pool.jpg"
                  alt="Modern poolside villa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/35 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-charcoal/75 backdrop-blur-md border border-white/15 px-3.5 py-1 text-[11px] uppercase tracking-[0.18em] text-alabaster">
                  Live Valuation Output
                </div>
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.18em] text-sage block">
                      Specification Summary
                    </span>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {form.area.toLocaleString("en-IN")} sq. ft. · {form.bedrooms} Bed ·{" "}
                      {form.bathrooms} Bath · {form.stories}F
                    </p>
                  </div>
                </div>
              </div>

              {/* Valuation Result Body */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key={result.predicted_price}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-sage font-semibold">
                        Estimated Market Value ({result.currency})
                      </span>
                      <div className="mt-2 font-bebas text-5xl sm:text-6xl text-white tracking-tight leading-none">
                        {formatINR(result.predicted_price)}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-teal-deep/60 border border-sage/30 px-3 py-1 text-xs font-medium text-sage">
                        <span>{formatINRCompact(result.predicted_price)}</span>
                        {pricePerSqFt !== null && (
                          <>
                            <span className="text-white/30">•</span>
                            <span>{formatINR(pricePerSqFt, 0)} / sq. ft.</span>
                          </>
                        )}
                      </div>

                      <dl className="mt-6 pt-6 border-t border-white/12 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <dt className="text-alabaster/55 uppercase tracking-wider">
                            Furnishing
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-white capitalize">
                            {form.furnishingstatus}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-alabaster/55 uppercase tracking-wider">
                            Parking
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-white">
                            {form.parking} {form.parking === 1 ? "Space" : "Spaces"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-alabaster/55 uppercase tracking-wider">
                            Amenities
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-white">
                            {activeAmenityCount} Active Features
                          </dd>
                        </div>
                        <div>
                          <dt className="text-alabaster/55 uppercase tracking-wider">
                            Model
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-white">
                            Linear Regression
                          </dd>
                        </div>
                      </dl>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-4"
                    >
                      <span className="text-xs uppercase tracking-[0.2em] text-sage font-semibold">
                        Ready for Inference
                      </span>
                      <p className="mt-2 font-serif-display italic text-2xl text-white">
                        Configure property attributes to calculate an estimate.
                      </p>
                      <p className="mt-3 text-sm text-alabaster/65 leading-relaxed">
                        Adjust square footage, room counts, amenities, and
                        furnishing status on the left, then select{" "}
                        <span className="text-white font-medium">
                          Predict House Price
                        </span>{" "}
                        to query the FastAPI model.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
