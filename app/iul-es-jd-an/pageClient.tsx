"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

const LANDING_KEY = "iul-es-jd-an";
const CLAIM_URL = "https://ntdr.quotify.us/?oid=3765&affid=3814";
const ARTICLE_HEADLINE = "El mayor secreto financiero de EE.UU.";
const ARTICLE_HEADLINE_ACCENT = "ya ha sido revelado";
const ARTICLE_SUBHEAD =
  "Las cuentas indexadas pueden dar hasta $450,000 para deudas, negocio o universidad.";
const SELECTED_AMOUNT = "$450,000";
const TRUST_POINTS = ["Sin examen medico", "Sin costos ocultos", "Aprobacion en 60 segundos"] as const;

const QUICK_FACTS = [
  {
    title: "Lo que se esta hablando",
    body: "Una estructura conocida como cuenta de ahorro indexada esta ganando atencion entre familias que buscan proteger ingresos y legado.",
  },
  {
    title: "Monto que mas se consulta",
    body: "Las revisiones mas comunes hoy se concentran entre $300,000 y $450,000 de proteccion potencial.",
  },
  {
    title: "Por que interesa",
    body: "Muchas personas quieren algo mas flexible que una cobertura basica y por eso comparan este tipo de estrategia con el ahorro tradicional.",
  },
] as const;

const BENEFIT_POINTS = [
  "Se revisa en funcion de edad, salud, presupuesto y objetivos familiares.",
  "Puede incluir proteccion para beneficiarios y acceso potencial a valor acumulado con el tiempo.",
  "Suele compararse con una cuenta porque la gente quiere entender el componente de crecimiento, aunque juridicamente no funciona como una cuenta bancaria.",
  "La revision inicial suele tardar menos de un minuto si ya sabes el rango de proteccion que te interesa.",
] as const;

const PROCESS_STEPS = [
  "Confirmas tu ubicacion y si quieres revisar opciones para tu hogar.",
  "Defines el rango aproximado de proteccion que te gustaria comparar.",
  "Se abre la revision con asesores que trabajan este tipo de estrategias para familias en EE. UU.",
] as const;

