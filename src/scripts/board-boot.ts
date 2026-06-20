import gsap from "gsap";

type BoardWindow = Window & {
  gsap?: typeof gsap;
  FLOW_DATA?: unknown;
};

const boardWindow = window as BoardWindow;
boardWindow.gsap = gsap;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

await loadScript("/board/flow-data.js");
await loadScript("/board/operator-board.js");
