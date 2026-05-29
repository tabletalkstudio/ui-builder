import { useMemo, useRef, useState, useEffect } from "react";
import {
  ICON_CATEGORIES,
  getIcon,
  DEFAULT_ICON_FOR_TYPE,
} from "../lib/iconRegistry";

type Props = {
  /** Current selection. null means "use default for type". */
  value: string | null;
  /** Default icon name shown when value is null. */
  defaultForType: string;
  onChange: (name: string | null) => void;
};

export function IconPicker({ value, defaultForType, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      const path = e.composedPath();
      if (!path.includes(wrapRef.current)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const effectiveName = value ?? defaultForType;
  const currentEntry = getIcon(effectiveName);
  const CurrentCmp = currentEntry?.Component;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_CATEGORIES;
    return ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.label.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.icons.length > 0);
  }, [query]);

  return (
    <div className="uib-icon-picker" ref={wrapRef}>
      <button
        type="button"
        className="uib-icon-trigger"
        onClick={() => setOpen((v) => !v)}
        title={currentEntry?.label}
      >
        {CurrentCmp && <CurrentCmp width={18} height={18} />}
        <span className="uib-icon-trigger-label">
          {value === null
            ? `Default (${currentEntry?.label ?? effectiveName})`
            : currentEntry?.label ?? effectiveName}
        </span>
        <span className="uib-icon-trigger-caret">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="uib-icon-popover">
          <input
            type="text"
            className="uib-icon-search"
            placeholder="Search icons…"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="uib-icon-reset"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            disabled={value === null}
          >
            Use default for type
          </button>
          <div className="uib-icon-grid-scroll">
            {filtered.length === 0 ? (
              <p className="uib-icon-empty">No icons match “{query}”.</p>
            ) : (
              filtered.map((cat) => (
                <div key={cat.name} className="uib-icon-cat">
                  <h5 className="uib-icon-cat-name">{cat.name}</h5>
                  <div className="uib-icon-grid">
                    {cat.icons.map((icon) => {
                      const Cmp = icon.Component;
                      const selected = effectiveName === icon.name;
                      return (
                        <button
                          key={`${cat.name}-${icon.name}`}
                          type="button"
                          className={`uib-icon-tile${selected ? " is-selected" : ""}`}
                          title={icon.label}
                          onClick={() => {
                            onChange(icon.name);
                            setOpen(false);
                          }}
                        >
                          <Cmp width={20} height={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export for callers that need the default lookup helper.
export { DEFAULT_ICON_FOR_TYPE };
