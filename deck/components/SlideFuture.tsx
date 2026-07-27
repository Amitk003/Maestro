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

const enhancements = [
  { title: "Multi-Restaurant Federation", desc: "Extend the digital twin to manage multiple locations with cross-location inventory sharing and demand balancing.", color: "#0070F3" },
  { title: "Advanced ML Models", desc: "Replace heuristic fallback with trained models for demand prediction, spoilage forecasting, and preference learning.", color: "#22C55E" },
  { title: "Voice & Chat Integration", desc: "Natural language ordering via voice assistants and in-app chat. Staff can interact with agents via voice commands.", color: "#A78BFA" },
  { title: "Supply Chain Integration", desc: "Direct supplier connection for automated reordering, price optimization, and delivery scheduling.", color: "#F59E0B" },
];

const phases = [
  { label: "Phase 1", desc: "Single restaurant", color: "#A78BFA" },
  { label: "Phase 2", desc: "Multi-location", color: "#A78BFA" },
  { label: "Phase 3", desc: "Supply chain", color: "#52525B" },
  { label: "Phase 4", desc: "Industry platform", color: "#52525B" },
];

export default function SlideFuture() {
  return (
    <div className="flex h-full w-full flex-col px-16 py-10">
      <motion.div initial="hidden" animate="visible" className="flex flex-col h-full gap-5">
        <motion.h2 custom={0} variants={fadeUp} className="text-4xl font-bold text-text">
          Future Scope & Conclusion
        </motion.h2>
        <motion.div custom={0} variants={fadeUp} className="h-px w-16 bg-accent" />

        {/* Two columns */}
        <div className="flex gap-10 flex-1">
          {/* Left: Enhancements */}
          <div className="flex flex-col gap-3 flex-1">
            <motion.p custom={1} variants={fadeUp} className="text-xs font-semibold text-accent tracking-wider uppercase">
              Future Enhancements
            </motion.p>
            <div className="flex flex-col gap-3">
              {enhancements.map((e, i) => (
                <motion.div
                  key={e.title}
                  custom={i + 2}
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  className="relative rounded-xl border border-border bg-surface p-4"
                >
                  <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: e.color }} />
                  <p className="text-sm font-semibold" style={{ color: e.color }}>{e.title}</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{e.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Conclusion + Timeline */}
          <div className="flex flex-1 flex-col gap-5">
            <motion.p custom={2} variants={fadeUp} className="text-xs font-semibold text-success tracking-wider uppercase">
              Conclusion
            </motion.p>

            <motion.div custom={3} variants={fadeUp} className="rounded-xl border border-success/20 bg-surface p-5 space-y-3">
              {[
                "Transforms restaurant operations from reactive to proactive.",
                "Six specialized AI agents collaborate through a living digital twin.",
                "Multi-agent architecture with heuristic fallback ensures reliability.",
                "Real-time updates via WebSocket across all stakeholders.",
                "Measurable impact: less waste, faster service, happier guests.",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                  <p className="text-xs text-text-secondary leading-relaxed">{point}</p>
                </div>
              ))}
            </motion.div>

            {/* Timeline */}
            <motion.p custom={4} variants={fadeUp} className="text-xs font-semibold text-purple tracking-wider uppercase">
              Scalability Roadmap
            </motion.p>

            <motion.div custom={5} variants={fadeUp} className="relative">
              {/* Line */}
              <div className="absolute top-2 left-0 right-0 h-0.5 bg-border" />
              <div className="flex justify-between relative">
                {phases.map((p, i) => (
                  <div key={p.label} className="flex flex-col items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 z-10" style={{ borderColor: p.color, background: i < 2 ? p.color : "#1A1A1A" }} />
                    <p className="text-[10px] font-semibold" style={{ color: p.color }}>{p.label}</p>
                    <p className="text-[10px] text-text-muted">{p.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tagline */}
        <motion.div custom={6} variants={fadeUp} className="border-t border-border pt-4 mt-auto text-center">
          <p className="text-2xl font-bold text-text">Maestro: Your Restaurant Runs Itself</p>
          <p className="text-sm text-text-secondary mt-1">Less waste. Faster tables. Happier guests. Staff that do not burn out.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
