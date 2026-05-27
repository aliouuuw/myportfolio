"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOCK_COPY, WORK_LEDGER_META } from "./_components/mock-config";
import { MockChrome } from "./_components/mock-chrome";
import { WorkLedger } from "./_components/work-ledger";
import { JoinBlock } from "./_components/join-block";
import { SpectralAtmosphere } from "./_components/spectral-atmosphere";
import { KeyboardHints } from "./_components/keyboard-hints";
import { getMockScroller } from "./_components/use-mock-scroller";

import "./neo-futuristic.css";

gsap.registerPlugin(ScrollTrigger);

const workEntries = MOCK_COPY.cases.map((project) => ({
  ...project,
  meta: WORK_LEDGER_META[project.id] ?? {
    tags: [],
    outcome: project.domain,
    stack: "—",
  },
}));

function motionOk(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function StudioMockPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = getMockScroller();
    const ctx = gsap.context(() => {
      if (motionOk()) {
        gsap.fromTo(
          [".hero-mark", ".hero-role", ".hero-cta > *"],
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
        gsap.set([".hero-mark", ".hero-role", ".hero-cta > *"], { opacity: 1, y: 0 });
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
                scroller,
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

      gsap.utils
        .toArray<HTMLElement>(".progress-fill[data-target]")
        .forEach((el) => {
          const target = el.dataset.target ?? "0";
          gsap.fromTo(
            el,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: motionOk() ? 0.9 : 0,
              ease: "power3.out",
              scrollTrigger: {
                scroller,
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            },
          );
        });
    }, rootRef);

    const r = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(r);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="neo-mock">
      <SpectralAtmosphere />
      <MockChrome />

      <main className="neo-mock-main">
        <section className="hero-section section-block hero-section--first">
          <div className="page-inner">
            <p className="hero-mark hero-eyebrow label">
              <span className="status-dot active" aria-hidden />
              <span>{MOCK_COPY.role} · Dakar</span>
            </p>

            <h1 className="hero-mark hero-display">
              <span className="hero-display-name">Aliou Wade.</span>
            </h1>

            <p className="hero-role">
              Operational systems for fintech and ops-heavy teams.{" "}
              <span className="hero-role-soft">
                Internal tools, CRMs, and customer surfaces, owned end to end.
              </span>
            </p>

            <div className="hero-cta">
              <a href="#work" className="btn btn-primary">
                See selected work
                <span aria-hidden>↓</span>
              </a>
              <a href="#contact" className="btn">Start a project</a>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="section-block border-t border-[color:var(--n-border)]"
        >
          <div className="page-inner">
            <header className="section-head reveal-up">
              <span className="label">01 / Work</span>
              <h2 className="heading section-head-title">Three systems that shipped.</h2>
              <p className="section-head-lead">
                Expand a row for proof, stack, and the full case study.
              </p>
            </header>

            <div className="section-body reveal-up">
              <WorkLedger projects={workEntries} />
            </div>
          </div>
        </section>

        <JoinBlock />

        <section
          id="writing"
          className="section-block border-t border-[color:var(--n-border)]"
        >
          <div className="page-inner">
            <header className="section-head reveal-up">
              <span className="label">03 / Writing</span>
              <h2 className="heading section-head-title">
                Why I stopped building BocalBun as a framework.
              </h2>
            </header>
            <div className="writing-body reveal-up">
              <p className="text-[color:var(--n-fg-secondary)] leading-relaxed max-w-[58ch]">
                A retrospective on sunk cost, architectural ambition, and the
                &ldquo;who is waiting?&rdquo; filter behind every system I ship now.
              </p>
              <a href="#" className="link label-sm writing-link">
                Read essay
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section-block border-t border-[color:var(--n-border)]"
        >
          <div className="page-inner about-grid">
            <header className="section-head reveal-up">
              <span className="label">04 / About</span>
            </header>
            <div className="about-copy reveal-up">
              <h2 className="heading section-head-title">
                I build software the way I read finance: as an operator.
              </h2>
              <p className="about-text">
                Senior technical operator at Everest Finance, consolidating web,
                internal CRM, and the Sama Naffa customer app. Previously acceptance
                testing infrastructure for Odoo 18 at ERGOBIT.
              </p>
              <p className="about-meta label-sm">
                Dakar · French & English · Open Q3 2026
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section-block border-t border-[color:var(--n-border)]"
        >
          <div className="page-inner">
            <header className="section-head reveal-up">
              <span className="label">05 / Contact</span>
              <h2 className="heading section-head-title contact-title">
                What is broken operationally?
              </h2>
            </header>
            <div className="contact-body reveal-up">
              <a className="link contact-email" href="mailto:hello@aliouwade.com">
                hello@aliouwade.com
              </a>
              <div className="contact-links">
                <a className="link label-sm" href="#">LinkedIn</a>
                <a className="link label-sm" href="#">GitHub</a>
                <a className="link label-sm" href="#">WhatsApp</a>
              </div>
              <p className="contact-note label-sm text-[color:var(--n-fg-muted)]">
                Replies within 48 hours, Mon–Fri.
              </p>
            </div>
          </div>
        </section>

        <KeyboardHints />

        <footer className="section-block site-footer border-t border-[color:var(--n-border)]">
          <div className="page-inner site-footer-inner">
            <p className="label">Aliou Wade · Dakar</p>
            <p className="label text-[color:var(--n-fg-muted)]">Preview mock</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
