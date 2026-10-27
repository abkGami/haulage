import { ScrubSection } from "@/components/scenes/ScrubSection";

export function Hero() {
  return (
    <ScrubSection scene="A" low={0.46} dim={0.28} id="top" labelledBy="hero-h">
      <div className="intro top-[117.5vh]">
        <p className="eyebrow">Why us</p>
        <h1 className="h1" id="hero-h">
          <span className="sr-only">Logistics that works as hard as you do.</span>
          <span aria-hidden="true">Logistics</span>
          <span aria-hidden="true">that works</span>
          <span aria-hidden="true">as hard as</span>
          <span aria-hidden="true">you do.</span>
        </h1>
      </div>

      <div className="b b--l b--l1 top-[187.5vh]" data-block>
        <svg className="ico b__i" aria-hidden="true">
          <use href="#i-globe" />
        </svg>
        <p className="b__t">
          One point
          <br className="lb" /> of contact
        </p>
        <p className="b__b">
          No more chasing multiple vendors. One
          <br className="lb" /> team manages your entire end-to-end flow,
          <br className="lb" /> origin to destination.
        </p>
      </div>

      <div className="b b--r b--r1 top-[187.5vh]" data-block>
        <svg className="ico b__i" aria-hidden="true">
          <use href="#i-stack" />
        </svg>
        <p className="b__t">
          Full supply chain
          <br className="lb" /> visibility
        </p>
        <p className="b__b">
          Track your freight in real time and get
          <br className="lb" /> proactive updates before issues become
          <br className="lb" /> delays.
        </p>
      </div>

      <div className="b b--l b--l2 top-[219.875vh]" data-block>
        <svg className="ico b__i" aria-hidden="true">
          <use href="#i-check" />
        </svg>
        <p className="b__t">
          Compliance
          <br className="lb" /> you can trust
        </p>
        <p className="b__b">
          Licensed customs brokers keep your
          <br className="lb" /> shipments moving within every regulatory
          <br className="lb" /> requirement, border to border.
        </p>
      </div>

      <div className="b b--r b--r2 top-[219.875vh]" data-block>
        <svg className="ico b__i" aria-hidden="true">
          <use href="#i-dollar" />
        </svg>
        <p className="b__t">
          Competitive,
          <br className="lb" /> transparent pricing
        </p>
        <p className="b__b">
          No hidden fees. Clear, competitive pricing
          <br className="lb" /> backed by responsive sales support
          <br className="lb" /> throughout the shipment.
        </p>
      </div>

      <div className="b b--c top-[257.875vh]" data-block>
        <svg className="ico b__i" aria-hidden="true">
          <use href="#i-chevrons" />
        </svg>
        <p className="b__t">
          Fast issue
          <br className="lb" /> resolution
        </p>
        <p className="b__b">
          When something unexpected happens, we
          <br className="lb" /> do not point fingers, we solve it. Our team
          <br className="lb" /> acts at once to protect your timeline.
        </p>
      </div>
    </ScrubSection>
  );
}
