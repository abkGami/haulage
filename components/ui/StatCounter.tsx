"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  /** Spoken value, e.g. "98 percent" — the animated digits are aria-hidden. */
  spoken: string;
};

/** Counts up once, on entry. The final number is already present in the HTML. */
export function StatCounter({ value, suffix = "", label, spoken }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      if (numberRef.current) numberRef.current.textContent = String(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        if (numberRef.current) {
          numberRef.current.textContent = String(Math.round(latest));
        }
      },
    });

    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={rootRef} className="stat">
      <p
        className="font-display text-[clamp(44px,6vw,84px)] font-extrabold leading-[.95] tracking-[-.02em] [font-variant-numeric:tabular-nums]"
        role="img"
        aria-label={spoken}
      >
        <span aria-hidden="true" ref={numberRef}>
          {value}
        </span>
        <span aria-hidden="true">{suffix}</span>
      </p>
      <p className="mt-3 font-ui text-[12px] font-bold uppercase leading-[1.35] tracking-[.16em] text-[var(--ink-mute)]">
        {label}
      </p>
    </div>
  );
}
