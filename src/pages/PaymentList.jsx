import React, { useState } from "react";
import Table from "../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListPayments = () => {
  const navigate = useNavigate();

  // Static payment data
  const [payments, setPayments] = useState([
    {
      id: 1,
      totalInvoice: "1000",
      totalPayments: "800",
      balance: "200",
    },
    {
      id: 2,
      totalInvoice: "1500",
      totalPayments: "1500",
      balance: "0",
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

  // Delete payment
  const deletePayment = (id) => {
    confirmAction("Are you sure you want to delete this payment?", () => {
      setPayments((prev) => prev.filter((item) => item.id !== id));
      toast.success("Payment deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle payment status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      // Assuming balance == 0 means "Paid", otherwise "Pending"
      const newStatus = row.balance === "0" ? "Paid" : "Pending";
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "Total Invoice", accessor: "totalInvoice" },
    { header: "Total Payments", accessor: "totalPayments" },
    { header: "Balance", accessor: "balance" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/payment/edit", { state: { paymentData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deletePayment(row.id),
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
        <title>Rentmosh | Payment List</title>
        <meta name="Payment List" content="Eco Stay Payment List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment List</h1>

      {payments.length > 0 ? (
        <Table columns={columns} data={payments} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No payments found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListPayments;
