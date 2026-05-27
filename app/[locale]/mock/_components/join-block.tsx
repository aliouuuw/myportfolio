"use client";

import { useState } from "react";

interface OpenProject {
  id: string;
  name: string;
  domain: string;
  progress: number;
  seats: number;
  blurb: string;
}

const OPEN_PROJECTS: OpenProject[] = [
  {
    id: "everest-consolidation",
    name: "Everest internal CRM",
    domain: "Fintech operations",
    progress: 62,
    seats: 1,
    blurb: "CRM and customer surfaces in one stack. Need a TypeScript collaborator on data modelling.",
  },
  {
    id: "odoo-toolkit-v2",
    name: "Odoo Testing Toolkit v2",
    domain: "Open source · ERP",
    progress: 28,
    seats: 2,
    blurb: "Robot Framework coverage for Odoo 18 inventory and accounting flows.",
  },
];

export function JoinBlock() {
  const [requested, setRequested] = useState<Record<string, boolean>>({});

  return (
    <section id="join" className="section-block border-t border-[color:var(--n-border)]">
      <div className="page-inner">
        <header className="section-head reveal-up">
          <span className="label">02 / Open</span>
          <h2 className="heading section-head-title">Collaborate or follow along.</h2>
          <p className="section-head-lead">
            Hire for a focused engagement, or request a seat on a project I am building in public.
          </p>
        </header>

        <div className="join-list reveal-up">
          {OPEN_PROJECTS.map((p) => (
            <article key={p.id} className="join-entry">
              <div className="join-entry-head">
                <h3 className="heading text-lg md:text-xl">{p.name}</h3>
                <span className="label">
                  {p.seats} seat{p.seats > 1 ? "s" : ""} · {p.domain}
                </span>
              </div>
              <p className="join-entry-blurb">{p.blurb}</p>

              <div className="join-entry-foot">
                <div className="progress join-progress">
                  <div className="progress-fill" data-target={String(p.progress)} />
                </div>
                <span className="label-sm text-[color:var(--n-fg-muted)]">{p.progress}%</span>
                <button
                  type="button"
                  onClick={() => setRequested((r) => ({ ...r, [p.id]: true }))}
                  className="btn join-request"
                  disabled={requested[p.id]}
                >
                  {requested[p.id] ? "Request sent" : "Request seat"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="section-foot reveal-up">
          <a href="#contact" className="btn btn-primary">
            Book an engagement
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
