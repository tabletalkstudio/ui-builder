import { useEffect, useRef } from "react";
import { useComposer, useDispatch } from "../state";
import { clampOffsets, minScaleForCover } from "../lib/clampOffsets";
import { Overlay } from "./Overlay";
import { useUpload } from "./UploadProvider";

export function ImageFrame() {
  const state = useComposer();
  const dispatch = useDispatch();
  const { openFilePicker } = useUpload();
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const { image, frame, imageTransform } = state;

  const minScale = minScaleForCover(
    image.naturalW,
    image.naturalH,
    frame.w,
    frame.h,
  );

  useEffect(() => {
    if (imageTransform.scale < minScale && image.src) {
      dispatch({ type: "setImageTransform", scale: minScale });
    }
  }, [minScale, imageTransform.scale, image.src, dispatch]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!image.src) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: imageTransform.offsetX,
      baseY: imageTransform.offsetY,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const { x, y } = clampOffsets(
      d.baseX + dx,
      d.baseY + dy,
      imageTransform.scale,
      image.naturalW,
      image.naturalH,
      frame.w,
      frame.h,
    );
    dispatch({ type: "setImageTransform", offsetX: x, offsetY: y });
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  return (
    <div
      ref={frameRef}
      className="pec-frame editor-frame"
      style={{
        width: frame.w,
        height: frame.h,
        borderRadius: frame.borderRadius,
      }}
    >
      {image.src ? (
        <img
          className="pec-cropped editor-image"
          src={image.src}
          alt=""
          draggable={false}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            width: image.naturalW,
            height: image.naturalH,
            transform: `translate(${imageTransform.offsetX}px, ${imageTransform.offsetY}px) scale(${imageTransform.scale})`,
            transformOrigin: "0 0",
            objectFit: "fill",
          }}
        />
      ) : (
        <div className="placeholder">
          <svg
            className="placeholder-icon"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="6"
              width="24"
              height="20"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="11" cy="13" r="2" fill="currentColor" />
            <path
              d="M5 22L12 15L17 19L21 16L27 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <p className="placeholder-text">Drag an image here to get started</p>
          <button
            type="button"
            className="primary placeholder-btn"
            onClick={openFilePicker}
          >
            Upload image
          </button>
        </div>
      )}
      {image.src && state.overlay.visible && (
        <Overlay
          frameRef={frameRef}
          x={state.overlay.x}
          y={state.overlay.y}
          chipText={state.overlay.chipText}
          labelText={state.overlay.labelText}
          theme={state.overlay.theme}
          cardVisible={state.overlay.cardVisible}
          onMove={(nx, ny) =>
            dispatch({ type: "setOverlay", patch: { x: nx, y: ny } })
          }
        />
      )}
    </div>
  );
}
