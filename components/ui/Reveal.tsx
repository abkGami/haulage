"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { EASE_REVEAL } from "@/lib/motion";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Fade-and-rise on first view.
 *
 * The first paint is always `opacity:0` — reduced motion must not change the
 * markup React hydrates (it would strip the tree). Reduced motion shortens the
 * transition to zero, and `globals.css` forces `.rv` visible for static/no-JS
 * readers so nothing is ever hidden behind a missing animation.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cx("rv", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.7, delay, ease: EASE_REVEAL }
      }
    >
      {children}
    </motion.div>
  );
}
