import React from "react";

const validAccessors = ["images", ""];

const Table = ({ columns, data, globalActions }) => {

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg md:text-sm text-xs">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 font-semibold uppercase tracking-wider">
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 border-b border-gray-200">
                {column.header}
              </th>
            ))}
            {globalActions && <th className="px-6 py-3 border-b border-gray-200">Actions</th>}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${
                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 border-b border-gray-200 text-gray-700"
                >
                  {renderCellContent(column, row)}
                </td>
              ))}

              {globalActions && (
                <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                  <div className="flex gap-2">
                    {globalActions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.handler(row)}
                        className={`px-3 py-1 text-sm rounded-md ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to render cell content based on column type
const renderCellContent = (column, row) => {
  const value = row[column.accessor];

  // Handle tags
  if (column.accessor === "tags" && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-[#333] text-white rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  // Handle images
  if (validAccessors.includes(column.accessor) && value) {
    if (typeof value === "string") {
      return (
        <img
          src={value}
          alt="Image"
          className="w-12 h-12 object-cover rounded-md border border-gray-200"
        />
      );
    } else {
      return "Invalid image data";
    }
  }

  // Handle descriptions (ensure it's a string)
  if (column.accessor === "description" && typeof value === "string") {
    return (
      <p className="text-gray-600 text-sm truncate max-w-xs" title={value}>
        {value}
      </p>
    );
  }

  // Default rendering for other columns: Ensure value is a valid type
  if (value && typeof value === "object") {
    // If the value is an object, render it as a stringified JSON
    return JSON.stringify(value);
  }

  return value || "N/A";  // Fallback if value is null or undefined
};


export default Table;
