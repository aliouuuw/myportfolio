/**
 * ThemeInitScript — synchronous, render-blocking script that resolves the
 * user's theme from localStorage (or system preference) and applies it to
 * <html data-theme="..."> *before* the rest of the body renders.
 *
 * This is the standard "no-flash" pattern. The script must:
 *   1. Run synchronously (not deferred / async)
 *   2. Be the first thing the browser parses inside <body>
 *   3. Set the attribute on documentElement so CSS variables resolve correctly
 *
 * The exact same string is rendered on server and client, so there is no
 * hydration mismatch (the <script> element's text content is identical).
 */
const themeInitCode = `(function(){try{var s=localStorage.getItem('theme');var t=(s==='dark'||s==='light')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export function ThemeInitScript() {
  return (
    <script dangerouslySetInnerHTML={{ __html: themeInitCode }} />
  );
}
