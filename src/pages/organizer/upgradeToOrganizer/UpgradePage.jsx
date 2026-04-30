import { ArrowLeft } from "lucide-react";
import SuccessScreen from "./SuccessScreen";
import CategorySelector from "../../../components/UI/UpgradeToOrganizer/CategorySelector";
import DynamicForm from "../../../components/UI/UpgradeToOrganizer/DynamicForm";

import {
  categories,
  fields,
  subtitles,
} from "../../../constants/upgradeConfig";
import { useUpgradeForm } from "../../../Hooks/useUpgradeForm";
import useAppNavigate from "../../../Router/useAppNavigate";
// import { useUpgradeForm } from "../hooks/useUpgradeForm";
// import CategorySelector from "../components/upgrade/CategorySelector";
// import DynamicForm from "../components/upgrade/DynamicForm";
// import SuccessScreen from "../components/upgrade/SuccessScreen";

export default function UpgradePage() {
  const navigate = useAppNavigate();

  const {
    selected,
    formData,
    fileData,
    socialData,
    errors,
    socialErrors,
    submitted,
    handleCategorySelect,
    handleFieldChange,
    handleFieldBlur,
    handleFileChange,
    handleSocialChange,
    handleSocialErrorChange,
    handleSubmit,
    handleReset,
  } = useUpgradeForm();

  if (submitted) {
    return <SuccessScreen category={selected} onReset={handleReset} />;
  }
  const submiting = () => {
    console.log(
      "formData:",
      formData,
      "fileDate:",
      fileData,
      "socialData:",
      socialData,
    );
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300"
      >
        <ArrowLeft size={20} className="text-slate-900" />
      </button>

      {/* Category selector */}
      <CategorySelector
        categories={categories}
        selected={selected}
        onSelect={handleCategorySelect}
      />

      {/* Dynamic form */}
      <DynamicForm
        title="Personal Information"
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
          Submit Upgrade
        </button>
      </div>
    </div>
  );
}
