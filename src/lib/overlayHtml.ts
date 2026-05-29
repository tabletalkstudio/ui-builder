/**
 * Shared overlay-to-HTML serializer used by both the SPA's zip exporter and
 * the bookmarklet's "Copy snippet" output. Mirrors components/Overlay.tsx so
 * the rendered editor preview and the exported markup are byte-equivalent.
 */

import { DEFAULT_ICON_FOR_TYPE, iconToSvgString } from "./iconRegistry";

export type SerializedOverlay = {
  visible: boolean;
  cardVisible: boolean;
  shadowEnabled: boolean;
  x: number;
  y: number;
  chipText: string;
  labelText: string;
  theme: "light" | "dark";
  size: "XL" | "L" | "M" | "S";
  secondaryType:
    | "single-image"
    | "signature"
    | "images"
    | "layers"
    | "text-prompt";
  iconName: string | null;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Generic placeholder swatch icon used inside cards (not the chip).
const ICON_IMAGE = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="5.5" cy="6.5" r="1.2" fill="currentColor"/><path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

function chipIcon(
  type: SerializedOverlay["secondaryType"],
  iconName: string | null,
): string {
  const name = iconName ?? DEFAULT_ICON_FOR_TYPE[type] ?? "image";
  return iconToSvgString(name);
}

function cardInner(
  type: SerializedOverlay["secondaryType"],
  labelText: string,
): string {
  switch (type) {
    case "signature":
      return `<div class="pec-swatch pec-swatch--wide">${ICON_IMAGE}</div>`;
    case "images":
      return `<span class="pec-label">${escapeHtml(labelText)}</span>
      <div class="pec-swatch-row">
        <div class="pec-swatch pec-swatch--sm">${ICON_IMAGE}</div>
        <div class="pec-swatch pec-swatch--sm">${ICON_IMAGE}</div>
        <div class="pec-swatch pec-swatch--sm">${ICON_IMAGE}</div>
      </div>`;
    case "layers":
      return `<div class="pec-layer-list">
        <div class="pec-layer-row"><div class="pec-swatch pec-swatch--thumb">${ICON_IMAGE}</div><span class="pec-layer-name">Layer Name</span></div>
        <div class="pec-layer-row"><div class="pec-swatch pec-swatch--thumb">${ICON_IMAGE}</div><span class="pec-layer-name">Layer Name</span></div>
        <div class="pec-layer-row"><div class="pec-swatch pec-swatch--thumb">${ICON_IMAGE}</div><span class="pec-layer-name">Layer Name</span></div>
      </div>`;
    case "text-prompt":
      return `<span class="pec-prompt-text">${escapeHtml(labelText || "text prompt")}</span>`;
    case "single-image":
    default:
      return `<span class="pec-label">${escapeHtml(labelText)}</span>
      <div class="pec-swatch">${ICON_IMAGE}</div>`;
  }
}

/**
 * Render the overlay div as an HTML string. `positionInline` decides whether
 * `left`/`top` are inlined as styles (true — for the bookmarklet snippet) or
 * left for an external stylesheet block (false — for the SPA's full-page
 * export where overlay position is in styles.css).
 */
export function renderOverlayHtml(
  o: SerializedOverlay,
  opts: { positionInline?: boolean } = {},
): string {
  if (!o.visible) return "";
  const sizeClass = `pec-size-${o.size.toLowerCase()}`;
  const themeClass = `pec-theme-${o.theme}`;
  const typeClass = `pec-type-${o.secondaryType}`;
  const shadowClass = o.shadowEnabled ? " pec-shadow" : "";
  const positionAttr = opts.positionInline
    ? ` style="position:absolute;left:${o.x}px;top:${o.y}px;"`
    : "";
  const cardBlock = o.cardVisible
    ? `\n  <div class="pec-card pec-card--${o.secondaryType}">${cardInner(o.secondaryType, o.labelText)}</div>`
    : "";
  return `<div class="pec-overlay ${themeClass} ${sizeClass} ${typeClass}${shadowClass}"${positionAttr}>
  <div class="pec-chip">${chipIcon(o.secondaryType, o.iconName)}<span>${escapeHtml(o.chipText)}</span></div>${cardBlock}
</div>`;
}
