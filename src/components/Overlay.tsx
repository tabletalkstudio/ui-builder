import { useRef, type RefObject } from "react";
import { DEFAULT_ICON_FOR_TYPE, getIcon } from "../lib/iconRegistry";

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
  /** Icon name override; falls back to default for the type. */
  iconName: string | null;
  onMove: (x: number, y: number) => void;
};

/* ---- Generic placeholder image swatch icon. Lives in the card body. ---- */
const SwatchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="5.5" cy="6.5" r="1.2" fill="currentColor" />
    <path d="M2 11.5L6 8L9 10.5L11.5 8.5L14 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

function ChipIcon({
  iconName,
  secondaryType,
}: {
  iconName: string | null;
  secondaryType: SecondaryType;
}) {
  const effectiveName =
    iconName ?? DEFAULT_ICON_FOR_TYPE[secondaryType] ?? "image";
  const entry = getIcon(effectiveName);
  if (!entry) return null;
  const Cmp = entry.Component;
  return <Cmp width="1em" height="1em" />;
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
      return <div className="pec-swatch pec-swatch--wide"><SwatchIcon /></div>;

    case "images":
      return (
        <>
          <span className="pec-label">{labelText}</span>
          <div className="pec-swatch-row">
            <div className="pec-swatch pec-swatch--sm"><SwatchIcon /></div>
            <div className="pec-swatch pec-swatch--sm"><SwatchIcon /></div>
            <div className="pec-swatch pec-swatch--sm"><SwatchIcon /></div>
          </div>
        </>
      );

    case "layers":
      return (
        <div className="pec-layer-list">
          {[0, 1, 2].map((i) => (
            <div key={i} className="pec-layer-row">
              <div className="pec-swatch pec-swatch--thumb"><SwatchIcon /></div>
              <span className="pec-layer-name">Layer Name</span>
            </div>
          ))}
        </div>
      );

    case "text-prompt":
      return <span className="pec-prompt-text">{labelText || "text prompt"}</span>;

    case "single-image":
    default:
      return (
        <>
          <span className="pec-label">{labelText}</span>
          <div className="pec-swatch"><SwatchIcon /></div>
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
  iconName,
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
        <ChipIcon iconName={iconName} secondaryType={secondaryType} />
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
