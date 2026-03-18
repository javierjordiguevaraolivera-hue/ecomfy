"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  createClientEventId,
  sendMetaServerEvent,
  trackCallCtaClick,
  trackEngagedInteraction,
  trackMetaBrowserEvent,
  trackMetric,
} from "@/lib/metrics-client";

type AgeRange = "50-59" | "60-69" | "70-79" | "80-85";
type CoverageRange = "$10,000" | "$20,000" | "$30,000" | "$50,000";
type YesNoAnswer = "Yes" | "No";
type StepHash = "validacion" | "monto" | "edad" | "calificando" | "aprobado";
type ProgressCookie = {
  benefit: YesNoAnswer | null;
  coverage: CoverageRange | null;
  age: AgeRange | null;
  step: StepHash;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const LANDING_KEY = "fe7-an-en";
const PHONE_HREF = "tel:+18556685535";
const PHONE_LABEL = "Call (855) 668-5535";
const META_PAGE_VIEW_KEY = "fe7-an-en:meta-page-view";
const META_PAGE_VIEW_COOKIE_KEY = "fe7_meta_page_view";
const FE7_PROGRESS_COOKIE_KEY = "fe7_an_en_progress";
const FE7_PROGRESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function syncStepHash(step: StepHash) {
  if (typeof window === "undefined") {
    return;
  }

  const nextUrl = `${window.location.pathname}${window.location.search}#${step}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}
const FE7_HEADLINE = "Seniors: You May Qualify for up to $50,000 in Final Expense Coverage";
const AGE_OPTIONS: AgeRange[] = ["50-59", "60-69", "70-79", "80-85"];
const COVERAGE_OPTIONS: CoverageRange[] = ["$10,000", "$20,000", "$30,000", "$50,000"];

function readProgressCookie(): ProgressCookie {
  const fallback: ProgressCookie = {
    benefit: null,
    coverage: null,
    age: null,
    step: "validacion",
  };

  if (typeof document === "undefined") {
    return fallback;
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${FE7_PROGRESS_COOKIE_KEY}=`));

  if (!cookie) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1)),
    ) as Partial<ProgressCookie>;
    const benefit = parsed.benefit === "Yes" || parsed.benefit === "No" ? parsed.benefit : null;
    const coverage =
      typeof parsed.coverage === "string" &&
      (COVERAGE_OPTIONS as readonly string[]).includes(parsed.coverage)
        ? (parsed.coverage as CoverageRange)
        : null;
    const age =
      typeof parsed.age === "string" &&
      (AGE_OPTIONS as readonly string[]).includes(parsed.age)
        ? (parsed.age as AgeRange)
        : null;
    const step =
      parsed.step === "monto" ||
      parsed.step === "edad" ||
      parsed.step === "calificando" ||
      parsed.step === "aprobado"
        ? parsed.step
        : "validacion";

    return {
      benefit,
      coverage,
      age,
      step,
    };
  } catch {
    return fallback;
  }
}

