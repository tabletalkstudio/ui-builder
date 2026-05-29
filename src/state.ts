import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { createElement } from "react";

export type Theme = "light" | "dark";
export type OverlaySize = "XL" | "L" | "M" | "S";
export type SecondaryType =
  | "single-image"
  | "signature"
  | "images"
  | "layers"
  | "text-prompt";

export const DEFAULT_CHIP_TEXT: Record<SecondaryType, string> = {
  "single-image": "Primary container",
  signature: "Sign PDF",
  images: "Images",
  layers: "Layers",
  "text-prompt": "Generate",
};

export type ComposerState = {
  image: {
    src: string | null;
    naturalW: number;
    naturalH: number;
    is2x: boolean;
  };
  frame: {
    w: number;
    h: number;
    borderRadius: number;
  };
  imageTransform: {
    offsetX: number;
    offsetY: number;
    scale: number;
  };
  overlay: {
    visible: boolean;
    cardVisible: boolean;
    x: number;
    y: number;
    chipText: string;
    labelText: string;
    theme: Theme;
    size: OverlaySize;
    secondaryType: SecondaryType;
  };
};

export const initialState: ComposerState = {
  image: { src: null, naturalW: 0, naturalH: 0, is2x: false },
  frame: { w: 600, h: 400, borderRadius: 12 },
  imageTransform: { offsetX: 0, offsetY: 0, scale: 1 },
  overlay: {
    visible: true,
    cardVisible: true,
    x: 16,
    y: 16,
    chipText: "Primary container",
    labelText: "Text",
    theme: "light",
    size: "M",
    secondaryType: "single-image",
  },
};

export type Action =
  | {
      type: "setImage";
      src: string;
      naturalW: number;
      naturalH: number;
      is2x: boolean;
    }
  | { type: "setFrame"; w?: number; h?: number; borderRadius?: number }
  | {
      type: "setImageTransform";
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }
  | { type: "setOverlay"; patch: Partial<ComposerState["overlay"]> }
  | { type: "reset" };

export function reducer(state: ComposerState, action: Action): ComposerState {
  switch (action.type) {
    case "setImage": {
      const w = action.is2x ? Math.round(action.naturalW / 2) : action.naturalW;
      const h = action.is2x ? Math.round(action.naturalH / 2) : action.naturalH;
      // @2x source needs 50% zoom so each source pixel maps to one frame pixel.
      const scale = action.is2x ? 0.5 : 1;
      return {
        ...state,
        image: {
          src: action.src,
          naturalW: action.naturalW,
          naturalH: action.naturalH,
          is2x: action.is2x,
        },
        frame: { ...state.frame, w, h },
        imageTransform: { offsetX: 0, offsetY: 0, scale },
      };
    }
    case "setFrame":
      return {
        ...state,
        frame: {
          w: action.w ?? state.frame.w,
          h: action.h ?? state.frame.h,
          borderRadius: action.borderRadius ?? state.frame.borderRadius,
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
    case "setOverlay": {
      let patch = action.patch;
      if (
        patch.secondaryType &&
        patch.secondaryType !== state.overlay.secondaryType &&
        patch.chipText === undefined
      ) {
        patch = {
          ...patch,
          chipText: DEFAULT_CHIP_TEXT[patch.secondaryType],
        };
      }
      return { ...state, overlay: { ...state.overlay, ...patch } };
    }
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const StateCtx = createContext<ComposerState>(initialState);
const DispatchCtx = createContext<Dispatch<Action>>(() => {});

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return createElement(
    StateCtx.Provider,
    { value: state },
    createElement(DispatchCtx.Provider, { value: dispatch }, children),
  );
}

export function useComposer() {
  return useContext(StateCtx);
}
export function useDispatch() {
  return useContext(DispatchCtx);
}

// Re-exported from the canonical location for backwards compatibility.
export { minScaleForCover } from "./lib/clampOffsets";
