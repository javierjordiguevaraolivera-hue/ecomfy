"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type CoverageRange = "$100,000" | "$150,000" | "$200,000" | "$250,000";
type YesNoAnswer = "Si" | "No";

const LANDING_KEY = "iul-es-pz2";
const CLAIM_URL = "https://seguro.generaldeals.info/";
const AGE_WORD = `a${String.fromCharCode(241)}os`;
const IUL_HEADLINE = `Influencer viral explica como hispanos menores de 40 ${AGE_WORD} en EE. UU. pueden recibir hasta $250,000 libres de impuestos`;
const COVERAGE_OPTIONS: CoverageRange[] = ["$100,000", "$150,000", "$200,000", "$250,000"];
const LOADING_STEPS = [
  "Revisando opciones en tu ubicacion",
  "Comparando cuentas indexadas",
  "Validando monto solicitado",
] as const;

const TRUST_POINTS = ["Sin examen medico", "Sin costos ocultos", "Aprobacion en 60 segundos"] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-pz2.jpg",
    name: "Andrea P.",
    city: "Houston, TX",
    coverage: "$250,000 revisados en opciones IUL",
    body:
      "Vi el video y por primera vez entendi la diferencia entre ahorrar en el banco y revisar una opcion pensada para proteger a mi familia.",
  },
  {
    image: "/robert h-testimonial2-pz2.jpg",
    name: "Luis C.",
    city: "Phoenix, AZ",
    coverage: "$180,000 comparados para proteccion",
    body:
      "La comparacion en pizarra fue lo que me hizo pedir la revision. Me gusto que explicaran el concepto sin rodeos.",
  },
  {
    image: "/Maria & Carlos L-testimonial3-pz2.jpg",
    name: "Monica y Jose R.",
    city: "Las Vegas, NV",
    coverage: "$250,000 consultados para la familia",
    body:
      "No sabiamos que existia una forma de revisar proteccion y dinero disponible dentro de la misma conversacion.",
  },
] as const;

const URGENCY_FEED = [
  { name: "Andrea", state: "Texas", approved: true, amount: "$250,000", minutesAgo: 3 },
  { name: "Marco", state: "Arizona", approved: true, amount: "$180,000", minutesAgo: 5 },
  { name: "Elena", state: "Florida", approved: false, amount: "$0", minutesAgo: 7 },
  { name: "Sofia", state: "Nevada", approved: true, amount: "$200,000", minutesAgo: 9 },
  { name: "Ramon", state: "California", approved: true, amount: "$150,000", minutesAgo: 12 },
  { name: "Lucia", state: "Georgia", approved: true, amount: "$250,000", minutesAgo: 15 },
  { name: "Brenda", state: "Illinois", approved: false, amount: "$0", minutesAgo: 18 },
] as const;

function ClaimIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.phoneIcon}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function PortalSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.portalSpinner}
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeOpacity="0.22" strokeWidth="3" />
      <path d="M12 3.5a8.5 8.5 0 0 1 7.2 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function CheckMark() {
  return <span className={styles.checkMark}>{"\u2713"}</span>;
}

function ApprovedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.feedStatusApproved}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.8 12.2 2.1 2.2 4.4-4.8" />
    </svg>
  );
}

function RejectedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.feedStatusRejected}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5 14.5 14.5" />
      <path d="M14.5 9.5 9.5 14.5" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.feedTimeIcon}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SuccessBadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.successBadgeIcon}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m7.8 12.2 2.7 2.8 5.7-6.1" />
    </svg>
  );
}

function LoadingStepCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.loadingStepCheckIcon}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.8 12.2 2.1 2.2 4.4-4.8" />
    </svg>
  );
}

