import { useState } from "react";
import { SOCIAL_PLATFORMS } from "../../../constants/upgradeConfig";
import { validateUrl } from "../../../utils/UpgradeValidation";
import { useTranslation } from "react-i18next";


/**
 * SocialLinksField
 * Manages a dynamic list of social / web link rows.
 *
 * Props:
 *  - value          {Object}  { [platformId]: url }
 *  - onChange       {(newValue: Object) => void}
 *  - errors         {Object}  { [platformId]: errorMessage }
 *  - onErrorChange  {(platformId: string, error: string|null) => void}
 */
export default function SocialLinksField({ value = {}, onChange, errors = {}, onErrorChange }) {
  const [rows, setRows] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [addError, setAddError] = useState("");
  const { t } = useTranslation();

  const usedPlatformIds = rows.map((r) => r.platformId);
  const availablePlatforms = SOCIAL_PLATFORMS.filter((p) => !usedPlatformIds.includes(p.id));

  const handleAdd = () => {
    if (!selectedPlatform) { setAddError("upgradeToOrganizer.validation.selectPlatform"); return; }
    if (!inputUrl.trim())   { setAddError("upgradeToOrganizer.validation.enterUrl"); return; }
    const urlErr = validateUrl(inputUrl);
    if (urlErr) { setAddError(urlErr); return; }

    const newRows = [...rows, { platformId: selectedPlatform, url: inputUrl.trim() }];
    setRows(newRows);
    onChange({ ...value, [selectedPlatform]: inputUrl.trim() });
    setSelectedPlatform("");
    setInputUrl("");
    setAddError("");
  };

  const handleRemove = (platformId) => {
    const newRows = rows.filter((r) => r.platformId !== platformId);
    setRows(newRows);
    const newVal = { ...value };
    delete newVal[platformId];
    onChange(newVal);
  };

  const handleRowChange = (platformId, url) => {
    const newRows = rows.map((r) => r.platformId === platformId ? { ...r, url } : r);
    setRows(newRows);
    onChange({ ...value, [platformId]: url });
    if (errors[platformId] && !validateUrl(url)) {
      onErrorChange(platformId, null);
    }
  };

  const handleRowBlur = (platformId, url) => {
    const err = validateUrl(url);
    onErrorChange(platformId, err);
  };

  return (
    <div className="col-span-2 flex flex-col gap-3">
      <div>
        <label className="text-sm font-medium text-gray-700">{t("upgradeToOrganizer.social.label")}</label>
        <p className="text-xs text-gray-400 mt-0.5">{t("upgradeToOrganizer.social.optional")}</p>
      </div>

      {/* Existing rows */}
      {rows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map(({ platformId, url }) => {
            const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId);
            const rowError = errors[platformId];
            return (
              <div key={platformId} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {/* Platform badge */}
                  <div className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg border border-gray-200 bg-gray-50 text-gray-600 whitespace-nowrap min-w-[120px]">
                    <span className="text-primary">{platform?.icon}</span>
                    {t(platform?.label)}
                  </div>

                  {/* URL input */}
                  <input
                    type="url"
                    value={url}
                    placeholder={t(platform?.placeholder)}
                    onChange={(e) => handleRowChange(platformId, e.target.value)}
                    onBlur={(e) => handleRowBlur(platformId, e.target.value)}
                    className={`flex-1 px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${
                      rowError
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(platformId)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 hover:bg-red-50 transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {rowError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
                    <span>⚠</span>{t(rowError)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add new row */}
      {availablePlatforms.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            {/* Platform dropdown */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedPlatform}
                onChange={(e) => { setSelectedPlatform(e.target.value); setAddError(""); }}
                className={`w-full appearance-none px-3 py-2.5 pr-8 text-sm border rounded-lg bg-white text-gray-800 outline-none cursor-pointer transition-all ${
                  addError && !selectedPlatform
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}
              >
                <option value="">{t("upgradeToOrganizer.social.selectPlatform")}</option>
                {availablePlatforms.map((p) => (
                  <option key={p.id} value={p.id}>{t(p.label)}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* URL input */}
            <input
              type="url"
              value={inputUrl}
              placeholder={
                selectedPlatform
                  ? t(SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)?.placeholder)
                  : t("upgradeToOrganizer.fields.placeholders.social")
              }
              onChange={(e) => { setInputUrl(e.target.value); setAddError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`flex-1 px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${
                addError && selectedPlatform
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
            />

            {/* Plus button */}
            <button
              onClick={handleAdd}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-primary/40 text-primary bg-primary/5 hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>

          {addError && (
            <p className="text-xs text-red-500 flex items-center gap-1 pl-1">
              <span>⚠</span>{t(addError)}
            </p>
          )}
        </div>
      )}

      {/* All platforms added */}
      {availablePlatforms.length === 0 && rows.length > 0 && (
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#BB52E0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {t("upgradeToOrganizer.social.allAdded")}
        </p>
      )}
    </div>
  );
}

