import { useComposer, useDispatch, minScaleForCover } from "../state";

export function ControlPanel() {
  const state = useComposer();
  const dispatch = useDispatch();
  const { image, frame, imageTransform, overlay } = state;

  const minScale = minScaleForCover(
    image.naturalW,
    image.naturalH,
    frame.w,
    frame.h,
  );

  const hasImage = !!image.src;

  return (
    <aside className="panel">
      <section>
        <h4>Frame</h4>
        <label>
          Width (px)
          <input
            type="number"
            min={1}
            value={frame.w}
            onChange={(e) =>
              dispatch({ type: "setFrame", w: Number(e.target.value) || 0 })
            }
          />
        </label>
        <label>
          Height (px)
          <input
            type="number"
            min={1}
            value={frame.h}
            onChange={(e) =>
              dispatch({ type: "setFrame", h: Number(e.target.value) || 0 })
            }
          />
        </label>
        <label>
          Border radius (px)
          <input
            type="range"
            min={0}
            max={Math.min(frame.w, frame.h) / 2}
            value={frame.borderRadius}
            onChange={(e) =>
              dispatch({
                type: "setFrame",
                borderRadius: Number(e.target.value),
              })
            }
          />
          <span className="value">{frame.borderRadius}px</span>
        </label>
      </section>

      <section>
        <h4>Image</h4>
        <label>
          Zoom
          <input
            type="range"
            min={minScale}
            max={Math.max(minScale * 4, 4)}
            step={0.01}
            disabled={!hasImage}
            value={Math.max(imageTransform.scale, minScale)}
            onChange={(e) =>
              dispatch({
                type: "setImageTransform",
                scale: Number(e.target.value),
              })
            }
          />
          <span className="value">
            {(imageTransform.scale * 100).toFixed(0)}%
          </span>
        </label>
        {image.src && (
          <p className="hint">
            Drag the image inside the frame to reframe.
            {image.is2x && (
              <>
                <br />
                Source: {image.naturalW}×{image.naturalH} (@2x)
              </>
            )}
          </p>
        )}
      </section>

      <section>
        <h4>Overlay</h4>
        <label className="row">
          <input
            type="checkbox"
            checked={overlay.visible}
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
            checked={overlay.cardVisible}
            disabled={!overlay.visible}
            onChange={(e) =>
              dispatch({
                type: "setOverlay",
                patch: { cardVisible: e.target.checked },
              })
            }
          />
          Show card (second box)
        </label>
        <label className="row">
          <input
            type="checkbox"
            checked={overlay.shadowEnabled}
            disabled={!overlay.visible}
            onChange={(e) =>
              dispatch({
                type: "setOverlay",
                patch: { shadowEnabled: e.target.checked },
              })
            }
          />
          Drop shadow
        </label>
        <label>
          Chip text
          <input
            type="text"
            value={overlay.chipText}
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
            value={overlay.labelText}
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
            value={overlay.secondaryType}
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
            value={overlay.size}
            onChange={(e) =>
              dispatch({
                type: "setOverlay",
                patch: { size: e.target.value as "XL" | "L" | "M" | "S" },
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
            value={overlay.theme}
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
        <p className="hint">Drag the overlay over the image to position it.</p>
      </section>
    </aside>
  );
}
