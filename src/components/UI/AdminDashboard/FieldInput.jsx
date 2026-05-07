const FieldInput = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-9 px-3 rounded-lg border border-gray-800  text-gray-300 text-sm outline-none focus:border-primary caret-primary"
      />
    </div>
  );
};

export default FieldInput;