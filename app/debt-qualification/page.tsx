"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";

type Sender = "agent" | "user";
type ControlState = "none" | "welcome" | "debt" | "payment" | "final";
type DebtRange = "10k-plus" | "7k-to-10k" | "less-than-7k";

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

const LANDING_CONTENT = {
  heroImage: "/gy.webp",
  avatar: "/asesora-ventas-8.png",
  agentName: "María",
  statusOnline: "En línea",
  typingLabel: "escribiendo",
  headerDeadlineLabel: "Programa cierra",
  todayLabel: "Hoy",
  introMessages: [
    "Hola👋",
    "Soy <span class='msg-bold'>María</span> del programa de <span class='msg-highlight'>Alivio Hispano</span>.",
    "¿Quieres saber si calificas para una <span class='msg-highlight'>condonación de deuda de hasta $50,000</span>? Haz click que <span class='msg-bold'>Sí!</span> 😃",
  ],
  welcomeButtonLabel: "Sí ✓",
  welcomeTooltipLabel: "Toca aquí para comenzar",
  debtQuestion: "¿Cuánta deuda tienes aproximadamente?",
  debtChoices: [
    { label: "$10,000 o más", value: "10k-plus" },
    { label: "$7,500 a $10,000", value: "7k-to-10k" },
    { label: "Menos de $7,500", value: "less-than-7k" },
  ] satisfies Choice<DebtRange>[],
  paymentMessages: ["¡Muy bien!", "¿Estás actualmente trabajando? 💼"],
  paymentChoices: [
    { label: "Sí", value: "yes" },
    { label: "No", value: "no" },
  ] satisfies Choice[],
  finalMessages: [
    "🎉 <span class='msg-highlight'>Listo! Estás Precalificado</span> para Saldar tu Deuda. 🙌",
    "He <b>reservado</b> un <b>experto</b> del programa para <b>completar tu aprobación 😃</b>",
    "<b>Haz clic en el botón para llamar</b> 📞 antes de que expire tu precalificación.",
    "Precalificación reservada por: <b><u style='color:red;'>1 minuto</u></b>⏱️ <b>¡Llámanos ahora!</b>",
  ],
  footerDisclaimer:
    "Base limpia para reemplazar con tus propios textos legales, enlaces y datos comerciales.",
  footerEditorNote:
    "Puedes cambiar copy, teléfono, CTA y links directamente en LANDING_CONTENT y CALL_OPTIONS.",
  footerLinks: [
    { label: "Términos", href: "#" },
    { label: "Privacidad", href: "#" },
  ],
};

const CALL_OPTIONS: Record<
  DebtRange,
  { display: string; href: string; note: string }
> = {
  "10k-plus": {
    display: "(888) 690-1362",
    href: "tel:+18886901362",
    note: "Llamada 100% segura y sin costo",
  },
  "7k-to-10k": {
    display: "(619) 558-3111",
    href: "tel:+16195583111",
    note: "Llamada 100% segura y sin costo",
  },
  "less-than-7k": {
    display: "(888) 725-1396",
    href: "tel:+18887251396",
    note: "Llamada 100% segura y sin costo",
  },
};

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

