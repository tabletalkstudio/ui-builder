import overlayCss from "../styles/overlay.css?raw";
import type { EmbedState } from "../state.embed";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeAttr = (s: string) => escapeHtml(s);

const ICON_SVG = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="5.5" cy="6.5" r="1.2" fill="currentColor"/><path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

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

  const cardBlock = state.overlay.cardVisible
    ? `
    <div class="pec-card">
      <span class="pec-label">${escapeHtml(state.overlay.labelText)}</span>
      <div class="pec-swatch">${ICON_SVG}</div>
    </div>`
    : "";

  const overlayBlock = state.overlay.visible
    ? `
  <div class="pec-overlay pec-theme-${state.overlay.theme}" style="position:absolute;left:${state.overlay.x}px;top:${state.overlay.y}px;">
    <div class="pec-chip">${ICON_SVG}<span>${escapeHtml(state.overlay.chipText)}</span></div>${cardBlock}
  </div>`
    : "";

  const html = `<div class="pec-image-frame" style="position:relative;overflow:hidden;width:${Math.round(displayW)}px;height:${Math.round(displayH)}px;border-radius:${borderRadius}px;">
  <img src="${escapeAttr(srcUrl)}" alt="" style="position:absolute;left:0;top:0;width:${naturalW}px;height:${naturalH}px;transform:translate(${Math.round(offsetX)}px,${Math.round(offsetY)}px) scale(${scale.toFixed(3)});transform-origin:0 0;display:block" />${overlayBlock}
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
