"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

const LANDING_KEY = "iul-es-rc-an2";
const CLAIM_URL = "https://www.jk8gcxs.com/7659ZZ3/79JQ12F/";
const ARTICLE_HEADLINE = "Cuentas de Ahorro Indexadas para jubilarte con hasta $450,000";
const ARTICLE_HEADLINE_ACCENT = "si empiezas antes de los 40";
const AGE_WORD = `a${String.fromCharCode(241)}os`;
const ARTICLE_SUBHEAD =
  `Una cuenta tipo IUL puede ayudarte a construir retiro, proteger a tu familia y revisar hasta $450,000 si eres menor de 40 ${AGE_WORD}.`;
const SELECTED_AMOUNT = "$450,000";
const TRUST_POINTS = [`Menores de 40 ${AGE_WORD}`, "Sin examen medico", "Aprobacion en 60 segundos"] as const;

const QUICK_FACTS = [
  {
    title: "El caso de Richard",
    body: `Richard tiene 78 ${AGE_WORD} y tuvo que hacer delivery cuando el ingreso del hogar se cayo. Esa historia esta empujando a muchos jovenes a planificar antes.`,
  },
  {
    title: "A quien va dirigido",
    body: `Esta revision se esta moviendo sobre todo entre hispanos de 20, 30 y menores de 40 ${AGE_WORD} que quieren construir respaldo antes de llegar a viejos sin opciones.`,
  },
  {
    title: "Lo que mas llama la atencion",
    body: "Puede combinar seguro de vida completo con crecimiento de dinero y acceso potencial a cash value tax free para retiro o etapas dificiles.",
  },
] as const;

const BENEFIT_POINTS = [
  "Si empiezas joven, el dinero tiene mas tiempo para crecer y trabajar a tu favor.",
  "Si te pasa algo, tu familia podria recibir hasta $450,000 en proteccion segun tu perfil.",
  "Si no te pasa nada, que es lo ideal, podrias acceder al cash value tax free mas adelante para retiro, gastos o una emergencia.",
  `Por el enfoque de largo plazo, el interes principal hoy esta en personas menores de 40 ${AGE_WORD}.`,
] as const;

const PROCESS_STEPS = [
  `Confirmas tu ubicacion y si tienes menos de 40 ${AGE_WORD} para revisar disponibilidad.`,
  "Se compara el rango de proteccion que buscas y el presupuesto mensual que podrias sostener.",
  "Si hay opciones en tu estado, se abre la revision con asesores que trabajan cuentas tipo IUL.",
] as const;

