import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../lib/utils"; // Make sure you have an API service file for making HTTP requests

const ListCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Ensure categories is an empty array initially

  // Fetch category list from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/admin/categories");
        console.log(response.data)
        setCategories(response.data); // Ensure categories is always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.", { position: "top-right" });
        setCategories([]); // In case of error, ensure categories is an empty array
      }
    };
    fetchCategories();
  }, []);

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
  const deleteCategory = async (id) => {
    confirmAction("Are you sure you want to delete this category?", async () => {
      try {
        const response = await API.delete(`/admin/categories/${id}`);
        if (response.status === 200) {
          setCategories((prev) => prev.filter((item) => item.id !== id));
          toast.success("Category deleted successfully!", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.", { position: "top-right" });
      }
    });
  };

  // Toggle category status
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";
        const response = await API.put(`/admin/categories/${row.id}`, {
          status: newStatus,
        });
        if (response.status === 200) {
          setCategories((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: newStatus } : item
            )
          );
          toast.success(`Status changed to ${newStatus}!`, { position: "top-right" });
        }
      } catch (error) {
        console.error("Error updating category status:", error);
        toast.error("Failed to update category status.", { position: "top-right" });
      }
    });
  };

  // Table columns
  const columns = [
    { header: "Category Name", accessor: "name" },
    {
      header: "Image",
      accessor: "category_image",
      cell: (row) => (
        <img src={row.category_image} alt="Category" className="w-12 h-12 object-cover rounded" />
      ),
    },
    { header: "Slug", accessor: "slug" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/categories/add", { state: { categoryData: row } }),
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
        <title>Rentmosh | Category List</title>
        <meta name="Category List" content="Eco Stay Category List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Category List</h1>

      {Array.isArray(categories) && categories.length > 0 ? (
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
