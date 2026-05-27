import { setRequestLocale } from "next-intl/server";

import { JoinBlock } from "@/components/join-block";
import { WorkLedger } from "@/components/work-ledger";
import { getWorkLedgerProjects } from "@/lib/work-ledger";

export default async function LedgerPreviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const projects = await getWorkLedgerProjects(locale);

  return (
    <div className="site-ledger relative min-h-screen bg-[var(--n-bg)]">
      <div className="page-inner section-block hero-section--first">
        <header className="section-head">
          <span className="label">Preview</span>
          <h1 className="heading section-head-title">Work ledger</h1>
          <p className="section-head-lead">
            T033–T034 verification route. Remove after homepage migration
            (T035).
          </p>
        </header>
        <WorkLedger locale={locale} projects={projects} />
      </div>
      <JoinBlock contactHref={`/${locale}/contact#contact`} />
    </div>
  );
}
