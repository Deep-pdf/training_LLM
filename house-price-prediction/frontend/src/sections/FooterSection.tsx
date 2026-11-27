"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Instagram, Mail, Phone } from "lucide-react";
import WordPullUp from "@/components/ui/word-pull-up";
import { fetchHealth } from "@/lib/api";
import type { HealthStatus } from "@/types/prediction";

const CONTACT_LINKS = [
  {
    label: "GitHub",
    value: "github.com/Deep-pdf",
    href: "https://github.com/Deep-pdf",
    icon: Github,
  },
  {
    label: "Email",
    value: "soumodeepsantra5@gmail.com",
    href: "mailto:soumodeepsantra5@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 6299964074",
    href: "tel:+916299964074",
    icon: Phone,
  },
  {
    label: "Instagram",
    value: "@ai_integrated_deep",
    href: "https://www.instagram.com/ai_integrated_deep",
    icon: Instagram,
  },
];

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Prediction", href: "#prediction" },
];

export default function FooterSection() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    let active = true;
    fetchHealth().then((status) => {
      if (active) setHealth(status);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer
      id="contact"
      className="bg-charcoal text-alabaster border-t border-white/10 pt-20 pb-12 px-4 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Bold Typographic Banner */}
        <div className="border-b border-white/12 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-sage font-semibold block mb-2">
              04 / Contact &amp; Colophon
            </span>
            <h2 className="font-bebas text-[clamp(3.2rem,8.5vw,7rem)] leading-[0.86] uppercase text-white tracking-tight">
              <WordPullUp
                duration={0.55}
                stagger={0.07}
                segments={[
                  { text: "Made by" },
                  { text: "DEEP", className: "text-sage" },
                ]}
              />
            </h2>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                health?.status === "healthy"
                  ? "bg-emerald-400"
                  : health?.status === "offline"
                  ? "bg-amber-400"
                  : "bg-sage"
              }`}
            />
            <span className="text-alabaster/80">
              Backend API:{" "}
              <strong className="text-white font-medium capitalize">
                {health ? health.status : "checking"}
              </strong>
            </span>
          </div>
        </div>

        {/* Contact Grid & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-white/12">
          <div className="lg:col-span-4">
            <div className="font-bebas text-2xl tracking-wider text-white">
              Predict<span className="text-sage">House</span>
            </div>
            <p className="mt-3 text-sm text-alabaster/65 leading-relaxed max-w-sm">
              Architectural house price valuation powered by Python,
              Scikit-learn Linear Regression, FastAPI, and Next.js.
            </p>
            <ul className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-alabaster/70">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACT_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.025] p-5 transition-colors hover:border-sage/50 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-deep text-alabaster">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-alabaster/50 block">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-white truncate block">
                        {item.value}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-alabaster/40 group-hover:text-sage transition-colors shrink-0 ml-2" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-alabaster/50">
          <p>PredictHouse — Open-Source House Price Prediction Platform</p>
          <p>Built with Next.js, Tailwind CSS &amp; FastAPI</p>
        </div>
      </div>
    </footer>
  );
}
