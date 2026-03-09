"use client";

import Image from "next/image";
import LandingGtm from "../components/antony-gtm";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  trackCallCtaClick,
  trackLandingView,
  trackMetric,
} from "@/lib/metrics-client";

type OptionValue = "a" | "b" | "c" | "d";

type ChatItem =
  | {
      id: string;
      type: "message";
      sender: "bot" | "user";
      content: string;
      html?: boolean;
    }
  | {
      id: string;
      type: "options";
    }
  | {
      id: string;
      type: "loader";
      content: string;
    }
  | {
      id: string;
      type: "typing";
    }
  | {
      id: string;
      type: "call";
      message: string;
      phoneLabel: string;
      phoneHref: string;
    };

const INTRO_MESSAGES = [
  "Hola👋🏻",
  "Soy María del programa de préstamos para consolidación de deudas.",
  "Para ayudarte a encontrar el préstamo adecuado, ¿cuál es el monto total de tu deuda actual (tarjetas y/o préstamos personales)?",
];

const OPTIONS: ReadonlyArray<{ label: string; value: OptionValue }> = [
  { label: "Menos de $7,000", value: "a" },
  { label: "Más de $7,000", value: "b" },
  { label: "Más de $15,000", value: "c" },
  { label: "Más de $30,000", value: "d" },
];

const SUCCESS_HTML =
  "<strong>✅ ¡Excelente noticia! Estás precalificado para liquidar tu deuda.🙌</strong><br><br>Hemos programado a un experto del programa para finalizar tu aprobación. ¡Esta precalificación es por tiempo limitado!<br><br>Haz clic en el botón de abajo para llamar 📞 antes de que expire tu precalificación y empieza a construir un futuro sin deudas hoy mismo.";

