export type LandingCatalogItem = {
  href: string;
  title: string;
  description: string;
  language: "es" | "en";
  metricsKey?: string;
  abTest?: {
    aKey: string;
    aLabel: string;
    bKey: string;
    bLabel: string;
  };
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
    href: "/fe4-fj-en",
    title: "FE4 FJ EN",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4-fj-en",
  },
  {
    href: "/fe-an-en",
    title: "FE AN EN Split",
    description: "A/B entrypoint that shows FE3 AN EN or FE4 AN EN.",
    language: "en",
    abTest: {
      aKey: "fe3-an-en",
      aLabel: "FE3 AN EN",
      bKey: "fe4-an-en",
      bLabel: "FE4 AN EN",
    },
  },
  {
    href: "/fe5-an-en",
    title: "FE5 AN EN",
    description: "Chatbot final expense flow con CTA de llamada.",
    language: "en",
    metricsKey: "fe5-an-en",
  },
  {
    href: "/fe5-jf-en",
    title: "FE5 JF EN",
    description: "Chatbot final expense flow con CTA de llamada.",
    language: "en",
    metricsKey: "fe5-jf-en",
  },
  {
    href: "/fe6-an-en",
    title: "FE6 AN EN",
    description: "Short final expense chat with direct call CTA.",
    language: "en",
    metricsKey: "fe6-an-en",
  },
  {
    href: "/fe7-an-en",
    title: "FE7 AN EN",
    description: "Senior benefits advertorial-style final expense landing.",
    language: "en",
    metricsKey: "fe7-an-en",
  },
  {
    href: "/iul-es",
    title: "IUL ES",
    description: "Independent duplicate of FE7 for future IUL changes.",
    language: "es",
    metricsKey: "iul-es",
  },
  {
    href: "/iul-es2",
    title: "IUL ES2",
    description: "Chat IUL en espanol con flujo corto y CTA de reclamo.",
    language: "es",
    metricsKey: "iul-es2",
  },
];
