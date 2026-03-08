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
    description: "Chat de precalificación de deuda en español.",
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
    description: "Advisor search flow con validación en vivo.",
    language: "en",
    metricsKey: "fe3-an-en",
  },
  {
    href: "/fe4-an-en",
    title: "FE4 AN EN",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4-an-en",
  },
];
