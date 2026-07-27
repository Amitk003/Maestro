"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function SlideTitle() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.p
          custom={0}
          variants={fadeUp}
          className="text-sm font-medium tracking-[0.3em] uppercase text-accent"
        >
          Vibeathon 6.0
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="text-[9rem] font-black leading-none tracking-tight text-text"
        >
          Maestro
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          className="mt-2 text-2xl font-light text-text-secondary max-w-xl"
        >
          An AI-Powered Restaurant Digital Twin
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          className="mt-12 h-px w-24 bg-accent"
        />

        <motion.p
          custom={4}
          variants={fadeUp}
          className="mt-4 text-sm text-text-muted tracking-wide"
        >
          Team Name &nbsp;|&nbsp; Leader Name &nbsp;|&nbsp; College &nbsp;|&nbsp; Year &amp; Department
        </motion.p>
      </motion.div>
    </div>
  );
}