export default function IulEsPz2Client({
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
  const [selectedBenefit, setSelectedBenefit] = useState<YesNoAnswer | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageRange | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [applicationId] = useState(
    () =>
      `PZ${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`,
  );
  const [countdownSeconds, setCountdownSeconds] = useState(90);
  const [urgencyIndex, setUrgencyIndex] = useState(0);
  const [urgencyPhase, setUrgencyPhase] = useState<"in" | "out">("in");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const urgencyItem = URGENCY_FEED[urgencyIndex] ?? URGENCY_FEED[0];
  const detectedLocation = city && state ? `${city}, ${state}` : "";
  const qualifyingLocation = detectedLocation || "tu area";
  const totalSteps = 2;
  const currentStep = selectedBenefit === null ? 1 : selectedCoverage === null ? 2 : 2;
  const currentQuestion = selectedBenefit === null ? "¿Ya recibiste tu beneficio?" : "Cuanto quieres recibir?";
  const optionValues = selectedBenefit === null ? ["Si", "No"] : COVERAGE_OPTIONS;

  useEffect(() => {
    trackLandingView(LANDING_KEY);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUrgencyPhase("out");
      window.setTimeout(() => {
        setUrgencyIndex((current) => (current + 1) % URGENCY_FEED.length);
        setUrgencyPhase("in");
      }, 320);
    }, 3600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!isChecking) {
      return;
    }

    setLoadingStepIndex(0);
    const timer = window.setInterval(() => {
      setLoadingStepIndex((current) => Math.min(current + 1, LOADING_STEPS.length - 1));
    }, 800);

    return () => {
      window.clearInterval(timer);
    };
  }, [isChecking]);

  useEffect(() => {
    if (!showApprovedPopup) {
      return;
    }

    setCountdownSeconds(90);
    const timer = window.setInterval(() => {
      setCountdownSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [showApprovedPopup]);

  useEffect(() => {
    if (!showApprovedPopup) {
      return;
    }

    const timer = window.setTimeout(() => {
      window.location.href = buildClaimUrl();
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showApprovedPopup]);

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

  function handleBenefitClick(option: YesNoAnswer) {
    setSelectedBenefit(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_benefit");
    trackMetric({ landing: LANDING_KEY, event: "benefit_selected", label: option });
  }

  function handleCoverageClick(option: CoverageRange) {
    setSelectedCoverage(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_amount");
    trackMetric({ landing: LANDING_KEY, event: "coverage_selected", label: option });
    setIsChecking(true);
    trackMetric({ landing: LANDING_KEY, event: "qualifying_started", label: qualifyingLocation });

    window.setTimeout(() => {
      setIsChecking(false);
      setShowApprovedPopup(true);
      trackMetric({ landing: LANDING_KEY, event: "qualified_popup", label: qualifyingLocation });
    }, 3200);
  }

  function handleClaimClick() {
    trackMetric({ landing: LANDING_KEY, event: "claim_click", label: "popup_claim" });
    window.location.href = buildClaimUrl();
  }

  const countdownMinutes = Math.floor(countdownSeconds / 60);
  const countdownRemainder = countdownSeconds % 60;
  const countdownLabel = `${countdownMinutes}:${countdownRemainder.toString().padStart(2, "0")}`;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Image
            src="/iul-life-logo-pz2.png"
            alt="IUL Life"
            width={188}
            height={56}
            className={styles.logo}
            priority
          />
        </div>

        <div className={styles.bandWrap}>
          <div className={styles.bandStripes} />
          <div className={styles.bandContent}>
            <span className={styles.bandFlag}>{"\u{1F525}"}</span>
            <div className={styles.bandText}>
              <div className={styles.bandTitle}>Influencer Viral</div>
              <div className={styles.bandSubtitle}>Comparativa Banco vs IUL en tendencia</div>
            </div>
            <span className={styles.bandFlag}>{"\u{1F4CA}"}</span>
          </div>
          <div className={styles.bandShimmer} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.alertCard}>
            <div className={styles.alertHeadlineFixed}>
              Influencer viral explica como recibir <span className={styles.alertAmount}>$250,000</span> libres de impuestos para hispanos menores de 40 {AGE_WORD}
            </div>
            <div className={styles.alertHeadline} data-headline={IUL_HEADLINE}>
              {IUL_HEADLINE}
            </div>
          </div>

          <section className={styles.heroCard}>
            <div className={styles.heroImageWrap}>
              <Image
                src={heroImage}
                alt="Influencer explicando la diferencia entre banco e IUL"
                width={900}
                height={900}
                className={styles.heroImage}
                priority
              />
            </div>
            <h1 className={styles.heroTitle} data-headline={IUL_HEADLINE}>
              {IUL_HEADLINE}
            </h1>
            <div className={styles.urgencyCard}>
              <div
                key={`${urgencyIndex}-${urgencyPhase}`}
                className={`${styles.urgencyTicker} ${
                  urgencyPhase === "out" ? styles.urgencyTickerOut : styles.urgencyTickerIn
                }`}
              >
                <div className={styles.urgencyMain}>
                  {urgencyItem.approved ? <ApprovedIcon /> : <RejectedIcon />}
                  <div className={styles.urgencyCopy}>
                    <div className={styles.urgencyHeadline}>
                      {urgencyItem.name} de {urgencyItem.state}
                    </div>
                    <div className={styles.urgencySubline}>
                      <span className={styles.urgencyStatusText}>
                        {urgencyItem.approved ? "Aprobado" : "No aprobado"}
                      </span>{" "}
                      <span
                        className={
                          urgencyItem.approved
                            ? styles.urgencyAmountApproved
                            : styles.urgencyAmountRejected
                        }
                      >
                        {urgencyItem.amount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.urgencyMeta}>
                  <TimeIcon />
                  <span>hace {urgencyItem.minutesAgo} min</span>
                </div>
              </div>
            </div>
            <p className={styles.heroDeadline}>
              Actualizado <span>{publishedLabel}</span>
            </p>
            <div className={styles.trustBlock}>
              <p className={styles.trustHeadline}>Tu familia merece proteccion hoy</p>
              <ul className={styles.trustPoints}>
                {TRUST_POINTS.map((point) => (
                  <li key={point} className={styles.trustPoint}>
                    <span className={styles.trustCheck}>{"\u2714"}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.formCard}>
            <div className={styles.stepBox}>
              <div className={styles.stepTop}>
                <span className={styles.stepIndex}>{currentStep}</span>
                <span className={styles.stepLabel}>Paso {currentStep} de {totalSteps}</span>
              </div>
              <p className={styles.questionTitle}>{currentQuestion}</p>
              <div className={styles.stepProgress}>
                <div
                  className={styles.stepProgressFill}
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {!isChecking && !showApprovedPopup ? (
              <div className={styles.optionGrid}>
                {optionValues.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={styles.optionButton}
                    onClick={() =>
                      selectedBenefit === null
                        ? handleBenefitClick(option as YesNoAnswer)
                        : handleCoverageClick(option as CoverageRange)
                    }
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className={styles.badgesCard}>
            <div className={styles.badgesTrack}>
              {[
                "Banco vs IUL",
                "Cuentas indexadas",
                "Dinero disponible",
                "Proteccion familiar",
                "Banco vs IUL",
                "Cuentas indexadas",
                "Dinero disponible",
                "Proteccion familiar",
              ].map((item, index) => (
                <div key={`${item}-${index}`} className={styles.badgeItem}>
                  <CheckMark />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.testimonialsSection}>
            <h2 className={styles.testimonialsTitle}>Lo que esta diciendo la gente</h2>
            <div className={styles.testimonialsGrid}>
              {TESTIMONIALS.map((testimonial) => (
                <article key={testimonial.name} className={styles.testimonial}>
                  <div className={styles.testimonialHeader}>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className={styles.testimonialAvatar}
                    />
                    <div>
                      <p className={styles.testimonialName}>{testimonial.name}</p>
                      <p className={styles.testimonialLocation}>{"\u2316"} {testimonial.city}</p>
                    </div>
                  </div>
                  <p className={styles.testimonialStars}>{"\u2605\u2605\u2605\u2605\u2605"}</p>
                  <p className={styles.testimonialCoverage}>{testimonial.coverage}</p>
                  <p className={styles.testimonialBody}>{testimonial.body}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {isChecking ? (
        <div className={styles.popupBackdrop}>
          <div className={`${styles.popupCard} ${styles.qualifyingPopup}`}>
            <div className={styles.loadingSpinner} />
            <div className={styles.popupTitle}>Calificando...</div>
            <div className={styles.popupBody}>
              Revisando disponibilidad en <strong>{qualifyingLocation}</strong>.
            </div>
            <div className={styles.loadingSteps}>
              {LOADING_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`${styles.loadingStep} ${
                    index === loadingStepIndex ? styles.loadingStepActive : ""
                  }`}
                >
                  {index < loadingStepIndex ? <LoadingStepCheckIcon /> : <span className={styles.loadingStepDot} />}
                  <span>
                    {step === "Revisando opciones en tu ubicacion"
                      ? `Revisando opciones en ${qualifyingLocation}`
                      : step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showApprovedPopup ? (
        <div className={styles.popupBackdrop}>
          <div className={styles.popupCard}>
            <button
              type="button"
              className={styles.popupClose}
              onClick={() => setShowApprovedPopup(false)}
              aria-label="Cerrar popup"
            >
              {"\u00D7"}
            </button>
            <div className={styles.popupSuccessBadge}>
              <SuccessBadgeIcon />
            </div>
            <div className={styles.popupTitle}>Felicitaciones</div>
            <div className={styles.popupLead}>Numero de revision #{applicationId}</div>
            <div className={styles.popupBody}>
              Hay opciones activas para revisar un beneficio en <strong>{qualifyingLocation}</strong>.
            </div>
            <div className={styles.popupTimer}>Tu lugar esta reservado por {countdownLabel}</div>
            <button
              type="button"
              className={`${styles.popupButton} ${styles.popupButtonLoading}`}
              onClick={handleClaimClick}
            >
              <span className={styles.portalSpinnerWrap} aria-hidden="true">
                <PortalSpinner />
              </span>
              <span className={styles.popupButtonLabel}>
                <ClaimIcon />
                <span>Estamos abriendo el portal</span>
              </span>
            </button>
          </div>
        </div>
      ) : null}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-pz2.png"
            alt="IUL Life"
            width={180}
            height={54}
            className={styles.footerLogo}
          />
          <p className={styles.footerDisclaimer}>
            Este es un anuncio comercial de productos de seguro. El angulo de cuentas de ahorro indexadas se usa con fines publicitarios para explicar una estructura tipo IUL. La cobertura, elegibilidad y disponibilidad varian segun el estado y el perfil de cada persona. <a href="#">Privacidad</a> | <a href="#">Terminos del servicio</a>
          </p>
          <div className={styles.footerLinks}>
            <span>Privacidad</span>
            <span>Terminos</span>
            <span>No llamar</span>
            <span>Contacto</span>
          </div>
          <p className={styles.footerCopyright}>{"\u00A9"} 2026 Radar Financiero. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}




