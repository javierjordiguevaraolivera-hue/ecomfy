"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { trackLandingView, trackMetric } from "@/lib/metrics-client";

type Sender = "agent" | "user";
type Phase = "questionOne" | "questionTwo" | "loading" | "done";

type Message = {
  id: string;
  sender: Sender;
  text: string;
};

type Answer = {
  label: string;
  value: string;
};

const PHONE_NUMBER = "(855) 668-5535";
const PHONE_HREF = "tel:+18556685535";

const QUESTION_ONE: Answer[] = [
  { label: "Age 50 to 64", value: "50-64" },
  { label: "Age 65 to 74", value: "65-74" },
  { label: "Age 75 to 85", value: "75-85" },
  { label: "Age 86+", value: "86-plus" },
];

const QUESTION_TWO: Answer[] = [
  { label: "$5,000 to $10,000", value: "5-10k" },
  { label: "$10,000 to $20,000", value: "10-20k" },
  { label: "$20,000+", value: "20k-plus" },
];

function getDetectedArea() {
  if (typeof window === "undefined") {
    return "your area";
  }

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!zone) {
    return "your area";
  }

  const parts = zone.split("/");
  const city = parts[parts.length - 1]?.replace(/_/g, " ");
  return city || "your area";
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function PhoneGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 1200 1200"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1183.326 997.842l-169.187 167.83c-24.974 25.612-58.077 34.289-90.316 34.328-142.571-4.271-277.333-74.304-387.981-146.215C354.22 921.655 187.574 757.82 82.984 559.832 42.87 476.809-4.198 370.878.299 278.209c.401-34.86 9.795-69.073 34.346-91.543L203.831 17.565c35.132-29.883 69.107-19.551 91.589 15.257l136.111 258.102c14.326 30.577 6.108 63.339-15.266 85.188l-62.332 62.3c-3.848 5.271-6.298 11.271-6.36 17.801 23.902 92.522 96.313 177.799 160.281 236.486 63.967 58.688 132.725 138.198 221.977 157.021 11.032 3.077 24.545 4.158 32.438-3.179l72.51-73.743c24.996-18.945 61.086-28.205 87.771-12.714h1.272l245.51 144.943c35.041 22.592 38.799 66.252 12.994 92.815Z" />
    </svg>
  );
}

