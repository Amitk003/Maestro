"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const steps = [
  { num: 1, label: "Twin Snapshot", color: "#0070F3" },
  { num: 2, label: "6 Agents Analyze", color: "#22C55E" },
  { num: 3, label: "Propose Actions", color: "#F59E0B" },
  { num: 4, label: "Orchestrator Resolves", color: "#A78BFA" },
  { num: 5, label: "Apply to Twin", color: "#EC4899" },
  { num: 6, label: "Broadcast via WS", color: "#06B6D4" },
];

const techStack = [
  { name: "Next.js 15", color: "#FFFFFF" },
  { name: "React 19", color: "#61DAFB" },
  { name: "Tailwind v4", color: "#06B6D4" },
  { name: "Google Gemini", color: "#4285F4" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Socket.io", color: "#FFFFFF" },
];

const arch = [
  { key: "Frontend", val: "Next.js 15 + React 19" },
  { key: "Real-Time", val: "Socket.io WebSocket" },
  { key: "Agent Worker", val: "Node.js + Express" },
  { key: "Digital Twin", val: "In-memory + 5s tick" },
  { key: "AI Layer", val: "Gemini + heuristic" },
  { key: "Database", val: "PostgreSQL via Supabase" },
];

export default function SlideTechnical() {
  return (
    <div className="flex h-full w-full flex-col px-16 py-10">
      <motion.div initial="hidden" animate="visible" className="flex flex-col h-full gap-5">
        <motion.h2 custom={0} variants={fadeUp} className="text-4xl font-bold text-text">
          Technical Approach
        </motion.h2>
        <motion.div custom={0} variants={fadeUp} className="h-px w-16 bg-accent" />

        {/* Horizontal Flowchart */}
        <motion.p custom={1} variants={fadeUp} className="text-xs font-semibold text-accent tracking-wider uppercase">
          Agent Decision Flow
        </motion.p>

        <motion.div custom={1} variants={fadeUp} className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: s.color }}
                >
                  {s.num}
                </div>
                <div className="w-full rounded-lg border border-border bg-surface p-3 text-center">
                  <p className="text-xs font-semibold text-text">{s.label}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <svg width="20" height="12" viewBox="0 0 20 12" className="shrink-0 mt-[-20px]">
                  <path d="M0 6 L14 6 M10 2 L14 6 L10 10" stroke="#3F3F46" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          ))}
        </motion.div>

        {/* Tech Stack Badges */}
        <motion.div custom={2} variants={fadeUp} className="h-px w-full bg-border" />
        <motion.p custom={2} variants={fadeUp} className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
          Technology Stack
        </motion.p>

        <motion.div custom={3} variants={fadeUp} className="flex gap-3 flex-wrap">
          {techStack.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ scale: 1.05, borderColor: t.color }}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5"
            >
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
              <span className="text-sm font-medium text-text">{t.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Grid */}
        <motion.div custom={4} variants={fadeUp} className="grid grid-cols-6 gap-3 mt-auto">
          {arch.map((a) => (
            <div key={a.key} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-[10px] font-semibold text-accent">{a.key}</p>
              <p className="text-[10px] text-text-muted mt-1">{a.val}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
