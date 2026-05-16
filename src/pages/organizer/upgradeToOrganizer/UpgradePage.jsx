import { ArrowLeft } from "lucide-react";
import SuccessScreen from "./SuccessScreen";
import CategorySelector from "../../../components/UI/UpgradeToOrganizer/CategorySelector";
import DynamicForm from "../../../components/UI/UpgradeToOrganizer/DynamicForm";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

import {
  categories,
  fields,
  subtitles,
} from "../../../constants/upgradeConfig";
import { useUpgradeForm } from "../../../Hooks/useUpgradeForm";
import useAppNavigate from "../../../Router/useAppNavigate";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";

export default function UpgradePage() {
  const navigate = useAppNavigate();
  const { t } = useTranslation();


  const {
    selected,
    formData,
    fileData,
    socialData,
    errors,
    socialErrors,
    submitted,
    openDialog,
    dialogMessage,
    loading,
    handleCategorySelect,
    handleFieldChange,
    handleFieldBlur,
    handleFileChange,
    handleSocialChange,
    handleSocialErrorChange,
    handleSubmit,
    handleReset,
    closeDialog,
  } = useUpgradeForm();

  if (submitted) {
    return <SuccessScreen category={selected} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <Title>{t("upgradeToOrganizer.page.title") || "Fa3liat | Upgrade to Organizer"}</Title>
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300"
      >
        <ArrowLeft size={20} className="text-slate-900" />
      </button>

      {/* Category selector */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-slate-700">
          {t("upgradeToOrganizer.page.selectionCategory")}
        </h3>
        <CategorySelector
          categories={categories}
          selected={selected}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Dynamic form */}
      <DynamicForm
        title={t("upgradeToOrganizer.page.personalInfo")}
        subtitle={subtitles[selected]}
        fields={fields[selected]}
        formData={formData}
        fileData={fileData}
        socialData={socialData}
        errors={errors}
        socialErrors={socialErrors}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
        onFileChange={handleFileChange}
        onSocialChange={handleSocialChange}
        onSocialErrorChange={handleSocialErrorChange}
      />

      {/* Footer */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 text-sm font-medium text-white rounded-xl bg-primary hover:bg-secandry transition-colors"
        >
          {t("upgradeToOrganizer.page.submitUpgrade")}
        </button>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={closeDialog}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}

