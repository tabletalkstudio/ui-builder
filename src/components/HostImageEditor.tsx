import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useEmbed, useEmbedDispatch } from "../state.embed";
import { clampOffsets, minScaleForCover } from "../lib/clampOffsets";
import { Overlay } from "./Overlay";

/**
 * Renders into the host page's wrapper element via portal:
 *   - the selected <img> with applied transform
 *   - the chip+card overlay
 *   - applies wrapper border-radius
 *
 * The wrapper div itself is owned by HostPageController; we mutate its
 * style (border-radius) and contents (image element + portal'd overlay).
 *
 * The <img> is NOT re-rendered by React (it's the host page's actual
 * element). We control it imperatively: src and transform/style updates
 * are applied via effects.
 */
export function HostImageEditor() {
  const state = useEmbed();
  const dispatch = useEmbedDispatch();
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const sel = state.selection;

  // Apply image src (swap or original)
  useEffect(() => {
    if (!sel) return;
    const desired = state.swapSrc ?? sel.originalSrc;
    if (sel.el.src !== desired) sel.el.src = desired;
  }, [sel, state.swapSrc]);

  // Apply image transform + sizing
  useEffect(() => {
    if (!sel) return;
    const t = state.imageTransform;
    sel.el.style.position = "absolute";
    sel.el.style.left = "0";
    sel.el.style.top = "0";
    sel.el.style.width = sel.naturalW + "px";
    sel.el.style.height = sel.naturalH + "px";
    sel.el.style.transformOrigin = "0 0";
    sel.el.style.transform = `translate(${t.offsetX}px, ${t.offsetY}px) scale(${t.scale})`;
  }, [sel, state.imageTransform]);

  // Apply wrapper border-radius
  useEffect(() => {
    if (!sel) return;
    sel.wrapper.style.borderRadius = state.frame.borderRadius + "px";
  }, [sel, state.frame.borderRadius]);

  // Enforce minimum cover scale when selection changes
  useEffect(() => {
    if (!sel) return;
    const min = minScaleForCover(
      sel.naturalW,
      sel.naturalH,
      sel.displayW,
      sel.displayH,
    );
    if (state.imageTransform.scale < min) {
      dispatch({ type: "setImageTransform", scale: min });
    }
  }, [sel, state.imageTransform.scale, dispatch]);

  // Attach pointer handlers to the image for panning. We use addEventListener
  // (not React props) since the <img> isn't part of the React tree.
  useEffect(() => {
    if (!sel) return;
    const img = sel.el;

    const onPointerDown = (e: PointerEvent) => {
      img.setPointerCapture(e.pointerId);
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        baseX: state.imageTransform.offsetX,
        baseY: state.imageTransform.offsetY,
      };
    };
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      const { x, y } = clampOffsets(
        d.baseX + dx,
        d.baseY + dy,
        state.imageTransform.scale,
        sel.naturalW,
        sel.naturalH,
        sel.displayW,
        sel.displayH,
      );
      dispatch({ type: "setImageTransform", offsetX: x, offsetY: y });
    };
    const onPointerUp = () => {
      dragRef.current.active = false;
    };

    img.addEventListener("pointerdown", onPointerDown);
    img.addEventListener("pointermove", onPointerMove);
    img.addEventListener("pointerup", onPointerUp);
    img.addEventListener("pointercancel", onPointerUp);
    return () => {
      img.removeEventListener("pointerdown", onPointerDown);
      img.removeEventListener("pointermove", onPointerMove);
      img.removeEventListener("pointerup", onPointerUp);
      img.removeEventListener("pointercancel", onPointerUp);
    };
  }, [sel, state.imageTransform.offsetX, state.imageTransform.offsetY, state.imageTransform.scale, dispatch]);

  if (!sel || !state.overlay.visible) return null;

  // Portal the chip+card into the wrapper. The wrapper's frame for clamp is
  // itself (sel.wrapper). We pass a stable RefObject-like via { current }.
  const frameRef = { current: sel.wrapper as HTMLElement | null };

  return createPortal(
    <Overlay
      frameRef={frameRef}
      x={state.overlay.x}
      y={state.overlay.y}
      chipText={state.overlay.chipText}
      labelText={state.overlay.labelText}
      theme={state.overlay.theme}
      size={state.overlay.size}
      secondaryType={state.overlay.secondaryType}
      cardVisible={state.overlay.cardVisible}
      shadowEnabled={state.overlay.shadowEnabled}
      onMove={(nx, ny) =>
        dispatch({ type: "setOverlay", patch: { x: nx, y: ny } })
      }
    />,
    sel.wrapper,
  );
}
