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

const useCases = [
  { title: "Customer Ordering", desc: "Guest types: '25 min, light dinner, pre-show'. Guest Alchemist parses intent, checks kitchen load, returns personalized meal sequence.", color: "#0070F3" },
  { title: "Kitchen Optimization", desc: "Grill station hits 90% load. Kitchen Conductor auto-routes items to Saute or Cold Prep. Chefs see only relevant orders.", color: "#22C55E" },
  { title: "Crisis Response", desc: "Storm + event surge. Demand Seer detects. Inventory Guardian flags spoilage. Orchestrator resolves all conflicts.", color: "#EF4444" },
  { title: "Waste Prevention", desc: "Salmon at 35% freshness. Inventory Guardian promotes Cold Salmon Tartare. 3.2kg waste prevented.", color: "#F59E0B" },
];

const impacts = [
  { value: "30-40%", label: "Waste Reduction", desc: "Proactive spoilage alerts + dynamic menu promotion", color: "#22C55E" },
  { value: "25%", label: "Service Speed", desc: "Intelligent routing + task prioritization", color: "#0070F3" },
  { value: "+2.0", label: "Guest Delight", desc: "Personalized experiences + recovery perks", color: "#F59E0B" },
];

export default function SlideImpact() {
  return (
    <div className="flex h-full w-full px-16 py-10">
      <motion.div initial="hidden" animate="visible" className="flex w-full gap-12">
        {/* Left: Use Cases */}
        <div className="flex flex-1 flex-col gap-3">
          <motion.h2 custom={0} variants={fadeUp} className="text-3xl font-bold text-text mb-1">
            Use Cases
          </motion.h2>
          <motion.div custom={0} variants={fadeUp} className="h-px w-16 bg-accent mb-3" />

          <div className="flex flex-col gap-3 flex-1">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                custom={i + 1}
                variants={fadeUp}
                whileHover={{ scale: 1.01 }}
                className="relative rounded-xl border border-border bg-surface p-4"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: uc.color }} />
                <p className="text-sm font-semibold" style={{ color: uc.color }}>{uc.title}</p>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Impact Metrics */}
        <div className="flex flex-1 flex-col gap-3">
          <motion.h2 custom={1} variants={fadeUp} className="text-xl font-semibold text-text-secondary mb-1">
            Expected Impact
          </motion.h2>
          <motion.div custom={1} variants={fadeUp} className="h-px w-full bg-border mb-3" />

          <div className="flex flex-1 flex-col justify-center gap-6">
            {impacts.map((m, i) => (
              <motion.div
                key={m.value}
                custom={i + 2}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <div className="flex items-baseline gap-3">
                  <p className="text-[3.5rem] font-black leading-none" style={{ color: m.color }}>
                    {m.value}
                  </p>
                  <p className="text-lg font-semibold text-text">{m.label}</p>
                </div>
                <p className="mt-2 text-xs text-text-secondary">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
