import { X } from "lucide-react";
import { useState, useRef } from "react";

export default function RulesInput({ rules = [], onChange }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const [localRules, setLocalRules] = useState([]);
  const activeRules = onChange ? rules : localRules;
  const setActiveRules = onChange ? onChange : setLocalRules;

  function addRule() {
    const val = input.trim();
    setError("");
    if (!val) return;
    setActiveRules([...activeRules, val]);
    setInput("");
    inputRef.current?.focus();
  }

  function removeRule(i) {
    setActiveRules(activeRules.filter((_, idx) => idx !== i));
  }

  return (
    <div
      className="rounded-2xl  mb-6 mt-3"

    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        
        <h2 className="text-base text-md font-medium w-fit">Restrictions & Rules </h2>
      </div>
      <p className="text-xs mb-4 text-slate-400">
        Define the rules that apply 
      </p>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && addRule()}
          placeholder="e.g. No offensive language allowed …"
          maxLength={200}
          className="flex-1 h-10 rounded-xl px-4 text-sm outline-none border transition-all duration-150"
          style={{ borderColor: error ? "#FF49B5" : "#ffc8e8", background: "#fff", color: "#1a1a1a" }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(255,73,181,0.15)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <button
          onClick={addRule}
          className="h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95 flex-shrink-0"
          style={{ background: "#FF49B5" }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.88)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Add rule
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: "#FF49B5" }}>{error}</p>
      )}

      {/* Bulleted list */}
      {activeRules.length > 0 && (
        <ul className="mt-4 flex flex-col gap-0">
          {activeRules.map((rule, i) => (
            <li key={i} className="flex items-center gap-3 group p-2">
              <span
                className=" w-2 h-2 rounded-full shrink-0"
                style={{ background: "#FF49B5" }}
              />
              <span className=" flex-1 leading-relaxed" >
                {rule}
              </span>
              <button
                onClick={() => removeRule(i)}
                className="text-lg leading-none hover:cursor-pointer group-hover:opacity-100 transition-opacity duration-150 shrink-0"
                style={{ color: "#FF49B5" }}
              >
                <X />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Count */}
      {activeRules.length > 0 && (
        <p className="text-sm mt-3" >
          <span style={{ color: "#FF49B5", fontWeight: 600 }}>{activeRules.length}</span>{" "}
          {activeRules.length === 1 ? "rule" : "rules"} added
        </p>
      )}
    </div>
  );
}
