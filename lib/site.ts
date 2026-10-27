export const SITE = {
  name: "Northwake",
  email: "hello@northwake.example",
  phone: "+44 20 7946 0102",
  phoneHref: "+442079460102",
  address: "Unit 4, Harbour Yard, Liverpool L3 4AA",
  url: "https://northwake.example/",
};

export const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Coverage", href: "#coverage" },
  { label: "FAQ", href: "#faq" },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Ocean freight", href: "#services" },
      { label: "Rail and road", href: "#services" },
      { label: "Air freight", href: "#services" },
      { label: "Customs and warehousing", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" },
      { label: "Contact", href: "#quote" },
    ],
  },
] as const;
