import { getTranslations } from "next-intl/server";

import { ScrambleText } from "@/components/scramble-text";
import { SYNTHESIS_FREELANCE } from "@/lib/synthesis-data";

export async function WorkFreelanceList() {
  const t = await getTranslations("WorkPage");
  const tClients = await getTranslations("HomePage.synthesis.workedWith");

  return (
    <section className="mt-16 border-t border-syn-border pt-14">
      <header className="mb-8 max-w-2xl">
        <p className="mono-eyebrow">{t("clientsEyebrow")}</p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight text-syn-ink-strong">
          {t("clientsTitle")}
        </h2>
        <p className="mt-3 text-sm text-syn-ink-secondary leading-relaxed">
          {t("clientsLead")}
        </p>
      </header>
      <ul className="flex flex-col gap-3">
        {SYNTHESIS_FREELANCE.map((project) => (
            <li
              key={project.key}
              className="syn-entity-card flex flex-col gap-2 p-5 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div>
                <p className="font-medium text-syn-ink-strong">
                  {tClients(`clients.${project.key}.name`)}
                </p>
                <p className="mt-1.5 text-sm text-syn-ink-secondary leading-relaxed max-w-2xl">
                  {tClients(`clients.${project.key}.scope`)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:pl-6">
                {project.note ? (
                  <span className="mono text-[10px] uppercase tracking-widest text-amber-400/80">
                    {tClients("conceptBadge")}
                  </span>
                ) : null}
                <span className="mono text-[10px] uppercase tracking-widest text-syn-ink-faint">
                  <ScrambleText text={tClients(`clients.${project.key}.domain`)} trigger="hover" />
                </span>
              </div>
            </li>
        ))}
      </ul>
    </section>
  );
}
