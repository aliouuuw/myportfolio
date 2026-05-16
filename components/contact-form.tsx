"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

interface ContactFormTranslations {
  formTitle: string;
  name: string;
  emailLabel: string;
  message: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorBody: string;
  validation: {
    nameRequired: string;
    emailRequired: string;
    messageRequired: string;
  };
}

interface ContactFormProps {
  translations: ContactFormTranslations;
}

export function ContactForm({ translations: t }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot field
  const [formState, setFormState] = useState<FormState>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return t.validation.nameRequired;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return t.validation.emailRequired;
    if (!message.trim()) return t.validation.messageRequired;
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot: if filled, silently succeed without sending
    if (website.trim()) {
      setFormState("success");
      return;
    }

    const error = validate();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 bg-canvas border border-border rounded text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:border-border-strong transition-colors";
  const labelClass = "block text-xs font-medium text-ink-tertiary mb-1.5 uppercase tracking-wide";

  if (formState === "success") {
    return (
      <div className="border border-border rounded p-8 bg-canvas-elevated">
        <p className="text-sm font-medium text-ink-primary mb-1">{t.successTitle}</p>
        <p className="text-sm text-ink-secondary">{t.successBody}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-medium text-ink-primary mb-6">{t.formTitle}</h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Honeypot field - hidden from humans, visible to bots */}
        <div style={{ position: "absolute", opacity: 0, height: 0, width: 0, overflow: "hidden" }}>
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t.name}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className={inputClass}
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t.emailLabel}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className={inputClass}
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {t.message}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            className={`${inputClass} resize-none`}
            disabled={formState === "submitting"}
          />
        </div>

        {validationError && (
          <p className="text-xs text-[var(--color-error)]">{validationError}</p>
        )}

        {formState === "error" && (
          <p className="text-xs text-[var(--color-error)]">{t.errorBody}</p>
        )}

        <button
          type="submit"
          disabled={formState === "submitting"}
          className="self-start inline-flex items-center justify-center h-10 px-8 rounded bg-ink-primary text-canvas text-sm font-medium transition-colors hover:bg-ink-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formState === "submitting" ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
