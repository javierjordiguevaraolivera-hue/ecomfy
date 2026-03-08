export type LandingCatalogItem = {
  href: string;
  title: string;
  description: string;
  language: "es" | "en";
  metricsKey?: string;
};

export const LANDING_CATALOG: LandingCatalogItem[] = [
  {
    href: "/debt-qualification",
    title: "Debt Qualification",
    description: "Chat de precalificacion de deuda en espanol.",
    language: "es",
    metricsKey: "debt-qualification",
  },
  {
    href: "/debt-relief-usa",
    title: "Debt Relief USA",
    description: "Debt relief con chat corto y CTA de llamada.",
    language: "es",
    metricsKey: "debt-relief-usa",
  },
  {
    href: "/fe3-an-en",
    title: "FE3 AN EN",
    description: "Advisor search flow con validacion en vivo.",
    language: "en",
    metricsKey: "fe3-an-en",
  },
  {
    href: "/fe3-mc-en",
    title: "FE3 MC EN",
    description: "Advisor search flow con validacion en vivo.",
    language: "en",
    metricsKey: "fe3-mc-en",
  },
  {
    href: "/fe4-an-en",
    title: "FE4 AN EN",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4-an-en",
  },
  {
    href: "/fe4-mc-en",
    title: "FE4 MC EN",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4-mc-en",
  },
  {
    href: "/fe5-an-en",
    title: "FE5 AN EN",
    description: "Chatbot final expense flow con CTA de llamada.",
    language: "en",
    metricsKey: "fe5-an-en",
  },
  {
    href: "/fe6-an-en",
    title: "FE6 AN EN",
    description: "Short final expense chat with direct call CTA.",
    language: "en",
    metricsKey: "fe6-an-en",
  },
];
