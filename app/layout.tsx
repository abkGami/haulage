import type { Metadata, Viewport } from "next";
import { Exo_2, Public_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { ProgressBar } from "@/components/site/ProgressBar";
import { Recorder } from "@/components/site/Recorder";
import { Sprite } from "@/components/ui/icons";
import { SITE } from "@/lib/site";
import "./globals.css";

const exo = Exo_2({
  subsets: ["latin"],
  weight: "800",
  variable: "--font-exo",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-public",
  display: "swap",
});

const POSTER =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5e018553-cb8a-420a-819f-fcdfa08e5df0.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Northwake — Freight forwarding, customs and inland haulage",
  description:
    "One team manages your entire end-to-end freight flow, origin to destination. Ocean, rail, road and air, with licensed customs brokers and live tracking.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Northwake — Logistics that works as hard as you do.",
    description:
      "One point of contact, full supply chain visibility and licensed customs brokers. Freight that moves without the chasing.",
    url: "/",
    siteName: "Northwake",
    images: [{ url: POSTER, width: 1600, height: 900, alt: "Aerial view of a container terminal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northwake — Logistics that works as hard as you do.",
    description:
      "One point of contact, full supply chain visibility and licensed customs brokers. Freight that moves without the chasing.",
    images: [POSTER],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0c",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${exo.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Nothing runs before paint: the reduced-motion and no-JS readings are
            pure CSS media queries (`prefers-reduced-motion` / `scripting`), so
            hydration never has to reconcile a mutated <html>. */}
      </head>
      <body>
        <Sprite />
        <a
          className="skip fixed left-4 top-[-80px] z-200 rounded-[2px] bg-cream px-[18px] py-3.5 font-ui text-[12px] font-bold uppercase leading-none tracking-[.16em] text-ink no-underline transition-[top] duration-200 ease-[var(--ease-site)] focus:top-3.5"
          href="#main"
        >
          Skip to content
        </a>

        <Header />
        <Recorder />

        {children}
        {/* Last in <body>: as the final layout child it would otherwise sit at
            the seam React resumes page hydration from. */}
        <ProgressBar />
      </body>
    </html>
  );
}


