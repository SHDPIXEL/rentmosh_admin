import React from "react";
import { BASE_URL } from "../lib/utils"; // Import BASE_URL

const validAccessors = ["images", "city_image", "category_image","subcategory_image","product_image","idProofImage"];

const Table = ({ columns, data, globalActions }) => {
  console.log(columns, data);
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
            {globalActions && (
              <th className="px-6 py-3 border-b border-gray-200">Actions</th>
            )}
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

  // Handle images (for city_image column)
  // console.log("Column accessor:", column.accessor);
  if (column.accessor === "city_image" && value) {
    // console.log("city_image value:", value);

    let imageArray = [];

    try {
      // Check if value is a string and looks like a JSON array
      if (typeof value === "string") {
        // console.log("Raw city_image string value before cleaning:", value);
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        // console.log("Cleaned city_image string:", cleanedValue);
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value; // If it's already an array, use it directly
      }
    } catch (error) {
      console.error("Error parsing city_image value:", error);
    }

    // console.log("Parsed city_image imageArray:", imageArray);
    // console.log(
    //   "Type of city_image imageArray:",
    //   Array.isArray(imageArray) ? "Array" : "Not Array"
    // );

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      // console.log("city_image imageUrl:", imageUrl);
      return (
        <>
          <img
            key="1"
            src={imageUrl}
            alt={`city_image`}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
          />
        </>
      );
    } else {
      // console.log("No images found in city_image array or array is empty.");
    }
  } else {
    // console.log(`No city_image value for column: ${column.accessor}`);
  }

  if (column.accessor === "category_image" && value) {
    // console.log("category_image value:", value);

    let imageArray = [];

    try {
      // Check if value is a string and looks like a JSON array
      if (typeof value === "string") {
        // console.log("Raw category_image string value before cleaning:", value);
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        // console.log("Cleaned category_image string:", cleanedValue);
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value; // If it's already an array, use it directly
      }
    } catch (error) {
      console.error("Error parsing category_image value:", error);
    }

    // console.log("Parsed category_image imageArray:", imageArray);
    // console.log(
    //   "Type of category_image imageArray:",
    //   Array.isArray(imageArray) ? "Array" : "Not Array"
    // );

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      // console.log("category_image imageUrl:", imageUrl);
      return (
        <>
          <img
            key="1"
            src={imageUrl}
            alt={`category_image`}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
          />
        </>
      );
    } else {
      // console.log("No images found in category_image array or array is empty.");
    }
  } else {
    // console.log(`No category_image value for column: ${column.accessor}`);
  }

  if (column.accessor === "product_image" && value) {
    //console.log("product_image value:", value);

    let imageArray = [];

    try {
      // Check if value is a string and looks like a JSON array
      if (typeof value === "string") {
        // console.log("Raw product_image string value before cleaning:", value);
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        // console.log("Cleaned product_image string:", cleanedValue);
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value; // If it's already an array, use it directly
      }
    } catch (error) {
      console.error("Error parsing product_image value:", error);
    }

    // console.log("Parsed product_image imageArray:", imageArray);
    // console.log(
    //   "Type of product_image imageArray:",
    //   Array.isArray(imageArray) ? "Array" : "Not Array"
    // );

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      // console.log("product_image imageUrl:", imageUrl);
      return (
        <>
          <img
            key="1"
            src={imageUrl}
            alt={`product_image`}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
          />
        </>
      );
    } else {
      // console.log("No images found in product_image array or array is empty.");
    }
  } else {
    // console.log(`No product_image value for column: ${column.accessor}`);
  }

  
  if (column.accessor === "subcategory_image" && value) {
    //console.log("subcategory_image value:", value);

    let imageArray = [];

    try {
      // Check if value is a string and looks like a JSON array
      if (typeof value === "string") {
        // console.log("Raw subcategory_image string value before cleaning:", value);
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        // console.log("Cleaned subcategory_image string:", cleanedValue);
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value; // If it's already an array, use it directly
      }
    } catch (error) {
      console.error("Error parsing product_image value:", error);
    }

    // console.log("Parsed subcategory_image imageArray:", imageArray);
    // console.log(
    //   "Type of subcategory_image imageArray:",
    //   Array.isArray(imageArray) ? "Array" : "Not Array"
    // );

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      // console.log("subcategory_image imageUrl:", imageUrl);
      return (
        <>
          <img
            key="1"
            src={imageUrl}
            alt={`subcategory_image`}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
          />
        </>
      );
    } else {
      // console.log("No images found in subcategory_image array or array is empty.");
    }
  } else {
    // console.log(`No subcategory_image value for column: ${column.accessor}`);
  }

  if (column.accessor === "idProofImage" && value) {
    //console.log("idProofImage value:", value);

    let imageArray = [];

    try {
      // Check if value is a string and looks like a JSON array
      if (typeof value === "string") {
        // console.log("Raw idProofImage string value before cleaning:", value);
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        // console.log("Cleaned idProofImage string:", cleanedValue);
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value; // If it's already an array, use it directly
      }
    } catch (error) {
      console.error("Error parsing product_image value:", error);
    }

    // console.log("Parsed idProofImage imageArray:", imageArray);
    // console.log(
    //   "Type of idProofImage imageArray:",
    //   Array.isArray(imageArray) ? "Array" : "Not Array"
    // );

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      // console.log("idProofImage imageUrl:", imageUrl);
      return (
        <>
          <img
            key="1"
            src={imageUrl}
            alt={`idProofImage`}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
          />
        </>
      );
    } else {
      // console.log("No images found in idProofImage array or array is empty.");
    }
  } else {
    // console.log(`No idProofImage value for column: ${column.accessor}`);
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

  return value || "N/A"; // Fallback if value is null or undefined
};

export default Table;