const FAQS = [
  {
    question: "Que son estas cuentas indexadas?",
    answer:
      "Mucha gente las llama asi para simplificarlo, pero normalmente la revision compara una estructura tipo IUL: seguro de vida completo mas crecimiento potencial de dinero.",
  },
  {
    question: `Por que se habla tanto de menores de 40 ${AGE_WORD}?`,
    answer:
      `Porque mientras antes empieces, mas tiempo tiene el dinero para crecer. Esta landing esta pensada especialmente para personas de 20, 30 y menores de 40 ${AGE_WORD} que quieren planificar a tiempo.`,
  },
  {
    question: "Ese dinero sirve solo si me muero?",
    answer:
      "No necesariamente. Si no te pasa nada, que es lo ideal, en muchos casos el cash value puede revisarse como apoyo para retiro, deudas o una etapa en la que ya no puedas trabajar igual.",
  },
] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-rc-an2.jpg",
    name: "Martha C.",
    city: "Orlando, FL",
    quote:
      `Vi la historia de Richard y me pego fuerte. Tengo 33 ${AGE_WORD} y entendi que esperar demasiado puede salir carisimo para mi futuro y para mis hijos.`,
  },
  {
    image: "/robert h-testimonial2-rc-an2.jpg",
    name: "Luis P.",
    city: "Houston, TX",
    quote:
      `Yo tengo 29 ${AGE_WORD}. Lo que me convencio fue saber que no todo depende de morir para que sirva. Tambien se puede pensar en retiro y respaldo para mas adelante.`,
  },
  {
    image: "/Maria & Carlos L-testimonial3-rc-an2.jpg",
    name: "Carla y Rene S.",
    city: "Phoenix, AZ",
    quote:
      "Nos dijeron claro que esto tiene mucho mas sentido si se revisa antes de los 40. Por eso quisimos movernos ahora y no cuando ya fuera tarde.",
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

export default function IulEsRcAn2Client({
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
    currentParams.forEach((value, key) => {
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
            <span className={styles.channel}>Retiro y proteccion familiar</span>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <article className={styles.story}>
          <div className={styles.storyHeader}>
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
              alt="Martha contando como la historia de Richard la hizo revisar una estrategia para retiro y proteccion"
              width={1600}
              height={1067}
              className={styles.heroImage}
              priority
            />
            <figcaption className={styles.heroCaption}>
              {`Martha empezo su cuenta indexada a los 27 ${AGE_WORD}, recibio $650,000.`}
            </figcaption>
          </figure>

          <div className={styles.heroCtaBlock}>
            <p className={styles.heroCtaText}>
              {`Si tienes menos de 40 ${AGE_WORD}, revisa en menos de un minuto si podrias aplicar a una cuenta indexada con hasta ${SELECTED_AMOUNT} en proteccion.`}
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
              <p className={styles.trustHeadline}>Cuenta tipo IUL para menores de 40</p>
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
              `La historia de Richard, un abuelo de 78 ${AGE_WORD} que salio a hacer delivery despues de que su esposa perdiera el trabajo, esta pegando fuerte entre hispanos jovenes. El mensaje es duro: despues de toda una vida trabajando, el retiro tradicional muchas veces no alcanza.`
            </p>
            <p>
              Una fundacion lo ayudo a salir adelante, pero el caso abrio una conversacion incomoda: cuantas personas llegan a viejas sin pension suficiente, sin respaldo y sin una estrategia real para cuando ya no pueden trabajar igual.
            </p>
            <p>
              <>Por eso este contenido esta girando sobre todo entre personas de 20, 30 y <strong>{`menores de 40 ${AGE_WORD}`}</strong>. La idea no es reaccionar cuando ya es tarde, sino revisar desde joven una cuenta tipo IUL que combine proteccion fuerte con dinero que puede crecer en el tiempo.</>
            </p>

            <aside className={styles.quoteCard}>
              <p>
                "Si empiezas antes de los 40, tu dinero todavia tiene tiempo para crecer. Si esperas a la vejez, muchas veces ya solo te toca resolver urgencias".
              </p>
            </aside>

            <h2>Por que la historia de Richard esta moviendo a tanta gente</h2>
            <p>
              Porque nadie quiere terminar trabajando por necesidad a una edad en la que deberia estar descansando. Ese miedo hizo que mucha gente empezara a revisar opciones que mezclan seguro de vida completo con acumulacion de dinero a largo plazo.
            </p>
            <p>
              <>En lugares como <strong>{detectedLocation}</strong>, el interes mayor se esta concentrando en hispanos {`menores de 40 ${AGE_WORD}`} que todavia tienen tiempo para construir cash value y dejar una base mas firme para su retiro y su familia.</>
            </p>

            <ul className={styles.featureList}>
              {BENEFIT_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.noteBox}>
              <strong>Importante:</strong> aunque mucha gente la llama cuenta de ahorro indexada, la revision real suele involucrar una estructura tipo IUL regulada a nivel federal y estatal. No es una cuenta bancaria comun y la elegibilidad final depende de edad, salud, presupuesto y estado.
            </div>

            <h2>Como funciona para quienes si quieren planificar a tiempo</h2>
            <p>
              El planteamiento es simple. Una parte sostiene la cobertura de vida para que tu familia tenga respaldo si te pasa algo, y otra parte puede acumular dinero con el tiempo. Si no te pasa nada, que es lo ideal, ese valor podria revisarse despues para retiro o para una etapa dificil.
            </p>
            <p>
              `Por eso el filtro importa tanto: esta pagina esta pensada especialmente para menores de 40 ${AGE_WORD} que todavia pueden aprovechar mejor el tiempo de crecimiento y no quieren llegar a la vejez sin alternativas.`
            </p>

            <h2>Como se revisa si aplica en tu caso</h2>
            <ol className={styles.processList}>
              {PROCESS_STEPS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className={styles.inlineBanner}>
              <div>
                <p className={styles.inlineBannerTitle}>Revision activa en {qualifyingLocation}</p>
                <p className={styles.inlineBannerText}>
                  `Hoy la mayor parte de las solicitudes se estan revisando para hispanos menores de 40 ${AGE_WORD} que quieren ordenar proteccion y retiro desde ahora.`
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

            <h2>Lo que dicen quienes lo revisaron a tiempo</h2>
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
            <h3>Lo que mas esta moviendo esta historia</h3>
            <ul className={styles.sidebarList}>
              <li>Richard se volvio una alerta para quienes no quieren llegar a viejos sin respaldo.</li>
              <li>Las cuentas tipo IUL estan llamando la atencion por combinar proteccion y cash value tax free.</li>
              <li>{`El foco principal hoy esta en hispanos menores de 40 ${AGE_WORD}.`}</li>
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
              Este advertorial resume un angulo publicitario basado en historias reales y contenido viral. La revision final depende del perfil del solicitante y la disponibilidad real en cada estado.
            </p>
            <p className={styles.sidebarTimestamp}>Actualizado {publishedLabel}</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-rc-an2.png"
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