export default function DebtQualificationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [control, setControl] = useState<ControlState>("none");
  const [typing, setTyping] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [footerVisible, setFooterVisible] = useState(false);
  const [debtRange, setDebtRange] = useState<DebtRange>("10k-plus");
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(false);
  const bootedRef = useRef(false);
  const busyRef = useRef(false);

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
      `${tomorrow.getDate()} de ${months[tomorrow.getMonth()]} ${tomorrow.getFullYear()}`,
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

      await appendAgentBatch(LANDING_CONTENT.introMessages);
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
      setCountdown((current) => (current <= 1 ? 60 : current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
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

  async function handleWelcomeStart() {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    await appendUserMessage("Sí");
    await appendAgentBatch([LANDING_CONTENT.debtQuestion]);

    if (isMountedRef.current) {
      setControl("debt");
    }

    busyRef.current = false;
  }

  async function handleDebtChoice(choice: Choice<DebtRange>) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    setDebtRange(choice.value);
    await appendUserMessage(choice.label);
    await appendAgentBatch(LANDING_CONTENT.paymentMessages);

    if (isMountedRef.current) {
      setControl("payment");
    }

    busyRef.current = false;
  }

  async function handlePaymentChoice(choice: Choice) {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    setControl("none");
    await appendUserMessage(choice.label);
    await appendAgentBatch(LANDING_CONTENT.finalMessages);

    if (isMountedRef.current) {
      setFooterVisible(true);
      setCountdown(60);
      setControl("final");
    }

    busyRef.current = false;
  }

  const countdownLabel = `${Math.floor(countdown / 60)}:${(countdown % 60)
    .toString()
    .padStart(2, "0")}`;
  const callOption = CALL_OPTIONS[debtRange];

  return (
    <main className={styles.page}>
      <section className={styles.chatFullscreen}>
        <div className={styles.mobileHeaderImage}>
          <Image
            src={LANDING_CONTENT.heroImage}
            alt="Header"
            width={1400}
            height={760}
            priority
          />
        </div>

        <header className={styles.chatHeader}>
          <div className={styles.headerAvatarWrapper}>
            <Image
              src={LANDING_CONTENT.avatar}
              alt={LANDING_CONTENT.agentName}
              width={38}
              height={38}
              className={styles.headerAvatar}
            />
            <span className={styles.headerStatusDot} />
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.headerName}>{LANDING_CONTENT.agentName}</div>
            <div className={styles.headerStatus}>
              {!typing ? (
                <span className={styles.statusText}>
                  <span className={styles.statusIndicator} />
                  {LANDING_CONTENT.statusOnline}
                </span>
              ) : (
                <span className={styles.typingIndicator}>
                  <span className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </span>
                  <span>{LANDING_CONTENT.typingLabel}</span>
                </span>
              )}
            </div>
          </div>

          <div className={styles.headerDeadline}>
            <span className={styles.headerDeadlineLabel}>
              {LANDING_CONTENT.headerDeadlineLabel}
            </span>
            <span className={styles.headerDeadlineDate}>{deadlineDate}</span>
          </div>
        </header>

        <div className={styles.chatBody} ref={chatBodyRef}>
          <div className={styles.chatMessages}>
            <div className={styles.chatDate}>
              <span>{LANDING_CONTENT.todayLabel}</span>
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
                      src={LANDING_CONTENT.avatar}
                      alt={LANDING_CONTENT.agentName}
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
                  src={LANDING_CONTENT.avatar}
                  alt={LANDING_CONTENT.agentName}
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
                  {LANDING_CONTENT.welcomeButtonLabel}
                </button>
                <button
                  type="button"
                  className={styles.tooltipText}
                  onClick={() => {
                    void handleWelcomeStart();
                  }}
                >
                  👆 {LANDING_CONTENT.welcomeTooltipLabel}
                </button>
              </div>
            ) : null}

            {control === "debt" ? (
              <div className={`${styles.responseButtons} ${styles.singleColumn}`}>
                {LANDING_CONTENT.debtChoices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handleDebtChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}

            {control === "payment" ? (
              <div className={styles.responseButtons}>
                {LANDING_CONTENT.paymentChoices.map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    className={styles.responseButton}
                    onClick={() => {
                      void handlePaymentChoice(choice);
                    }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            ) : null}

            {control === "final" ? (
              <div className={styles.ctaContainer}>
                <a href={callOption.href} className={styles.ctaButton}>
                  <span className={styles.phoneDot} />
                  <span className={styles.ctaButtonText}>
                    <span className={styles.ctaMainText}>{callOption.display}</span>
                    <span className={styles.ctaSubText}>{callOption.note}</span>
                  </span>
                  <span className={styles.phoneIcon} aria-hidden="true">
                    ☎
                  </span>
                </a>
                <div className={styles.countdownBanner}>
                  Precalificación reservada por:{" "}
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
              {LANDING_CONTENT.footerDisclaimer}
              <br />
              {LANDING_CONTENT.footerEditorNote}
            </div>
            <div className={styles.complianceLinks}>
              {LANDING_CONTENT.footerLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
