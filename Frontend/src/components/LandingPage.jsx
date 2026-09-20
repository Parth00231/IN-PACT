import React from "react";
import {
  ArrowRight,
  Check,
  Radio,
  Sparkles,
  MapPin,
  Cpu,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";
import { StatusBadge, SeverityDot, MarkerPin, Stat } from "./StatusBadge";

/**
 * IN-PACT Landing Page
 * ---------------------
 * Built with the IN-PACT design system tokens (Tailwind CSS).
 * Every color/radius/font traces back to the design spec.
 */

const LIVE_REPORTS = [
  {
    ticket: "CIV-88492",
    label: "Waterlogging — Sector 62",
    coords: "28.6280 N, 77.3649 E",
    status: "escalated",
    severity: "critical",
  },
  {
    ticket: "CIV-88510",
    label: "Pothole — NH-24 Service Rd",
    coords: "28.6142 N, 77.3910 E",
    status: "in_progress",
    severity: "high",
  },
  {
    ticket: "CIV-88521",
    label: "Streetlight outage — Sector 51",
    coords: "28.6011 N, 77.3705 E",
    status: "assigned",
    severity: "medium",
  },
];

const METRICS = [
  { value: "12K+", label: "Citizen Reports" },
  { value: "1.2K", label: "Issues Tracked" },
  { value: "87%", label: "Resolution Rate" },
  { value: "24/7", label: "Intelligence Monitoring" },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Report",
    desc: "Submit a complaint using text, photo, voice or your precise location in seconds.",
  },
  {
    num: "02",
    title: "Understand",
    desc: "AI identifies the problem, assesses severity, and determines the infrastructure involved.",
  },
  {
    num: "03",
    title: "Route",
    desc: "The system automatically routes cases to the appropriate department and authority.",
  },
  {
    num: "04",
    title: "Resolve",
    desc: "Authorities receive prioritized, actionable intelligence with real-time verification.",
  },
];

