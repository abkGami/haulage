"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { ScrubSection } from "@/components/scenes/ScrubSection";

const STEPS = [
  {
    number: "01",
    title: "Quote",
    body: "Tell us the cargo, the route and the date. You get a clear, all-in price with no hidden fees.",
    side: "step--l",
    top: "195vh",
  },
  {
    number: "02",
    title: "Plan",
    body: "We map the route, book the space, prepare the paperwork and flag risks before they cost you time.",
    side: "step--r",
    top: "228.75vh",
  },
  {
    number: "03",
    title: "Move",
    body: "Your freight is tracked in real time and one contact keeps you informed at every handover.",
    side: "step--l",
    top: "262.5vh",
  },
  {
    number: "04",
    title: "Deliver",
    body: "Cargo is cleared, delivered and confirmed. If anything shifts, we fix it before you have to ask.",
    side: "step--r",
    top: "296.25vh",
    last: true,
  },
];

export function Process() {
  const trackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const steps = Array.from(track.querySelectorAll<HTMLElement>(".step"));
    const fill = track.querySelector<HTMLElement>(".axis__f");
    if (!steps.length || !fill) return;

    gsap.registerPlugin(ScrollTrigger);

    // A step lights up once it crosses 55% of the viewport, same trigger as the
    // original single-file build.
    const toggleSteps = () => {
      const line = window.innerHeight * 0.55;
      for (const step of steps) {
        step.classList.toggle("is-on", step.getBoundingClientRect().top < line);
      }
    };

    const tween = gsap.to(fill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: () => `top+=${steps[0].offsetTop} top`,
        end: () => `top+=${steps[steps.length - 1].offsetTop} top`,
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: toggleSteps,
        onRefresh: toggleSteps,
      },
    });

    toggleSteps();
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      for (const step of steps) step.classList.remove("is-on");
    };
  }, []);

  return (
    <ScrubSection
      scene="C"
      low={0.62}
      dim={0.34}
      labelledBy="proc-h"
      seams={{ top: true }}
      trackRef={trackRef}
    >
      <div className="intro top-[125vh]" id="process">
        <p className="eyebrow">How it works</p>
        <h2 className="h2" id="proc-h">
          <span>From first call</span>
          <span>to final mile.</span>
          <span>Nothing</span>
          <span>left to chance.</span>
        </h2>
      </div>

      <div className="axis" aria-hidden="true">
        <div className="axis__f" />
      </div>

      <div className="steps">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className={`step ${step.side}`}
            style={{ top: step.top }}
            data-block={step.last ? "" : undefined}
          >
            <p className="step__n">{step.number}</p>
            <p className="b__t">{step.title}</p>
            <p className="b__b">{step.body}</p>
          </div>
        ))}
      </div>
    </ScrubSection>
  );
}
