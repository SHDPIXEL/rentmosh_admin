import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import API from "../../lib/utils";
import "react-toastify/dist/ReactToastify.css";

const ListSubcategories = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);

  // Fetch subcategory list
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await API.get("/admin/subcategories");
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
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

  // Delete subcategory
  const deleteSubcategory = async (id) => {
    confirmAction("Are you sure you want to delete this subcategory?", async () => {
      try {
        const response = await API.delete(`/admin/subcategories/${id}`);
        if (response.status === 200) {
          setSubcategories((prev) => prev.filter((item) => item.id !== id));
          toast.success("Subcategory deleted successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast.error("Failed to delete subcategory.", { position: "top-right" });
      }
    });
  };

  // Toggle subcategory status
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";

        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized. Please login again.", {
            position: "top-right",
          });
          return;
        }

        const response = await API.put(
          `/admin/subcategories/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Explicitly set JSON content type
            },
          }
        );

        if (response.status === 200) {
          setSubcategories((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: newStatus } : item
            )
          );

          toast.success(`Status changed to ${newStatus}!`, {
            position: "top-right",
          });
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error("Error updating subcategory status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update status.",
          { position: "top-right" }
        );
      }
    });
  };

  // Table columns
  const columns = [
    { header: "Subcategory Name", accessor: "name" },
    { header: "Category Name", accessor: "category.name" },
    {
      header: "Image",
      accessor: "subcategory_image",
      cell: (row) => (
        <img
          src={row.subcategory_image}
          alt="Subcategory"
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    { header: "Slug", accessor: "slug" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/sub-categories/add", { state: { subcategoryData: row } }),
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
        <title>Rentmosh | Subcategory List</title>
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

export default ListSubcategories;
