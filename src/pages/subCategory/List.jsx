import React, { useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListSubcategory = () => {
  const navigate = useNavigate();

  // Static subcategory data
  const [subcategories, setSubcategories] = useState([
    {
      id: 1,
      name: "Luxury Sofas",
      category: "Furniture",
      image: "https://via.placeholder.com/50",
      slug: "luxury-sofas",
      status: "Active",
    },
    {
      id: 2,
      name: "Wooden Tables",
      category: "Furniture",
      image: "https://via.placeholder.com/50",
      slug: "wooden-tables",
      status: "Inactive",
    },
  ]);

  // Custom confirmation toast
  const confirmAction = (message, onConfirm) => {
    toast.info(
      <div className="flex flex-col">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              onConfirm();
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Delete subcategory
  const deleteSubcategory = (id) => {
    confirmAction("Are you sure you want to delete this subcategory?", () => {
      setSubcategories((prev) => prev.filter((item) => item.id !== id));
      toast.success("Subcategory deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle subcategory status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      setSubcategories((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "Subcategory Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Image",
      accessor: "image",
      cell: (row) => (
        <img src={row.image} alt="Subcategory" className="w-12 h-12 object-cover rounded" />
      ),
    },
    { header: "Slug", accessor: "slug" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/subcategory/edit", { state: { subcategoryData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteSubcategory(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => updateStatus(row),
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Subcategory List</title>
        <meta name="Subcategory List" content="Eco Stay Subcategory List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Subcategory List</h1>

      {subcategories.length > 0 ? (
        <Table columns={columns} data={subcategories} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No subcategories found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListSubcategory;
