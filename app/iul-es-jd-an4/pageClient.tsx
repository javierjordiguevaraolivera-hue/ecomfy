"use client";

import Image from "next/image";
import { useEffect } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

const LANDING_KEY = "iul-es-jd-an4";
const CLAIM_URL = "https://www.jk8gcxs.com/7659ZZ3/79JQ12F/";
const ARTICLE_HEADLINE = "El secreto para recibir hasta $450,000";
const ARTICLE_HEADLINE_ACCENT = "y hacer crecer tu dinero";
const ARTICLE_SUBHEAD =
  "Una cuenta tipo IUL puede combinar cobertura de vida para tu familia con dinero que sigue creciendo con el tiempo, hasta tu jubilacion.";
const SELECTED_AMOUNT = "$450,000";
const TRUST_POINTS = [
  "Sin examen medico",
  "Sin costos ocultos",
  "Aprobacion en 60 segundos",
] as const;

const QUICK_FACTS = [
  {
    title: "Empiezan temprano",
    body: "Muchas familias inician estas estrategias cuando los hijos son pequenos para darle mas tiempo al interes compuesto.",
  },
  {
    title: "Proteccion real",
    body: "Si el ingreso principal falta manana, una cobertura fuerte puede ayudar con casa, deudas y universidad.",
  },
  {
    title: "Dos funciones",
    body: "Una parte protege con seguro de vida y otra parte puede acumular valor para el futuro.",
  },
] as const;

const BENEFIT_POINTS = [
  "Puedes empezar con un presupuesto mensual que tenga sentido para tu hogar.",
  "Una parte del pago sostiene la cobertura de vida y otra parte puede crecer con el tiempo.",
  "Si todo sale bien y no necesitas la proteccion, el dinero acumulado puede ayudar mas adelante con estudios, negocio o deudas.",
  "Mientras antes empieces, mas anos tiene tu dinero para trabajar a favor de tu familia.",
] as const;

const PROCESS_STEPS = [
  "Dejas tus datos y se revisa si en tu estado hay opciones para una cuenta tipo IUL.",
  "Se compara el rango de cobertura, tu presupuesto y el objetivo que quieres proteger.",
  "Si calificas, un asesor te explica como activar la estrategia paso a paso.",
] as const;

