import { ScrubSection } from "@/components/scenes/ScrubSection";
import { QuoteForm } from "@/components/ui/QuoteForm";

export function Quote() {
  return (
    <ScrubSection
      scene="D"
      low={0.46}
      dim={0.55}
      reverse
      labelledBy="q-h"
      seams={{ top: true, foot: true }}
    >
      <div className="intro top-[125vh]" id="quote">
        <p className="eyebrow">Ready when you are</p>
        <h2 className="h2" id="q-h">
          <span>Ready when</span>
          <span>your freight</span>
          <span>is. Let&apos;s</span>
          <span>move it.</span>
        </h2>
      </div>

      <div className="b b--c b--form top-[202.5vh]" data-block>
        <QuoteForm />
      </div>
    </ScrubSection>
  );
}
