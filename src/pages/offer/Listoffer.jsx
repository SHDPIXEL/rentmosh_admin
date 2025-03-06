import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import API from "../../lib/utils"; // Ensure API utility is properly set up
import "react-toastify/dist/ReactToastify.css";

const ListOffer = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);

  // Fetch offer list
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await API.get("/admin/offers");
        setOffers(response.data.offers);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to fetch offers.", { position: "top-right" });
      }
    };

    fetchOffers();
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

  // Delete offer
  const deleteOffer = async (id) => {
    confirmAction("Are you sure you want to delete this offer?", async () => {
      try {
        await API.delete(`/admin/offers/${id}`);
        setOffers((prev) => prev.filter((item) => item.id !== id));
        toast.success("Offer deleted successfully!", { position: "top-right" });
      } catch (error) {
        console.error("Error deleting offer:", error);
        toast.error("Failed to delete offer.", { position: "top-right" });
      }
    });
  };

  // Toggle offer status
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";
        const response = await API.put(`/admin/offers/${row.id}`, { status: newStatus });

        if (response.status === 200) {
          setOffers((prev) =>
            prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
          );
          toast.success(`Status changed to ${newStatus}!`, { position: "top-right" });
        }
      } catch (error) {
        console.error("Error updating offer status:", error);
        toast.error("Failed to update status.", { position: "top-right" });
      }
    });
  };

  // Table columns
  const columns = [
    { header: "Offer Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Code", accessor: "code" },
    { header: "Discount", accessor: "discount" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/offer/add", { state: { offerData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteOffer(row.id),
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
        <title>Rentmosh | Offer List</title>
        <meta name="Offer List" content="Eco Stay Offer List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Offer List</h1>

      {offers.length > 0 ? (
        <Table columns={columns} data={offers} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No offers found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListOffer;
