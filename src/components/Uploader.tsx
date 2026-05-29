import { useUpload } from "./UploadProvider";

export function Uploader() {
  const { openFilePicker } = useUpload();
  return (
    <button className="upload-btn" type="button" onClick={openFilePicker}>
      Upload image
    </button>
  );
}
