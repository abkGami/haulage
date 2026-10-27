"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/**
 * Scroll-linked page progress. GSAP's ScrollTrigger keeps this in sync with the
 * native scrollbar (and with document resizes) without a second scroll handler.
 */
export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return <div ref={ref} id="prog" className="prog" aria-hidden="true" />;
}
