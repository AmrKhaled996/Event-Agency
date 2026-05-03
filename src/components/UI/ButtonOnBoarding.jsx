import { useTranslation } from "react-i18next";

function ButtonOnBoarding({submit,data}) {
  const {t} = useTranslation();
  return (
    <div className="flex flex-row sm:flex-row gap-3 max-w-120 mx-auto">
      <button
        onClick={submit}
        className={`flex-1 h-12 bg-linear-to-r ${
          !data
            ? `bg-gray-300 `
            : `from-primary to-secandry hover:bg-primary/90 cursor-pointer `
        }hover:opacity-90  text-white text-2xl rounded-lg font-bold tracking-wide transition`}
      >
        {t("onboarding.continue")}
      </button>
    </div>
  );
}

export default ButtonOnBoarding;
