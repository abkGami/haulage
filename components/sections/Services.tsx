import { ScrubSection } from "@/components/scenes/ScrubSection";

const SERVICES = [
  {
    icon: "i-ocean",
    side: "b--l b--l1",
    top: "195vh",
    title: ["Ocean", " freight"],
    body: "Full and part container loads on every major trade lane, with space secured early and sailings tracked end to end.",
  },
  {
    icon: "i-land",
    side: "b--r b--r1",
    top: "195vh",
    title: ["Rail", " and road"],
    body: "Inland haulage and rail links that carry cargo from port to site without a gap in responsibility.",
  },
  {
    icon: "i-air",
    side: "b--l b--l2",
    top: "228.75vh",
    title: ["Air", " freight"],
    body: "Time-critical cargo on the fastest routings, with handling and clearance arranged before the plane lands.",
  },
  {
    icon: "i-box",
    side: "b--r b--r2",
    top: "228.75vh",
    title: ["Customs and", " warehousing"],
    body: "Licensed brokers and secure storage that keep cargo compliant and ready to move the day it clears.",
  },
];

export function Services() {
  return (
    <ScrubSection
      scene="B"
      low={0.62}
      dim={0.34}
      labelledBy="svc-h"
      seams={{ top: true }}
    >
      <div className="intro top-[125vh]" id="services">
        <p className="eyebrow">What we move</p>
        <h2 className="h2" id="svc-h">
          <span>Every mode.</span>
          <span>One plan.</span>
          <span>One team.</span>
          <span>Any lane.</span>
        </h2>
      </div>

      {SERVICES.map((service) => (
        <div
          key={service.title.join("")}
          className={`b ${service.side}`}
          style={{ top: service.top }}
          data-block
        >
          <svg className="ico b__i" aria-hidden="true">
            <use href={`#${service.icon}`} />
          </svg>
          <p className="b__t">
            {service.title[0]}
            <br className="lb" />
            {service.title[1]}
          </p>
          <p className="b__b">{service.body}</p>
          <a className="b__lnk" href="#quote">
            Learn more →
          </a>
        </div>
      ))}
    </ScrubSection>
  );
}
