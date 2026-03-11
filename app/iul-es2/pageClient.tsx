"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  trackEngagedInteraction,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type Sender = "agent" | "user";
type ControlState = "none" | "benefit" | "coverage" | "age" | "name" | "final";
type AgeRange = "50-59" | "60-69" | "70-79" | "80-85";
type BenefitValue = "si" | "no";
type CoverageValue = "$200,000" | "$350,000" | "$500,000" | "$950,000";

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

const LANDING_KEY = "iul-es2";
const CLAIM_URL = "https://www.quotify.us/";
const MESSAGE_DELAY_MS = 1100;
const BETWEEN_MESSAGES_MS = 500;

const BENEFIT_CHOICES = [
  { label: "Si", value: "si" },
  { label: "No", value: "no" },
] satisfies Choice<BenefitValue>[];

const COVERAGE_CHOICES = [
  { label: "$200,000", value: "$200,000" },
  { label: "$350,000", value: "$350,000" },
  { label: "$500,000", value: "$500,000" },
  { label: "$950,000", value: "$950,000" },
] satisfies Choice<CoverageValue>[];

const AGE_CHOICES = [
  { label: "50-59", value: "50-59" },
  { label: "60-69", value: "60-69" },
  { label: "70-79", value: "70-79" },
  { label: "80-85", value: "80-85" },
] satisfies Choice<AgeRange>[];

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
      className={styles.claimIcon}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

