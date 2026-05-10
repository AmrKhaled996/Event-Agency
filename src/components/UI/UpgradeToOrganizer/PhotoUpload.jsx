import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * PhotoUpload
 * Drag-and-drop / click-to-upload for profile images.
 *
 * Props:
 *  - label        {string}
 *  - required     {boolean}
 *  - error        {string|null}
 *  - onFileChange {(file: File) => void}
 */
export default function PhotoUpload({ label, required, error, onFileChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useTranslation();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onFileChange(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-secandry ml-0.5">*</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-colors py-8 ${
          error
            ? "border-red-400 bg-red-50"
            : dragging
            ? "border-primary bg-primary/5"
            : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-20 w-20 rounded-full object-cover border-2 border-primary/30"
          />
        ) : (
          <>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                error ? "bg-red-100" : "bg-primary/10"
              }`}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={error ? "#f87171" : "#BB52E0"}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-sm text-gray-500">{t("upgradeToOrganizer.upload.clickOrDrag")}</p>
            <p className="text-xs text-gray-400">{t("upgradeToOrganizer.upload.photoHint")}</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span>{error}
        </p>
      )}
    </div>
  );
}

