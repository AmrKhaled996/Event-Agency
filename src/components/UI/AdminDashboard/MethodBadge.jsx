const MethodBadge = ({ method }) => {
  const map = {
    GET: ["bg-[#0e3d2a]", "text-green-400"],
    POST: ["bg-[#1e3a5f]", "text-blue-400"],
    PATCH: ["bg-[#3d2a00]", "text-yellow-400"],
    DELETE: ["bg-[#3d0e0e]", "text-red-400"],
    DEL: ["bg-[#3d0e0e]", "text-red-400"],
  };

  const [bg, color] = map[method] || map.GET;

  return (
    <span
      className={`px-[6px] py-[1px] rounded text-[9px] font-black tracking-widest font-mono ${bg} ${color}`}
    >
      {method === "DELETE" ? "DEL" : method}
    </span>
  );
};

export default MethodBadge;