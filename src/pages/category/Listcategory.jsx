import React, { useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListCategory = () => {
  const navigate = useNavigate();

  // Static category data
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Sofas",
      image: "https://via.placeholder.com/50",
      slug: "sofas",
      status: "Active",
    },
    {
      id: 2,
      name: "Tables",
      image: "https://via.placeholder.com/50",
      slug: "tables",
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

  // Delete category
  const deleteCategory = (id) => {
    confirmAction("Are you sure you want to delete this category?", () => {
      setCategories((prev) => prev.filter((item) => item.id !== id));
      toast.success("Category deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle category status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      setCategories((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "Category Name", accessor: "name" },
    {
      header: "Image",
      accessor: "image",
      cell: (row) => (
        <img src={row.image} alt="Category" className="w-12 h-12 object-cover rounded" />
      ),
    },
    { header: "Slug", accessor: "slug" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/category/edit", { state: { categoryData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteCategory(row.id),
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
        <title>Eco Stay | Category List</title>
        <meta name="Category List" content="Eco Stay Category List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Category List</h1>

      {categories.length > 0 ? (
        <Table columns={columns} data={categories} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No categories found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListCategory;
