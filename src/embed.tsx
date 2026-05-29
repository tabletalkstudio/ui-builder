// Embed entry — the bookmarklet payload.
// Mounts a right-side sidebar (shadow-DOM isolated) and installs host page
// integration so the user can click any <img> on the host page to enter
// in-place editing mode.

import { createRoot, type Root } from "react-dom/client";
import { useEffect, useRef } from "react";
import {
  EmbedProvider,
  useEmbedDispatch,
  type Selection,
} from "./state.embed";
import {
  installHostPageIntegration,
  type HostPageController,
} from "./embed/HostPageController";
import { Sidebar } from "./embed/Sidebar";
import { EmbedControlPanel } from "./components/EmbedControlPanel";
import { HostImageEditor } from "./components/HostImageEditor";
import sidebarCss from "./embed/sidebar.css?inline";

const FLAG = "__UI_BUILDER_MOUNTED__";

type Win = Window & {
  [FLAG]?: { host: HTMLElement; root: Root; controller: HostPageController };
};

function EmbedApp({ controller }: { controller: HostPageController }) {
  const dispatch = useEmbedDispatch();
  const selectionRef = useRef<Selection | null>(null);

  // Wire host-page picks → state
  useEffect(() => {
    const handler = (img: HTMLImageElement) => {
      // If we have a prior selection, unwrap it first
      if (selectionRef.current) {
        controller.unwrapSelection(selectionRef.current);
      }
      const sel = controller.wrapImage(img);
      selectionRef.current = sel;
      dispatch({ type: "setSelection", selection: sel });
    };
    // Re-install with onPick pointing at React dispatch
    // (controller was created with a stub; replace its hook here)
    (controller as unknown as { _onPick?: (img: HTMLImageElement) => void })._onPick = handler;
  }, [controller, dispatch]);

  const handleClearSelection = () => {
    if (selectionRef.current) {
      controller.unwrapSelection(selectionRef.current);
      selectionRef.current = null;
      dispatch({ type: "setSelection", selection: null });
    }
  };

  return (
    <>
      <Sidebar
        onClose={() => {
          const w = window as unknown as Win;
          if (selectionRef.current) {
            controller.unwrapSelection(selectionRef.current);
            selectionRef.current = null;
          }
          const ctx = w[FLAG];
          if (ctx) {
            ctx.controller.teardown();
            ctx.root.unmount();
            ctx.host.remove();
            delete w[FLAG];
          }
        }}
        onCollapseChange={(c) => controller.setCollapsed(c)}
      >
        <EmbedControlPanel onClearSelection={handleClearSelection} />
      </Sidebar>
      <HostImageEditor />
    </>
  );
}

(function mount() {
  const w = window as unknown as Win;
  if (w[FLAG]) {
    // Toggle visibility on re-click of the bookmarklet
    const ctx = w[FLAG];
    const isHidden = ctx.host.style.display === "none";
    ctx.host.style.display = isHidden ? "block" : "none";
    if (isHidden) {
      // Reinstall the html margin etc.
      document.documentElement.classList.add("__uib-shifted");
    } else {
      document.documentElement.classList.remove("__uib-shifted");
    }
    return;
  }

  // Host element for the sidebar's shadow DOM
  const host = document.createElement("div");
  host.id = "ui-builder-overlay-host";
  host.style.cssText = "position:fixed;top:0;right:0;height:100vh;z-index:2147483647;";
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    ${sidebarCss}
  `;
  shadow.appendChild(style);

  const mountPoint = document.createElement("div");
  mountPoint.style.cssText = "height:100%;";
  shadow.appendChild(mountPoint);

  // Lazy-binding controller: it needs an onPick handler, but the handler
  // wants React's dispatch. We pass a thin trampoline that reads the real
  // handler off the controller object once React installs it.
  let controllerRef: HostPageController | null = null;
  const controller = installHostPageIntegration({
    onPick: (img) => {
      const cb = (
        controllerRef as unknown as {
          _onPick?: (img: HTMLImageElement) => void;
        } | null
      )?._onPick;
      if (cb) cb(img);
    },
  });
  controllerRef = controller;

  const root = createRoot(mountPoint);
  root.render(
    <EmbedProvider>
      <EmbedApp controller={controller} />
    </EmbedProvider>,
  );

  w[FLAG] = { host, root, controller };
})();
