import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAllTags } from "../../APIs/eventApis";

const MAX_TAGS = 10;
const MAX_WORDS = 3;

export default function TagInput({ tags = [], setTags }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [localTags, setLocalTags] = useState([]);
  const activeTags = setTags ? tags : localTags;
  const setActiveTags = setTags ? setTags : setLocalTags;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length > 1) {
        try {
          const response = await getAllTags(input.trim());
          const fetchedTags = response.data.data.tags || [];
          // Filter out tags that are already selected
          const filtered = fetchedTags
            .map(t => typeof t === 'string' ? t : t.name)
            .filter(tagName => !activeTags.map(at => at.toLowerCase()).includes(tagName.toLowerCase()));
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        } catch (err) {
          console.error("Failed to fetch tags", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [input, activeTags]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(tagName = input) {
    const val = tagName.trim();
    setError("");
    if (!val) return;
    const words = val.split(/\s+/).filter(Boolean);
    if (words.length > MAX_WORDS) {
      setError(t("ui.tags.errors.words", { count: MAX_WORDS }));
      return;
    }
    if (activeTags.length >= MAX_TAGS) {
      setError(t("ui.tags.errors.max", { count: MAX_TAGS }));
      return;
    }
    if (activeTags.map((t) => t.toLowerCase()).includes(val.toLowerCase())) {
      setError(t("ui.tags.errors.exists"));
      return;
    }
    setActiveTags([...activeTags, val]);
    if (setTags) setTags([...activeTags, val]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(i) {
    const updated = activeTags.filter((_, idx) => idx !== i);
    setActiveTags(updated);
    if (setTags) setTags(updated);
    setError("");
  }

  return (
    <div className="rounded-2xl mb-6 relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base text-md font-medium w-fit" >{t("ui.tags.title")}<strong className="text-red-600 text-lg">*</strong></h2>
      </div>
      <p className="text-xs mb-4" style={{ color: "#a0a0a0" }}>
        {t("ui.tags.desc", { max: MAX_TAGS, words: MAX_WORDS })}
      </p>

      {/* Input row */}
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            onFocus={() => input.trim().length > 1 && setSuggestions.length > 0 && setShowSuggestions(true)}
            placeholder={t("ui.tags.placeholder")}
            maxLength={40}
            className="w-full h-10 rounded-xl px-4 text-sm outline-none border transition-all duration-150"
            style={{ borderColor: error ? "#FF49B5" : "#e4c6f5", background: "#fff", color: "#1a1a1a" }}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors"
                  onClick={() => addTag(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => addTag()}
          disabled={activeTags.length >= MAX_TAGS}
          className="h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          style={{ background: "#BB52E0" }}
        >
          {t("ui.tags.addButton")}
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
          <span style={{ color: "#BB52E0", fontWeight: 600 }}>{activeTags.length}</span> / {MAX_TAGS} {t("ui.tags.used")}
        </p>
      )}
    </div>
  );
}

