"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type PointerEvent } from "react";

type Props = {
  icon: string;
  title: string;
  body: string;
};

/**
 * Fine-pointer cards get a small 3D lean. Touch devices skip the effect
 * entirely — no handlers fire, and the transform stays at rest.
 */
export function IndustryCard({ icon, title, body }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const reduce = useReducedMotion();

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMove(event: PointerEvent<HTMLElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, translateZ: 4 }}
      className="h-full rounded-[2px] border border-ink/16 bg-white/15 p-8 transition-[background-color,box-shadow] duration-200 ease-out hover:bg-white/30 hover:shadow-[0_24px_48px_rgba(20,21,22,.08)] narrow:p-[26px]"
    >
      <svg className="ico ico--ink mb-6" aria-hidden="true">
        <use href={`#${icon}`} />
      </svg>
      <h3 className="font-ui text-[16px] font-bold uppercase leading-[1.25] tracking-[.04em]">
        {title}
      </h3>
      <p className="mt-2.5 font-ui text-[14px] leading-[1.5] text-ink/[.72]">
        {body}
      </p>
    </motion.article>
  );
}
