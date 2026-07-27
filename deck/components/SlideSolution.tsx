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

const agents = [
  { name: "Demand Seer", desc: "Predicts demand from weather, events, time", color: "#0070F3", pos: "left" },
  { name: "Kitchen Conductor", desc: "Balances station loads and routing", color: "#22C55E", pos: "right" },
  { name: "Inventory Guardian", desc: "Prevents spoilage and waste", color: "#F59E0B", pos: "left" },
  { name: "Guest Alchemist", desc: "Personalizes customer experience", color: "#A78BFA", pos: "right" },
  { name: "Staff Harmony", desc: "Optimizes tasks, prevents burnout", color: "#EC4899", pos: "bottom" },
];

export default function SlideSolution() {
  return (
    <div className="flex h-full w-full flex-col px-16 py-10">
      <motion.div initial="hidden" animate="visible" className="flex flex-col h-full">
        <motion.h2 custom={0} variants={fadeUp} className="text-4xl font-bold text-text mb-1">
          The Solution
        </motion.h2>
        <motion.p custom={1} variants={fadeUp} className="text-sm text-text-secondary mb-1">
          Multi-Agent Architecture with a Living Digital Twin
        </motion.p>
        <motion.div custom={1} variants={fadeUp} className="h-px w-16 bg-accent mb-6" />

        {/* Agent Node Map */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* Center Hub */}
          <motion.div
            custom={2}
            variants={fadeUp}
            className="absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-accent bg-accent/10"
          >
            <span className="text-sm font-bold text-accent">Maestro</span>
            <span className="text-[10px] text-accent-light">Orchestrator</span>
          </motion.div>

          {/* Top Row */}
          <div className="absolute top-4 left-0 right-0 flex justify-between px-12">
            {agents.filter(a => a.pos === "left" || a.pos === "right").slice(0, 2).map((a, i) => (
              <motion.div
                key={a.name}
                custom={i + 3}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center rounded-xl border bg-surface p-4 w-44"
                style={{ borderColor: a.color + "40" }}
              >
                <span className="text-sm font-semibold" style={{ color: a.color }}>{a.name}</span>
                <span className="text-[10px] text-text-secondary text-center mt-1">{a.desc}</span>
              </motion.div>
            ))}
          </div>

          {/* Middle Row */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-12">
            {agents.filter(a => a.pos === "left" || a.pos === "right").slice(2, 4).map((a, i) => (
              <motion.div
                key={a.name}
                custom={i + 5}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center rounded-xl border bg-surface p-4 w-44"
                style={{ borderColor: a.color + "40" }}
              >
                <span className="text-sm font-semibold" style={{ color: a.color }}>{a.name}</span>
                <span className="text-[10px] text-text-secondary text-center mt-1">{a.desc}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom */}
          <motion.div
            custom={7}
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            className="absolute bottom-8 flex flex-col items-center rounded-xl border bg-surface p-4 w-44"
            style={{ borderColor: agents[4].color + "40" }}
          >
            <span className="text-sm font-semibold" style={{ color: agents[4].color }}>{agents[4].name}</span>
            <span className="text-[10px] text-text-secondary text-center mt-1">{agents[4].desc}</span>
          </motion.div>

          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* Lines from agents to center */}
            <line x1="18%" y1="18%" x2="48%" y2="46%" stroke="#0070F330" strokeWidth="1.5" />
            <line x1="82%" y1="18%" x2="52%" y2="46%" stroke="#22C55E30" strokeWidth="1.5" />
            <line x1="18%" y1="55%" x2="48%" y2="52%" stroke="#F59E0B30" strokeWidth="1.5" />
            <line x1="82%" y1="55%" x2="52%" y2="52%" stroke="#A78BFA30" strokeWidth="1.5" />
            <line x1="50%" y1="82%" x2="50%" y2="58%" stroke="#EC489930" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Benefits Bar */}
        <motion.div custom={8} variants={fadeUp} className="flex gap-8 border-t border-border pt-5 mt-2">
          {[
            { label: "Proactive", desc: "Act before problems occur" },
            { label: "Always On", desc: "Heuristic fallback if AI is down" },
            { label: "Real-Time", desc: "5-second update cycle via WebSocket" },
          ].map((b) => (
            <div key={b.label} className="flex-1">
              <p className="text-sm font-semibold text-accent">{b.label}</p>
              <p className="text-xs text-text-secondary mt-1">{b.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
