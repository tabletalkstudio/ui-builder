import hostCss from "./host-injected.css?inline";
import overlayCss from "../styles/overlay.css?inline";
import type { Selection } from "../state.embed";

const STYLE_ID = "__uib-host-styles";
const HTML_CLASS = "__uib-shifted";
const PICK_CLASS = "__uib-pick-mode";

export type HostPageController = {
  /** Tear down all DOM mutations + listeners. */
  teardown: () => void;
  /** Wrap the given image; called when user clicks. */
  wrapImage: (img: HTMLImageElement) => Selection;
  /** Unwrap the given selection, restoring the original DOM. */
  unwrapSelection: (sel: Selection) => void;
  /** Update html collapsed class for sidebar collapse state. */
  setCollapsed: (collapsed: boolean) => void;
};

export type InstallOpts = {
  onPick: (img: HTMLImageElement) => void;
};

export function installHostPageIntegration(
  opts: InstallOpts,
): HostPageController {
  // Inject styles
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.textContent = `${hostCss}\n${overlayCss}`;
    document.head.appendChild(styleEl);
  }

  // Shift html + enable pick mode
  document.documentElement.classList.add(HTML_CLASS);
  document.body.classList.add(PICK_CLASS);

  // Click handler on images. Capture phase so we beat any host handlers
  // (especially navigation from <a> wrappers).
  const onClick = (e: MouseEvent) => {
    const t = e.target;
    if (!(t instanceof HTMLImageElement)) return;
    // Ignore clicks inside our own sidebar / wrapper images we've already managed
    if (t.classList.contains("__uib-managed")) return;
    if (!t.complete || t.naturalWidth === 0) {
      // Defer: image not ready
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    opts.onPick(t);
  };

  document.addEventListener("click", onClick, true);

  const teardown = () => {
    document.removeEventListener("click", onClick, true);
    document.documentElement.classList.remove(HTML_CLASS);
    document.documentElement.classList.remove("__uib-collapsed");
    document.body.classList.remove(PICK_CLASS);
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
  };

  const wrapImage = (img: HTMLImageElement): Selection => {
    const rect = img.getBoundingClientRect();
    const originalSrc = img.currentSrc || img.src;
    const originalParent = img.parentNode!;
    const originalNextSibling = img.nextSibling;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const displayW = rect.width;
    const displayH = rect.height;

    // Inspect the host's actual object-fit so we reproduce its visual.
    //   cover / fill (default) → cover scale (max ratio)
    //   contain / scale-down  → contain scale (min ratio)
    //   none                  → 1:1 (image at natural size, centered)
    const objectFit =
      window.getComputedStyle(img).objectFit || "fill";
    let scale: number;
    if (naturalW === 0 || naturalH === 0) {
      scale = 1;
    } else if (objectFit === "contain" || objectFit === "scale-down") {
      scale = Math.min(displayW / naturalW, displayH / naturalH);
      // scale-down never enlarges
      if (objectFit === "scale-down") scale = Math.min(scale, 1);
    } else if (objectFit === "none") {
      scale = 1;
    } else {
      // "fill" (default) and "cover" — best uniform match is cover scale.
      scale = Math.max(displayW / naturalW, displayH / naturalH);
    }
    const offsetX = (displayW - naturalW * scale) / 2;
    const offsetY = (displayH - naturalH * scale) / 2;

    const wrapper = document.createElement("div");
    wrapper.className = "__uib-wrapper";
    wrapper.style.width = displayW + "px";
    wrapper.style.height = displayH + "px";

    // Replace the img's place in the DOM with the wrapper, then move the img inside.
    originalParent.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    img.classList.add("__uib-managed", "__uib-selected");

    // Pre-apply the initial transform synchronously, before React renders.
    // Without this, the .__uib-managed CSS rules (width: auto / height: auto)
    // cause the image to paint at its natural size for one frame, which
    // looks like a brief zoom-in/crop flash.
    if (naturalW > 0 && naturalH > 0) {
      img.style.position = "absolute";
      img.style.left = "0";
      img.style.top = "0";
      img.style.width = naturalW + "px";
      img.style.height = naturalH + "px";
      img.style.transformOrigin = "0 0";
      img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    }

    return {
      el: img,
      wrapper,
      originalSrc,
      originalParent,
      originalNextSibling,
      naturalW,
      naturalH,
      displayW,
      displayH,
      initialTransform: { offsetX, offsetY, scale },
    };
  };

  const unwrapSelection = (sel: Selection) => {
    const { el, wrapper, originalSrc, originalParent, originalNextSibling } =
      sel;
    // Restore src
    el.src = originalSrc;
    el.classList.remove("__uib-managed", "__uib-selected");
    // Clear inline styles we may have applied via React
    el.removeAttribute("style");
    // Move image back to its original location
    if (originalParent.contains(wrapper)) {
      if (originalNextSibling) {
        originalParent.insertBefore(el, originalNextSibling);
      } else {
        originalParent.appendChild(el);
      }
      wrapper.parentNode?.removeChild(wrapper);
    } else if (wrapper.parentNode) {
      // Wrapper was moved (host page DOM mutation) — restore best-effort
      wrapper.parentNode.insertBefore(el, wrapper);
      wrapper.parentNode.removeChild(wrapper);
    }
  };

  const setCollapsed = (collapsed: boolean) => {
    document.documentElement.classList.toggle("__uib-collapsed", collapsed);
  };

  return { teardown, wrapImage, unwrapSelection, setCollapsed };
}
