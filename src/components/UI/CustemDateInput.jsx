
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

export default function CustomDateInput({ selected, onChange, ...props }) {
  const {t} = useTranslation();
  return (
    <div className="mb-10 flex flex-col items-center w-full">
      <label htmlFor="date" className="block text-lg font-bold mb-3">
        {t("onboarding.personlityinfo.dateLabel")}
      </label>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={t("onboarding.personlityinfo.datePlaceholder")}
        
        className="w-100 max-w-sm rounded-lg border px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200"
        showMonthDropdown
        showYearDropdown
        dropdownMode="scroll"
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date(2018 , 0 , 1)}
        {...props}
      />
    </div>
  );
}