const FAQS = [
  {
    question: "Que son las cuentas de ahorro indexadas?",
    answer:
      "Es un nombre publicitario que muchas personas usan para referirse a estrategias de proteccion con componente indexado. No son cuentas bancarias tradicionales, pero la idea atrae porque combina proteccion y acumulacion potencial.",
  },
  {
    question: "Esto garantiza $450,000?",
    answer:
      "No. El monto real depende del perfil de cada familia, del presupuesto, del estado de residencia y de la evaluacion de elegibilidad. La landing solo ofrece una revision preliminar de opciones disponibles.",
  },
  {
    question: "Como se aplica?",
    answer:
      "Se empieza con una revision corta, luego se comparan opciones con un asesor y finalmente se confirma si hay disponibilidad para el rango que te interesa.",
  },
] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-jd-an.jpg",
    name: "Leah M.",
    city: "Brooklyn, NY",
    quote:
      "Yo buscaba algo que protegiera a mis hijos sin sentir que estaba dejando el dinero quieto. La revision me ayudo a entender que si habia estrategias mas completas que una cobertura basica.",
  },
  {
    image: "/robert h-testimonial2-jd-an.jpg",
    name: "Daniel R.",
    city: "Miami, FL",
    quote:
      "Lo que mas me sirvio fue entender la diferencia entre ahorrar solo por mi cuenta y revisar una opcion indexada pensada para proteger a la familia.",
  },
  {
    image: "/Maria & Carlos L-testimonial3-jd-an.jpg",
    name: "Sara y Eli T.",
    city: "Los Angeles, CA",
    quote:
      "Nos hablaron claro: no era magia ni dinero regalado. Era una forma distinta de ordenar proteccion y legado, y eso fue lo que queriamos comparar.",
  },
] as const;

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.metaIcon}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.inlineIcon}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function IulEsJdAnClient({
  heroImage,
  publishedLabel,
  city,
  state,
}: {
  heroImage: string;
  publishedLabel: string;
  city: string;
  state: string;
}) {
  const detectedLocation = city && state ? `${city}, ${state}` : "Estados Unidos";
  const qualifyingLocation = city && state ? `${city}, ${state}` : "tu estado";

  useEffect(() => {
    trackLandingView(LANDING_KEY);
  }, []);

  function buildClaimUrl() {
    if (typeof window === "undefined") {
      return CLAIM_URL;
    }

    const target = new URL(CLAIM_URL);
    const currentParams = new URLSearchParams(window.location.search);
    const protectedParams = new Set(["oid", "affid"]);

    currentParams.forEach((value, key) => {
      if (protectedParams.has(key)) {
        return;
      }

      target.searchParams.append(key, value);
    });

    return target.toString();
  }

  function handleDirectApply(label: string) {
    trackEngagedInteraction(LANDING_KEY, label);
    trackMetric({ landing: LANDING_KEY, event: "claim_click", label });
    window.location.href = buildClaimUrl();
  }

  return (
    <main className={styles.page}>
      <div className={styles.heroWash} aria-hidden="true" />

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.mastheadTop}>
            <span className={styles.kicker}>Reporte especial</span>
            <span className={styles.mastheadDot} />
            <span className={styles.channel}>Finanzas familiares</span>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <article className={styles.story}>
          <div className={styles.storyHeader}>
            <p className={styles.sectionLabel}>Economia del hogar</p>
            <h1 className={styles.headline}>
              <span>{ARTICLE_HEADLINE}</span>{" "}
              <span className={styles.headlineAccent}>{ARTICLE_HEADLINE_ACCENT}</span>
            </h1>
            <p className={styles.deck}>{ARTICLE_SUBHEAD}</p>
            <div className={styles.metaRow}>
              <CalendarIcon />
              <span className={styles.metaInline}>{detectedLocation}</span>
              <span className={styles.metaDivider}>-</span>
              <span className={styles.metaInline}>{publishedLabel}</span>
            </div>
          </div>

          <figure className={styles.heroFigure}>
            <Image
              src={heroImage}
              alt="Familia sentada en su cocina revisando opciones financieras para su hogar"
              width={1600}
              height={1067}
              className={styles.heroImage}
              priority
            />
            <figcaption className={styles.heroCaption}>
              Familia judia revela el secreto de su fortuna.
            </figcaption>
          </figure>

          <div className={styles.heroCtaBlock}>
            <p className={styles.heroCtaText}>
              Revisa en menos de un minuto si tu familia podria calificar para recibir hasta {SELECTED_AMOUNT}.
            </p>
            <button
              type="button"
              className={styles.heroCtaButton}
              onClick={() => handleDirectApply("hero_direct_apply")}
            >
              Aplicar al Beneficio
              <ArrowIcon />
            </button>
            <div className={styles.trustBlock}>
              <p className={styles.trustHeadline}>Tu familia merece proteccion hoy</p>
              <div className={styles.trustPoints}>
                {TRUST_POINTS.map((point) => (
                  <span key={point} className={styles.trustPoint}>
                    <span className={styles.trustCheck}>{"\u2714"}</span>
                    <span>{point}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.factGrid}>
            {QUICK_FACTS.map((fact) => (
              <section key={fact.title} className={styles.factCard}>
                <p className={styles.factTitle}>{fact.title}</p>
                <p className={styles.factBody}>{fact.body}</p>
              </section>
            ))}
          </div>

          <div className={styles.articleBody}>
            <p className={styles.lead}>
              Una familia de alto patrimonio puso el tema sobre la mesa: en lugar de dejar toda la carga de proteccion en el ahorro tradicional, revisaron una estructura que podria ayudar a blindar ingresos, ordenar herencia y proyectar hasta {SELECTED_AMOUNT} para sus beneficiarios.
            </p>
            <p>
              En el mercado hispano mucha gente la conoce como cuenta de ahorro indexada porque quiere entenderla de forma simple. En la practica, la revision normalmente compara proteccion, potencial de acumulacion y acceso a una estrategia pensada para el largo plazo.
            </p>
            <p>
              El interes ha crecido en lugares como <strong>{detectedLocation}</strong>, donde cada vez mas familias buscan algo mas sofisticado que una poliza minima y algo mas estructurado que ahorrar sin una estrategia definida.
            </p>

            <aside className={styles.quoteCard}>
              <p>
                "No se trata de un truco ni de dinero instantaneo. Se trata de entender una estrategia que muchas familias nunca comparan y que puede cambiar la forma en que protegen su hogar".
              </p>
            </aside>

            <h2>Que son las cuentas de ahorro indexadas?</h2>
            <p>
              Son estrategias que el publico suele describir con ese nombre porque mezclan la idea de proteccion con crecimiento potencial ligado a indices. No funcionan como una cuenta bancaria comun, pero su atractivo esta en que muchas personas sienten que por fin pueden hablar de legado y proteccion en un mismo plan.
            </p>

            <ul className={styles.featureList}>
              {BENEFIT_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.noteBox}>
              <strong>Importante:</strong> aunque el angulo publicitario la presente como cuenta de ahorro indexada, la revision real suele involucrar una estructura tipo IUL. La disponibilidad final depende del perfil de cada persona y de las reglas de cada estado.
            </div>

            <h2>Como aplican las familias que quieren revisarlo</h2>
            <p>
              El proceso preliminar suele ser breve. Primero se confirma la zona de residencia, luego se define el rango de proteccion que se quiere explorar y por ultimo se abre una revision para ver si hay opciones disponibles.
            </p>

            <ol className={styles.processList}>
              {PROCESS_STEPS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className={styles.inlineBanner}>
              <div>
                <p className={styles.inlineBannerTitle}>Actualizacion local</p>
                <p className={styles.inlineBannerText}>
                  Se estan revisando solicitudes para hogares en <strong>{qualifyingLocation}</strong>.
                </p>
              </div>
              <button
                type="button"
                className={styles.inlineBannerButton}
                onClick={() => handleDirectApply("mid_article_direct_apply")}
              >
                Aplicar al Beneficio
                <ArrowIcon />
              </button>
            </div>

            <h2>Historias de familias que pidieron una revision</h2>
            <div className={styles.testimonialGrid}>
              {TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.name} className={styles.testimonial}>
                  <div className={styles.testimonialHeader}>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className={styles.testimonialAvatar}
                    />
                    <div>
                      <p className={styles.testimonialName}>{testimonial.name}</p>
                      <p className={styles.testimonialLocation}>{testimonial.city}</p>
                    </div>
                  </div>
                  <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                </article>
              ))}
            </div>

            <h2>Preguntas frecuentes</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq) => (
                <article key={faq.question} className={styles.faqItem}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <p className={styles.sidebarEyebrow}>Resumen rapido</p>
            <h3>Lo que esta descubriendo la gente</h3>
            <ul className={styles.sidebarList}>
              <li>La expresion cuenta de ahorro indexada es una forma simple de explicar una estrategia mas completa.</li>
              <li>La revision preliminar ayuda a estimar que rango podria tener sentido para tu hogar.</li>
              <li>Hoy el mayor interes esta alrededor del umbral de $450,000.</li>
            </ul>
            <button
              type="button"
              className={styles.sidebarButton}
              onClick={() => handleDirectApply("sidebar_direct_apply")}
            >
              Aplicar al Beneficio
            </button>
          </div>

          <div className={styles.sidebarCardSecondary}>
            <p className={styles.sidebarMiniLabel}>Nota editorial</p>
            <p>
              Este contenido tiene formato de advertorial. La informacion se presenta con fines publicitarios y la revision final depende del perfil real del solicitante.
            </p>
            <p className={styles.sidebarTimestamp}>Actualizado {publishedLabel}</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-jd-an.png"
            alt="IUL Life"
            width={170}
            height={52}
            className={styles.footerLogo}
          />
          <p className={styles.footerDisclaimer}>
            Este advertorial promociona productos de proteccion y estrategias financieras ofrecidas por terceros. No es un medio periodistico independiente ni una agencia gubernamental. Al continuar, podrias ser contactado por un agente licenciado para revisar disponibilidad, costo y elegibilidad.
          </p>
          <div className={styles.footerLinks}>
            <span>Privacidad</span>
            <span>Terminos</span>
            <span>Divulgacion</span>
            <span>Contacto</span>
          </div>
          <p className={styles.footerCopyright}>
            Copyright 2026 Informe Patrimonial. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}


















