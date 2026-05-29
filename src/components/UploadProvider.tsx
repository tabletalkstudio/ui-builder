import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useDispatch } from "../state";

type Pending = { src: string; w: number; h: number };

type UploadApi = {
  openFilePicker: () => void;
  acceptFile: (file: File) => void;
};

const UploadCtx = createContext<UploadApi>({
  openFilePicker: () => {},
  acceptFile: () => {},
});

export function useUpload() {
  return useContext(UploadCtx);
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);

  const acceptFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPending({ src, w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = src;
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const commit = (is2x: boolean) => {
    if (!pending) return;
    dispatch({
      type: "setImage",
      src: pending.src,
      naturalW: pending.w,
      naturalH: pending.h,
      is2x,
    });
    setPending(null);
  };

  return (
    <UploadCtx.Provider value={{ openFilePicker, acceptFile }}>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ display: "none" }}
      />
      {pending && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h3>Is this a @2x image?</h3>
            <p>
              The image is {pending.w} × {pending.h} px. If it's a @2x asset, we
              should halve the working dimensions.
            </p>
            <div className="modal-actions">
              <button onClick={() => commit(false)}>No, use as-is</button>
              <button className="primary" onClick={() => commit(true)}>
                Yes, treat as @2x
              </button>
            </div>
          </div>
        </div>
      )}
    </UploadCtx.Provider>
  );
}
