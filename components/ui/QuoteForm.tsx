"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cx } from "@/lib/cx";
import { EASE_SITE } from "@/lib/motion";
import { SITE } from "@/lib/site";

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

type FieldName = "name" | "email" | "route";
type Errors = Partial<Record<FieldName, string>>;

const INPUT =
  "min-h-12 w-full rounded-[2px] border bg-cream/8 px-3.5 py-3 font-ui text-[15px] leading-[1.3] text-paper outline-none placeholder:text-cream/45 focus:border-cream focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cream";

const LABEL =
  "mb-2 block font-ui text-[11px] font-bold uppercase leading-none tracking-[.16em] text-cream/[.78]";

export function QuoteForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok">("idle");
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  const okRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduce = useReducedMotion();

  useEffect(() => () => clearTimeout(timer.current), []);

  function clearError(field: FieldName) {
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill this, people never see it.
    if (String(data.get("company_url") ?? "")) return;

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const route = String(data.get("route") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      next.email = "Enter a valid work email.";
    }
    if (!route) next.route = "Tell us the origin and destination.";

    if (Object.keys(next).length) {
      setErrors(next);
      setFailed(false);
      setNotice("Check the highlighted fields and send again.");
      const first = (["name", "email", "route"] as FieldName[]).find(
        (field) => next[field],
      );
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }

    setErrors({});
    setNotice("");
    setFailed(false);
    setStatus("sending");

    if (!ENDPOINT) {
      timer.current = setTimeout(() => setStatus("ok"), 650);
      return;
    }

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("ok");
    } catch {
      setStatus("idle");
      setFailed(true);
    }
  }

  const sending = status === "sending";

  return (
    <div className="panel pointer-events-auto mx-auto w-full max-w-[calc(100vw-44px)] rounded-[2px] border border-cream/16 bg-page/45 p-8 text-paper backdrop-blur-[14px] narrow:max-w-full narrow:px-5 narrow:py-6">
      <AnimatePresence mode="wait" initial={false}>
        {status === "ok" ? (
          <motion.div
            key="sent"
            ref={(element) => {
              okRef.current = element;
              // AnimatePresence mounts this after the form's exit; focus it here
              // rather than in an effect that would run before the swap.
              if (element) element.focus();
            }}
            id="f-ok"
            tabIndex={-1}
            role="status"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE_SITE }}
            className="py-1 font-ui text-[15px] leading-[1.6] outline-none"
          >
            <strong className="mb-2.5 block font-display text-[clamp(20px,28px,30px)] font-extrabold uppercase leading-[1.15]">
              Thank you.
            </strong>
            We will reply within one working day.
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={false}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-5 font-ui text-[12px] font-bold uppercase leading-none tracking-[.16em] text-cream/80">
              Tell us about the movement
            </h3>
            <form onSubmit={handleSubmit} noValidate id="quote-form">
              <div className="mb-4">
                <label className={LABEL} htmlFor="f-name">
                  Name
                </label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  aria-describedby="e-name"
                  aria-invalid={Boolean(errors.name)}
                  onChange={() => clearError("name")}
                  className={cx(INPUT, errors.name ? "border-danger" : "border-cream/25")}
                  required
                />
                <p
                  id="e-name"
                  aria-live="polite"
                  className={cx(
                    "mt-1.5 font-ui text-[12px] leading-[1.4] text-danger",
                    !errors.name && "hidden",
                  )}
                >
                  {errors.name ?? ""}
                </p>
              </div>

              <div className="mb-4">
                <label className={LABEL} htmlFor="f-email">
                  Work email
                </label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-describedby="e-email"
                  aria-invalid={Boolean(errors.email)}
                  onChange={() => clearError("email")}
                  className={cx(INPUT, errors.email ? "border-danger" : "border-cream/25")}
                  required
                />
                <p
                  id="e-email"
                  aria-live="polite"
                  className={cx(
                    "mt-1.5 font-ui text-[12px] leading-[1.4] text-danger",
                    !errors.email && "hidden",
                  )}
                >
                  {errors.email ?? ""}
                </p>
              </div>

              <div className="mb-4">
                <label className={LABEL} htmlFor="f-route">
                  Origin and destination
                </label>
                <input
                  id="f-route"
                  name="route"
                  type="text"
                  placeholder="Lagos to Rotterdam"
                  aria-describedby="e-route"
                  aria-invalid={Boolean(errors.route)}
                  onChange={() => clearError("route")}
                  className={cx(INPUT, errors.route ? "border-danger" : "border-cream/25")}
                  required
                />
                <p
                  id="e-route"
                  aria-live="polite"
                  className={cx(
                    "mt-1.5 font-ui text-[12px] leading-[1.4] text-danger",
                    !errors.route && "hidden",
                  )}
                >
                  {errors.route ?? ""}
                </p>
              </div>

              <div className="mb-4">
                <label className={LABEL} htmlFor="f-cargo">
                  Cargo
                </label>
                <select
                  id="f-cargo"
                  name="cargo"
                  className={cx(INPUT, "field-select border-cream/25")}
                >
                  <option>Container</option>
                  <option>Pallets</option>
                  <option>Project cargo</option>
                  <option>Air</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div className="mb-4">
                <label className={LABEL} htmlFor="f-msg">
                  Message
                </label>
                <textarea
                  id="f-msg"
                  name="message"
                  rows={3}
                  placeholder="Weight, volume, ready date"
                  className={cx(INPUT, "min-h-24 resize-y border-cream/25")}
                />
              </div>

              <div className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true">
                <label htmlFor="f-hp">Company website</label>
                <input
                  id="f-hp"
                  name="company_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                className="btn btn--primary mt-2 w-full"
                type="submit"
                id="f-submit"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send my request"}
              </button>
              <p className="mt-3 font-ui text-[12px] leading-[1.5] text-cream/70">
                Reply within one working day. No spam.
              </p>
              <p
                id="f-global"
                aria-live="polite"
                className={cx(
                  "mt-3 font-ui text-[12px] leading-[1.5] text-danger",
                  !notice && !failed && "hidden",
                )}
              >
                {failed ? (
                  <>
                    We could not send that.{" "}
                    <a className="underline" href={`mailto:${SITE.email}`}>
                      Email us instead
                    </a>
                    .
                  </>
                ) : (
                  notice
                )}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
