"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  trackCallCtaClick,
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type Step =
  | "quiz"
  | "checking"
  | "checkingComplete"
  | "searchingAdvisors"
  | "advisorFound"
  | "success";

const AGE_OPTIONS = ["45–54", "55–64", "65–74", "75+"] as const;
const INSURANCE_OPTIONS = ["No", "Yes"] as const;
const DEFAULT_PHONE_NUMBER = "(855) 668-5535";
const DEFAULT_PHONE_HREF = "tel:+18556685535";

const ADVISORS = [
  {
    name: "Sarah M.",
    experience: "11 years experience",
    families: "1,480 families helped",
    image: "/asesora-ventas-2.png",
    status: "Currently on a call with another family.",
  },
  {
    name: "Daniel R.",
    experience: "9 years experience",
    families: "1,120 families helped",
    image: "/asesor-ventas-4.png",
    status: "Out on a scheduled in-home policy visit.",
  },
  {
    name: "Chris A.",
    experience: "8 years experience",
    families: "940 families helped",
    image: "/asesor-ventas-7.png",
    status: "Finalizing a policy signature with a client.",
  },
  {
    name: "Megan T.",
    experience: "13 years experience",
    families: "1,860 families helped",
    image: "/asesora-ventas-5.png",
    status: "Available now and ready to take your call.",
  },
] as const;

