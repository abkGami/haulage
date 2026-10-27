"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { EASE_SITE } from "@/lib/motion";
import { PlusIcon } from "./icons";

export type FaqItem = { question: string; answer: string };

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="mt-16 border-t border-ink/16">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-btn-${index}`;

        return (
          <div key={item.question} className="border-b border-ink/16">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-[26px] text-left font-ui text-[17px] font-bold leading-[1.35]"
              >
                {item.question}
                <PlusIcon
                  className={cx(
                    "size-[18px] flex-none transition duration-300",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.3, ease: EASE_SITE }
              }
              className="overflow-hidden"
            >
              <p className="max-w-[680px] pb-7 pr-[60px] font-ui text-[15px] leading-[1.62] text-ink/[.78] narrow:pr-0">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
