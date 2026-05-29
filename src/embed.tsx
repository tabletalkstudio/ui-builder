// Embed entry point — loaded by the bookmarklet.
// Mounts the editor into a shadow-DOM overlay on the host page so styles
// stay isolated and we don't fight the host page's CSS.

import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import appCss from "./App.css?inline";
import overlayCss from "./styles/overlay.css?inline";

const FLAG = "__UI_BUILDER_MOUNTED__";

type Win = Window & {
  [FLAG]?: { host: HTMLElement; root: Root };
};

(function mount() {
  const w = window as unknown as Win;
  if (w[FLAG]) {
    // Already mounted — toggle visibility instead of double-mounting.
    const existing = w[FLAG];
    existing.host.style.display =
      existing.host.style.display === "none" ? "block" : "none";
    return;
  }

  const host = document.createElement("div");
  host.id = "ui-builder-overlay-host";
  host.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:2147483647",
    "display:block",
  ].join(";");
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .ui-builder-shell {
      position: fixed;
      inset: 0;
      background: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #1a1a1a;
      overflow: auto;
    }
    .ui-builder-close {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 10;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #d0d0d0;
      background: #ffffff;
      color: #1a1a1a;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    .ui-builder-close:hover { background: #f5f5f5; }
    ${appCss}
    ${overlayCss}
  `;
  shadow.appendChild(style);

  const shell = document.createElement("div");
  shell.className = "ui-builder-shell";
  shadow.appendChild(shell);

  const closeBtn = document.createElement("button");
  closeBtn.className = "ui-builder-close";
  closeBtn.setAttribute("aria-label", "Close UI Builder");
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => {
    const ctx = w[FLAG];
    if (!ctx) return;
    ctx.root.unmount();
    ctx.host.remove();
    delete w[FLAG];
  };
  shell.appendChild(closeBtn);

  const mountPoint = document.createElement("div");
  mountPoint.style.cssText = "width:100%;min-height:100%;";
  shell.appendChild(mountPoint);

  const root = createRoot(mountPoint);
  root.render(<App />);

  w[FLAG] = { host, root };
})();
