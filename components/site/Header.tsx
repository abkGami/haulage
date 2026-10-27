"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cx } from "@/lib/cx";
import { NAV } from "@/lib/site";
import { MenuIcon } from "@/components/ui/icons";
import { MobileMenu } from "./MobileMenu";

type Mode = "light" | "dark";

/**
 * Samples the real geometry under the header's centre line. The first 55% of a
 * dark section's 34vh cloud seam reads as light, matching what is on screen.
 */
function useHeaderTheme(ref: RefObject<HTMLElement | null>) {
  const [mode, setMode] = useState<Mode>("dark");
  const [scrolled, setScrolled] = useState(false);
  const lightRef = useRef(false);

  useEffect(() => {
    let raf = 0;

    const read = () => {
      raf = 0;
      const headerHeight = ref.current?.offsetHeight ?? 64;
      // Viewport space: `getBoundingClientRect` is already scroll-adjusted.
      const line = headerHeight * 0.5;
      let next: Mode = "dark";

      const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
      for (const section of sections) {
        const bounds = section.getBoundingClientRect();
        if (line < bounds.top || line >= bounds.bottom) continue;
        const seam = section.querySelector<HTMLElement>(".seam");
        const seamHeight = seam ? seam.offsetHeight : 0;
        next =
          seamHeight && line < bounds.top + seamHeight * 0.55
            ? "light"
            : ((section.dataset.theme as Mode | undefined) ?? "dark");
      }

      const isLight = next === "light";
      if (isLight !== lightRef.current) {
        lightRef.current = isLight;
        setMode(isLight ? "light" : "dark");
      }
      setScrolled(window.scrollY > 80);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [ref]);

  return { mode, scrolled };
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const { mode, scrolled } = useHeaderTheme(headerRef);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  // The menu is a portrait affordance; rotating out of portrait closes it.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(max-width: 609px), (orientation: portrait)");
    const onChange = () => {
      if (!query.matches) close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, close]);

  return (
    <>
      <header
        ref={headerRef}
        id="hd"
        className={cx(
          "hd",
          mode === "light" && "is-light",
          open && "is-menu-open",
          scrolled && "is-scrolled",
        )}
      >
        <div className="hd__in">
          <a className="brand" href="#top" aria-label="Northwake, home">
            Northwake
          </a>
          <nav className="hd__nav" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-self-end gap-2.5">
            <a className="btn btn--primary hd__cta" href="#quote">
              Get a quote
            </a>
            <button
              className="menu-btn"
              type="button"
              id="menuBtn"
              aria-expanded={open}
              aria-controls="menu"
              onClick={toggle}
            >
              <MenuIcon />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} />
    </>
  );
}
