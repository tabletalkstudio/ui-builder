import { useState } from "react";
import JSZip from "jszip";
import { useComposer } from "../state";
import { cropImage } from "../lib/cropImage";
import { serializeHtml } from "../lib/serializeHtml";
import { serializeCss } from "../lib/serializeCss";

export function ExportButton() {
  const state = useComposer();
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    if (!state.image.src) return;
    setBusy(true);
    try {
      const pngBlob = await cropImage(state);
      const html = serializeHtml(state);
      const css = serializeCss(state);

      const zip = new JSZip();
      zip.file("index.html", html);
      zip.file("styles.css", css);
      zip.file("image.png", pngBlob);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "composition.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="primary export-btn"
      onClick={onExport}
      disabled={!state.image.src || busy}
    >
      {busy ? "Exporting…" : "Export"}
    </button>
  );
}
