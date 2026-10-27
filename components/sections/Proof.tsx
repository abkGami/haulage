import { IndustryCard } from "@/components/ui/IndustryCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLede, SectionTitle } from "@/components/ui/SectionTitle";
import { StatCounter } from "@/components/ui/StatCounter";

const STATS = [
  { value: 24, suffix: "/7", label: "Live shipment tracking", spoken: "24/7" },
  { value: 98, suffix: "%", label: "On-time delivery", spoken: "98 percent" },
  { value: 40, suffix: "+", label: "Trade lanes served", spoken: "40 plus" },
  { value: 1, suffix: "", label: "Point of contact", spoken: "1" },
];

const INDUSTRIES = [
  {
    icon: "i-bag",
    title: "Retail and e-commerce",
    body: "Seasonal peaks, tight windows and stock that cannot sit still.",
  },
  {
    icon: "i-snow",
    title: "Food and cold chain",
    body: "Temperature-controlled moves with the cold chain unbroken.",
  },
  {
    icon: "i-crane",
    title: "Construction and projects",
    body: "Oversize loads, staged deliveries and site-ready sequencing.",
  },
  {
    icon: "i-gear",
    title: "Manufacturing",
    body: "Inbound components and outbound finished goods on one plan.",
  },
  {
    icon: "i-bolt",
    title: "Energy and mining",
    body: "Remote destinations, heavy cargo and schedules that cannot slip.",
  },
  {
    icon: "i-cross",
    title: "Healthcare",
    body: "Time-critical consignments handled with documented care.",
  },
];

export function Proof() {
  return (
    <section
      className="light light--seam pb-[140px] narrow:pb-24"
      data-theme="light"
      id="proof"
      aria-labelledby="proof-h"
    >
      <div className="wrap">
        <div className="grid grid-cols-[1fr_300px] items-end gap-8 border-b border-ink/16 pb-[34px] narrow:grid-cols-1 narrow:items-start narrow:gap-[18px]">
          <SectionTitle id="proof-h">
            <span>Numbers</span>
            <span>that hold up</span>
            <span className="text-grey">on every lane</span>
          </SectionTitle>
          <Reveal>
            <SectionLede>Measured across live shipments, reported plainly.</SectionLede>
          </Reveal>
        </div>

        <div className="stats">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>

        <p className="mb-[22px] mt-[46px] font-ui text-[11px] font-bold uppercase leading-[1.2] tracking-[.304em] text-[var(--ink-mute)]">
          Who we ship for
        </p>

        <div className="grid grid-cols-3 gap-6 narrow:grid-cols-1 narrow:gap-3.5">
          {INDUSTRIES.map((industry, index) => (
            <Reveal key={industry.title} delay={Math.min(index, 5) * 0.08}>
              <IndustryCard {...industry} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
