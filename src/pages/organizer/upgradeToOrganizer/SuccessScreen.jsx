import { useTranslation } from "react-i18next";

/**
 * SuccessScreen
 * Shown after a successful form submission.
 *
 * Props:
 *  - category  {string}   e.g. "hobbies"
 *  - onReset   {() => void}
 */
export default function SuccessScreen({ category, onReset }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#BB52E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h2 className="text-2xl font-medium text-gray-900">
        {t("upgradeToOrganizer.success.title")}
      </h2>
      <p className="text-sm text-gray-400">
        {t("upgradeToOrganizer.success.description", {
          category: t(`upgradeToOrganizer.categories.${category}.label`),
        })}
      </p>

      <button
        onClick={onReset}
        className="mt-4 px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-primary hover:bg-secandry transition-colors"
      >
        {t("upgradeToOrganizer.success.submitAnother")}
      </button>
    </div>
  );
}