const FAQS = [
  {
    question: "Es una cuenta de ahorro comun?",
    answer:
      "No. Comercialmente mucha gente la llama cuenta indexada, pero en realidad se trata de una poliza tipo IUL con beneficio de vida y crecimiento potencial ligado a indices.",
  },
  {
    question: "Que pasa si no me muero pronto?",
    answer:
      "Ese es justamente el escenario ideal. En muchos casos el valor acumulado puede seguir creciendo y luego usarse para universidad, negocio o una etapa dificil.",
  },
  {
    question: "Se puede pensar para los hijos?",
    answer:
      "Muchas familias comparan estas estrategias desde que los hijos son pequenos para darles mas tiempo de crecimiento. La disponibilidad final depende de edad, salud, presupuesto y reglas del estado.",
  },
] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-jd-an4.jpg",
    name: "Raul y Miriam P.",
    city: "Aventura, FL",
    quote:
      "Nos hizo sentido porque no queriamos que todo dependiera del ahorro tradicional. Queremos proteccion hoy, pero tambien algo que pueda servirle a nuestros hijos manana.",
  },
  {
    image: "/robert h-testimonial2-jd-an4.jpg",
    name: "Daniel S.",
    city: "Houston, TX",
    quote:
      "Lo que me abrio los ojos fue entender que una sola estrategia podia cubrir a mi familia y al mismo tiempo construir valor a largo plazo.",
  },
  {
    image: "/Maria & Carlos L-testimonial3-jd-an4.jpg",
    name: "Lidia y Saul R.",
    city: "Scottsdale, AZ",
    quote:
      "Yo pensaba solo en seguro de vida. La revision me ayudo a ver que tambien podia pensar en universidad, negocio y legado familiar.",
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

export default function IulEsJdAn2Client({
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
            <span className={styles.kicker}>Archivo privado</span>
            <span className={styles.mastheadDot} />
            <span className={styles.channel}>Legado y proteccion familiar</span>
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
              alt="Asesor explicando una estrategia de legado familiar con cuenta tipo IUL"
              width={1600}
              height={1067}
              className={styles.heroImage}
              priority
            />
            <figcaption className={styles.heroCaption}>
              En algunas familias el dinero no se gasta primero. Se pone a trabajar para la siguiente generacion.
            </figcaption>
          </figure>

          <div className={styles.heroCtaBlock}>
            <p className={styles.heroCtaText}>
              Descubre si puedes activar hasta {SELECTED_AMOUNT} en proteccion para tu familia mientras tu dinero sigue creciendo.
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
              <p className={styles.trustHeadline}>Seguro de Tipo IUL</p>
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
              Algunas familias repiten la misma leccion durante generaciones: no esperar a una crisis para proteger la casa, la universidad de los hijos y el ingreso del hogar. Por eso comparan estrategias tipo IUL que unen cobertura de vida con crecimiento potencial.
            </p>
            <p>
              En ciertos hogares, los regalos nunca fueron solo juguetes o cosas de un momento. La idea siempre fue otra: poner el dinero a trabajar desde temprano para que el tiempo y el interes compuesto hicieran su parte.
            </p>
            <p>
              Hoy esa logica se sigue usando en lugares como <strong>{detectedLocation}</strong> a traves de seguros de vida tipo IUL. Una parte protege a tu familia con cobertura fuerte y otra parte puede acumular valor para usarse mas adelante.
            </p>

            <aside className={styles.quoteCard}>
              <p>
                "Si faltas manana, tu familia no solo pierde un ingreso. Tambien puede perder tiempo, tranquilidad y oportunidades. Por eso los hogares que planean empiezan antes".
              </p>
            </aside>

            <h2>Por que tantas familias empiezan temprano</h2>
            <p>
              Mientras antes se activa una estrategia de este tipo, mas tiempo tiene el dinero para crecer. Por eso muchas familias la revisan cuando los hijos son pequenos, e incluso cuando nace un bebe.
            </p>
            <p>
              En algunos ejemplos de largo plazo, una cuenta bien mantenida desde muy temprano puede proyectar cifras altas cuando un hijo llega a los 18 anos. No es garantia, pero explica por que tanta gente seria piensa primero en el tiempo y luego en el monto.
            </p>

            <ul className={styles.featureList}>
              {BENEFIT_POINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.noteBox}>
              <strong>Importante:</strong> no es una cuenta bancaria tradicional. Se trata de una poliza tipo IUL con beneficio de vida y crecimiento potencial. El monto final depende del perfil, la edad, el presupuesto y la aprobacion real.
            </div>

            <h2>Que pasa si el ingreso principal desaparece manana</h2>
            <p>
              Sin plan, tres cosas suelen pegar primero: la universidad de los hijos se complica, la casa entra en riesgo y las deudas siguen llegando. No es falta de amor. Es falta de estructura.
            </p>
            <p>
              Por eso esta estrategia llama tanto la atencion: protege hoy, pero tambien puede dejar dinero acumulado para universidad, un negocio o una etapa dificil si la familia nunca tiene que usar la cobertura.
            </p>

            <h2>Como se revisa si aplica para tu familia</h2>
            <ol className={styles.processList}>
              {PROCESS_STEPS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className={styles.inlineBanner}>
              <div>
                <p className={styles.inlineBannerTitle}>Revision activa en {qualifyingLocation}</p>
                <p className={styles.inlineBannerText}>
                  Se estan comparando cuentas tipo IUL para familias que quieren proteger hijos, casa y deudas sin empezar desde cero mas adelante.
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

            <h2>Lo que dicen quienes ya pidieron una revision</h2>
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
            <p className={styles.sidebarEyebrow}>Resumen privado</p>
            <h3>Lo que mas sorprende a las familias</h3>
            <ul className={styles.sidebarList}>
              <li>Una sola estrategia puede proteger a tus beneficiarios y al mismo tiempo construir valor con el paso de los anos.</li>
              <li>Muchas familias la revisan pensando en hijos, universidad, negocio y legado.</li>
              <li>Hoy se estan comparando montos de hasta {SELECTED_AMOUNT} para hogares que quieren orden real.</li>
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
            <p className={styles.sidebarMiniLabel}>Nota importante</p>
            <p>
              No todas las personas califican y los resultados no son identicos para todos. La revision existe para confirmar disponibilidad real, costo y rango de cobertura en tu estado.
            </p>
            <p className={styles.sidebarTimestamp}>Actualizado {publishedLabel}</p>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-jd-an4.png"
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
            Copyright 2026 Archivo de Legado. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}







