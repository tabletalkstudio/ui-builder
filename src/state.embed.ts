import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { createElement } from "react";
import { coverFitTransform } from "./lib/clampOffsets";

export type Theme = "light" | "dark";

export type Selection = {
  el: HTMLImageElement;
  wrapper: HTMLElement;
  /** Original src so we can restore on unmount or "Restore original". */
  originalSrc: string;
  /** Image's original parent + nextSibling so we can put it back where we found it. */
  originalParent: Node;
  originalNextSibling: Node | null;
  naturalW: number;
  naturalH: number;
  /** Rendered dimensions at the moment we selected. */
  displayW: number;
  displayH: number;
};

export type EmbedState = {
  sidebar: { collapsed: boolean };
  selection: Selection | null;
  swapSrc: string | null;
  frame: { borderRadius: number };
  imageTransform: { offsetX: number; offsetY: number; scale: number };
  overlay: {
    visible: boolean;
    x: number;
    y: number;
    chipText: string;
    labelText: string;
    theme: Theme;
  };
};

export const initialEmbedState: EmbedState = {
  sidebar: { collapsed: false },
  selection: null,
  swapSrc: null,
  frame: { borderRadius: 12 },
  imageTransform: { offsetX: 0, offsetY: 0, scale: 1 },
  overlay: {
    visible: true,
    x: 12,
    y: 12,
    chipText: "Primary container",
    labelText: "Text",
    theme: "light",
  },
};

export type EmbedAction =
  | { type: "setSelection"; selection: Selection | null }
  | { type: "setSwapSrc"; src: string | null }
  | { type: "setFrame"; borderRadius?: number }
  | {
      type: "setImageTransform";
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }
  | { type: "setOverlay"; patch: Partial<EmbedState["overlay"]> }
  | { type: "setSidebar"; patch: Partial<EmbedState["sidebar"]> };

export function embedReducer(
  state: EmbedState,
  action: EmbedAction,
): EmbedState {
  switch (action.type) {
    case "setSelection":
      return {
        ...state,
        selection: action.selection,
        // Reset per-selection transforms when changing image. Start at the
        // cover-fit transform so the image looks identical to how it was
        // already rendered on the host page (no zoom/crop jump on click).
        swapSrc: null,
        imageTransform: action.selection
          ? coverFitTransform(
              action.selection.naturalW,
              action.selection.naturalH,
              action.selection.displayW,
              action.selection.displayH,
            )
          : { offsetX: 0, offsetY: 0, scale: 1 },
        frame: { borderRadius: state.frame.borderRadius },
      };
    case "setSwapSrc":
      return { ...state, swapSrc: action.src };
    case "setFrame":
      return {
        ...state,
        frame: {
          borderRadius:
            action.borderRadius ?? state.frame.borderRadius,
        },
      };
    case "setImageTransform":
      return {
        ...state,
        imageTransform: {
          offsetX: action.offsetX ?? state.imageTransform.offsetX,
          offsetY: action.offsetY ?? state.imageTransform.offsetY,
          scale: action.scale ?? state.imageTransform.scale,
        },
      };
    case "setOverlay":
      return { ...state, overlay: { ...state.overlay, ...action.patch } };
    case "setSidebar":
      return { ...state, sidebar: { ...state.sidebar, ...action.patch } };
    default:
      return state;
  }
}

const StateCtx = createContext<EmbedState>(initialEmbedState);
const DispatchCtx = createContext<Dispatch<EmbedAction>>(() => {});

export function EmbedProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(embedReducer, initialEmbedState);
  return createElement(
    StateCtx.Provider,
    { value: state },
    createElement(DispatchCtx.Provider, { value: dispatch }, children),
  );
}

export function useEmbed() {
  return useContext(StateCtx);
}
export function useEmbedDispatch() {
  return useContext(DispatchCtx);
}
