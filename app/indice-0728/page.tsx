"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

const spanishLandings = [
  {
    href: "/debt-qualification",
    title: "Debt Qualification",
    description: "Chat tipo precalificación de deuda en español.",
  },
  {
    href: "/debt-relief-usa",
    title: "Debt Relief USA",
    description: "Landing de consolidación/debt relief con chat corto.",
  },
];

const englishLandings = [
  {
    href: "/fe1",
    title: "FE1",
    description: "Final Expense quiz corto con advisor ready CTA.",
  },
  {
    href: "/fe2",
    title: "FE2",
    description: "Final Expense estilo SecureLife con quiz, loading y call CTA.",
  },
  {
    href: "/fe3",
    title: "FE3",
    description: "Final Expense con búsqueda de advisor en vivo.",
  },
  {
    href: "/fe4",
    title: "FE4",
    description: "Final Expense long-form con FAQ, social proof y advisor flow.",
  },
];

function getFullUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
}

function LandingCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  const [copied, setCopied] = useState<"" | "full" | "path">("");

  async function copyText(value: string, type: "full" | "path") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className={styles.card}>
      <Link href={href} className={styles.cardLink}>
        <div className={styles.cardTop}>
          <span className={styles.cardTitle}>{title}</span>
          <span className={styles.cardArrow}>↗</span>
        </div>
        <div className={styles.cardPath}>{href}</div>
        <p className={styles.cardDescription}>{description}</p>
      </Link>

      <div className={styles.copyBox}>
        <div className={styles.copyRow}>
          <input
            className={styles.copyField}
            value={getFullUrl(href)}
            readOnly
            aria-label={`Link completo de ${title}`}
          />
          <button
            type="button"
            className={styles.copyButton}
            onClick={() => void copyText(getFullUrl(href), "full")}
          >
            {copied === "full" ? "Copiado" : "Copiar Link"}
          </button>
        </div>

        <div className={styles.copyRow}>
          <input
            className={styles.copyField}
            value={href}
            readOnly
            aria-label={`Ruta de ${title}`}
          />
          <button
            type="button"
            className={styles.copyButtonSecondary}
            onClick={() => void copyText(href, "path")}
          >
            {copied === "path" ? "Copiado" : "Copiar Ruta"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LandingSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; title: string; description: string }>;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <LandingCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  );
}

export default function LandingIndexPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.kicker}>Landing Index</span>
          <h1 className={styles.title}>indice-0728</h1>
          <p className={styles.subtitle}>
            Acceso rápido a todas las landings actuales, separadas por idioma.
          </p>
        </header>

        <LandingSection title="Español" items={spanishLandings} />
        <LandingSection title="English" items={englishLandings} />
      </div>
    </main>
  );
}
