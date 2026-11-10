"use client";

import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { clipFor, CLIPS, type SceneId } from "@/lib/clips";
import { cx } from "@/lib/cx";
import { getEngine } from "./scene-engine";

const FALLBACK_POSTER = CLIPS.A?.poster ?? "";

type Props = {
  scene: SceneId;
  /** Share of the timeline used for the first stretch of the scroll track. */
  low: number;
  /** Peak black overlay at the end of the scene. */
  dim: number;
  reverse?: boolean;
  id?: string;
  labelledBy: string;
  seams?: { top?: boolean; foot?: boolean };
  trackRef?: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
};

/**
 * A sticky, scroll-scrubbed video scene. Content is absolutely positioned over
 * the scene and measured by the engine to derive the track length.
 */
export function ScrubSection({
  scene,
  low,
  dim,
  reverse = false,
  id,
  labelledBy,
  seams,
  trackRef,
  className,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  const clip = clipFor(scene);
  const hasMedia = Boolean(clip?.hd);
  const showFallback = !hasMedia && Boolean(FALLBACK_POSTER);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const engine = getEngine();
    const controller = engine.add({
      id: scene,
      track: section,
      video: videoRef.current,
      dim: dimRef.current,
      low,
      maxDim: dim,
      reverse,
      clip,
    });

    return () => engine.remove(controller);
    // Scene geometry is static for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id={id}
      ref={(el) => {
        sectionRef.current = el;
        if (trackRef) trackRef.current = el;
      }}
      className={cx("track", className)}
      data-scene={scene}
      data-theme="dark"
      aria-labelledby={labelledBy}
    >
      <div className={cx("scene", !hasMedia && "no-media")}>
        {clip?.poster ? (
          // The poster is the video's own first frame on a third-party CDN. A
          // plain  keeps it off the optimizer proxy and paints immediately.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="poster"
            src={clip.poster}
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        ) : showFallback ? (
          // No clip on this scene: show the poster as a fallback on mobile so
          // the scene is never a blank black screen between sections.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="poster"
            src={FALLBACK_POSTER}
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        ) : null}
        {hasMedia ? (
          <video
            ref={videoRef}
            className="clip"
            muted
            playsInline
            preload={scene === "A" ? "auto" : "none"}
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}
        <div className="tint" />
        <div className="dim" ref={dimRef} />
      </div>

      {seams?.top ? <div className="seam" aria-hidden="true" /> : null}
      {seams?.foot ? <div className="seam seam--foot" aria-hidden="true" /> : null}

      <div className="content">{children}</div>
    </section>
  );
}
