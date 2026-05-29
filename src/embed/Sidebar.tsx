import type { ReactNode } from "react";
import { useEmbed, useEmbedDispatch } from "../state.embed";

type Props = {
  children: ReactNode;
  onClose: () => void;
  onCollapseChange: (collapsed: boolean) => void;
};

export function Sidebar({ children, onClose, onCollapseChange }: Props) {
  const state = useEmbed();
  const dispatch = useEmbedDispatch();
  const collapsed = state.sidebar.collapsed;

  const setCollapsed = (v: boolean) => {
    dispatch({ type: "setSidebar", patch: { collapsed: v } });
    onCollapseChange(v);
  };

  return (
    <div className={`uib-shell${collapsed ? " is-collapsed" : ""}`}>
      <button
        type="button"
        className="uib-collapse-btn"
        title={collapsed ? "Expand UI Builder" : "Collapse UI Builder"}
        aria-label={collapsed ? "Expand" : "Collapse"}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "‹" : "›"}
      </button>
      <div className="uib-content">
        <header className="uib-header">
          <h1>UI Builder</h1>
          <button
            type="button"
            className="uib-close-btn"
            title="Close"
            aria-label="Close UI Builder"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className="uib-body">{children}</div>
      </div>
    </div>
  );
}
