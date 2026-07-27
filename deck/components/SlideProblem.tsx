"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const problems = [
  {
    title: "Reactive Operations",
    desc: "Ticket printers, manual coordination, and verbal communication are the backbone of most restaurants. Problems are addressed only after they occur.",
    color: "#EF4444",
  },
  {
    title: "Information Silos",
    desc: "Kitchen, front-of-house, inventory, and management operate in disconnected loops. No one has complete visibility into restaurant state.",
    color: "#F59E0B",
  },
  {
    title: "No Prediction",
    desc: "Existing systems cannot anticipate demand surges from weather, events, or time patterns. Restaurants are always caught off-guard.",
    color: "#A78BFA",
  },
];

const metrics = [
  { value: "$200B+", label: "Annual food waste in US restaurants" },
  { value: "30%", label: "Average kitchen idle time during peak hours" },
  { value: "4.2x", label: "Higher staff turnover vs. tech industry" },
];

export default function SlideProblem() {
  return (
    <div className="flex h-full w-full px-16 py-12">
      <motion.div initial="hidden" animate="visible" className="flex w-full gap-16">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-4">
          <motion.h2 custom={0} variants={fadeUp} className="text-4xl font-bold text-text mb-2">
            The Problem
          </motion.h2>
          <motion.div custom={1} variants={fadeUp} className="h-px w-16 bg-accent mb-4" />

          <div className="flex flex-col gap-5">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i + 2}
                variants={fadeUp}
                className="relative rounded-xl border border-border bg-surface p-5"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
                  style={{ background: p.color }}
                />
                <h3 className="text-base font-semibold mb-2" style={{ color: p.color }}>
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="flex flex-1 flex-col gap-4">
          <motion.h2 custom={1} variants={fadeUp} className="text-xl font-semibold text-text-secondary mb-2">
            Industry Impact
          </motion.h2>
          <motion.div custom={1} variants={fadeUp} className="h-px w-full bg-border mb-4" />

          <div className="flex flex-1 flex-col justify-center gap-8">
            {metrics.map((m, i) => (
              <motion.div
                key={m.value}
                custom={i + 3}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface p-8"
              >
                <p className="text-[4rem] font-black leading-none text-accent">{m.value}</p>
                <p className="mt-3 text-sm text-text-secondary">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
