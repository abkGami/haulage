import { Reveal } from "@/components/ui/Reveal";
import { SectionLede, SectionTitle } from "@/components/ui/SectionTitle";

const QUOTES = [
  {
    name: "Thomas Reid",
    role: "Director, Harbour Fit Group",
    quote:
      "My business would not function without this team. They treat every consignment on its own merits, and our account managers know our business well enough to answer before we ask. We have never had that from a bigger carrier.",
  },
  {
    name: "Ana Park",
    role: "Supply Chain Lead, Northline Projects",
    quote:
      "As a first-time shipper on a major infrastructure job, we were in unfamiliar territory. They planned the whole route with us, flagged every risk early, and our first delivery reached site on the day they promised.",
  },
  {
    name: "Liam Carter",
    role: "Operations Manager, Coastline Foods",
    quote:
      "One contact, one dashboard, no surprises. When a vessel slipped two days, we heard about it before our customers did, and the new plan was already in place.",
  },
];

export function Trust() {
  return (
    <section
      className="light light--seam pb-[140px] narrow:pb-24"
      data-theme="light"
      aria-labelledby="trust-h"
    >
      <div className="wrap">
        <div className="grid grid-cols-[1fr_300px] items-end gap-8 border-b border-ink/16 pb-[34px] narrow:grid-cols-1 narrow:items-start narrow:gap-[18px]">
          <SectionTitle id="trust-h">
            <span>Trusted</span>
            <span>by businesses</span>
            <span className="text-grey">across the region</span>
          </SectionTitle>
          <Reveal>
            <SectionLede>
              From first-time importers to high-volume shippers, our customers
              stay because every consignment is treated like it matters.
            </SectionLede>
          </Reveal>
        </div>

        {QUOTES.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.08}>
            <div className="grid grid-cols-[260px_1fr] gap-6 border-b border-ink/16 py-11 narrow:grid-cols-1 narrow:gap-[18px] narrow:py-8">
              <div>
                <p className="font-ui text-[13px] font-bold uppercase leading-[1.3] tracking-[.02em]">
                  {item.name}
                </p>
                <p className="mt-1 font-ui text-[12px] leading-[1.4] text-[var(--ink-mute)]">
                  {item.role}
                </p>
              </div>
              <blockquote className="m-0 max-w-[680px] font-ui text-[clamp(17px,1.6vw,21px)] font-normal leading-[1.42]">
                {item.quote}
              </blockquote>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
