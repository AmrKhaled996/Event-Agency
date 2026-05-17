import { useEffect, useState } from "react";
import { getCountries, getStates, getCities } from "../../../APIs/locationAPIs";
import { useTranslation } from "react-i18next";

export default function LocationSelect({
  id,
  label,
  locationType,
  dependsOn,
  formData,
  value,
  required,
  error,
  half,
  onChange,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const parentValue = dependsOn ? formData[dependsOn] : null;

  useEffect(() => {
    async function fetchData() {
      if (dependsOn && !parentValue) {
        setOptions([]);
        return;
      }

      try {
        setLoading(true);
        let response;
        if (locationType === "country") {
          response = await getCountries();
        } else if (locationType === "state") {
          response = await getStates(parentValue);
        } else if (locationType === "city") {
          response = await getCities(parentValue);
        }

        if (response?.data?.data) {
          setOptions(response.data.data);
        }
      } catch (err) {
        console.error(`Failed to fetch ${locationType}:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locationType, parentValue, dependsOn]);

  return (
    <div className={`${half ? "col-span-1" : "col-span-2"} flex flex-col gap-1.5`}>
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={loading || (dependsOn && !parentValue)}
        className={`w-full px-3 py-2 bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:bg-gray-50`}
      >
        <option value="">{loading ? t("common.actions.loading") : t("common.actions.select")}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
