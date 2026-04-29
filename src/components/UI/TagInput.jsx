import { X } from "lucide-react";
import { useState, useRef } from "react";

const MAX_TAGS = 10;
const MAX_WORDS = 3;

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const internalTags = onChange ? tags : undefined;
  const [localTags, setLocalTags] = useState([]);
  const activeTags = onChange ? tags : localTags;
  const setActiveTags = onChange ? onChange : setLocalTags;

  function addTag() {
    const val = input.trim();
    setError("");
    if (!val) return;
    const words = val.split(/\s+/).filter(Boolean);
    if (words.length > MAX_WORDS) { setError("Tags can have at most 3 words."); return; }
    if (activeTags.length >= MAX_TAGS) { setError("Maximum of 10 tags reached."); return; }
    if (activeTags.map((t) => t.toLowerCase()).includes(val.toLowerCase())) { setError("This tag already exists."); return; }
    setActiveTags([...activeTags, val]);
    setInput("");
    inputRef.current?.focus();
  }

  function removeTag(i) {
    setActiveTags(activeTags.filter((_, idx) => idx !== i));
    console.log(activeTags)
    setError("");
  }

  return (
    <div
      className="rounded-2xl mb-6"
      
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
  
        <h2 className="text-base text-md font-medium w-fit" >Tags<strong className="text-red-600 text-lg">*</strong></h2>
      </div>
      <p className="text-xs mb-4" style={{ color: "#a0a0a0" }}>
        Add up to {MAX_TAGS} tags · max {MAX_WORDS} words each
      </p>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="e.g. machine learning …"
          maxLength={40}
          className="flex-1 h-10 rounded-xl px-4 text-sm outline-none border transition-all duration-150"
          style={{ borderColor: error ? "#FF49B5" : "#e4c6f5", background: "#fff", color: "#1a1a1a" }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 0 3px rgba(187,82,224,0.15)")}
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        />
        <button
          onClick={addTag}
          disabled={activeTags.length >= MAX_TAGS}
          className="h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: "#BB52E0" }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.filter = "brightness(0.88)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Add tag
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs mt-1.5 font-medium" style={{ color: "#FF49B5" }}>{error}</p>
      )}

      {/* Badges */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeTags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 border text-primary border-primary/80 rounded-full text-sm font-medium bg-primary/5"

            >
              {tag}
              <button
                onClick={() => removeTag(i)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 transition-all duration-150 hover:scale-102 hover:cursor-pointer bg-primary"
                
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Counter */}
      {activeTags.length > 0 && (
        <p className="text-xs mt-3" style={{ color: "#a78bab" }}>
          <span style={{ color: "#BB52E0", fontWeight: 600 }}>{activeTags.length}</span> / 10 tags used
        </p>
      )}
    </div>
  );
}
