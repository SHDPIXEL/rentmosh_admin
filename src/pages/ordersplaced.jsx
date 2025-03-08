import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { SquarePen, CheckCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../lib/utils";

const ListOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Fetch Customers Data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/admin/orders");
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchOrders();
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

  const markOrderAsProcessing = async (row) => {
    updateOrderStatus(row, "Processing");
  };

  const markOrderAsDelivered = async (row) => {
    updateOrderStatus(row, "Delivered");
  };

  const updateOrderStatus = async (row, newStatus) => {

    confirmAction(
      `Are you sure you want to update the status to ${newStatus}?`,
      async () => {
        try {
          const response = await API.put(`/admin/orders/${row.id}/status`, {
            orderStatus: newStatus,
          });

          if (response.data.success) {
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.id === row.id
                  ? { ...order, orderStatus: newStatus }
                  : order
              )
            );
            toast.success(`Order status updated to ${newStatus}`, {
              position: "top-right",
            });
          } else {
            toast.error("Failed to update order status.", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error updating order status:", error.response?.data || error);
          toast.error("Error updating order status.", {
            position: "top-right",
          });
        }
      }
    );
  };

  const handleDownloadInvoice = async (userId, orderId) => {
  
    if (!userId || !orderId) {
      console.error("Missing userId or orderId");
      toast.error("Invalid user or order details.");
      return;
    }
  
    try {
      const response = await API.get(`/admin/invoice/${userId}/${orderId}`, {
        responseType: "blob",
      });
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${userId}-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(
        "Error downloading invoice:",
        error.response?.data || error.message
      );
      toast.error("Invoice not found or server error.");
    }
  };
  

  // Table columns
  const columns = [
    { header: "OrderId", accessor: "orderId" },
    { header: "Date", accessor: "date" },
    { header: "User Name", accessor: "user.name" },
    { header: "User Email", accessor: "user.email" },
    { header: "User Phone", accessor: "user.phone" },
    { header: "Product Name", accessor: "product.title" },
    { header: "Full Address", accessor: "fullAddress" },
    { header: "KycId", accessor: "kycStatus" },
    { header: "Order Status", accessor: "orderStatus" },
    { header: "Payment Method", accessor: "paymentMethod" },
    { header: "Download Invoice", accessor: "download" },
  ];

  const actions = [
    {
      label: "Processing",
      handler: (row) => markOrderAsProcessing(row), // ✅ Mark as Processing
      className: "bg-blue-200 text-blue-700 hover:bg-blue-700 hover:text-blue-200 transition-all",
    },
    {
      label: "Delivered",
      handler: (row) => markOrderAsDelivered(row), // ✅ Mark as Delivered
      className: "bg-green-200 text-green-700 hover:bg-green-700 hover:text-green-200 transition-all",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Rentmosh | Order List</title>
        <meta name="Order List" content="Eco Stay Order List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Order List</h1>

      {orders?.length > 0 ? (
        <Table
          columns={columns}
          data={orders}
          globalActions={actions}
          downloadInvoice={handleDownloadInvoice}
          markOrderAsDelivered={markOrderAsDelivered}
        />
      ) : (
        <div className="text-center text-gray-600 mt-10">No orders found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListOrder;
