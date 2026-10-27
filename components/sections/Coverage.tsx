import { Accordion, type FaqItem } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLede, SectionTitle } from "@/components/ui/SectionTitle";

const REGIONS = [
  { name: "Africa", ports: ["Lagos", "Abidjan", "Mombasa", "Durban"] },
  { name: "Europe", ports: ["Rotterdam", "Hamburg", "Antwerp", "Valencia"] },
  { name: "Middle East", ports: ["Jebel Ali", "Jeddah", "Dammam"] },
  { name: "Asia", ports: ["Singapore", "Shanghai", "Busan", "Nhava Sheva"] },
  { name: "North America", ports: ["Los Angeles", "Savannah", "Houston", "Vancouver"] },
  { name: "South America", ports: ["Santos", "Cartagena", "Callao"] },
];

const FAQ: FaqItem[] = [
  {
    question: "How fast can you quote?",
    answer:
      "Most quotes come back the same working day. Send the cargo, the route and the date, and you get one all-in price with no hidden fees.",
  },
  {
    question: "Do you handle customs clearance?",
    answer:
      "Yes. Licensed brokers clear your cargo in every market we serve, and the paperwork is prepared before the shipment moves, not after it lands.",
  },
  {
    question: "Can I track my shipment?",
    answer:
      "Yes. You get live tracking and proactive updates at every handover, so you hear about a change before it becomes a delay.",
  },
  {
    question: "What if my cargo is delayed?",
    answer:
      "You get one contact who owns the fix. We re-plan at once, protect your delivery date where we can, and tell you what changed and why.",
  },
  {
    question: "Do you work with first-time shippers?",
    answer:
      "Often. We plan the route with you, flag the risks early and explain each step, so a first shipment is not a leap of faith.",
  },
];

export function Coverage() {
  return (
    <section
      className="light light--seam pb-[140px] narrow:pb-24"
      data-theme="light"
      aria-labelledby="cov-h"
    >
      <div className="wrap" id="coverage">
        <div className="grid grid-cols-[1fr_300px] items-end gap-8 border-b border-ink/16 pb-[34px] narrow:grid-cols-1 narrow:items-start narrow:gap-[18px]">
          <SectionTitle id="cov-h">
            <span>Where we ship</span>
            <span>and what people</span>
            <span className="text-grey">ask first</span>
          </SectionTitle>
          <Reveal>
            <SectionLede>
              If your question is not here, one message gets you a person, not a
              ticket.
            </SectionLede>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-x-8 narrow:grid-cols-1 narrow:gap-0">
          {REGIONS.map((region, index) => (
            <Reveal key={region.name} delay={index * 0.06}>
              <div className="border-t border-ink/16 py-[22px] pb-[26px]">
                <h3 className="font-ui text-[12px] font-bold uppercase leading-none tracking-[.16em]">
                  {region.name}
                </h3>
                <p className="mt-3 font-ui text-[14px] leading-[1.7] text-[var(--ink-mute)]">
                  {region.ports.map((port) => (
                    <span key={port} className="block">
                      {port}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div id="faq">
          <Accordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}
