const DataTable = ({ cols, rows }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-primary border-b border-gray-800">
            {cols.map((c) => (
              <th
                key={c.key}
                className="px-4 py-2 text-left text-[10px] font-bold tracking-wider text-white whitespace-nowrap"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-gray-900 hover:bg-[#0d1117]"
            >
              {cols.map((c) => (
                <td
                  key={c.key}
                  className="px-4 py-2 text-gray-300 whitespace-nowrap"
                >
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;