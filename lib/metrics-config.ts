export const FUNNEL_CONFIG = {
  "debt-qualification": {
    title: "Debt Qualification",
    language: "Español",
    steps: [
      { event: "landing_view", label: "Landing View" },
      { event: "welcome_started", label: "Started Chat" },
      { event: "debt_selected", label: "Selected Debt Amount" },
      { event: "employment_selected", label: "Selected Employment" },
      { event: "prequalified", label: "Reached Call Screen" },
      { event: "call_click", label: "Clicked Call" },
    ],
  },
  "debt-relief-usa": {
    title: "Debt Relief USA",
    language: "Español",
    steps: [
      { event: "landing_view", label: "Landing View" },
      { event: "options_shown", label: "Saw Debt Options" },
      { event: "debt_selected", label: "Selected Debt Range" },
      { event: "qualified", label: "Reached Qualified Result" },
      { event: "call_click", label: "Clicked Call" },
    ],
  },
  "fe3-an-en": {
    title: "FE3 AN EN",
    language: "English",
    steps: [
      { event: "landing_view", label: "Landing View" },
      { event: "age_selected", label: "Selected Age" },
      { event: "insurance_selected", label: "Selected Insurance" },
      { event: "quiz_submitted", label: "Submitted Quiz" },
      { event: "qualification_checked", label: "Passed Qualification Check" },
      { event: "advisor_ready", label: "Reached Advisor Ready" },
      { event: "call_click", label: "Clicked Final Call" },
    ],
  },
  "fe4-an-en": {
    title: "FE4 AN EN",
    language: "English",
    steps: [
      { event: "landing_view", label: "Landing View" },
      { event: "age_selected", label: "Selected Age" },
      { event: "insurance_selected", label: "Selected Insurance" },
      { event: "quiz_submitted", label: "Submitted Quiz" },
      { event: "qualification_checked", label: "Passed Qualification Check" },
      { event: "advisor_ready", label: "Reached Advisor Ready" },
      { event: "call_click", label: "Clicked Final Call" },
    ],
  },
} as const;
