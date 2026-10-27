"use client";

import { useEffect } from "react";
import type { SceneId } from "@/lib/clips";
import { getEngine, type SceneController } from "@/components/scenes/scene-engine";

const clamp = (value: number, min: number, max: number) =>
  value < min ? min : value > max ? max : value;

/** Cubic-bezier solver, matching the site's standard easing curve. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const calc = (t: number, a: number, b: number) =>
    ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) =>
    3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const delta = calc(t, x1, x2) - x;
      if (Math.abs(delta) < 1e-4) break;
      const derivative = slope(t, x1, x2);
      if (Math.abs(derivative) < 1e-6) break;
      t -= delta / derivative;
    }
    return calc(t, y1, y2);
  };
}

type RecWindow = Window & {
  __recTime?: (scene?: string | number, time?: number, alt?: number) => number;
};

/**
 * QA affordance from the brief: `?rec=1` walks the hero over 6.5s and
 * `?rec=full` walks the document. Inert without the query parameter.
 */
export function Recorder() {
  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get("rec");
    if (!mode) return;

    const full = mode === "full";
    const engine = getEngine();
    const ease = bezier(0.45, 0.05, 0.55, 0.95);
    const started = performance.now();
    const root = document.documentElement;
    const previousBehaviour = root.style.scrollBehavior;
    let manual = false;
    let raf = 0;

    root.style.scrollBehavior = "auto";

    const go = (scene: SceneController | undefined, progress: number) => {
      if (!scene) return;
      const total = full
        ? Math.max(1, root.scrollHeight - window.innerHeight)
        : scene.end + 0.9 * window.innerHeight;
      window.scrollTo(0, scene.top + clamp(progress, 0, 1) * total);
    };

    const recTime = (a?: string | number, b?: number, c?: number) => {
      let scene: SceneController | undefined;
      let time: number | null;

      if (typeof a === "string") {
        scene = engine.get(a as SceneId);
        time = typeof b === "number" ? b : (c ?? null);
      } else {
        scene = engine.get("A");
        time = typeof a === "number" ? a : typeof b === "number" ? b : null;
      }
      if (time == null) return 0;

      manual = true;
      const target = scene ?? engine.get("A");
      if (!target) return time;

      const duration = target.dur || 5.04;
      const eased = clamp(time / Math.max(0, duration - 1 / 48), 0, 1);
      const q = target.reverse ? 1 - eased : eased;
      const progress =
        q < target.low
          ? (q / target.low) * target.knee
          : target.knee + ((q - target.low) / (1 - target.low)) * (1 - target.knee);

      go(target, progress);
      return time;
    };

    (window as RecWindow).__recTime = recTime;

    const drive = () => {
      const elapsed = performance.now() - started;
      if (!manual) {
        const k = clamp(elapsed / 6500, 0, 1);
        const progress =
          k <= 0.046
            ? 0.03
            : k >= 0.892
              ? 0.94
              : 0.03 + ease((k - 0.046) / 0.846) * 0.91;
        go(engine.get("A"), progress);
      }
      if (elapsed < 6500) raf = requestAnimationFrame(drive);
    };

    raf = requestAnimationFrame(drive);

    return () => {
      cancelAnimationFrame(raf);
      delete (window as RecWindow).__recTime;
      root.style.scrollBehavior = previousBehaviour;
    };
  }, []);

  return null;
}
