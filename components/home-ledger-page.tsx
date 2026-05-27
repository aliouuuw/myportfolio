"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { useAbout } from "@/components/about-provider";
import { JoinBlock } from "@/components/join-block";
import { SystemsMapSection } from "@/components/systems-map-section";
import { WorkLedger } from "@/components/work-ledger";
import {
  FLAGSHIP_ESSAY_SLUG,
  type WorkLedgerProject,
} from "@/lib/work-ledger-types";

gsap.registerPlugin(ScrollTrigger);

interface HomeLedgerPageProps {
  locale: string;
  projects: WorkLedgerProject[];
  essay: { title: string; summary: string } | null;
}

export function HomeLedgerPage({
  locale,
  projects,
  essay,
}: HomeLedgerPageProps) {
  const t = useTranslations("HomePage.ledger");
  const { openAbout } = useAbout();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".hero-content > *",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          }
        );

        gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }, rootRef);

      return () => ctx.revert();
    }
  }, []);

  const essayHref = `/${locale}/writing/${FLAGSHIP_ESSAY_SLUG}`;
  const contactHref = `/${locale}/contact`;

  return (
    <div ref={rootRef} className="relative flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, var(--color-accent-subtle), transparent)",
          }}
        />

        <div className="page-inner">
          <div className="hero-content max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-tertiary">
              {t("heroEyebrow")}
            </p>

            <h1 className="mb-6 font-sans text-4xl font-medium tracking-tight text-ink-primary sm:text-5xl md:text-6xl">
              {t("heroRole")}
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-ink-secondary">
              {t("heroRoleSoft")}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="btn btn-primary"
              >
                {t("ctaWork")}
              </a>
              <Link href={contactHref} className="btn">
                {t("ctaContact")}
              </Link>
              <button type="button" className="btn" onClick={openAbout}>
                {t("learnMore")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section
        id="work"
        className="section-block border-t border-border"
      >
        <div className="page-inner">
          <header className="section-head reveal-up">
            <span className="label">{t("workEyebrow")}</span>
            <h2 className="heading section-head-title">{t("workTitle")}</h2>
            <p className="section-head-lead">{t("workLead")}</p>
          </header>

          <div className="section-body reveal-up">
            <WorkLedger locale={locale} projects={projects} />
          </div>
        </div>
      </section>

      {/* Systems Map */}
      <SystemsMapSection locale={locale} />

      {/* Join Block */}
      <JoinBlock bookHref={contactHref} />

      {/* Writing */}
      {essay && (
        <section
          id="writing"
          className="section-block border-t border-border"
        >
          <div className="page-inner">
            <header className="section-head reveal-up">
              <span className="label">{t("writingEyebrow")}</span>
              <h2 className="heading section-head-title">{essay.title}</h2>
            </header>
            <div className="reveal-up max-w-2xl">
              <p className="mb-6 leading-relaxed text-ink-secondary">
                {essay.summary}
              </p>
              <Link
                href={essayHref}
                className="inline-flex items-center gap-2 text-sm font-medium text-ink-primary transition-colors hover:text-accent"
              >
                {t("readEssay")}
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section
        id="contact"
        className="section-block border-t border-border"
      >
        <div className="page-inner text-center">
          <div className="reveal-up mx-auto max-w-xl">
            <h2 className="mb-4 font-sans text-2xl font-medium tracking-tight text-ink-primary sm:text-3xl">
              {t("contactTitle")}
            </h2>
            <p className="mb-6 text-ink-secondary">{t("contactNote")}</p>
            <Link href={contactHref} className="btn btn-primary">
              {t("contactCta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
