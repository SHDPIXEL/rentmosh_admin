import React, { useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListBenefit = () => {
  const navigate = useNavigate();

  // Static benefit data
  const [benefits, setBenefits] = useState([
    {
      id: 1,
      title: "Free Delivery",
      slug: "free-delivery",
      description: "Get free delivery on all orders above $100.",
      status: "Active",
    },
    {
      id: 2,
      title: "Discounts",
      slug: "discounts",
      description: "Enjoy up to 50% off on selected items.",
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

  // Delete benefit
  const deleteBenefit = (id) => {
    confirmAction("Are you sure you want to delete this benefit?", () => {
      setBenefits((prev) => prev.filter((item) => item.id !== id));
      toast.success("Benefit deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle benefit status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      setBenefits((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
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
      handler: (row) => navigate("/benefit/edit", { state: { benefitData: row } }),
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
        <title>Eco Stay | Benefit List</title>
        <meta name="Benefit List" content="Eco Stay Benefit List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Benefit List</h1>

      {benefits.length > 0 ? (
        <Table columns={columns} data={benefits} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No benefits found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListBenefit;
