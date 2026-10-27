import type { ReactNode } from "react";

export function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-display text-[clamp(34px,4.4vw,60px)] font-extrabold uppercase leading-none tracking-[-.01em] [&>span]:block"
    >
      {children}
    </h2>
  );
}

/** Intro paragraph that sits at the end of a section header row. */
export function SectionLede({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[300px] justify-self-end font-ui text-[13px] leading-[1.55] text-[var(--ink-mute)] narrow:max-w-full narrow:justify-self-start">
      {children}
    </p>
  );
}
