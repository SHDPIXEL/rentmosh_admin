import React, { useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListOffer = () => {
  const navigate = useNavigate();

  // Static offer data
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Winter Sale",
      description: "Get up to 50% off on all products.",
      code: "WINTER50",
      status: "Active",
    },
    {
      id: 2,
      name: "Summer Sale",
      description: "Get up to 30% off on select items.",
      code: "SUMMER30",
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

  // Delete offer
  const deleteOffer = (id) => {
    confirmAction("Are you sure you want to delete this offer?", () => {
      setOffers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Offer deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle offer status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      setOffers((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "Offer Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Code", accessor: "code" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/offer/edit", { state: { offerData: row } }),
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
        <title>Eco Stay | Offer List</title>
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
