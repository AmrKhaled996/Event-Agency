const JsonBox = ({ data }) => {
  if (!data) return null;

  return (
    <pre className="mt-3 p-3 rounded-lg text-[11px] leading-6 overflow-x-auto bg-[#080d14] text-green-400 border border-[#0e3d2a] font-mono">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default JsonBox;