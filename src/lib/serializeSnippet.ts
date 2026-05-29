import overlayCss from "../styles/overlay.css?raw";
import type { EmbedState } from "../state.embed";
import { renderOverlayHtml } from "./overlayHtml";

const escapeAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function serializeSnippet(state: EmbedState): {
  html: string;
  css: string;
  combined: string;
} {
  const sel = state.selection;
  if (!sel) {
    return { html: "", css: "", combined: "" };
  }

  const srcUrl = state.swapSrc ?? sel.originalSrc;
  const { offsetX, offsetY, scale } = state.imageTransform;
  const { borderRadius } = state.frame;
  const { displayW, displayH, naturalW, naturalH } = sel;

  const overlayBlock = renderOverlayHtml(state.overlay, { positionInline: true });

  const html = `<div class="pec-image-frame" style="position:relative;overflow:hidden;width:${Math.round(displayW)}px;height:${Math.round(displayH)}px;border-radius:${borderRadius}px;">
  <img src="${escapeAttr(srcUrl)}" alt="" style="position:absolute;left:0;top:0;width:${naturalW}px;height:${naturalH}px;transform:translate(${Math.round(offsetX)}px,${Math.round(offsetY)}px) scale(${scale.toFixed(3)});transform-origin:0 0;display:block" />${overlayBlock ? "\n  " + overlayBlock : ""}
</div>`;

  const css = overlayCss.trim();

  const combined = `<!-- Paste this CSS once into your stylesheet (or a <style> block) -->
<style>
${css}
</style>

<!-- Paste this HTML wherever you want the composition to appear -->
${html}
`;

  return { html, css, combined };
}
