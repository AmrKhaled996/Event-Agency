import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * PdfUpload
 * Drag-and-drop / click-to-upload for PDF documents.
 *
 * Props:
 *  - label        {string}
 *  - required     {boolean}
 *  - error        {string|null}
 *  - onFileChange {(file: File) => void}
 */
export default function PdfUpload({ label, required, error, onFileChange }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useTranslation();

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
        </div>

        {fileName ? (
          <p className="text-sm text-primary font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500">{t("upgradeToOrganizer.upload.clickOrDrag")}</p>
            <p className="text-xs text-gray-400">{t("upgradeToOrganizer.upload.pdfHint")}</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
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

