import { Coverage } from "@/components/sections/Coverage";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { Quote } from "@/components/sections/Quote";
import { Services } from "@/components/sections/Services";
import { Trust } from "@/components/sections/Trust";

const ORGANISATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Northwake",
  url: "https://northwake.example/",
  description:
    "Freight forwarding, customs clearance and inland haulage with one point of contact from origin to destination.",
  email: "hello@northwake.example",
  telephone: "+44 20 7946 0102",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 4, Harbour Yard",
    addressLocality: "Liverpool",
    postalCode: "L3 4AA",
    addressCountry: "GB",
  },
  areaServed: ["Africa", "Europe", "Middle East", "Asia", "North America", "South America"],
};

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Trust />
        <Services />
        <Proof />
        <Process />
        <Coverage />
        <Quote />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION) }}
      />
    </>
  );
}
