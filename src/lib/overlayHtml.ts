/**
 * Shared overlay-to-HTML serializer used by both the SPA's zip exporter and
 * the bookmarklet's "Copy snippet" output. Mirrors components/Overlay.tsx so
 * the rendered editor preview and the exported markup are byte-equivalent.
 */

export type SerializedOverlay = {
  visible: boolean;
  cardVisible: boolean;
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
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ICON_IMAGE = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/><circle cx="5.5" cy="6.5" r="1.2" fill="currentColor"/><path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const ICON_PENCIL = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2L14 5L5.5 13.5L2 14L2.5 10.5L11 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.5 3.5L12.5 6.5" stroke="currentColor" stroke-width="1.2"/></svg>`;
const ICON_IMAGES = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="4.5" width="10" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2"/><rect x="1.5" y="2.5" width="10" height="8" rx="1.2" stroke="currentColor" stroke-width="1.2" fill="var(--pec-bg)"/><circle cx="4" cy="5" r="0.9" fill="currentColor"/><path d="M2 9L5 6.5L7.5 8.5L9 7.5L11 9" stroke="currentColor" stroke-width="1.0" stroke-linejoin="round"/></svg>`;
const ICON_LAYERS = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5L14.5 5L8 8.5L1.5 5L8 1.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M2 8.5L8 11.5L14 8.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M2 11.5L8 14.5L14 11.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
const ICON_GENERATE = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 3L4 6M2.5 4.5L5.5 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M11 8L11 13M8.5 10.5L13.5 10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M9 1L10 3L12 4L10 5L9 7L8 5L6 4L8 3L9 1Z" fill="currentColor"/></svg>`;

function chipIcon(type: SerializedOverlay["secondaryType"]): string {
  switch (type) {
    case "signature": return ICON_PENCIL;
    case "images": return ICON_IMAGES;
    case "layers": return ICON_LAYERS;
    case "text-prompt": return ICON_GENERATE;
    case "single-image":
    default: return ICON_IMAGE;
  }
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
  const positionAttr = opts.positionInline
    ? ` style="position:absolute;left:${o.x}px;top:${o.y}px;"`
    : "";
  const cardBlock = o.cardVisible
    ? `\n  <div class="pec-card pec-card--${o.secondaryType}">${cardInner(o.secondaryType, o.labelText)}</div>`
    : "";
  return `<div class="pec-overlay ${themeClass} ${sizeClass} ${typeClass}"${positionAttr}>
  <div class="pec-chip">${chipIcon(o.secondaryType)}<span>${escapeHtml(o.chipText)}</span></div>${cardBlock}
</div>`;
}
