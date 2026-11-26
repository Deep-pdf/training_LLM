"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { label: "Prediction", href: "#prediction", id: "prediction" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 px-4 sm:px-8"
          : "py-4 sm:py-5 px-4 sm:px-8"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 ${
          scrolled
            ? "bg-alabaster/90 backdrop-blur-md border border-soft-grey shadow-[0_8px_30px_rgba(0,57,72,0.08)]"
            : "bg-alabaster/65 backdrop-blur-sm border border-white/40"
        }`}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep rounded-full pr-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-deep text-alabaster transition-transform duration-300 group-hover:scale-105">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M3 11L12 3l9 8" />
              <path d="M5 10v10h14V10" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </span>
          <span className="font-bebas tracking-wider text-xl sm:text-2xl text-charcoal leading-none pt-0.5">
            Predict<span className="text-teal-deep">House</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                    isActive
                      ? "text-teal-deep font-semibold"
                      : "text-charcoal/75 hover:text-charcoal"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-teal-deep/10 -z-10"
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#prediction"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#prediction");
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-teal-deep px-4 py-2 text-xs sm:text-sm font-medium text-alabaster transition-all duration-200 hover:bg-charcoal hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-deep"
          >
            <span>Estimate Value</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/5 text-charcoal hover:bg-charcoal/10 transition-colors"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl bg-alabaster/95 backdrop-blur-lg border border-soft-grey p-4 shadow-xl"
          >
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-teal-deep text-alabaster"
                          : "text-charcoal hover:bg-limestone"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 pt-3 border-t border-soft-grey">
              <a
                href="#prediction"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#prediction");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-deep px-4 py-3 text-sm font-semibold text-alabaster"
              >
                <span>Start Price Prediction</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
