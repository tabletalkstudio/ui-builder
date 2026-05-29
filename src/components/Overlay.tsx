import { useRef, type RefObject } from "react";

export type SecondaryType =
  | "single-image"
  | "signature"
  | "images"
  | "layers"
  | "text-prompt";
export type OverlaySize = "XL" | "L" | "M" | "S";

export type OverlayProps = {
  /** Element whose bounds we clamp the overlay drag to. */
  frameRef: RefObject<HTMLElement | null>;
  x: number;
  y: number;
  chipText: string;
  labelText: string;
  theme: "light" | "dark";
  size: OverlaySize;
  secondaryType: SecondaryType;
  /** When false, only the chip renders (no card below). */
  cardVisible: boolean;
  /** Whether to apply the soft drop shadow on the overlay. */
  shadowEnabled: boolean;
  onMove: (x: number, y: number) => void;
};

/* ---- Icons. One per secondaryType. All sized via currentColor + 1em-ish. ---- */

const ImageIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="5.5" cy="6.5" r="1.2" fill="currentColor" />
    <path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const PencilIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 2L14 5L5.5 13.5L2 14L2.5 10.5L11 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M9.5 3.5L12.5 6.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const ImagesIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3.5" y="4.5" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <rect x="1.5" y="2.5" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" fill="var(--pec-bg)" />
    <circle cx="4" cy="5" r="0.9" fill="currentColor" />
    <path d="M2 9L5 6.5L7.5 8.5L9 7.5L11 9" stroke="currentColor" strokeWidth="1.0" strokeLinejoin="round" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5L14.5 5L8 8.5L1.5 5L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M2 8.5L8 11.5L14 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M2 11.5L8 14.5L14 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const GenerateIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3L4 6M2.5 4.5L5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 8L11 13M8.5 10.5L13.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M9 1L10 3L12 4L10 5L9 7L8 5L6 4L8 3L9 1Z" fill="currentColor" />
  </svg>
);

function ChipIcon({ type }: { type: SecondaryType }) {
  switch (type) {
    case "signature":
      return <PencilIcon />;
    case "images":
      return <ImagesIcon />;
    case "layers":
      return <LayersIcon />;
    case "text-prompt":
      return <GenerateIcon />;
    case "single-image":
    default:
      return <ImageIcon />;
  }
}

/* ---- Card content per type. ---- */

function CardContent({
  type,
  labelText,
}: {
  type: SecondaryType;
  labelText: string;
}) {
  switch (type) {
    case "signature":
      // Card is just a large swatch — no text label.
      return <div className="pec-swatch pec-swatch--wide"><ImageIcon /></div>;

    case "images":
      return (
        <>
          <span className="pec-label">{labelText}</span>
          <div className="pec-swatch-row">
            <div className="pec-swatch pec-swatch--sm"><ImageIcon /></div>
            <div className="pec-swatch pec-swatch--sm"><ImageIcon /></div>
            <div className="pec-swatch pec-swatch--sm"><ImageIcon /></div>
          </div>
        </>
      );

    case "layers":
      return (
        <div className="pec-layer-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="pec-layer-row">
              <div className="pec-swatch pec-swatch--thumb"><ImageIcon /></div>
              <span className="pec-layer-name">Layer Name</span>
            </div>
          ))}
        </div>
      );

    case "text-prompt":
      // The "card" is an input-style rounded rect, no padding for a label.
      return <span className="pec-prompt-text">{labelText || "text prompt"}</span>;

    case "single-image":
    default:
      return (
        <>
          <span className="pec-label">{labelText}</span>
          <div className="pec-swatch"><ImageIcon /></div>
        </>
      );
  }
}

export function Overlay({
  frameRef,
  x,
  y,
  chipText,
  labelText,
  theme,
  size,
  secondaryType,
  cardVisible,
  shadowEnabled,
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
      className={`pec-overlay pec-draggable pec-theme-${theme} pec-size-${size.toLowerCase()} pec-type-${secondaryType}${shadowEnabled ? " pec-shadow" : ""}`}
      style={{ left: x, top: y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pec-chip">
        <ChipIcon type={secondaryType} />
        <span>{chipText}</span>
      </div>
      {cardVisible && (
        <div className={`pec-card pec-card--${secondaryType}`}>
          <CardContent type={secondaryType} labelText={labelText} />
        </div>
      )}
    </div>
  );
}
