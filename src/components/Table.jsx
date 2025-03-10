import React, { useState } from "react";
import { Download, Loader } from "lucide-react";
import { BASE_URL } from "../lib/utils"; // Import BASE_URL

const validAccessors = [
  "images",
  "city_image",
  "category_image",
  "subcategory_image",
  "product_image",
  "idProofImage",
];

const Table = ({
  columns,
  data,
  globalActions,
  toggleInStock,
  downloadInvoice,
  markOrderAsDelivered,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg md:text-sm text-xs">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100 text-center text-gray-600 font-semibold uppercase tracking-wider">
            {columns.map((column, index) => (
              <th key={index} className="px-6 py-3 text-center border-b border-gray-200">
                {column.header}
              </th>
            ))}
            {globalActions && (
              <th className="px-6 py-3 border-b text-center border-gray-200">Actions</th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {[...data].reverse().map(
            (
              row,
              rowIndex // Reverse data here
            ) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 border-b text-center border-gray-200 text-gray-700"
                  >
                    {renderCellContent(
                      column,
                      row,
                      toggleInStock,
                      downloadInvoice,
                      markOrderAsDelivered
                    )}
                  </td>
                ))}

                {globalActions && (
                  <td className="px-6 py-4 border-b text-center border-gray-200 text-gray-700">
                    {row.status === "Verified" ||
                    row.orderStatus === "Delivered" ? (
                      <span className="text-gray-400">---</span> // Remove all actions if Delivered or Verified
                    ) : row.orderStatus === "Processing" ? (
                      <div className="flex justify-center text-center gap-2">
                        {globalActions
                          .filter((action) => action.label === "Download") // Only show "Download" action
                          .map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.handler(row)}
                              className={`px-3 py-1 text-sm text-center rounded-md ${action.className}`}
                            >
                              {action.label}
                            </button>
                          ))}

                        {/* Manually Add Delivered Button when orderStatus is Processing */}
                        <button
                          onClick={() => markOrderAsDelivered(row)}
                          className="px-3 py-1 text-sm text-center rounded-md bg-green-200 text-green-700 hover:bg-green-700 hover:text-green-200 transition-all"
                        >
                          Delivered
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center gap-2">
                        {globalActions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.handler(row)}
                            className={`px-3 py-1 text-sm text-center rounded-md ${action.className}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to render cell content based on column type
const renderCellContent = (column, row, toggleInStock, downloadInvoice) => {
  const value = row[column.accessor];

  if (column.accessor === "user.name") {
    return <span>{row.user?.name || "N/A"}</span>;
  }

  if (column.accessor === "user.email") {
    return <span>{row.user?.email || "N/A"}</span>;
  }

  if (column.accessor === "user.phone") {
    return <span>{row.user?.phone || "N/A"}</span>;
  }
  if (column.accessor === "orderItems.productTitle") {
    return <span>{row.orderItems[0]?.productTitle || "N/A"}</span>;
  }
  if (column.accessor === "kycStatus") {
    return (
      <span
        className={`px-4 py-1 text-sm font-medium rounded-md min-w-[120px] text-center whitespace-nowrap ${
          row.kycStatus === "Verified" || row.KYC?.status === "Active"
            ? "bg-green-200 text-green-700"
            : row.kycStatus === "Reverification needed" ||
              row.KYC?.status === "Inactive"
            ? "bg-red-200 text-red-700"
            : "bg-yellow-200 text-yellow-700"
        }`}
      >
        {row.kycStatus || "N/A"}
      </span>
    );
  }
  if (column.accessor === "Address.fullAddress") {
    return <span>{row.Address?.address || "N/A"}</span>;
  }
  if (column.accessor === "Address.nearestLandmark") {
    return <span>{row.Address?.nearestLandmark || "N/A"}</span>;
  }
  if (column.accessor === "Address.city") {
    return <span>{row.Address?.city || "N/A"}</span>;
  }
  if (column.accessor === "Address.state") {
    return <span>{row.Address?.state || "N/A"}</span>;
  }
  if (column.accessor === "Address.postalCode") {
    return <span>{row.Address?.postalCode || "N/A"}</span>;
  }
  if (column.accessor === "date") {
    const dateObj = new Date(row.date);
    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let formattedTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Ensures AM/PM format
      timeZone: "Asia/Kolkata",
    });

    formattedTime = formattedTime.replace(/(am|pm)/i, (match) =>
      match.toUpperCase()
    );

    return <span>{`${formattedDate} ${formattedTime}`}</span>;
  }

  if (column.accessor === "category.name") {
    return <span>{row.category?.name || "N/A"}</span>;
  }

  if (column.accessor === "createdAt") {
    const dateObj = new Date(row.createdAt);
    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    let formattedTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Ensures AM/PM format
      timeZone: "Asia/Kolkata",
    });

    formattedTime = formattedTime.replace(/(am|pm)/i, (match) =>
      match.toUpperCase()
    );

    return <span>{`${formattedDate} ${formattedTime}`}</span>;
  }

  // Render checkbox for inStock column
  if (column.accessor === "inStock") {
    return (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={row.inStock === true}
          onChange={() => toggleInStock(row)} // This will properly handle the toggle
          className="w-6 h-6 cursor-pointer rounded-full border-2 border-gray-400 checked:bg-[#960B22] checked:border-[#960B22] checked:accent-[#960B22] focus:ring-0"
        />
      </div>
    );
  }

  if (column.accessor === "status") {
    return (
      <div className="">
        <span
          className={`px-2 py-1 text-sm font-medium rounded-md ${
            row.status === "Verified" || row.status === "Active"
              ? "bg-green-200 text-green-700"
              : row.status === "Reverification needed" ||
                row.status === "Inactive"
              ? "bg-red-200 text-red-700"
              : "bg-yellow-200 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      </div>
    );
  }

  if (column.accessor === "orderStatus") {
    return (
      <div className="">
        <span
          className={`px-2 py-1 text-sm font-medium rounded-md ${
            row.orderStatus === "Delivered"
              ? "bg-green-200 text-green-700"
              : row.orderStatus === "Processing"
              ? "bg-blue-200 text-blue-700"
              : "bg-yellow-200 text-yellow-700"
          }`}
        >
          {row.orderStatus}
        </span>
      </div>
    );
  }

  // Handle download button for invoice
  if (column.accessor === "download") {
    return (
      <div className="flex justify-center items-center">
        <DownloadButton
          downloadInvoice={downloadInvoice}
          userId={row.user?.id}
          orderId={row.orderId}
        />
      </div>
    );
  }

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
  if (column.accessor === "city_image" && value) {
    let imageArray = [];

    try {
      // Check if value is a JSON string (array) or a single string (file path)
      if (typeof value === "string") {
        // console.log("Raw city_image string value before processing:", value);

        // If the value looks like a JSON array, parse it
        if (value.startsWith("[") && value.endsWith("]")) {
          imageArray = JSON.parse(value);
        } else {
          // If it's a single string, wrap it in an array
          imageArray = [value];
        }
      } else if (Array.isArray(value)) {
        // If it's already an array, use it directly
        imageArray = value;
      }
    } catch (error) {
      console.error("Error parsing city_image value:", error);
    }

    // console.log("Parsed city_image imageArray:", imageArray);

    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageUrl = `${BASE_URL}/${imageArray[0]}`; // Use the first image in the array
      return (
        <img
          key="1"
          src={imageUrl}
          alt="city_image"
          className="w-12 h-12 object-cover rounded-md border border-gray-200 hover:scale-105"
        />
      );
    }
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
    let imageArray = [];
  
    try {
      if (typeof value === "string") {
        const cleanedValue = value.replace(/\\"/g, '"').replace(/^"|"$/g, ""); // Remove extra quotes
        imageArray = JSON.parse(cleanedValue);
      } else {
        imageArray = value;
      }
    } catch (error) {
      console.error("Error parsing product_image value:", error);
    }
  
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return (
        <div className="grid grid-cols-2 w-40">
          {imageArray.map((img, index) => (
            <img
              key={index}
              src={`${BASE_URL}/${img}`}
              alt={`product_image_${index}`}
              className="w-12 h-12 mb-5 object-cover rounded-md border border-gray-200 hover:scale-105"
            />
          ))}
        </div>
      );
    }
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

const DownloadButton = ({ downloadInvoice, userId, orderId }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await downloadInvoice(userId, orderId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-500 hover:text-blue-700 flex justify-center text-center items-center"
      title="Download Invoice"
      disabled={loading}
    >
      {loading ? (
        <Loader size={20} className="animate-spin" />
      ) : (
        <Download size={20} />
      )}
    </button>
  );
};

export default Table;
