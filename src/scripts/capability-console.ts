/** Engagement Console — master-detail panel switching.
 *  Progressive enhancement: without JS, all dossiers are visible.
 *  With JS, only the first is shown and the rail controls navigation.
 */
export function initEngagementConsole(): void {
  const console = document.getElementById("engagement-console");
  if (!console) return;

  const caps = Array.from(console.querySelectorAll<HTMLButtonElement>(".lp-console-cap"));
  const dossiers = Array.from(console.querySelectorAll<HTMLElement>(".lp-dossier"));
  if (caps.length === 0 || dossiers.length === 0) return;

  // Hide all dossiers except the first (progressive enhancement)
  dossiers.forEach((d, i) => {
    d.hidden = i !== 0;
  });

  caps.forEach((cap, i) => {
    if (i === 0) {
      cap.classList.add("is-active");
      cap.setAttribute("aria-expanded", "true");
    }

    cap.addEventListener("click", () => {
      const target = cap.getAttribute("data-eng");
      if (!target) return;

      caps.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-expanded", "false");
      });
      cap.classList.add("is-active");
      cap.setAttribute("aria-expanded", "true");

      dossiers.forEach((d) => {
        d.hidden = d.id !== `dossier-${target}`;
      });
    });
  });
}
