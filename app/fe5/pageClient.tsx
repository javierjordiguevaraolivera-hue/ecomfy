"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import { trackLandingView, trackMetric } from "@/lib/metrics-client";

type Sender = "agent" | "user";
type ControlState = "none" | "welcome" | "age" | "insurance" | "final";
type AgeRange = "45-54" | "55-64" | "65-74" | "75+";
type InsuranceValue = "yes" | "no";

type Message = {
  id: string;
  sender: Sender;
  html: string;
  time: string;
  showAvatar?: boolean;
};

type Choice<T extends string = string> = {
  label: string;
  value: T;
};

const LANDING_KEY = "fe5-an-en";
const PHONE_NUMBER = "(855) 668-5535";
const PHONE_HREF = "tel:+18556685535";

const AGE_CHOICES = [
  { label: "45-54", value: "45-54" },
  { label: "55-64", value: "55-64" },
  { label: "65-74", value: "65-74" },
  { label: "75+", value: "75+" },
] satisfies Choice<AgeRange>[];

const INSURANCE_CHOICES = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
] satisfies Choice<InsuranceValue>[];

const MESSAGE_DELAY_MS = 1200;
const BETWEEN_MESSAGES_MS = 600;

function getTimeString() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function Fe5Client({ locationLabel }: { locationLabel: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [control, setControl] = useState<ControlState>("none");
  const [typing, setTyping] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [footerVisible, setFooterVisible] = useState(false);
  const [ageRange, setAgeRange] = useState<AgeRange>("55-64");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(false);
  const bootedRef = useRef(false);
  const busyRef = useRef(false);

  const introMessages = [
    "Hi there.",
    "I'm <span class='msg-bold'>Megan</span> from <span class='msg-highlight'>Quiet Legacy</span>.",
    `We found licensed final expense options in <span class='msg-bold'>${locationLabel}</span>.`,
    "Want to see if you pre-qualify today for <span class='msg-highlight'>up to $20,000 in final expense coverage</span> with a free call?",
  ];

  useEffect(() => {
    trackLandingView(LANDING_KEY);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeadlineDate(
      `${months[tomorrow.getMonth()]} ${tomorrow.getDate()}, ${tomorrow.getFullYear()}`,
    );

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (bootedRef.current) {
      return;
    }

    bootedRef.current = true;
    let cancelled = false;

    async function boot() {
      await sleep(600);
      if (cancelled || !isMountedRef.current) {
        return;
      }

      await appendAgentBatch(introMessages);
      if (!cancelled && isMountedRef.current) {
        setControl("welcome");
      }
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const body = chatBodyRef.current;
    if (!body) {
      return;
    }

    body.scrollTo({
      top: body.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, control, typing, footerVisible]);

  useEffect(() => {
    if (control !== "final") {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => (current <= 1 ? 120 : current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [control]);

  useEffect(() => {
    if (control === "welcome") {
      trackMetric({
        landing: LANDING_KEY,
        event: "welcome_shown",
      });
    }

    if (control === "final") {
      trackMetric({
        landing: LANDING_KEY,
        event: "prequalified",
      });
    }
  }, [control]);

  async function appendAgentBatch(items: string[]) {
    for (const [index, item] of items.entries()) {
      if (!isMountedRef.current) {
        return;
      }

      setTyping(true);
      await sleep(MESSAGE_DELAY_MS);

      if (!isMountedRef.current) {
        return;
      }

      setTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-${index}-${current.length}`,
          sender: "agent",
          html: item,
          time: getTimeString(),
          showAvatar: index === 0,
        },
      ]);

      if (index < items.length - 1) {
        await sleep(BETWEEN_MESSAGES_MS);
      }
    }
  }

  async function appendUserMessage(label: string) {
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user-${current.length}`,
        sender: "user",
        html: label,
        time: getTimeString(),
      },
    ]);
  }

  async function handleWelcomeStart() {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    trackMetric({
      landing: LANDING_KEY,
      event: "welcome_started",
      label: "yes",
    });
    await appendUserMessage("Yes");
    await appendAgentBatch([
      "Great. First question:",
      "What is your age range?",
    ]);

    if (isMountedRef.current) {
      setControl("age");
    }

    busyRef.current = false;
  }

  async function handleAgeChoice(choice: Choice<AgeRange>) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    setAgeRange(choice.value);
    trackMetric({
      landing: LANDING_KEY,
      event: "age_selected",
      label: choice.value,
    });
    await appendUserMessage(choice.label);
    await appendAgentBatch([
      "Thanks.",
      "Do you currently have life insurance?",
    ]);

    if (isMountedRef.current) {
      setControl("insurance");
    }

    busyRef.current = false;
  }

  async function handleInsuranceChoice(choice: Choice<InsuranceValue>) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    trackMetric({
      landing: LANDING_KEY,
      event: "insurance_selected",
      label: choice.value,
    });
    await appendUserMessage(choice.label);
    await appendAgentBatch([
      "Great news.",
      `Based on your answers, you look <span class='msg-highlight'>pre-qualified</span> for final expense coverage in <span class='msg-bold'>${locationLabel}</span>.`,
      "I reserved a licensed advisor to help you review today's options and pricing.",
      "<span class='msg-bold'>Tap the call button now</span> to receive your free consultation before this spot expires.",
    ]);

    if (isMountedRef.current) {
      setFooterVisible(true);
      setCountdown(120);
      setControl("final");
    }

    busyRef.current = false;
  }

  const countdownLabel = `${Math.floor(countdown / 60)}:${(countdown % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className={styles.page}>
      <section className={styles.chatFullscreen}>
        <div className={styles.mobileHeaderImage}>
          <Image
            src="/hero-family.jpg"
            alt="Final expense coverage"
            width={1400}
            height={900}
            priority
          />
        </div>

        <header className={styles.chatHeader}>
          <div className={styles.headerAvatarWrapper}>
            <Image
              src="/asesora-ventas-5.png"
              alt="Megan"
              width={38}
              height={38}
              className={styles.headerAvatar}
            />
            <span className={styles.headerStatusDot} />
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.headerName}>Megan</div>
            <div className={styles.headerStatus}>
              {!typing ? (
                <span className={styles.statusText}>
                  <span className={styles.statusIndicator} />
                  Online
                </span>
              ) : (
                <span className={styles.typingIndicator}>
                  <span className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </span>
                  <span>typing</span>
                </span>
              )}
            </div>
          </div>

          <div className={styles.headerDeadline}>
            <span className={styles.headerDeadlineLabel}>Window closes</span>
            <span className={styles.headerDeadlineDate}>{deadlineDate}</span>
          </div>
        </header>

        <div className={styles.chatBody} ref={chatBodyRef}>
          <div className={styles.chatMessages}>
            <div className={styles.chatDate}>
              <span>Today</span>
            </div>

            {messages.map((message) => (
              <article
                key={message.id}
                className={`${styles.chatMessage} ${
                  message.sender === "agent" ? styles.agent : styles.user
                }`}
              >
                {message.sender === "agent" ? (
                  message.showAvatar ? (
                    <Image
                      src="/asesora-ventas-5.png"
                      alt="Megan"
                      width={36}
                      height={36}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarSpacer} />
                  )
                ) : null}

                <div className={styles.messageWrapper}>
                  <div
                    className={styles.message}
                    dangerouslySetInnerHTML={{ __html: message.html }}
                  />
                  <div className={styles.messageTime}>{message.time}</div>
                </div>
              </article>
            ))}

            {typing ? (
              <article className={`${styles.chatMessage} ${styles.agent}`}>
                <Image
                  src="/asesora-ventas-5.png"
                  alt="Megan"
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
                <div className={styles.messageWrapper}>
                  <div className={styles.message}>
                    <div className={styles.loadingDots}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </article>
            ) : null}

            {control === "welcome" ? (
              <div className={styles.tooltipWrapper}>
                <button
                  type="button"
                  className={`${styles.baseButton} ${styles.singleCtaButton}`}
                  onClick={() => {
                    void handleWelcomeStart();
                  }}
                >
                  Yes, check now
                </button>
                <button
                  type="button"
                  className={styles.tooltipText}
                  onClick={() => {
                    void handleWelcomeStart();
                  }}
                >
                  Tap here to start
                </button>
              </div>
            ) : null}

            {control === "age" ? (
              <div className={styles.responseButtons}>
                {AGE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handleAgeChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}

            {control === "insurance" ? (
              <div className={styles.responseButtons}>
                {INSURANCE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handleInsuranceChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}

            {control === "final" ? (
              <div className={styles.ctaContainer}>
                <a
                  href={PHONE_HREF}
                  className={styles.ctaButton}
                  onClick={() => {
                    trackMetric({
                      landing: LANDING_KEY,
                      event: "call_click",
                      label: ageRange,
                    });
                  }}
                >
                  <span className={styles.phoneDot} />
                  <span className={styles.ctaButtonText}>
                    <span className={styles.ctaMainText}>{PHONE_NUMBER}</span>
                    <span className={styles.ctaSubText}>
                      Free consultation with a licensed advisor
                    </span>
                  </span>
                  <span className={styles.phoneIcon} aria-hidden="true">
                    {"\u260e"}
                  </span>
                </a>
                <div className={styles.countdownBanner}>
                  Advisor reserved for:{" "}
                  <span className={styles.countdownTimer}>{countdownLabel}</span>
                </div>
              </div>
            ) : null}
          </div>

          <footer
            className={`${styles.complianceFooter} ${
              footerVisible ? "" : styles.hidden
            }`}
          >
            <div className={styles.complianceDisclaimer}>
              Not affiliated with any government agency.
              <br />
              Coverage availability varies by state and insurer.
              <br />
              This site is a marketing lead generation service.
            </div>
            <div className={styles.complianceLinks}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
