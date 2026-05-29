import { useRef, type RefObject } from "react";
import { useComposer, useDispatch } from "../state";

type Props = { frameRef: RefObject<HTMLDivElement | null> };

const ImageIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="1.5"
      y="2.5"
      width="13"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <circle cx="5.5" cy="6.5" r="1.2" fill="currentColor" />
    <path
      d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export function Overlay({ frameRef }: Props) {
  const state = useComposer();
  const dispatch = useDispatch();
  const overlayRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({ active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: state.overlay.x,
      baseY: state.overlay.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    const frame = frameRef.current;
    const el = overlayRef.current;
    let nx = drag.current.baseX + dx;
    let ny = drag.current.baseY + dy;
    if (frame && el) {
      const maxX = frame.clientWidth - el.offsetWidth;
      const maxY = frame.clientHeight - el.offsetHeight;
      nx = Math.min(Math.max(0, nx), Math.max(0, maxX));
      ny = Math.min(Math.max(0, ny), Math.max(0, maxY));
    }
    dispatch({ type: "setOverlay", patch: { x: nx, y: ny } });
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={overlayRef}
      className={`pec-overlay pec-draggable pec-theme-${state.overlay.theme}`}
      style={{ left: state.overlay.x, top: state.overlay.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pec-chip">
        <ImageIcon />
        <span>{state.overlay.chipText}</span>
      </div>
      <div className="pec-card">
        <span className="pec-label">{state.overlay.labelText}</span>
        <div className="pec-swatch">
          <ImageIcon />
        </div>
      </div>
    </div>
  );
}
