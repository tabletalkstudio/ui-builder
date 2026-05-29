import type { ComposerState } from "../state";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const imageIconSvg = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
  <circle cx="5.5" cy="6.5" r="1.2" fill="currentColor"/>
  <path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;

export function serializeHtml(state: ComposerState): string {
  const { overlay } = state;

  const cardHtml = overlay.cardVisible
    ? `
      <div class="pec-card">
        <span class="pec-label">${escapeHtml(overlay.labelText)}</span>
        <div class="pec-swatch">${imageIconSvg}</div>
      </div>`
    : "";

  const overlayHtml = overlay.visible
    ? `
    <div class="pec-overlay pec-theme-${overlay.theme}">
      <div class="pec-chip">
        ${imageIconSvg}
        <span>${escapeHtml(overlay.chipText)}</span>
      </div>${cardHtml}
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported Composition</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <div class="pec-composer">
    <div class="pec-frame">
      <img class="pec-cropped" src="./image.png" alt="" />${overlayHtml}
    </div>
  </div>
</body>
</html>
`;
}
