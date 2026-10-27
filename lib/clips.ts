export type SceneId = "A" | "B" | "C" | "D";

export type ClipConfig = {
  /** 1080p source, scrubbed on pointer devices. */
  hd: string;
  /** 720p source, used on small screens where only one clip stays attached. */
  sd?: string;
  poster?: string;
};

const CDN =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";

/**
 * One clip per descent stage. A is the aerial yard approach; B is the container
 * port, C the road/rail corridor, and D reverses A for the quote.
 *
 * B and C are intentionally empty: the scene renders its neutral dark surface
 * (`.no-media`) instead of invented footage. Drop a URL in and the engine picks
 * it up — no other change required.
 */
export const CLIPS: Record<SceneId, ClipConfig | null> = {
  A: {
    hd: `${CDN}/e02bb27f-80d8-445f-a03e-1b609dac4261.mp4`,
    sd: `${CDN}/e8eb434f-d097-4b1b-b9e6-c8b46fa43040.mp4`,
    poster: `${CDN}/5e018553-cb8a-420a-819f-fcdfa08e5df0.jpg`,
  },
  B: null,
  C: null,
  // D deliberately reuses A, played backwards by the engine.
  D: null,
};

export function clipFor(scene: SceneId): ClipConfig | null {
  return CLIPS[scene] ?? (scene === "D" ? CLIPS.A : null);
}
