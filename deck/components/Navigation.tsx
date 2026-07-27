"use client";
import { motion } from "framer-motion";

const slides = [
  "Title",
  "Problem",
  "Solution",
  "Technical",
  "Impact",
  "Future",
];

export default function Navigation({
  current,
  setCurrent,
}: {
  current: number;
  setCurrent: (i: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-5">
      <div className="flex items-center gap-1.5 rounded-full bg-surface/80 backdrop-blur-xl border border-border px-4 py-2.5">
        {slides.map((label, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ color: i === current ? "#FFFFFF" : "#52525B" }}
          >
            {i === current && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
