"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AntonyGtm from "../components/antony-gtm";
import styles from "./page.module.css";
import {
  trackCallCtaClick,
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type AgeRange = "50-59" | "60-69" | "70-79" | "80-85";

const LANDING_KEY = "fe7-an-en";
const PHONE_HREF = "tel:+18556685535";
const AGE_OPTIONS: AgeRange[] = ["50-59", "60-69", "70-79", "80-85"];

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

function CheckIcon() {
  return <span className={styles.checkMark}>✓</span>;
}

export default function Fe7Client({
  heroImage,
  deadlineLabel,
}: {
  heroImage: string;
  deadlineLabel: string;
}) {
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);

  useEffect(() => {
    trackLandingView(LANDING_KEY);
  }, []);

  function handleAgeClick(option: AgeRange) {
    setSelectedAge(option);
    trackEngagedInteraction(LANDING_KEY, "quiz_age");
    trackMetric({
      landing: LANDING_KEY,
      event: "age_selected",
      label: option,
    });
  }

  function handleCallClick(placement: string) {
    trackCallCtaClick({
      landing: LANDING_KEY,
      phone: PHONE_HREF,
      placement,
      label: selectedAge ?? undefined,
    });
    trackMetric({
      landing: LANDING_KEY,
      event: "call_click",
      label: placement,
    });
  }

  return (
    <main className={styles.page}>
      <AntonyGtm />

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
            <div className={styles.alertLabel}>
              <span className={styles.alertDot} />
              ALERT
            </div>
            <div className={styles.alertText}>
              Americans over 50 can now qualify for Final Expense coverage
              starting at <b>$1/day</b>. Protect your family from burial costs...
              Program closes <b>{deadlineLabel}</b>
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
            <h1 className={styles.heroTitle}>
              Seniors: You May Qualify for $5,000–$50,000 in Final Expense Coverage
            </h1>
            <p className={styles.heroDeadline}>
              ⚠️ Program closes <span>{deadlineLabel}</span>
            </p>
          </section>

          <section className={styles.formCard}>
            <div className={styles.stepBox}>
              <div className={styles.stepTop}>
                <span className={styles.stepIndex}>1</span>
                <span className={styles.stepLabel}>Step 1 of 2</span>
              </div>
              <p className={styles.questionTitle}>What is your age range?</p>
              <div className={styles.stepProgress}>
                <div className={styles.stepProgressFill} />
              </div>
            </div>

            <div className={styles.optionGrid}>
              {AGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.optionButton} ${
                    selectedAge === option ? styles.optionButtonActive : ""
                  }`}
                  onClick={() => handleAgeClick(option)}
                >
                  <span>{option.replace("-", "–")}</span>
                </button>
              ))}
            </div>
          </section>

          <a
            href={PHONE_HREF}
            className={styles.cta}
            onClick={() => handleCallClick("primary_cta")}
          >
            <span className={styles.ctaPulse} />
            <span className={styles.ctaCopy}>
              <span className={styles.ctaTitle}>📞 Speak With a Licensed Agent</span>
              <span className={styles.ctaSubtitle}>Free consultation • No obligation</span>
            </span>
          </a>

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
                  <CheckIcon />
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
            This is a commercial advertisement for insurance products. Quiet
            Legacy is not a government agency and is not affiliated with Medicare
            or any government program. By calling the number on this page, you
            consent to being contacted by a licensed insurance agent. Coverage
            amounts, premiums, and eligibility vary by state and individual
            circumstances. Not all applicants will qualify. Please consult with a
            licensed agent for details. <a href="#">Privacy Policy</a> |{" "}
            <a href="#">Terms of Service</a>
          </p>
          <div className={styles.footerLinks}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Do Not Call</span>
            <span>Contact Us</span>
          </div>
          <p className={styles.footerCopyright}>
            © 2026 Quiet Legacy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
