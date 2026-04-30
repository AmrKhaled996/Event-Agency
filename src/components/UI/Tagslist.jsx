export function TagsList({ tags = [] }) {
  if (!tags.length) return null;
  return (<>
  <h2 className="text-xl font-semibold mb-2">Event Tags</h2>
    <div className="flex flex-wrap gap-2 mt-4 mb-6 ">
      {tags.map((tag, i) => (
          <span
          key={i}
          className="px-3 py-1 rounded-full  font-medium bg-gray-100 text-gray-600 border border-gray-200"
        >
          {tag}
        </span>
      ))}
    </div>
      </>
  );
}
 