function SecureIcon() {
  return (
    <svg
      className={styles.secureIcon}
      viewBox="0 0 1200 1200"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1183.326 997.842l-169.187 167.83c-24.974 25.612-58.077 34.289-90.316 34.328-142.571-4.271-277.333-74.304-387.981-146.215C354.22 921.655 187.574 757.82 82.984 559.832 42.87 476.809-4.198 370.878.299 278.209c.401-34.86 9.795-69.073 34.346-91.543L203.831 17.565c35.132-29.883 69.107-19.551 91.589 15.257l136.111 258.102c14.326 30.577 6.108 63.339-15.266 85.188l-62.332 62.3c-3.848 5.271-6.298 11.271-6.36 17.801 23.902 92.522 96.313 177.799 160.281 236.486 63.967 58.688 132.725 138.198 221.977 157.021 11.032 3.077 24.545 4.158 32.438-3.179l72.51-73.743c24.996-18.945 61.086-28.205 87.771-12.714h1.272l245.51 144.943c35.041 22.592 38.799 66.252 12.994 92.815Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className={styles.locationIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className={styles.successPillIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.8 12.2 2.1 2.2 4.4-4.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className={styles.callIcon}
      viewBox="0 0 1200 1200"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1183.326 997.842l-169.187 167.83c-24.974 25.612-58.077 34.289-90.316 34.328-142.571-4.271-277.333-74.304-387.981-146.215C354.22 921.655 187.574 757.82 82.984 559.832 42.87 476.809-4.198 370.878.299 278.209c.401-34.86 9.795-69.073 34.346-91.543L203.831 17.565c35.132-29.883 69.107-19.551 91.589 15.257l136.111 258.102c14.326 30.577 6.108 63.339-15.266 85.188l-62.332 62.3c-3.848 5.271-6.298 11.271-6.36 17.801 23.902 92.522 96.313 177.799 160.281 236.486 63.967 58.688 132.725 138.198 221.977 157.021 11.032 3.077 24.545 4.158 32.438-3.179l72.51-73.743c24.996-18.945 61.086-28.205 87.771-12.714h1.272l245.51 144.943c35.041 22.592 38.799 66.252 12.994 92.815Z" />
    </svg>
  );
}

function BenefitShield() {
  return (
    <svg
      className={styles.benefitIcon}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7.74807 0.0658784C7.59435 -0.0219595 7.40565 -0.0219595 7.25193 0.0658784L0.251931 4.06588C0.096143 4.1549 0 4.32057 0 4.5V5.21989C0 9.75232 3.0046 13.7356 7.36264 14.9808C7.45242 15.0064 7.54758 15.0064 7.63736 14.9808C11.9954 13.7356 15 9.75232 15 5.21989V4.5C15 4.32057 14.9039 4.1549 14.7481 4.06588L7.74807 0.0658784Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BenefitCheck() {
  return (
    <svg
      className={styles.benefitIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.8 12.2 2.1 2.2 4.4-4.8" />
    </svg>
  );
}

export default function Fe3Client({
  locationLabel,
  landingKey = "fe3-an-en",
  phoneNumber = DEFAULT_PHONE_NUMBER,
  phoneHref = DEFAULT_PHONE_HREF,
}: {
  locationLabel: string;
  landingKey?: string;
  phoneNumber?: string;
  phoneHref?: string;
}) {
  const [step, setStep] = useState<Step>("quiz");
  const [age, setAge] = useState("");
  const [insurance, setInsurance] = useState("");
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(109);
  const [advisorIndex, setAdvisorIndex] = useState(0);
  const [advisorStatus, setAdvisorStatus] = useState("Checking live availability...");

  const selectedAdvisor = useMemo(() => ADVISORS[3], []);

  useEffect(() => {
    trackLandingView(landingKey);
  }, [landingKey]);

  useEffect(() => {
    if (step !== "checking") {
      return;
    }

    setProgress(18);
    const t1 = window.setTimeout(() => setProgress(44), 850);
    const t2 = window.setTimeout(() => setProgress(74), 1600);
    const t3 = window.setTimeout(() => {
      setProgress(100);
      setStep("checkingComplete");
    }, 2400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "checkingComplete") {
      return;
    }

    const t = window.setTimeout(() => setStep("searchingAdvisors"), 650);
    return () => {
      window.clearTimeout(t);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "searchingAdvisors") {
      return;
    }

    setAdvisorIndex(0);
    setProgress(18);
    setAdvisorStatus(ADVISORS[0].status);

    const t1 = window.setTimeout(() => {
      setAdvisorIndex(1);
      setProgress(38);
      setAdvisorStatus(ADVISORS[1].status);
    }, 1200);

    const t2 = window.setTimeout(() => {
      setAdvisorIndex(2);
      setProgress(58);
      setAdvisorStatus(ADVISORS[2].status);
    }, 2500);

    const t3 = window.setTimeout(() => {
      setAdvisorIndex(3);
      setProgress(82);
      setAdvisorStatus("Validating current call availability...");
    }, 3900);

    const t4 = window.setTimeout(() => {
      setProgress(100);
      setAdvisorStatus(`${ADVISORS[3].name} is available now and ready to help.`);
      setStep("advisorFound");
    }, 5000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "advisorFound") {
      return;
    }

    const t = window.setTimeout(() => setStep("success"), 700);
    return () => {
      window.clearTimeout(t);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "success") {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => (current <= 1 ? 109 : current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [step]);

  useEffect(() => {
    if (step === "checkingComplete") {
      trackMetric({
        landing: landingKey,
        event: "qualification_checked",
      });
    }

    if (step === "searchingAdvisors") {
      trackMetric({
        landing: landingKey,
        event: "advisor_search_started",
      });
    }

    if (step === "success") {
      trackMetric({
        landing: landingKey,
        event: "advisor_ready",
      });
    }
  }, [step]);

  const canContinue = Boolean(age && insurance);
  const countdownLabel = `${Math.floor(countdown / 60)}:${(countdown % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <Image
              src="/Quiet-legacy-logo-final.png"
              alt="Quiet Legacy"
              width={182}
              height={42}
              className={styles.logoImage}
              priority
            />
          </div>

          <a
            href={phoneHref}
            className={styles.secureBadge}
            onClick={() => {
              trackCallCtaClick({
                landing: landingKey,
                phone: phoneHref,
                placement: "header_number",
              });
              trackMetric({
                landing: landingKey,
                event: "header_call_click",
              });
            }}
          >
            <SecureIcon />
            <span>{phoneNumber}</span>
          </a>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Protect Your Family with{" "}
              <span className={styles.heroAccent}>Final Expense Coverage</span>
            </h1>

            <p className={styles.heroText}>
              2 quick questions to see if you qualify — coverage from{" "}
              <strong>$1/day</strong>. No medical exam.
            </p>

            <div className={styles.locationRow}>
              <PinIcon />
              <span>Offers in {locationLabel}</span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          {step === "quiz" ? (
            <>
              <h2 className={styles.cardTitle}>See If You Pre-Qualify</h2>
              <div className={styles.cardSubtext}>
                30 seconds — completely free.
              </div>

              <div className={styles.questionBlock}>
                <h3 className={styles.questionTitle}>1. What is your age range?</h3>
                <div className={styles.answersGrid}>
                  {AGE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionButton} ${
                        age === option ? styles.optionSelected : ""
                      }`}
                      onClick={() => {
                        if (landingKey.includes("-an-")) {
                          trackEngagedInteraction(landingKey, "quiz_age");
                        }
                        setAge(option);
                        trackMetric({
                          landing: landingKey,
                          event: "age_selected",
                          label: option,
                        });
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.questionBlock}>
                <h3 className={styles.questionTitle}>
                  2. Do you currently have life insurance?
                </h3>
                <div className={styles.answersGrid}>
                  {INSURANCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionButton} ${
                        insurance === option ? styles.optionSelected : ""
                      }`}
                      onClick={() => {
                        if (landingKey.includes("-an-")) {
                          trackEngagedInteraction(landingKey, "quiz_insurance");
                        }
                        setInsurance(option);
                        trackMetric({
                          landing: landingKey,
                          event: "insurance_selected",
                          label: option,
                        });
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`${styles.primaryButton} ${
                  canContinue ? styles.primaryEnabled : ""
                }`}
                disabled={!canContinue}
                onClick={() => {
                  trackMetric({
                    landing: landingKey,
                    event: "quiz_submitted",
                  });
                  setStep("checking");
                }}
              >
                Check My Options →
              </button>

              <div className={styles.privacyNote}>
                🔒 Your information is secure and will never be shared.
              </div>
            </>
          ) : null}

          {step === "checking" || step === "checkingComplete" ? (
            <div className={styles.loadingState}>
              <div className={styles.spinnerWrap}>
                <div
                  className={`${styles.loadingBadge} ${
                    step === "checkingComplete"
                      ? styles.loadingBadgeSuccess
                      : styles.loadingBadgeSpin
                  }`}
                >
                  {step === "checkingComplete" ? (
                    <span className={styles.loadingBadgeCheck}>✓</span>
                  ) : null}
                </div>
                <div className={styles.loadingTitleStrong}>
                  Checking If You Qualify...
                </div>
                <div className={styles.loadingTextStrong}>
                  Reviewing basic eligibility for final expense options
                </div>
                <div className={styles.progressTrackWide}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === "searchingAdvisors" || step === "advisorFound" ? (
            <div className={styles.loadingState}>
              <div className={styles.spinnerWrap}>
                <div
                  className={`${styles.loadingBadge} ${
                    step === "advisorFound"
                      ? styles.loadingBadgeSuccess
                      : styles.loadingBadgeSpin
                  }`}
                >
                  {step === "advisorFound" ? (
                    <span className={styles.loadingBadgeCheck}>✓</span>
                  ) : null}
                </div>
                <div className={styles.loadingTitleStrong}>
                  Looking for an Available Advisor...
                </div>
                <div className={styles.loadingTextStrong}>
                  Matching licensed agents for {locationLabel}
                </div>
                <div className={styles.progressTrackWide}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className={styles.advisorSearchCard}>
                  <Image
                    src={ADVISORS[advisorIndex].image}
                    alt={ADVISORS[advisorIndex].name}
                    width={52}
                    height={52}
                    className={styles.advisorThumb}
                  />
                  <div className={styles.advisorSearchMeta}>
                    <div className={styles.advisorSearchName}>
                      {ADVISORS[advisorIndex].name}
                    </div>
                    <div className={styles.advisorSearchExp}>
                      {ADVISORS[advisorIndex].experience}
                    </div>
                    <div className={styles.advisorSearchFamilies}>
                      {ADVISORS[advisorIndex].families}
                    </div>
                  </div>
                </div>

                <div className={styles.advisorStatusLine}>{advisorStatus}</div>
              </div>
            </div>
          ) : null}

          {step === "success" ? (
            <div className={styles.successState}>
              <div className={styles.successPill}>
                <CheckIcon />
                <span>You Pre-Qualify! Great News.</span>
              </div>

              <div className={styles.successTitle}>Your Advisor Is Ready</div>
              <div className={styles.successText}>
                Call now for your <strong>FREE</strong> consultation — no
                obligation.
              </div>

              <div className={styles.advisorReadyCard}>
                <Image
                  src={selectedAdvisor.image}
                  alt={selectedAdvisor.name}
                  width={66}
                  height={66}
                  className={styles.advisorReadyPhoto}
                />
                <div className={styles.advisorReadyMeta}>
                  <div className={styles.advisorReadyName}>
                    {selectedAdvisor.name}
                  </div>
                  <div className={styles.advisorReadyLine}>
                    {selectedAdvisor.experience}
                  </div>
                  <div className={styles.advisorReadyLine}>
                    {selectedAdvisor.families}
                  </div>
                </div>
              </div>

              <a
                href={phoneHref}
                className={styles.callButton}
                  onClick={() => {
                    trackCallCtaClick({
                      landing: landingKey,
                      phone: phoneHref,
                      placement: "final_cta",
                      label: selectedAdvisor.name,
                    });
                    trackMetric({
                      landing: landingKey,
                      event: "call_click",
                      label: selectedAdvisor.name,
                  });
                }}
              >
                <span className={styles.callIconWrap}>
                  <span className={styles.callIconPulse} />
                  <PhoneIcon />
                </span>
                <span>Call {selectedAdvisor.name} at {phoneNumber}</span>
              </a>

              <div className={styles.timerBox}>
                <div className={styles.timerTitle}>
                  Advisor available for: <strong>{countdownLabel}</strong>
                </div>
                <div className={styles.timerBar}>
                  <div
                    className={styles.timerFill}
                    style={{ width: `${(countdown / 109) * 100}%` }}
                  />
                </div>
                <div className={styles.timerHint}>
                  Your spot may be given to the next caller.
                </div>
              </div>

              <div className={styles.benefits}>
                <div className={styles.benefit}>
                  <BenefitShield />
                  <div>Licensed Agents</div>
                </div>
                <div className={styles.benefit}>
                  <BenefitCheck />
                  <div>No Obligation</div>
                </div>
                <div className={styles.benefit}>
                  <PhoneIcon />
                  <div>100% Free Call</div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <footer className={styles.footer}>
          <div>Not a guarantee of coverage. Eligibility subject to carrier approval.</div>
          <div>© 2026 Quiet Legacy. All rights reserved.</div>
        </footer>
      </div>
    </main>
  );
}
