import { useState } from "react";
import { ImageFrame } from "./ImageFrame";
import { useUpload } from "./UploadProvider";

export function EditorCanvas() {
  const { acceptFile } = useUpload();
  const [dragOver, setDragOver] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setDragOver(true);
    }
  };

  const onDragLeave = (e: React.DragEvent) => {
    // Only clear when leaving the canvas itself, not bubbling from children
    if (e.currentTarget === e.target) setDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  };

  return (
    <div
      className={`canvas${dragOver ? " is-drag-over" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <ImageFrame />
    </div>
  );
}
