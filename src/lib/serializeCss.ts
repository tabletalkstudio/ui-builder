import overlayCss from "../styles/overlay.css?raw";
import type { ComposerState } from "../state";

export function serializeCss(state: ComposerState): string {
  const { frame, overlay } = state;

  const overrides = `
/* Composition overrides — generated */
body {
  margin: 0;
  padding: 24px;
  background: #f5f5f5;
}

.pec-frame {
  width: ${frame.w}px;
  height: ${frame.h}px;
  border-radius: ${frame.borderRadius}px;
}

${
  overlay.visible
    ? `.pec-overlay {
  left: ${overlay.x}px;
  top: ${overlay.y}px;
}`
    : ""
}
`;

  return `${overlayCss}\n${overrides}`;
}
