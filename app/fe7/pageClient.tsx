"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  trackCallCtaClick,
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type AgeRange = "50-59" | "60-69" | "70-79" | "80-85";
type CoverageRange = "$10,000" | "$20,000" | "$30,000" | "$50,000";
type YesNoAnswer = "Yes" | "No";

const LANDING_KEY = "fe7-an-en";
const PHONE_HREF = "tel:+18556685535";
const FE7_HEADLINE = "Seniors: You May Qualify for up to $50,000 in Final Expense Coverage";
const AGE_OPTIONS: AgeRange[] = ["50-59", "60-69", "70-79", "80-85"];
const COVERAGE_OPTIONS: CoverageRange[] = ["$10,000", "$20,000", "$30,000", "$50,000"];

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
}: {
  heroImage: string;
  deadlineLabel: string;
  city: string;
  state: string;
}) {
  const [selectedLocation, setSelectedLocation] = useState<YesNoAnswer | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<YesNoAnswer | null>(null);
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageRange | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);
  const [fullName, setFullName] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [applicationId] = useState(() => `FE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [countdownSeconds, setCountdownSeconds] = useState(90);
  const [urgencyIndex, setUrgencyIndex] = useState(0);
  const [urgencyPhase, setUrgencyPhase] = useState<"in" | "out">("in");

  const urgencyItem = URGENCY_FEED[urgencyIndex] ?? URGENCY_FEED[0];
  const detectedLocation = city && state ? `${city}, ${state}` : "";
  const shouldAskLocation = Boolean(detectedLocation);
  const qualifyingLocation =
    shouldAskLocation && selectedLocation !== "No" ? detectedLocation : "your area";
  const totalSteps = shouldAskLocation ? 5 : 4;

  let currentStep = 1;
  let currentQuestion = shouldAskLocation
    ? `Are you from ${detectedLocation}?`
    : "Have you already claimed your Final Expense benefit?";
  let optionValues: string[] = shouldAskLocation ? ["Yes", "No"] : ["Yes", "No"];
  let optionHandler: ((value: string) => void) | null = null;
  let showTextInput = false;

  if (shouldAskLocation && selectedLocation === null) {
    currentStep = 1;
    currentQuestion = `Are you from ${detectedLocation}?`;
    optionValues = ["Yes", "No"];
    optionHandler = (value) => handleLocationClick(value as YesNoAnswer);
  } else if (selectedBenefit === null) {
    currentStep = shouldAskLocation ? 2 : 1;
    currentQuestion = "Have you already claimed your Final Expense benefit?";
    optionValues = ["Yes", "No"];
    optionHandler = (value) => handleBenefitClick(value as YesNoAnswer);
  } else if (selectedCoverage === null) {
    currentStep = shouldAskLocation ? 3 : 2;
    currentQuestion = "How much do you want to receive?";
    optionValues = COVERAGE_OPTIONS;
    optionHandler = (value) => handleCoverageClick(value as CoverageRange);
  } else if (selectedAge === null) {
    currentStep = shouldAskLocation ? 4 : 3;
    currentQuestion = "Select your age range.";
    optionValues = AGE_OPTIONS;
    optionHandler = (value) => handleAgeClick(value as AgeRange);
  } else {
    currentStep = shouldAskLocation ? 5 : 4;
    currentQuestion = "Enter your name.";
    showTextInput = true;
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
  }

  function handleAgeClick(option: AgeRange) {
    setSelectedAge(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_age");
    trackMetric({ landing: LANDING_KEY, event: "age_selected", label: option });
  }

  function handleNameSubmit() {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      return;
    }

    setFullName(trimmedName);
    setIsChecking(true);
    trackEngagedInteraction(LANDING_KEY, "quiz_name");
    trackMetric({ landing: LANDING_KEY, event: "name_submitted", label: trimmedName });
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

  function handleCallClick(placement: string) {
    trackCallCtaClick({
      landing: LANDING_KEY,
      phone: PHONE_HREF,
      placement,
      label: (selectedCoverage ?? selectedAge ?? fullName.trim()) || undefined,
    });
    trackMetric({ landing: LANDING_KEY, event: "call_click", label: placement });
  }

  const countdownMinutes = Math.floor(countdownSeconds / 60);
  const countdownRemainder = countdownSeconds % 60;
  const countdownLabel = `${countdownMinutes}:${countdownRemainder.toString().padStart(2, "0")}`;

  return (
    <main className={styles.page}>
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
              <span className={styles.headerCallStatus}>
                <span className={styles.liveDot} />
                Agent Available
              </span>
              <span className={styles.headerCallAction}>
                <PhoneIcon />
                Speak Now
              </span>
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
                width={900}
                height={900}
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
            <div className={styles.stepBox}>
              <div className={styles.stepTop}>
                <span className={styles.stepIndex}>{currentStep}</span>
                <span className={styles.stepLabel}>Step {currentStep} of {totalSteps}</span>
              </div>
              <p className={styles.questionTitle}>{currentQuestion}</p>
              <div className={styles.stepProgress}>
                <div
                  className={styles.stepProgressFill}
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {showTextInput ? (
              <div className={styles.nameForm}>
                <label htmlFor="fe7-name" className={styles.nameLabel}>
                  Your first name
                </label>
                <input
                  id="fe7-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={styles.nameInput}
                  placeholder="Enter your first name"
                />
                <button
                  type="button"
                  className={styles.nameSubmit}
                  onClick={handleNameSubmit}
                >
                  Continue
                </button>
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
                "A+ BBB Rating",
                "Licensed Agents",
                "HIPAA Compliant",
                "Trusted by 50,000+",
              ].map((item, index) => (
                <div key={`${item}-${index}`} className={styles.badgeItem}>
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
            <div className={styles.popupTitle}>Congratulations {fullName.trim()}</div>
            <div className={styles.popupLead}>Application #{applicationId}</div>
            <div className={styles.popupBody}>
              Call an agent to get more information about your Final Expense options in{" "}
              <strong>{qualifyingLocation}</strong>.
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
                <span>Call (855) 668-5535</span>
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
