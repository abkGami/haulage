"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_SITE } from "@/lib/motion";
import { SITE } from "@/lib/site";

type Props = {
  open: boolean;
  onClose: () => void;
};

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Coverage", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
];

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>("a, button:not([disabled])"),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.24, ease: EASE_SITE }}
          className="fixed inset-0 z-110 flex flex-col gap-[6vh] bg-page px-[22px] pb-10 pt-[18vh] text-cream"
        >
          <nav className="flex flex-col gap-[6vh]" aria-label="Mobile">
            {LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.35,
                  delay: reduce ? 0 : 0.05 + index * 0.05,
                  ease: EASE_SITE,
                }}
                className="font-display text-[clamp(32px,10vw,52px)] font-extrabold uppercase leading-none tracking-[.01em] no-underline"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col items-start gap-[18px]">
            <a
              className="btn btn--primary max-w-[320px] self-stretch max-[420px]:max-w-none"
              href="#quote"
              onClick={onClose}
            >
              Get a quote
            </a>
            <p className="font-ui text-[13px] leading-[1.5] text-cream/70">
              {SITE.email}
              <br />
              {SITE.phone}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