function writeProgressCookie(progress: ProgressCookie) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${FE7_PROGRESS_COOKIE_KEY}=${encodeURIComponent(
    JSON.stringify(progress),
  )}; path=/; max-age=${FE7_PROGRESS_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function hasCookieFlag(name: string) {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie.split("; ").some((entry) => entry === `${name}=1`);
}

function writeCookieFlag(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=1; path=/; max-age=${FE7_PROGRESS_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function getCurrentStepHash({
  selectedBenefit,
  selectedCoverage,
  selectedAge,
  isChecking,
  showApprovedPopup,
}: {
  selectedBenefit: YesNoAnswer | null;
  selectedCoverage: CoverageRange | null;
  selectedAge: AgeRange | null;
  isChecking: boolean;
  showApprovedPopup: boolean;
}): StepHash {
  if (isChecking) {
    return "calificando";
  }

  if (showApprovedPopup || selectedAge !== null) {
    return "aprobado";
  }

  if (selectedCoverage !== null) {
    return "edad";
  }

  if (selectedBenefit !== null) {
    return "monto";
  }

  return "validacion";
}

const TESTIMONIALS = [
  {
    image: "/Dorothy W-testimonial1.jpg",
    name: "Dorothy W.",
    city: "Atlanta, GA",
    coverage: "$25,000 coverage secured",
    body:
      "I was worried my family would be burdened with funeral costs. Within one phone call, I was approved for $25,000 in coverage with no medical exam. My payments are only $32/month.",
  },
  {
    image: "/robert h-testimonial2.jpg",
    name: "Robert H.",
    city: "Phoenix, AZ",
    coverage: "$15,000 policy - no exam needed",
    body:
      "At 72, I thought no one would insure me. The agent was so kind and patient. Got approved the same day. Now my kids won't have to worry about anything.",
  },
  {
    image: "/Maria & Carlos L-testimonial3.jpg",
    name: "Maria & Carlos L.",
    city: "San Antonio, TX",
    coverage: "$40,000 combined coverage",
    body:
      "We both got covered together. The process was simple, and the agent explained everything clearly. Best decision we've made for our family's peace of mind.",
  },
] as const;

const URGENCY_FEED = [
  { name: "Brandon", state: "Arizona", approved: true, amount: "$27,000", minutesAgo: 3 },
  { name: "Tyler", state: "Texas", approved: false, amount: "$0", minutesAgo: 5 },
  { name: "Helen", state: "Florida", approved: true, amount: "$18,000", minutesAgo: 7 },
  { name: "Robert", state: "Nevada", approved: true, amount: "$32,000", minutesAgo: 9 },
  { name: "Linda", state: "Ohio", approved: true, amount: "$21,000", minutesAgo: 12 },
  { name: "Samuel", state: "Georgia", approved: true, amount: "$35,000", minutesAgo: 14 },
  { name: "Patricia", state: "Alabama", approved: true, amount: "$24,000", minutesAgo: 16 },
  { name: "Eugene", state: "Missouri", approved: true, amount: "$29,000", minutesAgo: 18 },
  { name: "Cheryl", state: "Indiana", approved: false, amount: "$0", minutesAgo: 21 },
  { name: "Dennis", state: "Oklahoma", approved: true, amount: "$31,000", minutesAgo: 24 },
  { name: "Wanda", state: "Tennessee", approved: true, amount: "$20,000", minutesAgo: 27 },
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

function CheckMark() {
  return <span className={styles.checkMark}>✓</span>;
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

export default function Fe7Client({
  heroImage,
  deadlineLabel,
  city,
  state,
  metaPixelId,
  heroImageWidth,
  heroImageHeight,
}: {
  heroImage: string;
  deadlineLabel: string;
  city: string;
  state: string;
  metaPixelId: string;
  heroImageWidth: number;
  heroImageHeight: number;
}) {
  const [selectedBenefit, setSelectedBenefit] = useState<YesNoAnswer | null>(() => readProgressCookie().benefit);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageRange | null>(() => readProgressCookie().coverage);
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(() => readProgressCookie().age);
  const [isChecking, setIsChecking] = useState(false);
  const [showApprovedPopup, setShowApprovedPopup] = useState(() => {
    const progress = readProgressCookie();
    return progress.step === "calificando" || progress.step === "aprobado";
  });
  const [applicationId] = useState(() => `FE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [countdownSeconds, setCountdownSeconds] = useState(90);
  const [urgencyIndex, setUrgencyIndex] = useState(0);
  const [urgencyPhase, setUrgencyPhase] = useState<"in" | "out">("in");

  const urgencyItem = URGENCY_FEED[urgencyIndex] ?? URGENCY_FEED[0];
  const detectedLocation = city && state ? `${city}, ${state}` : "";
  const qualifyingLocation = detectedLocation || "your area";
  const totalSteps = 3;

  const currentStepHash = getCurrentStepHash({
    selectedBenefit,
    selectedCoverage,
    selectedAge,
    isChecking,
    showApprovedPopup,
  });

  let currentStep = 1;
  let currentQuestion = "Have you already claimed your cash benefit?";
  let optionValues: string[] = ["Yes", "No"];
  let optionHandler: ((value: string) => void) | null = null;
  let showQualifiedState = false;

  if (selectedBenefit === null) {
    currentStep = 1;
    currentQuestion = "Have you already claimed your cash benefit?";
    optionValues = ["Yes", "No"];
    optionHandler = (value) => handleBenefitClick(value as YesNoAnswer);
  } else if (selectedCoverage === null) {
    currentStep = 2;
    currentQuestion = "How much do you want to receive?";
    optionValues = COVERAGE_OPTIONS;
    optionHandler = (value) => handleCoverageClick(value as CoverageRange);
  } else if (selectedAge === null) {
    currentStep = 3;
    currentQuestion = "Select your age range.";
    optionValues = AGE_OPTIONS;
    optionHandler = (value) => handleAgeClick(value as AgeRange);
  } else {
    currentStep = 3;
    currentQuestion = "You qualify to speak with a licensed agent.";
    optionValues = [];
    showQualifiedState = true;
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUrgencyPhase("out");
      window.setTimeout(() => {
        setUrgencyIndex((current) => (current + 1) % URGENCY_FEED.length);
        setUrgencyPhase("in");
      }, 640);
    }, 10000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

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
    syncStepHash(currentStepHash);
    writeProgressCookie({
      benefit: selectedBenefit,
      coverage: selectedCoverage,
      age: selectedAge,
      step: currentStepHash,
    });
  }, [currentStepHash, selectedAge, selectedBenefit, selectedCoverage]);



  function trackMetaPageView(source: string) {
    if (typeof window === "undefined") {
      return;
    }

    if (
      window.sessionStorage.getItem(META_PAGE_VIEW_KEY) === "1" ||
      hasCookieFlag(META_PAGE_VIEW_COOKIE_KEY)
    ) {
      return;
    }

    window.sessionStorage.setItem(META_PAGE_VIEW_KEY, "1");
    writeCookieFlag(META_PAGE_VIEW_COOKIE_KEY);
    const eventId = createClientEventId("meta-pageview");
    trackMetaBrowserEvent({
      pixelId: metaPixelId,
      eventName: "PageView",
      eventId,
    });
    sendMetaServerEvent({
      landing: LANDING_KEY,
      eventName: "PageView",
      eventId,
      step: currentStepHash,
      label: source,
      placement: source,
    });
    trackMetric({ landing: LANDING_KEY, event: "meta_page_view", label: source });
  }

  function trackMetaContact(source: string) {
    if (typeof window === "undefined") {
      return;
    }

    const eventId = createClientEventId("meta-contact");
    trackMetaBrowserEvent({
      pixelId: metaPixelId,
      eventName: "Contact",
      eventId,
    });
    sendMetaServerEvent({
      landing: LANDING_KEY,
      eventName: "Contact",
      eventId,
      step: currentStepHash,
      label: source,
      placement: source,
      phone: PHONE_HREF,
    });
    trackMetric({ landing: LANDING_KEY, event: "meta_contact", label: source });
  }

  function startQualification() {
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
    }, 1600);
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
    trackMetaPageView("step_edad");
  }

  function handleAgeClick(option: AgeRange) {
    setSelectedAge(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_age");
    trackMetric({ landing: LANDING_KEY, event: "age_selected", label: option });
    startQualification();
  }

  function handleCallClick(placement: string) {
    trackMetaContact(placement);
    trackCallCtaClick({
      landing: LANDING_KEY,
      phone: PHONE_HREF,
      placement,
      label: selectedCoverage ?? selectedAge ?? undefined,
    });
    trackMetric({ landing: LANDING_KEY, event: "call_click", label: placement });
  }

  const selectedCoverageLabel = selectedCoverage ?? "your selected coverage amount";
  const countdownMinutes = Math.floor(countdownSeconds / 60);
  const countdownRemainder = countdownSeconds % 60;
  const countdownLabel = `${countdownMinutes}:${countdownRemainder.toString().padStart(2, "0")}`;

  return (
    <main className={`${styles.page} ${isChecking || showApprovedPopup ? styles.pageBlurred : ""}`.trim()}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Image
            src="/Quiet-legacy-logo-final.png"
            alt="Quiet Legacy"
            width={188}
            height={56}
            className={styles.logo}
            priority
          />

          <a
            href={PHONE_HREF}
            className={styles.headerCall}
            onClick={() => handleCallClick("header_call")}
          >
            <Image
              src="/asesora-ventas-5.png"
              alt="Insurance agent Sarah"
              width={28}
              height={28}
              className={styles.headerAvatar}
            />
            <div className={styles.headerCallCopy}>
              <span className={styles.headerCallStatus}>Agent Available</span>
            </div>
          </a>
        </div>

        <div className={styles.bandWrap}>
          <div className={styles.bandStripes} />
          <div className={styles.bandContent}>
            <span className={styles.bandFlag}>🇺🇸</span>
            <div className={styles.bandText}>
              <div className={styles.bandTitle}>Benefits for Seniors</div>
              <div className={styles.bandSubtitle}>Coverage available nationwide</div>
            </div>
            <span className={styles.bandFlag}>🇺🇸</span>
          </div>
          <div className={styles.bandShimmer} />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.alertCard}>
            <div className={styles.alertHeadlineFixed}>
              Seniors: You May Qualify for up to{" "}
              <span className={styles.alertAmount}>$50,000</span> in Final Expense
              Coverage
            </div>
            <div className={styles.alertHeadline} data-headline={FE7_HEADLINE}>
              {FE7_HEADLINE}
            </div>
          </div>

          <section className={styles.heroCard}>
            <div className={styles.heroImageWrap}>
              <Image
                src={heroImage}
                alt="Family visiting a loved one at a peaceful cemetery"
                width={heroImageWidth}
                height={heroImageHeight}
                className={styles.heroImage}
                priority
              />
            </div>
            <h1 className={styles.heroTitle} data-headline={FE7_HEADLINE}>
              {FE7_HEADLINE}
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
                      {urgencyItem.name} from {urgencyItem.state}
                    </div>
                    <div className={styles.urgencySubline}>
                      <span className={styles.urgencyStatusText}>
                        {urgencyItem.approved ? "approved" : "not approved"}
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
                  <span>{urgencyItem.minutesAgo} min ago</span>
                </div>
              </div>
            </div>
            <p className={styles.heroDeadline}>
              Program closes <span>{deadlineLabel}</span>
            </p>
          </section>

          <section className={styles.formCard}>
            <div className={styles.formIntro}>
              <span className={styles.formIntroDot} />
              Answer 3 quick questions to see if you qualify
            </div>
            <div className={styles.stepBox}>
              <p className={styles.questionTitle}>{currentQuestion}</p>
              <div className={styles.stepProgress}>
                <div
                  className={styles.stepProgressFill}
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {!showQualifiedState ? (
              <p className={styles.formHint}>Tap one answer below to continue instantly</p>
            ) : null}

            {showQualifiedState ? (
              <div className={styles.nameForm}>
                <p className={styles.nameLabel}>
                  You qualify to review coverage options around {selectedCoverageLabel} right now.
                </p>
                <a
                  href={PHONE_HREF}
                  className={styles.popupButton}
                  onClick={() => handleCallClick("qualified_card")}
                >
                  <span className={styles.popupButtonDot} />
                  <span className={styles.popupButtonLabel}>
                    <PhoneIcon />
                    <span>{PHONE_LABEL}</span>
                  </span>
                </a>
              </div>
            ) : (
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
            )}
          </section>

          <section className={styles.badgesCard}>
            <div className={styles.badgesTrack}>
              {[
                "A+ BBB Rating",
                "Licensed Agents",
                "HIPAA Compliant",
                "Trusted by 50,000+",
              ].map((item) => (
                <div key={item} className={styles.badgeItem}>
                  <CheckMark />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.testimonialsSection}>
            <h2 className={styles.testimonialsTitle}>Real Families. Real Coverage.</h2>
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
                      <p className={styles.testimonialLocation}>⌁ {testimonial.city}</p>
                    </div>
                  </div>
                  <p className={styles.testimonialStars}>★★★★★</p>
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
            <div className={styles.popupTitle}>Qualifying...</div>
            <div className={styles.popupBody}>
              Viewing options in <strong>{qualifyingLocation}</strong>.
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
              aria-label="Close application popup"
            >
              ×
            </button>
            <div className={styles.popupSuccessBadge}>
              <SuccessBadgeIcon />
            </div>
            <div className={styles.popupTitle}>You Qualify</div>
            <div className={styles.popupLead}>Application #{applicationId}</div>
            <div className={styles.popupBody}>
              Call an agent now to review Final Expense options around{" "}
              <strong>{selectedCoverageLabel}</strong> in <strong>{qualifyingLocation}</strong>.
            </div>
            <div className={styles.popupTimer}>Spot reserved for {countdownLabel}</div>
            <a
              href={PHONE_HREF}
              className={styles.popupButton}
              onClick={() => handleCallClick("popup_cta")}
            >
              <span className={styles.popupButtonDot} />
              <span className={styles.popupButtonLabel}>
                <PhoneIcon />
                <span>{PHONE_LABEL}</span>
              </span>
            </a>
          </div>
        </div>
      ) : null}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/Quiet-legacy-logo-final.png"
            alt="Quiet Legacy"
            width={180}
            height={54}
            className={styles.footerLogo}
          />
          <p className={styles.footerDisclaimer}>
            This is a commercial advertisement for insurance products. Quiet Legacy is
            not a government agency and is not affiliated with Medicare or any
            government program. By calling the number on this page, you consent to
            being contacted by a licensed insurance agent. Coverage amounts, premiums,
            and eligibility vary by state and individual circumstances. Not all
            applicants will qualify. Please consult with a licensed agent for details.{" "}
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
          </p>
          <div className={styles.footerLinks}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Do Not Call</span>
            <span>Contact Us</span>
          </div>
          <p className={styles.footerCopyright}>© 2026 Quiet Legacy. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
























