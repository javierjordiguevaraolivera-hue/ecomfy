"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

const LANDING_KEY = "iul-es-pz";
const CLAIM_URL = "https://seguro.generaldeals.info/";
const ARTICLE_HEADLINE = "La influencer que se hizo viral por explicar";
const ARTICLE_HEADLINE_ACCENT = "como recibir hasta $250,000";
const ARTICLE_SUBHEAD =
  "Su comparativa Banco vs IUL puso a miles de personas a revisar beneficios ligados a cuentas de ahorro indexadas.";
const SELECTED_AMOUNT = "$250,000";
const TRUST_POINTS = ["Sin examen medico", "Consulta rapida", "Sin costos ocultos"] as const;

const QUICK_FACTS = [
  {
    title: "Tema viral",
    body: "El video despega porque explica en pizarra una comparacion simple entre banco tradicional e IUL.",
  },
  {
    title: "Monto que buscan",
    body: "La consulta mas repetida en este momento gira alrededor de beneficios de hasta $250,000.",
  },
  {
    title: "Por que conecta",
    body: "La explicacion aterriza un producto complejo en lenguaje de ahorro, proteccion y dinero disponible.",
  },
] as const;

const BENEFIT_POINTS = [
  "La expresion cuentas de ahorro indexadas se usa para explicar, de forma comercial, una estructura tipo IUL.",
  "Puede combinar proteccion para beneficiarios con acumulacion potencial vinculada al comportamiento de indices.",
  "Muchas personas la comparan con el banco porque buscan crecimiento sin depender solo de una cuenta tradicional.",
  "La revision inicial suele tardar menos de un minuto si ya sabes que rango te interesa comparar.",
] as const;

const PROCESS_STEPS = [
  "Confirmas tu ubicacion y el rango de beneficio que quieres explorar.",
  "Se abre una revision corta para validar si hay opciones disponibles para tu perfil.",
  "Si encaja, pasas a comparar alternativas con asesores que trabajan este tipo de estrategia.",
] as const;

