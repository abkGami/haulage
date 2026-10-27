import type { ClipConfig, SceneId } from "@/lib/clips";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export type SceneRegistration = {
  id: SceneId;
  track: HTMLElement;
  video: HTMLVideoElement | null;
  dim: HTMLElement | null;
  low: number;
  maxDim: number;
  reverse: boolean;
  clip: ClipConfig | null;
};

type FrameRect = { top: number; bottom: number; height: number };

/**
 * One scene = one sticky video track. The video is only ever moved with
 * `currentTime`; it is never played, looped or faded. A single easing step per
 * frame keeps the scrub smooth without a timeline library in the hot path.
 */
class SceneController {
  readonly id: SceneId;
  readonly track: HTMLElement;
  readonly video: HTMLVideoElement | null;
  readonly dimEl: HTMLElement | null;
  readonly clip: ClipConfig | null;
  readonly low: number;
  readonly maxDim: number;
  readonly reverse: boolean;
  readonly hasMedia: boolean;

  top = 0;
  end = 1;
  trackH = 0;
  knee = 0.5;

  cur = 0;
  target = 0;
  dur = 0;

  active = false;
  attached = false;

  private readonly lastBlock: HTMLElement | null;
  private io: IntersectionObserver | null = null;

  constructor(reg: SceneRegistration) {
    this.id = reg.id;
    this.track = reg.track;
    this.video = reg.video;
    this.dimEl = reg.dim;
    this.clip = reg.clip;
    this.low = reg.low;
    this.maxDim = reg.maxDim;
    this.reverse = reg.reverse;
    this.hasMedia = Boolean(reg.clip?.hd);

    const blocks = reg.track.querySelectorAll<HTMLElement>("[data-block]");
    this.lastBlock = blocks.length
      ? blocks[blocks.length - 1]
      : reg.track.querySelector<HTMLElement>(".b");

    if (!this.hasMedia) {
      reg.track.querySelector<HTMLElement>(".scene")?.classList.add("no-media");
    }

    const v = this.video;
    if (v) {
      v.addEventListener("loadeddata", this.onLoadedData);
      v.addEventListener("loadedmetadata", this.onLoadedMetadata);
      v.addEventListener("seeked", this.onSeeked);
      v.addEventListener("error", this.onError);
    }
  }

  private onLoadedData = () => {
    const v = this.video;
    if (!v) return;
    v.classList.add("is-ready");
    engine?.kick();
  };

  private onLoadedMetadata = () => {
    const v = this.video;
    if (!v) return;
    this.dur = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 5.04;
    engine?.kick();
  };

  private onSeeked = () => {
    const v = this.video;
    if (!v || !this.active || !this.attached || v.seeking) return;
    if (Math.abs(v.currentTime - this.cur) > 1 / 60) {
      try {
        v.currentTime = this.cur;
      } catch {
        /* the element can be torn down mid-seek */
      }
    }
    engine?.kick();
  };

  private onError = () => {
    this.video?.classList.remove("is-ready");
  };

  observe(onActive: (active: boolean) => void) {
    if (!("IntersectionObserver" in window)) {
      this.active = true;
      onActive(true);
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        this.active = entry.isIntersecting;
        onActive(entry.isIntersecting);
      },
      { rootMargin: "200% 0px 200% 0px" },
    );
    this.io.observe(this.track);
  }

  measure() {
    const scrollY = window.scrollY || 0;
    const vh = window.innerHeight;
    const track: FrameRect = this.track.getBoundingClientRect();
    const last: FrameRect = this.lastBlock
      ? this.lastBlock.getBoundingClientRect()
      : track;

    const bottom = last.bottom - track.top + scrollY;
    // Phones flow the scene content instead of pinning each block; keep the
    // empty run-out after the last block short so the next section shows sooner.
    const narrow = window.matchMedia(
      "(max-width: 609px), (orientation: portrait)",
    ).matches;
    this.end = Math.max(bottom + vh * (narrow ? 0.35 : 0.75), vh * (narrow ? 0.9 : 1.2));
    this.trackH = this.end + vh;
    this.knee = clamp(bottom / this.end, 0.05, 0.98);
    this.track.style.height = `${this.trackH}px`;
  }

  position() {
    this.top = this.track.getBoundingClientRect().top + (window.scrollY || 0);
  }

  attach(isMobile: boolean, owner: SceneController | null) {
    const v = this.video;
    if (!v || this.attached || !this.clip?.hd) return;
    if (isMobile && owner && owner !== this) owner.detach();
    const src = isMobile ? this.clip.sd || this.clip.hd : this.clip.hd;
    if (!src) return;
    this.attached = true;
    this.cur = this.target;
    if (!this.dur) this.dur = 5.04;
    v.src = src;
    v.load();
    engine?.kick();
  }

  detach() {
    const v = this.video;
    if (!v || !this.attached) return;
    this.attached = false;
    v.classList.remove("is-ready");
    v.removeAttribute("src");
    try {
      v.load();
    } catch {
      /* noop */
    }
  }

  /** @returns true while the scrub is still easing towards its target. */
  tick(): boolean {
    if (!this.active) return false;

    const y = window.scrollY || 0;
    const p = clamp((y - this.top) / this.end, 0, 1);
    const q =
      p < this.knee
        ? (p / this.knee) * this.low
        : this.low + ((p - this.knee) / (1 - this.knee)) * (1 - this.low);
    const qe = this.reverse ? 1 - q : q;
    const duration = this.dur || 5.04;

    this.target = qe * Math.max(0, duration - 1 / 48);

    if (this.dimEl) {
      this.dimEl.style.opacity = (smooth(0.15, 0.4, qe) * this.maxDim).toFixed(3);
    }

    const v = this.video;
    if (!v || !this.attached || v.readyState < 1) return false;

    this.cur += (this.target - this.cur) * 0.22;
    if (Math.abs(this.target - this.cur) < 1 / 240) this.cur = this.target;

    if (!v.seeking && Math.abs(v.currentTime - this.cur) > 1 / 60) {
      try {
        v.currentTime = this.cur;
      } catch {
        /* keep the loop alive; the next seek retries */
      }
    }

    return Math.abs(this.target - this.cur) > 1 / 240;
  }

  destroy() {
    this.io?.disconnect();
    this.io = null;
    const v = this.video;
    if (v) {
      v.removeEventListener("loadeddata", this.onLoadedData);
      v.removeEventListener("loadedmetadata", this.onLoadedMetadata);
      v.removeEventListener("seeked", this.onSeeked);
      v.removeEventListener("error", this.onError);
    }
    this.detach();
  }
}

