"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { useAbout } from "@/components/about-provider";
import { SpectralAtmosphere } from "@/components/spectral-atmosphere";
import { SystemsMapSection } from "@/components/systems-map-section";
import { WorkLedger } from "@/components/work-ledger";
import {
  FLAGSHIP_ESSAY_SLUG,
  type WorkLedgerProject,
} from "@/lib/work-ledger-types";

gsap.registerPlugin(ScrollTrigger);

type EssayTeaser = {
  title: string;
  summary: string;
};

interface HomeLedgerPageProps {
  locale: string;
  projects: WorkLedgerProject[];
  essay: EssayTeaser | null;
}

function motionOk(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    const ctx = gsap.context(() => {
      if (motionOk()) {
        gsap.fromTo(
          [".hero-mark", ".hero-cta > *"],
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.06,
          },
        );
      } else {
        gsap.set([".hero-mark", ".hero-cta > *"], {
          opacity: 1,
          y: 0,
        });
      }

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        if (motionOk()) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        } else {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      });
    }, rootRef);

    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(r);
      ctx.revert();
    };
  }, []);

  const essayHref = `/${locale}/writing/${FLAGSHIP_ESSAY_SLUG}`;
  const contactHref = `/${locale}/contact`;

  return (
    <div
      ref={rootRef}
      className="site-ledger relative -mt-14 flex flex-1 flex-col bg-[var(--n-bg)] text-[var(--n-fg)]"
    >
      <div className="relative z-[1] flex flex-1 flex-col">
        <section className="hero-section hero-section--atmosphere section-block pt-28 sm:pt-32">
          <SpectralAtmosphere />
          <div className="page-inner relative z-[1]">
            <p className="hero-mark label">{t("heroEyebrow")}</p>

            <h1 className="hero-mark hero-role">
              {t("heroRole")}
            </h1>

            <p className="hero-mark hero-role-soft" style={{ marginTop: '0.75rem' }}>
              {t("heroRoleSoft")}
            </p>

            <div className="hero-cta">
              <a href="#work" className="btn btn-primary">
                {t("ctaWork")}
                <span aria-hidden>↓</span>
              </a>
              <Link href={contactHref} className="btn">
                {t("ctaContact")}
              </Link>
              <button type="button" className="btn btn-learn-more" onClick={openAbout}>
                {t("learnMore")}
              </button>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="section-block border-t border-[color:var(--n-border)]"
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

        <SystemsMapSection locale={locale} />

        {essay && (
          <section
            id="writing"
            className="section-block border-t border-[color:var(--n-border)]"
          >
            <div className="page-inner">
              <header className="section-head reveal-up">
                <span className="label">{t("writingEyebrow")}</span>
                <h2 className="heading section-head-title">{essay.title}</h2>
              </header>
              <div className="writing-body reveal-up">
                <p className="text-[color:var(--n-fg-secondary)] leading-relaxed max-w-[58ch]">
                  {essay.summary}
                </p>
                <Link
                  href={essayHref}
                  className="link-subtle label-sm mt-4 inline-block"
                >
                  {t("readEssay")}
                  <span aria-hidden> →</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section
          id="contact"
          className="section-block border-t border-[color:var(--n-border)]"
        >
          <div className="page-inner">
            <header className="section-head reveal-up">
              <span className="label">{t("contactEyebrow")}</span>
              <h2 className="heading section-head-title">{t("contactTitle")}</h2>
            </header>
            <div className="contact-body reveal-up">
              <a
                className="contact-email font-sans text-xl font-medium tracking-tight text-[var(--n-fg)] underline-offset-4 hover:underline"
                href="mailto:wadealiou00@gmail.com"
              >
                wadealiou00@gmail.com
              </a>
              <div className="contact-links mt-4 flex flex-wrap gap-4">
                <a
                  className="link-subtle label-sm"
                  href="https://www.linkedin.com/in/aliouuuw"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
                <a
                  className="link-subtle label-sm"
                  href="https://github.com/aliouuuw"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
                <a
                  className="link-subtle label-sm"
                  href="https://wa.me/221777228845"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  WhatsApp
                </a>
              </div>
              <p className="contact-note label-sm mt-4 text-[color:var(--n-fg-muted)]">
                {t("contactNote")}
              </p>
              <Link href={contactHref} className="btn btn-primary mt-6">
                {t("contactCta")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