const INTELLIGENCE_PILLARS = [
  {
    tag: "AI",
    title: "Understand",
    desc: "Natural language and computer vision parse multimodal citizen reports with high precision.",
    icon: Sparkles,
  },
  {
    tag: "GIS",
    title: "Locate",
    desc: "Geographic spatial intelligence pinpoints affected clusters and municipal boundaries.",
    icon: MapPin,
  },
  {
    tag: "ML",
    title: "Prioritize",
    desc: "Machine learning models evaluate severity, recurrence rate, and public safety impact.",
    icon: Cpu,
  },
  {
    tag: "PREDICT",
    title: "Prevent",
    desc: "Historical patterns and environmental data forecast infrastructure vulnerabilities.",
    icon: TrendingUp,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-canvas font-sans text-text-primary antialiased">
      {/* ---------------- Navigation ---------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface-canvas/80 border-b border-border-subdued">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-control bg-brand font-bold text-white shadow-md shadow-brand/20">
              I
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              IN-PACT
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-text-secondary md:flex">
            <a
              href="#how-it-works"
              className="transition-colors hover:text-text-primary"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-text-primary"
            >
              About
            </a>
            <a
              href="#live-map"
              className="transition-colors hover:text-text-primary"
            >
              Live Map
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-control border border-border-active bg-surface-container/50 px-4 py-2 text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated hover:border-border-active/80">
              Government Login
            </button>
            <button className="rounded-control bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-hover shadow-sm shadow-brand/25">
              Citizen Login
            </button>
          </div>
        </nav>
      </header>

      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow effect */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand/10 blur-[120px] rounded-full" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          {/* Left: Copy + CTAs */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
              AI-POWERED CIVIC INTELLIGENCE
            </div>

            <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl text-text-primary">
              Smarter Cities.
              <br />
              <span className="text-brand">
                Faster Action.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-text-secondary leading-relaxed">
              Report civic problems in seconds. IN-PACT uses artificial
              intelligence to understand, prioritize and route grievances to
              the right government authority.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="flex items-center gap-2 rounded-control bg-brand px-6 py-3 font-semibold text-white shadow-container transition-all hover:bg-brand-hover hover:shadow-brand/20">
                Report a Problem
                <ArrowRight size={18} />
              </button>
              <button className="rounded-control border border-border-active bg-surface-container/60 px-6 py-3 font-semibold text-text-primary transition-all hover:bg-surface-elevated">
                Explore Dashboard
              </button>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-text-secondary">
              <Check size={16} className="text-severity-low shrink-0" />
              <span>No need to know which department to contact</span>
            </div>
          </div>

          {/* Right: Live Civic Intelligence Card */}
          <div id="live-map" className="relative">
            <div className="rounded-card border border-border-subdued bg-surface-container p-6 shadow-container transition-all duration-300 hover:border-border-active">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
                  LIVE CIVIC INTELLIGENCE
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-severity-low/30 bg-severity-low/10 px-2.5 py-0.5 text-xs font-semibold text-severity-low">
                  <Radio size={12} className="animate-pulse" />
                  LIVE
                </span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-text-primary">
                Greater Noida
              </h3>

              {/* Map Surface */}
              <div className="relative h-64 overflow-hidden rounded-control border border-border-subdued bg-surface-canvas">
                <svg
                  className="absolute inset-0 h-full w-full opacity-25"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="32"
                      height="32"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 32 0 L 0 0 0 32"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Road network visualization */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
                  <line
                    x1="10%"
                    y1="80%"
                    x2="90%"
                    y2="20%"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="20%"
                    y1="20%"
                    x2="80%"
                    y2="85%"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  <line
                    x1="5%"
                    y1="45%"
                    x2="95%"
                    y2="50%"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Severity markers */}
                <div className="absolute left-[20%] top-[35%]">
                  <MarkerPin severity="critical" />
                </div>
                <div className="absolute left-[78%] top-[55%]">
                  <MarkerPin severity="high" />
                </div>
                <div className="absolute left-[45%] top-[72%]">
                  <MarkerPin severity="medium" />
                </div>
              </div>

              {/* Live Report Feed */}
              <ul className="mt-4 space-y-2">
                {LIVE_REPORTS.map((r) => (
                  <li
                    key={r.ticket}
                    className="flex items-center justify-between gap-3 rounded-control border border-border-subdued bg-surface-elevated/40 px-3 py-2 transition-colors hover:bg-surface-elevated/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <SeverityDot severity={r.severity} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {r.label}
                        </p>
                        <p className="font-mono text-[11px] text-text-secondary">
                          {r.ticket} · {r.coords}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} className="shrink-0" />
                  </li>
                ))}
              </ul>

              {/* Stats Strip */}
              <div className="mt-5 grid grid-cols-3 divide-x divide-border-subdued border-t border-border-subdued pt-5">
                <Stat value="1,284" label="ACTIVE ISSUES" />
                <Stat
                  value="42"
                  label="CRITICAL"
                  valueClass="text-severity-high"
                />
                <Stat
                  value="87%"
                  label="RESOLVED"
                  valueClass="text-severity-low"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- High-Level Stats Strip ---------------- */}
      <section className="border-y border-border-subdued bg-surface-container/40 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 sm:grid-cols-4 lg:px-8">
          {METRICS.map((stat, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="font-mono text-3xl font-extrabold text-brand tracking-tight sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How It Works Section ---------------- */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-ai-cyan/30 bg-ai-cyan/10 px-3 py-1 text-xs font-semibold text-ai-cyan tracking-wider">
              HOW IT WORKS
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-text-primary">
              From complaint to{" "}
              <span className="text-brand">government action.</span>
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg">
              Citizens simply report the problem. IN-PACT handles the complexity
              behind the scenes using AI-powered intelligence.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((s) => (
              <div
                key={s.num}
                className="group relative rounded-card border border-border-subdued bg-surface-container p-6 transition-all duration-300 hover:border-brand/50 hover:bg-surface-elevated/40"
              >
                <div className="font-mono text-3xl font-bold text-text-secondary/40 transition-colors group-hover:text-brand">
                  {s.num}
                </div>
                <h3 className="mt-4 text-lg font-bold text-text-primary">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why IN-PACT / Intelligence Section ---------------- */}
      <section id="about" className="border-t border-border-subdued bg-surface-container/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-ai-purple/30 bg-ai-purple/10 px-3 py-1 text-xs font-semibold text-ai-purple tracking-wider">
              WHY IN-PACT
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-text-primary">
              From reactive governance{" "}
              <span className="text-ai-purple">to predictive governance.</span>
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg">
              IN-PACT doesn't simply collect complaints. It transforms scattered
              citizen reports into structured, prioritized and actionable
              intelligence for government authorities.
            </p>
          </div>

          {/* Intelligence Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INTELLIGENCE_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.tag}
                  className="rounded-card border border-border-subdued bg-surface-container p-6 transition-all duration-300 hover:border-ai-purple/40 hover:bg-surface-elevated/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-control border border-border-active bg-surface-canvas px-2.5 py-1 font-mono text-xs font-semibold text-ai-purple">
                      {item.tag}
                    </span>
                    <Icon size={20} className="text-text-secondary" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-border-subdued py-12 bg-surface-canvas">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-control bg-brand font-bold text-white">
              I
            </div>
            <span className="font-bold tracking-tight text-text-primary">
              IN-PACT
            </span>
            <span className="text-xs text-text-secondary">
              — AI-Powered Civic Intelligence
            </span>
          </div>

          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} IN-PACT Civic Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
