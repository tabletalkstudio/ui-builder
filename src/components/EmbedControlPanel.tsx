import { useState } from "react";
import { useEmbed, useEmbedDispatch } from "../state.embed";
import { minScaleForCover } from "../lib/clampOffsets";
import { serializeSnippet } from "../lib/serializeSnippet";

type Props = {
  onClearSelection: () => void;
};

export function EmbedControlPanel({ onClearSelection }: Props) {
  const state = useEmbed();
  const dispatch = useEmbedDispatch();
  const sel = state.selection;
  const [copied, setCopied] = useState(false);

  const handleReplace = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      dispatch({ type: "setSwapSrc", src: url });
    };
    input.click();
  };

  const handleCopy = async () => {
    if (!sel) return;
    const { combined } = serializeSnippet(state);
    try {
      await navigator.clipboard.writeText(combined);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select a textarea
      const ta = document.createElement("textarea");
      ta.value = combined;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const minScale = sel
    ? minScaleForCover(sel.naturalW, sel.naturalH, sel.displayW, sel.displayH)
    : 1;
  const maxRadius = sel ? Math.floor(Math.min(sel.displayW, sel.displayH) / 2) : 100;

  return (
    <div className="uib-panel">
      <section>
        <h4>Selection</h4>
        {sel ? (
          <>
            <p className="hint">
              {Math.round(sel.displayW)} × {Math.round(sel.displayH)} px on page
              <br />
              (source {sel.naturalW} × {sel.naturalH})
            </p>
            <button type="button" onClick={onClearSelection}>
              Clear selection
            </button>
          </>
        ) : (
          <p className="hint">
            Click any image on the page to start editing it in place.
          </p>
        )}
      </section>

      {sel && (
        <>
          <section>
            <h4>Image</h4>
            <button type="button" onClick={handleReplace}>
              Replace image…
            </button>
            {state.swapSrc && (
              <button
                type="button"
                onClick={() => dispatch({ type: "setSwapSrc", src: null })}
              >
                Restore original
              </button>
            )}
            <label>
              Zoom
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={Math.max(state.imageTransform.scale / minScale, 1)}
                onChange={(e) =>
                  dispatch({
                    type: "setImageTransform",
                    scale: Number(e.target.value) * minScale,
                  })
                }
              />
              <span className="value">
                {((state.imageTransform.scale / minScale) * 100).toFixed(0)}%
              </span>
            </label>
            <p className="hint">Drag the image to pan.</p>
          </section>

          <section>
            <h4>Frame</h4>
            <label>
              Border radius
              <input
                type="range"
                min={0}
                max={maxRadius}
                value={Math.min(state.frame.borderRadius, maxRadius)}
                onChange={(e) =>
                  dispatch({
                    type: "setFrame",
                    borderRadius: Number(e.target.value),
                  })
                }
              />
              <span className="value">{state.frame.borderRadius}px</span>
            </label>
          </section>

          <section>
            <h4>Overlay</h4>
            <label className="row">
              <input
                type="checkbox"
                checked={state.overlay.visible}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: { visible: e.target.checked },
                  })
                }
              />
              Show overlay
            </label>
            <label className="row">
              <input
                type="checkbox"
                checked={state.overlay.cardVisible}
                disabled={!state.overlay.visible}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: { cardVisible: e.target.checked },
                  })
                }
              />
              Show card (second box)
            </label>
            <label>
              Chip text
              <input
                type="text"
                value={state.overlay.chipText}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: { chipText: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Label text
              <input
                type="text"
                value={state.overlay.labelText}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: { labelText: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Secondary type
              <select
                value={state.overlay.secondaryType}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: {
                      secondaryType: e.target.value as
                        | "single-image"
                        | "signature"
                        | "images"
                        | "layers"
                        | "text-prompt",
                    },
                  })
                }
              >
                <option value="single-image">Single image</option>
                <option value="signature">Signature</option>
                <option value="images">Images</option>
                <option value="layers">Layers</option>
                <option value="text-prompt">Text prompt</option>
              </select>
            </label>
            <label>
              Size
              <select
                value={state.overlay.size}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: {
                      size: e.target.value as "XL" | "L" | "M" | "S",
                    },
                  })
                }
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>
            <label>
              Theme
              <select
                value={state.overlay.theme}
                onChange={(e) =>
                  dispatch({
                    type: "setOverlay",
                    patch: { theme: e.target.value as "light" | "dark" },
                  })
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </section>

          <section>
            <h4>Output</h4>
            <button type="button" className="primary" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy HTML + CSS snippet"}
            </button>
            <p className="hint">
              Paste into your codebase to reproduce this composition.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
