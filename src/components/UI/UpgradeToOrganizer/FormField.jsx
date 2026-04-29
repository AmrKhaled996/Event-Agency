import WarningIcon from "../../Icons/WarningIcon";

/**
 * FormField
 * Renders a single labeled text/email/tel input with inline error display.
 *
 * Props:
 *  - id        {string}   HTML id and name
 *  - label     {string}
 *  - type      {string}   "text" | "email" | "tel" | "url" etc.
 *  - placeholder {string}
 *  - value     {string}
 *  - required  {boolean}
 *  - error     {string|null}
 *  - half      {boolean}  If false, spans full grid width (col-span-2)
 *  - onChange  {(id, value) => void}
 *  - onBlur    {(id, value) => void}
 */
export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  required,
  error,
  half,
  onChange,
  onBlur,
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? "" : "col-span-2"}`}>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-secandry ml-0.5">*</span>}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={(e) => onBlur(id, e.target.value)}
        className={`px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-800 placeholder-gray-400 outline-none transition-all ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-4 h-4"><WarningIcon /></span>{error}
        </p>
      )}
    </div>
  );
}