export default function IulEs2Client({ locationLabel }: { locationLabel: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [control, setControl] = useState<ControlState>("none");
  const [typing, setTyping] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const [footerVisible, setFooterVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("60-69");
  const [coverageValue, setCoverageValue] = useState<CoverageValue>("$350,000");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(false);
  const bootedRef = useRef(false);
  const busyRef = useRef(false);

  const introMessages = [
    "Hola, soy <span class='msg-bold'>Megan</span> del equipo de <span class='msg-highlight'>IUL Life</span>.",
    `Encontramos opciones de <span class='msg-highlight'>Seguro IUL</span> disponibles en <span class='msg-bold'>${locationLabel}</span>.`,
  ];

  useEffect(() => {
    trackLandingView(LANDING_KEY);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeadlineDate(
      `${tomorrow.getDate()} ${months[tomorrow.getMonth()]} ${tomorrow.getFullYear()}`,
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
      await sleep(500);
      if (cancelled || !isMountedRef.current) {
        return;
      }

      await appendAgentBatch(introMessages);
      await appendAgentBatch(["Ya reclamaste tu beneficio IUL?"]);

      if (!cancelled && isMountedRef.current) {
        setControl("benefit");
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

    setRedirectCountdown(4);
    const countdownTimer = window.setInterval(() => {
      setRedirectCountdown((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    const redirectTimer = window.setTimeout(() => {
      window.location.href = CLAIM_URL;
    }, 4000);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(redirectTimer);
    };
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

  async function handleBenefitChoice(choice: Choice<BenefitValue>) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    trackEngagedInteraction(LANDING_KEY, "chat_benefit");
    trackMetric({ landing: LANDING_KEY, event: "benefit_selected", label: choice.value });
    await appendUserMessage(choice.label);
    await appendAgentBatch(["Perfecto.", "Cuanto quieres recibir?"]);

    if (isMountedRef.current) {
      setControl("coverage");
    }

    busyRef.current = false;
  }

  async function handleCoverageChoice(choice: Choice<CoverageValue>) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    setCoverageValue(choice.value);
    trackEngagedInteraction(LANDING_KEY, "chat_amount");
    trackMetric({ landing: LANDING_KEY, event: "coverage_selected", label: choice.value });
    await appendUserMessage(choice.label);
    await appendAgentBatch(["Ahora una mas.", "Selecciona tu rango de edad."]);

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
    trackEngagedInteraction(LANDING_KEY, "chat_age");
    trackMetric({ landing: LANDING_KEY, event: "age_selected", label: choice.value });
    await appendUserMessage(choice.label);
    await appendAgentBatch(["Ultimo paso.", "Ingresa tu nombre."]);

    if (isMountedRef.current) {
      setControl("name");
    }

    busyRef.current = false;
  }

  async function handleNameSubmit() {
    const trimmedName = fullName.trim();
    if (!trimmedName || busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    trackEngagedInteraction(LANDING_KEY, "chat_name");
    trackMetric({ landing: LANDING_KEY, event: "name_submitted", label: trimmedName });
    await appendUserMessage(trimmedName);
    await appendAgentBatch([
      "Perfecto.",
      `Estamos calificando tu caso para opciones IUL en <span class='msg-bold'>${locationLabel}</span>.`,
      `Felicitaciones <span class='msg-highlight'>${trimmedName}</span>. Tu solicitud fue aprobada.`,
      "Tu numero de calificacion es <span class='msg-bold'>#IUL09028Y3</span>.",
      "Pulsa el boton para reclamar tu beneficio ahora.",
    ]);

    if (isMountedRef.current) {
      setFooterVisible(true);
      setControl("final");
    }

    busyRef.current = false;
  }

  function handleClaimClick() {
    trackMetric({
      landing: LANDING_KEY,
      event: "claim_click",
      label: `${coverageValue}-${ageRange}`,
    });
    window.location.href = CLAIM_URL;
  }

  return (
    <main className={styles.page}>
      <section className={styles.chatFullscreen}>
        <div className={styles.mobileHeaderImage}>
          <Image
            src="/marta-cheque.png"
            alt="Beneficio IUL"
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
                  En linea
                </span>
              ) : (
                <span className={styles.typingIndicator}>
                  <span className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </span>
                  <span>escribiendo</span>
                </span>
              )}
            </div>
          </div>

          <div className={styles.headerDeadline}>
            <span className={styles.headerDeadlineLabel}>Programa cierra</span>
            <span className={styles.headerDeadlineDate}>{deadlineDate}</span>
          </div>
        </header>

        <div className={styles.chatBody} ref={chatBodyRef}>
          <div className={styles.chatMessages}>
            <div className={styles.chatDate}>
              <span>Hoy</span>
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

            {control === "benefit" ? (
              <div className={styles.responseButtons}>
                {BENEFIT_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handleBenefitChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}

            {control === "coverage" ? (
              <div className={styles.responseButtons}>
                {COVERAGE_CHOICES.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handleCoverageChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
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

            {control === "name" ? (
              <div className={styles.nameFormCard}>
                <label htmlFor="iul-es2-name" className={styles.nameLabel}>
                  Tu nombre
                </label>
                <input
                  id="iul-es2-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={styles.nameInput}
                  placeholder="Escribe tu nombre"
                />
                <button
                  type="button"
                  className={`${styles.baseButton} ${styles.nameSubmitButton}`}
                  onClick={() => {
                    void handleNameSubmit();
                  }}
                >
                  Continuar
                </button>
              </div>
            ) : null}

            {control === "final" ? (
              <div className={styles.ctaContainer}>
                <button type="button" className={styles.ctaButton} onClick={handleClaimClick}>
                  <span className={styles.phoneDot} />
                  <span className={styles.ctaButtonText}>
                    <span className={styles.ctaMainText}>Reclamar Beneficio</span>
                    <span className={styles.ctaSubText}>
                      Completa tu solicitud en Quotify
                    </span>
                  </span>
                  <span className={styles.claimIconWrap} aria-hidden="true">
                    <ClaimIcon />
                  </span>
                </button>
                <div className={styles.countdownBanner}>
                  Redirigiendo automaticamente en{" "}
                  <span className={styles.countdownTimer}>{redirectCountdown}s</span>
                </div>
              </div>
            ) : null}
          </div>

          <footer
            className={`${styles.complianceFooter} ${footerVisible ? "" : styles.hidden}`}
          >
            <div className={styles.complianceDisclaimer}>
              No afiliado con ninguna agencia gubernamental.
              <br />
              La disponibilidad varia segun estado y aseguradora.
              <br />
              Este sitio es un servicio de generacion de leads.
            </div>
            <div className={styles.complianceLinks}>
              <a href="#">Terminos</a>
              <a href="#">Privacidad</a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
