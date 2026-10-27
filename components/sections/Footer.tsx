import { FOOTER_COLUMNS, SITE } from "@/lib/site";

const LINK =
  "font-ui text-[14px] leading-[1.4] text-cream/70 no-underline hover:text-cream hover:underline hover:underline-offset-4";

export function Footer() {
  return (
    <footer className="ft" data-theme="dark">
      <div className="wrap">
        <div className="ft__g">
          <div>
            <a className="brand" href="#top" aria-label="Northwake, home">
              Northwake
            </a>
            <p className="mt-[18px] max-w-[280px] font-ui text-[14px] leading-[1.6] text-cream/70">
              Freight forwarding, customs and inland haulage on one plan, with one
              team accountable from origin to destination.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-[18px] font-ui text-[11px] font-bold uppercase leading-none tracking-[.16em] text-cream/55">
                {column.title}
              </h3>
              <ul className="m-0 grid list-none gap-[11px] p-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className={LINK}
                      href={link.href}
                      data-placeholder={link.href === "#" ? "route" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-[18px] font-ui text-[11px] font-bold uppercase leading-none tracking-[.16em] text-cream/55">
              Contact
            </h3>
            <ul className="m-0 grid list-none gap-[11px] p-0">
              <li>
                <a className={LINK} href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a className={LINK} href={`tel:${SITE.phoneHref}`}>
                  {SITE.phone}
                </a>
              </li>
              <li className="font-ui text-[14px] leading-[1.4] text-cream/70">
                Unit 4, Harbour Yard
                <br />
                Liverpool L3 4AA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-between gap-5 border-t border-cream/16 pt-[22px] font-ui text-[12px] leading-[1.4] text-cream/60 narrow:mt-11">
          <p>© 2026 Northwake. All rights reserved.</p>
          <p>
            <a className="ml-0 hover:underline" href="#" data-placeholder="route">
              Privacy
            </a>
            <a className="ml-[18px] hover:underline" href="#" data-placeholder="route">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
