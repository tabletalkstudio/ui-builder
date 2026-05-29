import { useRef, type RefObject } from "react";

export type OverlayProps = {
  /** Element whose bounds we clamp the overlay drag to. */
  frameRef: RefObject<HTMLElement | null>;
  x: number;
  y: number;
  chipText: string;
  labelText: string;
  theme: "light" | "dark";
  /** When false, only the chip renders (no card below). */
  cardVisible: boolean;
  onMove: (x: number, y: number) => void;
};

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

export function Overlay({
  frameRef,
  x,
  y,
  chipText,
  labelText,
  theme,
  cardVisible,
  onMove,
}: OverlayProps) {
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
      baseX: x,
      baseY: y,
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
    onMove(nx, ny);
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={overlayRef}
      className={`pec-overlay pec-draggable pec-theme-${theme}`}
      style={{ left: x, top: y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pec-chip">
        <ImageIcon />
        <span>{chipText}</span>
      </div>
      {cardVisible && (
        <div className="pec-card">
          <span className="pec-label">{labelText}</span>
          <div className="pec-swatch">
            <ImageIcon />
          </div>
        </div>
      )}
    </div>
  );
}
