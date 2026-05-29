import type { ComposerState } from "../state";
import { renderOverlayHtml } from "./overlayHtml";

export function serializeHtml(state: ComposerState): string {
  const overlayHtml = renderOverlayHtml(state.overlay, { positionInline: false });

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
      <img class="pec-cropped" src="./image.png" alt="" />${overlayHtml ? "\n      " + overlayHtml : ""}
    </div>
  </div>
</body>
</html>
`;
}
