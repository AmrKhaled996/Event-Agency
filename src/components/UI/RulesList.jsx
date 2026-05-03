import { useTranslation } from "react-i18next";

export function RulesList({ rules = [] }) {
  const {t}=useTranslation();
  if (!rules.length) return null;
  return (<>
    <h2 className="text-xl font-semibold mb-2">{t("events.details.rules")}</h2>
    <ul className="flex flex-col gap-1.5  mb-6">
      {rules.map((rule, i) => (
        <li key={i} className="flex  gap-2.5 text-lg text-gray-700 items-center">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
          {rule}
        </li>
      ))}
    </ul>
  </>
  );
}