class Engine {
  readonly scenes = new Set<SceneController>();

  private mobile = false;
  private mobileOwner: SceneController | null = null;
  private staticMode = false;
  private raf = 0;
  private measureTimer: number | undefined;
  private readonly mq: MediaQueryList;

  constructor() {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection?.saveData);

    this.mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.staticMode = this.mq.matches;
    this.mobile = window.innerWidth <= 900 || saveData;

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("load", this.onLoad);
    this.mq.addEventListener("change", this.onReduceChange);
    document.fonts?.ready.then(this.onLoad).catch(() => {});
  }

  private onScroll = () => {
    this.syncMobile();
    this.kick();
  };

  private onResize = () => {
    window.clearTimeout(this.measureTimer);
    this.measureTimer = window.setTimeout(() => this.measure(), 150);
  };

  private onLoad = () => this.measure();

  private onReduceChange = (event: MediaQueryListEvent) => {
    this.staticMode = event.matches;
    this.measure();
  };

  add(reg: SceneRegistration): SceneController {
    const controller = new SceneController(reg);
    this.scenes.add(controller);

    controller.observe((active) => {
      if (this.staticMode) return;
      if (!active) controller.detach();
      else if (!this.mobile) controller.attach(false, this.mobileOwner);
      this.syncMobile();
      this.kick();
    });

    this.measure();
    return controller;
  }

  remove(controller: SceneController) {
    this.scenes.delete(controller);
    if (this.mobileOwner === controller) this.mobileOwner = null;
    controller.destroy();
  }

  get(id: SceneId): SceneController | undefined {
    for (const scene of this.scenes) if (scene.id === id) return scene;
    return undefined;
  }

  measure() {
    if (this.staticMode) {
      for (const scene of this.scenes) {
        scene.track.style.height = "";
        scene.detach();
      }
      return;
    }

    this.mobile = window.innerWidth <= 900 || this.isSaveData();
    for (const scene of this.scenes) scene.measure();
    for (const scene of this.scenes) scene.position();

    this.syncMobile();
    this.kick();
  }

  private isSaveData() {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    return Boolean(nav.connection?.saveData);
  }

  /** Only one clip decodes at a time on small screens. */
  private syncMobile() {
    if (!this.mobile || this.staticMode) return;

    const y = window.scrollY || 0;
    const vh = window.innerHeight;
    let best: SceneController | null = null;
    let bestOverlap = 0;

    for (const scene of this.scenes) {
      if (!scene.hasMedia) continue;
      const overlap =
        Math.min(scene.top + scene.trackH, y + vh) -
        Math.max(scene.top, y);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = scene;
      }
    }

    for (const scene of this.scenes) {
      if (scene !== best && scene.attached) scene.detach();
    }
    if (best && bestOverlap > 0 && !best.attached) {
      best.attach(this.mobile, this.mobileOwner);
      this.mobileOwner = best;
    }
  }

  kick = () => {
    if (!this.raf) this.raf = requestAnimationFrame(this.loop);
  };

  private loop = () => {
    this.raf = 0;
    let busy = false;
    for (const scene of this.scenes) {
      if (scene.tick()) busy = true;
    }
    if (busy) this.kick();
  };
}

let engine: Engine | null = null;

export function getEngine(): Engine {
  if (!engine) engine = new Engine();
  return engine;
}

export type { SceneController };
