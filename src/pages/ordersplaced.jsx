import React, { useState } from "react";
import Table from "../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListOrder = () => {
  const navigate = useNavigate();

  // Static order data
  const [orders, setOrders] = useState([
    {
      id: 1,
      allorders: "50",
      kycpending: "5",
      activeorders: "30",
      inactiveorders: "10",
      failedorders: "5",
    },
    {
      id: 2,
      allorders: "80",
      kycpending: "2",
      activeorders: "60",
      inactiveorders: "15",
      failedorders: "3",
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

  // Delete order
  const deleteOrder = (id) => {
    confirmAction("Are you sure you want to delete this order?", () => {
      setOrders((prev) => prev.filter((item) => item.id !== id));
      toast.success("Order deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle order status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      // Example: Here you could toggle the order status between active and inactive, or any other logic.
      const newStatus = row.activeorders > 0 ? "Inactive" : "Active";
      setOrders((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "All Orders", accessor: "allorders" },
    { header: "KYC Pending", accessor: "kycpending" },
    { header: "Active Orders", accessor: "activeorders" },
    { header: "Inactive Orders", accessor: "inactiveorders" },
    { header: "Failed Orders", accessor: "failedorders" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/order/edit", { state: { orderData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteOrder(row.id),
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
        <title>Rentmosh | Order List</title>
        <meta name="Order List" content="Eco Stay Order List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Order List</h1>

      {orders.length > 0 ? (
        <Table columns={columns} data={orders} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No orders found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListOrder;
