/**
 * CategorySelector
 * Renders the three category cards (Hobbies / Business / Company).
 *
 * Props:
 *  - categories  {Array}   from upgradeConfig
 *  - selected    {string}  currently active category id
 *  - onSelect    {(id: string) => void}
 */
export default function CategorySelector({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
        Selection category
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col gap-1.5 p-4 rounded-xl border text-left w-60 transition-all ${
              selected === cat.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            <span className={selected === cat.id ? "text-primary" : "text-gray-400"}>
              {cat.icon}
            </span>
            <span
              className={`text-sm font-medium ${
                selected === cat.id ? "text-primary" : "text-gray-800"
              }`}
            >
              {cat.label}
            </span>
            <span className="text-xs text-gray-400 leading-snug">{cat.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
