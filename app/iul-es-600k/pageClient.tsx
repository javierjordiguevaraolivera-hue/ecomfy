"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type CoverageRange = "$200,000" | "$350,000" | "$500,000" | "$600,000";
type YesNoAnswer = "Si" | "No";

const LANDING_KEY = "iul-es-600k";
const CLAIM_URL = "https://seguro.generaldeals.info/";
const IUL_HEADLINE = "Familias en EE. UU. estan recibiendo hasta $600,000 con su Seguro IUL";
const COVERAGE_OPTIONS: CoverageRange[] = ["$200,000", "$350,000", "$500,000", "$600,000"];
const LOADING_STEPS = [
  "Revisando opciones en tu ubicacion",
  "Verificando fondos disponibles",
  "Validando monto solicitado",
] as const;

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1-600k.jpg",
    name: "Dorothy W.",
    city: "Atlanta, GA",
    coverage: "$450,000 aprobados con IUL",
    body:
      "Yo queria dejarle algo real a mi familia, no solo para gastos finales. En una sola llamada entendi como una poliza IUL puede proteger a mis hijos y tambien acumular valor en efectivo.",
  },
  {
    image: "/robert h-testimonial2-600k.jpg",
    name: "Robert H.",
    city: "Phoenix, AZ",
    coverage: "$300,000 de cobertura aprobada",
    body:
      "Pensaba que este tipo de cobertura seria complicada. El asesor me explico todo claro y encontre una opcion que protege a mi familia y me da tranquilidad financiera.",
  },
  {
    image: "/Maria & Carlos L-testimonial3-600k.jpg",
    name: "Maria y Carlos L.",
    city: "San Antonio, TX",
    coverage: "$900,000 de cobertura combinada",
    body:
      "Buscabamos una estrategia para proteger a nuestra familia y dejar un legado. El proceso fue simple y entendimos como usar IUL como parte de nuestro plan financiero.",
  },
] as const;

const URGENCY_FEED = [
  { name: "Brandon", state: "Arizona", approved: true, amount: "$420,000", minutesAgo: 3 },
  { name: "Tyler", state: "Texas", approved: false, amount: "$0", minutesAgo: 5 },
  { name: "Helen", state: "Florida", approved: true, amount: "$260,000", minutesAgo: 7 },
  { name: "Robert", state: "Nevada", approved: true, amount: "$680,000", minutesAgo: 9 },
  { name: "Linda", state: "Ohio", approved: true, amount: "$350,000", minutesAgo: 12 },
  { name: "Samuel", state: "Georgia", approved: true, amount: "$600,000", minutesAgo: 14 },
  { name: "Patricia", state: "Alabama", approved: true, amount: "$500,000", minutesAgo: 16 },
  { name: "Eugene", state: "Missouri", approved: true, amount: "$720,000", minutesAgo: 18 },
  { name: "Cheryl", state: "Indiana", approved: false, amount: "$0", minutesAgo: 21 },
  { name: "Dennis", state: "Oklahoma", approved: true, amount: "$610,000", minutesAgo: 24 },
  { name: "Wanda", state: "Tennessee", approved: true, amount: "$240,000", minutesAgo: 27 },
  { name: "Gregory", state: "Kentucky", approved: false, amount: "$0", minutesAgo: 31 },
  { name: "Elaine", state: "Virginia", approved: false, amount: "$0", minutesAgo: 36 },
] as const;

