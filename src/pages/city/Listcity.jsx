import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import API from "../../lib/utils";
import "react-toastify/dist/ReactToastify.css";

const ListCity = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  // Fetch city list
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await API.get("/admin/cities");
        console.log(response.data.cities);
        setCities(response.data.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to fetch cities.", { position: "top-right" });
      }
    };

    fetchCities();
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

  // Delete city
  const deleteCity = async (id) => {
    confirmAction("Are you sure you want to delete this city?", async () => {
      try {
        const response = await API.delete(`/admin/cities/${id}`);
        if (response.status === 200) {
          setCities((prev) => prev.filter((item) => item.id !== id));
          toast.success("City deleted successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting city:", error);
        toast.error("Failed to delete city.", { position: "top-right" });
      }
    });
  };

  // Toggle city status
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
          `/admin/update/cities/${row.id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Explicitly set JSON content type
            },
          }
        );

        if (response.status === 200) {
          setCities((prev) =>
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
        console.error("Error updating city status:", error);
        toast.error(
          error.response?.data?.message || "Failed to update status.",
          { position: "top-right" }
        );
      }
    });
  };

  // Table columns
  const columns = [
    { header: "City Name", accessor: "name" },
    {
      header: "Image",
      accessor: "image",
      cell: (row) => (
        <img
          src={row.image}
          alt="City"
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
      handler: (row) => navigate("/city/add", { state: { cityData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteCity(row.id),
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
        <title>Rentmosh | City List</title>
        <meta name="City List" content="Eco Stay City List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">City List</h1>

      {cities.length > 0 ? (
        <Table columns={columns} data={cities} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No cities found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListCity;
