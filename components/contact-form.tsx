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
  const [website, setWebsite] = useState("");
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
      if (res.ok) setFormState("success");
      else setFormState("error");
    } catch {
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="card">
        <p className="text-[16px] font-medium text-ink-primary mb-2">
          {t.successTitle}
        </p>
        <p className="text-[14px] text-ink-secondary leading-relaxed">
          {t.successBody}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-[15px] font-medium text-ink-primary mb-5">
        {t.formTitle}
      </h2>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div
          style={{ position: "absolute", opacity: 0, height: 0, width: 0, overflow: "hidden" }}
          aria-hidden
        >
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
          <label htmlFor="contact-name" className="field-label">
            {t.name}
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="field-input"
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="field-label">
            {t.emailLabel}
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="field-input"
            disabled={formState === "submitting"}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="field-label">
            {t.message}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
            className="field-textarea"
            disabled={formState === "submitting"}
          />
        </div>

        {validationError && (
          <p className="text-[13px] text-error">
            {validationError}
          </p>
        )}
        {formState === "error" && (
          <p className="text-[13px] text-error">{t.errorBody}</p>
        )}

        <button
          type="submit"
          disabled={formState === "submitting"}
          className="btn btn-primary self-start mt-2"
        >
          {formState === "submitting" ? t.submitting : t.submit}
          <span aria-hidden>→</span>
        </button>
      </form>
    </div>
  );
}