function PhoneIcon() {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

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
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="3"
      />
      <path
        d="M12 3.5a8.5 8.5 0 0 1 7.2 4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
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

export default function IulEs600kClient({
  heroImage,
  deadlineLabel,
  city,
  state,
}: {
  heroImage: string;
  deadlineLabel: string;
  city: string;
  state: string;
}) {
  const [selectedLocation, setSelectedLocation] = useState<YesNoAnswer | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<YesNoAnswer | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageRange | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [applicationId] = useState(
    () =>
      `IUL${Math.floor(10000 + Math.random() * 90000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`,
  );
  const [countdownSeconds, setCountdownSeconds] = useState(90);
  const [urgencyIndex, setUrgencyIndex] = useState(0);
  const [urgencyPhase, setUrgencyPhase] = useState<"in" | "out">("in");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const urgencyItem = URGENCY_FEED[urgencyIndex] ?? URGENCY_FEED[0];
  const detectedLocation = city && state ? `${city}, ${state}` : "";
  const shouldAskLocation = false;
  const qualifyingLocation = detectedLocation || "tu area";
  const totalSteps = 2;

  let currentStep = 1;
  let currentQuestion = shouldAskLocation
    ? `Eres de ${detectedLocation}?`
    : "Ya reclamaste tu beneficio IUL?";
  let optionValues: string[] = shouldAskLocation ? ["Si", "No"] : ["Si", "No"];
  let optionHandler: ((value: string) => void) | null = null;

  if (shouldAskLocation && selectedLocation === null) {
    currentStep = 1;
    currentQuestion = `Eres de ${detectedLocation}?`;
    optionValues = ["Si", "No"];
    optionHandler = (value) => handleLocationClick(value as YesNoAnswer);
  } else if (selectedBenefit === null) {
    currentStep = shouldAskLocation ? 2 : 1;
    currentQuestion = "Ya reclamaste tu beneficio IUL?";
    optionValues = ["Si", "No"];
    optionHandler = (value) => handleBenefitClick(value as YesNoAnswer);
  } else if (selectedCoverage === null) {
    currentStep = shouldAskLocation ? 3 : 2;
    currentQuestion = "Cuanto quieres recibir?";
    optionValues = COVERAGE_OPTIONS;
    optionHandler = (value) => handleCoverageClick(value as CoverageRange);
  } else {
    currentStep = totalSteps;
    currentQuestion = "Calificando...";
  }

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
      window.location.href = CLAIM_URL;
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showApprovedPopup]);

  function handleLocationClick(option: YesNoAnswer) {
    setSelectedLocation(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_location");
    trackMetric({ landing: LANDING_KEY, event: "location_selected", label: option });
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
    trackMetric({
      landing: LANDING_KEY,
      event: "qualifying_started",
      label: qualifyingLocation,
    });

    window.setTimeout(() => {
      setIsChecking(false);
      setShowApprovedPopup(true);
      trackMetric({
        landing: LANDING_KEY,
        event: "qualified_popup",
        label: qualifyingLocation,
      });
    }, 3200);
  }

  function handleClaimClick() {
    trackMetric({ landing: LANDING_KEY, event: "claim_click", label: "popup_claim" });
  }

  const countdownMinutes = Math.floor(countdownSeconds / 60);
  const countdownRemainder = countdownSeconds % 60;
  const countdownLabel = `${countdownMinutes}:${countdownRemainder.toString().padStart(2, "0")}`;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Image
            src="/iul-life-logo-600k.png"
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
            <span className={styles.bandFlag}>{"\u{1F1FA}\u{1F1F8}"}</span>
            <div className={styles.bandText}>
              <div className={styles.bandTitle}>Beneficios con IUL</div>
              <div className={styles.bandSubtitle}>Cobertura disponible en todo USA</div>
            </div>
            <span className={styles.bandFlag}>{"\u{1F1FA}\u{1F1F8}"}</span>
          </div>
          <div className={styles.bandShimmer} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.alertCard}>
            <div className={styles.alertHeadlineFixed}>
              Familias en EE. UU. estan recibiendo hasta{" "}
              <span className={styles.alertAmount}>$600,000</span> con su Seguro IUL
            </div>
            <div className={styles.alertHeadline} data-headline={IUL_HEADLINE}>
              {IUL_HEADLINE}
            </div>
          </div>

          <section className={styles.heroCard}>
            <div className={styles.heroImageWrap}>
              <Image
                src={heroImage}
                alt="Familia construyendo un legado financiero"
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
                        {urgencyItem.approved ? "aprobado" : "no aprobado"}
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
              Programa cierra <span>{deadlineLabel}</span>
            </p>
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
                    onClick={() => optionHandler?.(option)}
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
                "Estrategia de legado",
                "Cobertura flexible",
                "Valor en efectivo",
                "Proteccion familiar",
                "Estrategia de legado",
                "Cobertura flexible",
                "Valor en efectivo",
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
            <h2 className={styles.testimonialsTitle}>Familias reales. Proteccion real.</h2>
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
                  {index < loadingStepIndex ? (
                    <LoadingStepCheckIcon />
                  ) : (
                    <span className={styles.loadingStepDot} />
                  )}
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
            <div className={styles.popupLead}>Numero de calificacion #{applicationId}</div>
            <div className={styles.popupBody}>
              Haz sido aprobado. Registrate para reclamar tu beneficio en{" "}
              <strong>{qualifyingLocation}</strong>.
            </div>
            <div className={styles.popupTimer}>Tu lugar esta reservado por {countdownLabel}</div>
            <a
              href={CLAIM_URL}
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
            </a>
          </div>
        </div>
      ) : null}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo-iul-negativo-600k.png"
            alt="IUL Life"
            width={180}
            height={54}
            className={styles.footerLogo}
          />
          <p className={styles.footerDisclaimer}>
            Este es un anuncio comercial de productos de seguro. IUL Life no es una
            agencia gubernamental ni esta afiliada con Medicare ni con ningun programa
            gubernamental. Al llamar al numero de esta pagina, aceptas ser contactado por
            un agente licenciado. La cobertura, primas y elegibilidad varian segun el
            estado y el perfil de cada persona. No todos califican. Consulta con un agente
            licenciado para recibir detalles. <a href="#">Privacidad</a> |{" "}
            <a href="#">Terminos del servicio</a>
          </p>
          <div className={styles.footerLinks}>
            <span>Privacidad</span>
            <span>Terminos</span>
            <span>No llamar</span>
            <span>Contacto</span>
          </div>
          <p className={styles.footerCopyright}>{"\u00A9"} 2026 IUL Life. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}





