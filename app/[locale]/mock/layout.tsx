import type { ReactNode } from "react";

import "./mock-shell.css";

type MockLayoutProps = {
  children: ReactNode;
};

/** Full-viewport preview shell — sits above site chrome (TopNav, Footer). */
export default function MockLayout({ children }: MockLayoutProps) {
  return (
    <div id="mock-shell" className="mock-shell fixed inset-0 z-[200] overflow-y-auto bg-canvas text-ink-primary">
      {children}
    </div>
  );
}