function ShieldIcon() {
  return (
    <svg
      className={styles.topBarIcon}
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

function HandMoneyIcon() {
  return (
    <svg
      className={styles.topBarIcon}
      viewBox="0 -32 576 576"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M271.06,144.3l54.27,14.3a8.59,8.59,0,0,1,6.63,8.1c0,4.6-4.09,8.4-9.12,8.4h-35.6a30,30,0,0,1-11.19-2.2c-5.24-2.2-11.28-1.7-15.3,2l-19,17.5a11.68,11.68,0,0,0-2.25,2.66,11.42,11.42,0,0,0,3.88,15.74,83.77,83.77,0,0,0,34.51,11.5V240c0,8.8,7.83,16,17.37,16h17.37c9.55,0,17.38-7.2,17.38-16V222.4c32.93-3.6,57.84-31,53.5-63-3.15-23-22.46-41.3-46.56-47.7L282.68,97.4a8.59,8.59,0,0,1-6.63-8.1c0-4.6,4.09-8.4,9.12-8.4h35.6A30,30,0,0,1,332,83.1c5.23,2.2,11.28,1.7,15.3-2l19-17.5A11.31,11.31,0,0,0,368.47,61a11.43,11.43,0,0,0-3.84-15.78,83.82,83.82,0,0,0-34.52-11.5V16c0-8.8-7.82-16-17.37-16H295.37C285.82,0,278,7.2,278,16V33.6c-32.89,3.6-57.85,31-53.51,63C227.63,119.6,247,137.9,271.06,144.3ZM565.27,328.1c-11.8-10.7-30.2-10-42.6,0L430.27,402a63.64,63.64,0,0,1-40,14H272a16,16,0,0,1,0-32h78.29c15.9,0,30.71-10.9,33.25-26.6a31.2,31.2,0,0,0,.46-5.46A32,32,0,0,0,352,320H192a117.66,117.66,0,0,0-74.1,26.29L71.4,384H16A16,16,0,0,0,0,400v96a16,16,0,0,0,16,16H372.77a64,64,0,0,0,40-14L564,377a32,32,0,0,0,1.28-48.9Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className={styles.callButtonIcon}
      viewBox="0 0 1200 1200"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M1183.326 997.842l-169.187 167.83c-24.974 25.612-58.077 34.289-90.316 34.328-142.571-4.271-277.333-74.304-387.981-146.215C354.22 921.655 187.574 757.82 82.984 559.832 42.87 476.809-4.198 370.878.299 278.209c.401-34.86 9.795-69.073 34.346-91.543L203.831 17.565c35.132-29.883 69.107-19.551 91.589 15.257l136.111 258.102c14.326 30.577 6.108 63.339-15.266 85.188l-62.332 62.3c-3.848 5.271-6.298 11.271-6.36 17.801 23.902 92.522 96.313 177.799 160.281 236.486 63.967 58.688 132.725 138.198 221.977 157.021 11.032 3.077 24.545 4.158 32.438-3.179l72.51-73.743c24.996-18.945 61.086-28.205 87.771-12.714h1.272l245.51 144.943c35.041 22.592 38.799 66.252 12.994 92.815Z" />
    </svg>
  );
}

export default function DebtReliefUsaPage() {
  const [items, setItems] = useState<ChatItem[]>([
    { id: "initial-loader", type: "loader", content: "Escribiendo..." },
  ]);
  const [optionSelected, setOptionSelected] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    trackLandingView("debt-relief-usa");
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) {
      return;
    }

    body.scrollTop = body.scrollHeight;
  }, [items]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    let cancelled = false;

    async function runFlow() {
      await wait(2000);
      if (cancelled) {
        return;
      }

      setItems([]);

      for (let index = 0; index < INTRO_MESSAGES.length; index += 1) {
        if (cancelled) {
          return;
        }

        setItems((current) => [
          ...current,
          {
            id: `intro-${index}`,
            type: "message",
            sender: "bot",
            content: INTRO_MESSAGES[index],
          },
        ]);

        if (index < INTRO_MESSAGES.length - 1) {
          await wait(1000);
          if (cancelled) {
            return;
          }

          setItems((current) => [...current, { id: `typing-${index}`, type: "typing" }]);

          await wait(1500);
          if (cancelled) {
            return;
          }

          setItems((current) =>
            current.filter((item) => item.id !== `typing-${index}`),
          );
        }
      }

      if (!cancelled) {
        trackMetric({
          landing: "debt-relief-usa",
          event: "options_shown",
        });
        setItems((current) => [...current, { id: "options", type: "options" }]);
      }
    }

    void runFlow();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleOption(value: OptionValue) {
    if (optionSelected) {
      return;
    }

    setOptionSelected(true);
    trackMetric({
      landing: "debt-relief-usa",
      event: "debt_selected",
      label: value,
    });
    const selected = OPTIONS.find((option) => option.value === value);

    setItems((current) => [
      ...current.filter((item) => item.type !== "options"),
      {
        id: `user-${value}`,
        type: "message",
        sender: "user",
        content: selected?.label ?? "",
      },
      {
        id: "eligibility-loader",
        type: "loader",
        content: "Calculando su elegibilidad...",
      },
    ]);

    window.setTimeout(() => {
      setItems((current) => {
        const next = current.filter((item) => item.id !== "eligibility-loader");

        if (value === "a") {
          trackMetric({
            landing: "debt-relief-usa",
            event: "not_qualified",
            label: value,
          });
          return [
            ...next,
            {
              id: "result-decline",
              type: "message",
              sender: "bot",
              content:
                "Lo sentimos, según la información proporcionada, actualmente no califica para nuestro Programa de Liquidación de Deudas. Sin embargo, hay otras opciones disponibles. ¡No dude en contactarnos para explorar alternativas!",
            },
          ];
        }

        trackMetric({
          landing: "debt-relief-usa",
          event: "qualified",
          label: value,
        });

        return [
          ...next,
          {
            id: "result-success",
            type: "call",
            message: SUCCESS_HTML,
            phoneLabel: "Llama ahora: +1 (833) 518-1451",
            phoneHref: "tel:+18335181451",
          },
        ];
      });
    }, 3000);
  }

  return (
    <main className={styles.page}>
      <LandingGtm />
      <div className={styles.topBar}>
        <ShieldIcon />
        <span>
          ¡Más de <strong>12,000 personas</strong> ya redujeron sus deudas! ¡Tu
          alivio financiero empieza aquí!
        </span>
        <HandMoneyIcon />
      </div>

      <section className={styles.header}>
        <Image
          src="/Quiet-legacy-logo-final.png"
          alt="Insurance Icon"
          width={380}
          height={80}
          className={styles.headerLogo}
          priority
        />
        <div className={styles.headline}>
          ¿Tiene deudas de tarjetas de crédito y préstamos personales? Es hora
          de acabar con el estrés. Deje que nuestro programa le ayude a tomar
          el control y recuperar su tranquilidad.
        </div>
        <div className={styles.subtext}>
          Ayudamos a personas con deudas de tarjetas de crédito y préstamos
          personales con préstamos de consolidación que van desde $ 7,000 a $
          50,000 Dolares
        </div>
      </section>

      <section className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <img
              src="/asesora-ventas-6.png"
              alt="Maria"
              className={styles.chatHeaderAvatar}
            />
            Maria
            <span className={styles.chatHeaderStatus}>
              Online <span className={styles.onlineDot} />
            </span>
          </div>

          <div className={styles.chatBody} ref={bodyRef}>
            {items.map((item) => {
              if (item.type === "message") {
                return (
                  <div
                    key={item.id}
                    className={`${styles.message} ${
                      item.sender === "bot" ? styles.bot : styles.user
                    }`}
                    {...(item.html
                      ? {
                          dangerouslySetInnerHTML: { __html: item.content },
                        }
                      : {})}
                  >
                    {!item.html ? item.content : null}
                  </div>
                );
              }

              if (item.type === "options") {
                return (
                  <div key={item.id} className={styles.buttons}>
                    {OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={styles.btnOption}
                        onClick={() => handleOption(option.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleOption(option.value);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                );
              }

              if (item.type === "call") {
                return (
                  <div key={item.id} className={styles.callBlock}>
                    <div
                      className={`${styles.message} ${styles.bot}`}
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                    <a
                      href={item.phoneHref}
                      className={styles.callButton}
                      onClick={() => {
                        trackCallCtaClick({
                          landing: "debt-relief-usa",
                          phone: item.phoneHref,
                          placement: "result_cta",
                          label: item.phoneLabel,
                        });
                        trackMetric({
                          landing: "debt-relief-usa",
                          event: "call_click",
                          label: item.phoneLabel,
                        });
                      }}
                    >
                      <PhoneIcon />
                      {item.phoneLabel}
                    </a>
                  </div>
                );
              }

              if (item.type === "typing") {
                return (
                  <div
                    key={item.id}
                    className={`${styles.message} ${styles.bot} ${styles.typingBubble}`}
                  >
                    <span className={styles.typingIndicator} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                );
              }

              return (
                <div key={item.id} className={styles.loader}>
                  {item.content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          Copyright 2025, Todos los derechos reservados. Este sitio no forma
          parte del sitio web de Facebook™ ni de Facebook™ Inc. Además, este
          sitio NO cuenta con el respaldo de Facebook™ de ninguna manera.
          FACEBOOK™ es una marca registrada de FACEBOOK™, Inc.
        </p>
        <p>
          <a href="#">Términos y Condiciones</a> |<a href="#">Aviso Legal</a> |
          <a href="#">Política de Privacidad</a>
        </p>
      </footer>
    </main>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