const FAQS = [
  {
    question: "Que son las cuentas de ahorro indexadas?",
    answer:
      "Es una forma publicitaria de explicar estrategias de proteccion con componente indexado. No son cuentas bancarias, pero mucha gente las entiende mejor cuando se presentan asi.",
  },
  {
    question: "El beneficio de $250,000 esta garantizado?",
    answer:
      "No. El rango final depende de edad, salud, presupuesto, estado de residencia y reglas de elegibilidad del proveedor que revise tu caso.",
  },
  {
    question: "Como se aplica?",
    answer:
      "Primero haces una revision corta, luego se comparan opciones y finalmente se confirma si existe disponibilidad para el rango que quieres evaluar.",
  },
] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-pz.jpg",
    name: "Andrea P.",
    city: "Houston, TX",
    quote:
      "Vi el video y por primera vez entendi la diferencia entre ahorrar en el banco y revisar una opcion pensada para proteger a mi familia.",
  },
  {
    image: "/robert h-testimonial2-pz.jpg",
    name: "Luis C.",
    city: "Phoenix, AZ",
    quote:
      "La comparacion en pizarra fue lo que me hizo pedir la revision. Me gusto que explicaran el concepto sin rodeos.",
  },
  {
    image: "/Maria & Carlos L-testimonial3-pz.jpg",
    name: "Monica y Jose R.",
    city: "Las Vegas, NV",
    quote:
      "No sabiamos que existia una forma de revisar proteccion y dinero disponible dentro de la misma conversacion.",
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

export default function IulEsPzClient({
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

    const target = new URL(CLAIM_URL, window.location.origin);
    const currentParams = new URLSearchParams(window.location.search);

    currentParams.forEach((value, key) => {
      target.searchParams.set(key, value);
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
      <div className={styles.whiteboardGlow} aria-hidden="true" />

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.mastheadTop}>
            <span className={styles.kicker}>Viral en redes</span>
            <span className={styles.mastheadDot} />
            <span className={styles.channel}>Finanzas explicadas</span>
          </div>
          <div className={styles.brandRow}>
            <div>
              <p className={styles.brand}>Radar Financiero</p>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <article className={styles.story}>
          <div className={styles.storyHeader}>
            <p className={styles.sectionLabel}>Tendencia hispana</p>
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
              alt="Influencer de finanzas mostrando una comparacion entre banco e IUL en pizarra"
              width={1600}
              height={1067}
              className={styles.heroImage}
              priority
            />
            <figcaption className={styles.heroCaption}>
              La comparativa Banco vs IUL en pizarra disparo consultas sobre beneficios de hasta {SELECTED_AMOUNT}.
            </figcaption>
          </figure>

          <div className={styles.heroCtaBlock}>
            <p className={styles.heroCtaText}>
              Revisa en menos de un minuto si podrias calificar para recibir hasta {SELECTED_AMOUNT}.
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
              <p className={styles.trustHeadline}>Lo estan revisando miles de personas</p>
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
              Lo que hizo despegar este contenido fue la claridad: mientras muchos hablan de ahorro y proteccion como si fueran mundos separados, ella lo resumio en una sola pizarra y llevo a miles de usuarios a preguntar si existe una alternativa que podria abrir un beneficio de hasta {SELECTED_AMOUNT}.
            </p>
            <p>
              En la conversacion comercial se les suele llamar cuentas de ahorro indexadas. El nombre pega porque suena cercano, aunque la revision real suele involucrar una estructura tipo IUL enfocada en proteccion, acumulacion potencial y dinero disponible bajo ciertas condiciones.
            </p>
            <p>
              En zonas como <strong>{detectedLocation}</strong>, el interes ha crecido entre personas que ya no quieren depender solo del banco tradicional para construir respaldo financiero a largo plazo.
            </p>

            <aside className={styles.quoteCard}>
              <p>
                "No se hizo viral por prometer dinero facil. Se hizo viral porque explico, sin tecnicismos, por que tanta gente esta comparando banco vs IUL".
              </p>
            </aside>

            <h2>Que son las cuentas de ahorro indexadas?</h2>
            <p>
              Son estrategias que muchas personas entienden mejor cuando se presentan como una mezcla de proteccion y crecimiento potencial. No son una cuenta bancaria comun, pero si pueden formar parte de una conversacion sobre respaldo, legado y acceso a valor acumulado.
            </p>

            <ul className={styles.featureList}>
              {BENEFIT_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.noteBox}>
              <strong>Importante:</strong> esta pagina tiene formato advertorial. La expresion cuentas de ahorro indexadas se usa como angulo de comunicacion, pero la revision final depende del perfil real del solicitante y de la disponibilidad en su estado.
            </div>

            <h2>Como se revisa si podrias aplicar</h2>
            <p>
              El proceso es corto. Primero se confirma la ubicacion, luego el rango que quieres revisar y despues se valida si hay alternativas activas para personas en tu zona.
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
                  Se estan comparando opciones para personas en <strong>{qualifyingLocation}</strong>.
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

            <h2>Lo que dicen quienes pidieron la revision</h2>
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
            <h3>Lo que explico en la pizarra</h3>
            <ul className={styles.sidebarList}>
              <li>Banco e IUL no cumplen el mismo papel cuando se habla de proteccion y acumulacion.</li>
              <li>El nombre cuentas de ahorro indexadas ayuda a entender una estructura mas compleja.</li>
              <li>El rango que hoy mas curiosidad despierta esta cerca de {SELECTED_AMOUNT}.</li>
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
              Este contenido es promocional y no constituye asesoria financiera individual. La revision final depende del perfil del solicitante y de la disponibilidad del proveedor.
            </p>
            <p className={styles.sidebarTimestamp}>Actualizado {publishedLabel}</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-pz.png"
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
            Copyright 2026 Radar Financiero. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

