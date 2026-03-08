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
    href: "/fe1",
    title: "FE1",
    description: "Final expense quiz corto con advisor ready.",
    language: "en",
    metricsKey: "fe1",
  },
  {
    href: "/fe2",
    title: "FE2",
    description: "SecureLife style quiz con loading y call CTA.",
    language: "en",
    metricsKey: "fe2",
  },
  {
    href: "/fe3",
    title: "FE3",
    description: "Advisor search flow con validación en vivo.",
    language: "en",
    metricsKey: "fe3",
  },
  {
    href: "/fe4",
    title: "FE4",
    description: "Long-form con social proof, FAQ y advisor flow.",
    language: "en",
    metricsKey: "fe4",
  },
];
