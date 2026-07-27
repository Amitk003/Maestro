"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import SlideTitle from "@/components/SlideTitle";
import SlideProblem from "@/components/SlideProblem";
import SlideSolution from "@/components/SlideSolution";
import SlideTechnical from "@/components/SlideTechnical";
import SlideImpact from "@/components/SlideImpact";
import SlideFuture from "@/components/SlideFuture";

const slides = [SlideTitle, SlideProblem, SlideSolution, SlideTechnical, SlideImpact, SlideFuture];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function Home() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback(
    (newDirection: number) => {
      const next = page + newDirection;
      if (next < 0 || next >= slides.length) return;
      setPage([next, newDirection]);
    },
    [page]
  );

  const goTo = useCallback(
    (i: number) => {
      setPage([i, i > page ? 1 : -1]);
    },
    [page]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        paginate(1);
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        paginate(-1);
      }
      // Number keys 1-6
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6) {
        goTo(num - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate, goTo]);

  const Slide = slides[page];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bg">
      {/* Slide Counter */}
      <div className="fixed top-5 right-6 z-50 text-xs font-medium text-text-muted">
        {String(page + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Slide />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Navigation current={page} setCurrent={goTo} />

      {/* Keyboard hints */}
      <div className="fixed bottom-5 left-6 z-50 flex gap-2 text-[10px] text-text-muted">
        <span className="rounded border border-border px-1.5 py-0.5">←</span>
        <span className="rounded border border-border px-1.5 py-0.5">→</span>
        <span className="ml-1">to navigate</span>
      </div>
    </div>
  );
}