export default function FinalExpensePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<Phase>("questionOne");
  const [activeAnswers, setActiveAnswers] = useState<Answer[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [countdown, setCountdown] = useState(120);
  const [started, setStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const detectedArea = useMemo(getDetectedArea, []);

  useEffect(() => {
    trackLandingView("fe1");
  }, []);

  useEffect(() => {
    if (started) {
      return;
    }

    let cancelled = false;
    setStarted(true);

    async function init() {
      await wait(700);
      if (cancelled) {
        return;
      }

      setMessages([
        {
          id: "m1",
          sender: "agent",
          text: "Hi, I can help you check final expense options in about 30 seconds.",
        },
      ]);

      await wait(500);
      if (cancelled) {
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: "m2",
          sender: "agent",
          text: "The call is free and there’s no long form to fill out.",
        },
      ]);

      await wait(450);
      if (cancelled) {
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: "m3",
          sender: "agent",
          text: "First, what age range fits the person needing coverage?",
        },
      ]);
      setIsTyping(false);
      setActiveAnswers(QUESTION_ONE);
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [started]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return;
    }

    body.scrollTop = body.scrollHeight;
  }, [messages, activeAnswers, isTyping, loadingStep, phase]);

  useEffect(() => {
    if (phase !== "done") {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => (current <= 1 ? 120 : current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [phase]);

  useEffect(() => {
    if (loadingStep === 1) {
      trackMetric({
        landing: "fe1",
        event: "loading_started",
      });
    }

    if (loadingStep === 2) {
      trackMetric({
        landing: "fe1",
        event: "advisor_connecting",
      });
    }
  }, [loadingStep]);

  useEffect(() => {
    if (phase === "done") {
      trackMetric({
        landing: "fe1",
        event: "advisor_ready",
      });
    }
  }, [phase]);

  async function handleAnswer(answer: Answer) {
    if (phase === "loading" || phase === "done") {
      return;
    }

    setActiveAnswers([]);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, sender: "user", text: answer.label },
    ]);
    setSelectedAnswers((current) => [...current, answer.value]);
    setIsTyping(true);

    if (phase === "questionOne") {
      trackMetric({
        landing: "fe1",
        event: "question_one_answered",
        label: answer.value,
      });
      await wait(600);
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-agent-q2`,
          sender: "agent",
          text: "About how much final expense coverage are you looking for?",
        },
      ]);
      setIsTyping(false);
      setPhase("questionTwo");
      setActiveAnswers(QUESTION_TWO);
      return;
    }

    trackMetric({
      landing: "fe1",
      event: "question_two_answered",
      label: answer.value,
    });
    setPhase("loading");
    await wait(700);
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-agent-final`,
        sender: "agent",
        text: "Thanks. I’m checking live availability and advisor availability now.",
      },
    ]);
    setIsTyping(false);
    setLoadingStep(1);

    await wait(2200);
    setLoadingStep(2);

    await wait(2100);
    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-agent-ready`,
        sender: "agent",
        text: "You’re pre-qualified to speak with a licensed advisor now.",
      },
    ]);
    setPhase("done");
  }

  const countdownLabel = `${Math.floor(countdown / 60)}:${(countdown % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <a
          href={PHONE_HREF}
          className={styles.topBar}
          onClick={() => {
            trackMetric({
              landing: "fe1",
              event: "header_call_click",
            });
          }}
        >
          <span className={styles.topBarIcon} aria-hidden="true">
            <PhoneGlyph />
          </span>
          <span>{PHONE_NUMBER}</span>
        </a>

        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.logoWrap}>
                  <Image
                    src="/Quiet-legacy-logo-final.png"
                    alt="Brand logo"
                    width={350}
                    height={100}
                    className={styles.logo}
                    priority
                  />
                </div>

                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowIcon}>●</span>
                  FINAL EXPENSE PRE-QUALIFIER
                </div>

                <h1 className={styles.title}>
                  Check final expense options and speak with a{" "}
                  <span className={styles.titleAccent}>live advisor</span>{" "}
                  today.
                </h1>

                <p className={styles.subtitle}>
                  Answer 2 quick questions. If you qualify, you’ll get a direct
                  number to call an available licensed advisor right away.
                </p>

                <div className={styles.trustRow}>
                  <span className={styles.trustPill}>2 quick questions</span>
                  <span className={styles.trustPill}>No forms</span>
                  <span className={styles.trustPill}>Free phone consultation</span>
                </div>

                <div className={styles.heroStats}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Qualification Time</span>
                    <span className={styles.statValue}>~30 seconds</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Consultation</span>
                    <span className={styles.statValue}>100% Free Call</span>
                  </div>
                </div>

                <div className={styles.areaNote}>Detected area: {detectedArea}</div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.heroImageWrap}>
                  <Image
                    src="/gy.webp"
                    alt="Support representative"
                    fill
                    className={styles.heroImage}
                  />
                </div>

                <div className={styles.heroOverlayCard}>
                  <span className={styles.overlayIcon}>☎</span>
                  <div>
                    <span className={styles.overlayTitle}>
                      Speak with a live advisor today
                    </span>
                    <span className={styles.overlayText}>
                      Quick help with burial and final expense options.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.chatCard}>
            <div className={styles.chatHeader}>
              <Image
                src="/asesora-ventas-8.png"
                alt="Advisor"
                width={50}
                height={50}
                className={styles.advisorAvatar}
              />
              <div className={styles.advisorMeta}>
                <span className={styles.advisorName}>Megan, Licensed Advisor</span>
                <span className={styles.advisorStatus}>
                  <span className={styles.headerSignal} />
                  Available now
                </span>
              </div>
            </div>

            <div className={styles.chatBody} ref={bodyRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.sender === "agent"
                      ? styles.messageAgent
                      : styles.messageUser
                  }`}
                >
                  {message.text}
                </div>
              ))}

              {isTyping ? (
                <div
                  className={`${styles.message} ${styles.messageAgent} ${styles.typingBubble}`}
                >
                  <span className={styles.typingDots} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              ) : null}

              {activeAnswers.length > 0 ? (
                <div className={styles.answers}>
                  {activeAnswers.map((answer) => (
                    <button
                      key={answer.value}
                      type="button"
                      className={styles.answerButton}
                      onClick={() => {
                        void handleAnswer(answer);
                      }}
                    >
                      {answer.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {phase === "loading" || phase === "done" ? (
                <div className={styles.statusStack}>
                  <div className={styles.statusCard}>
                    <span className={styles.statusIndex}>1</span>
                    <div>
                      <span className={styles.statusTitle}>
                        Searching best offer based on your information and
                        location
                      </span>
                      <span className={styles.statusText}>
                        Matching available options for your area.
                      </span>
                      {loadingStep >= 1 ? (
                        <span className={styles.statusLive}>
                          <span className={styles.statusPulse} />
                          Best-fit search in progress
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.statusCard}>
                    <span className={styles.statusIndex}>2</span>
                    <div>
                      <span className={styles.statusTitle}>
                        Connecting you with an available advisor
                      </span>
                      <span className={styles.statusText}>
                        Checking live phone availability right now.
                      </span>
                      {loadingStep >= 2 ? (
                        <span className={styles.statusLive}>
                          <span className={styles.statusPulse} />
                          Advisor line reserved
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {phase === "done" ? (
                <div className={styles.callPanel}>
                  <div>
                    <div className={styles.callPanelTitle}>
                      Your advisor is ready. Call now.
                    </div>
                    <div className={styles.callPanelText}>
                      Call now to review final expense options, pricing ranges,
                      and next steps. Your consultation is free and this reserved
                      line disconnects in 2 minutes.
                    </div>
                  </div>

                  <a
                    href={PHONE_HREF}
                    className={styles.callButton}
                    onClick={() => {
                      trackMetric({
                        landing: "fe1",
                        event: "call_click",
                      });
                    }}
                  >
                    <PhoneGlyph />
                    Call {PHONE_NUMBER}
                  </a>

                  <div className={styles.callMeta}>
                    <span className={styles.metaPill}>Free consultation</span>
                    <span className={styles.metaPill}>No obligation</span>
                    <span className={styles.metaPill}>
                      Line reserved for{" "}
                      <strong className={styles.countdownValue}>
                        {countdownLabel}
                      </strong>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
