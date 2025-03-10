import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../lib/utils";

const ListBenefit = () => {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);

  // Fetch benefits list
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await API.get("/admin/benefits");

        setBenefits(response.data.benefits);
      } catch (error) {
        console.error("Error fetching benefits:", error);
      }
    };

    fetchBenefits();
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

  // Delete benefit
  const deleteBenefit = async (id) => {
    confirmAction("Are you sure you want to delete this benefit?", async () => {
      try {
        const response = await API.delete(`/admin/benefits/${id}`);
        if (response.status === 200) {
          setBenefits((prev) => prev.filter((item) => item.id !== id));
          toast.success("Benefit deleted successfully!", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error deleting benefit:", error);
        toast.error("Failed to delete benefit.", { position: "top-right" });
      }
    });
  };

  // Toggle benefit status
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";
        const response = await API.put(`/admin/benefits/${row.id}`, {
          status: newStatus,
        });

        if (response.status === 200) {
          setBenefits((prev) =>
            prev.map((item) =>
              item.id === row.id ? { ...item, status: newStatus } : item
            )
          );
          toast.success(`Status changed to ${newStatus}!`, {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.", { position: "top-right" });
      }
    });
  };

  // Table columns
  const columns = [
    { header: "Benefit Title", accessor: "title" },
    { header: "Slug", accessor: "slug" },
    { header: "Description", accessor: "description" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) =>
        navigate("/benefit/add", { state: { benefitData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteBenefit(row.id),
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
        <title>Rentmosh | Benefit List</title>
        <meta name="Benefit List" content="Eco Stay Benefit List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Benefit List</h1>

      {benefits.length > 0 ? (
        <Table columns={columns} data={benefits} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No benefits found</div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListBenefit;
