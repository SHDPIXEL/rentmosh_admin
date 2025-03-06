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
        console.log(response.data.orders); // Debugging log
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customer data.", {
          position: "top-right",
        });
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
          console.error("Error updating order status:", error);
          toast.error("Error updating order status.", {
            position: "top-right",
          });
        }
      }
    );
  };

  const handleDownloadInvoice = async (userId, orderId) => {
    try {
      const response = await API.get(`/admin/invoice/${userId}/${orderId}`, {
        responseType: "blob", // Ensures it handles files correctly
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
    { header: "User Name", accessor: "User.name" },
    { header: "User Email", accessor: "User.email" },
    { header: "User Phone", accessor: "User.phone" },
    { header: "Product Name", accessor: "product.title" },
    { header: "Full Address", accessor: "fullAddress" },
    { header: "KycId", accessor: "KYC.status" },
    { header: "Order Status", accessor: "orderStatus" },
    { header: "Payment Method", accessor: "paymentMethod" },
    { header: "Download Invoice", accessor: "download" },
  ];

  const actions = [
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => markOrderAsProcessing(row), // ✅ Mark as Processing
      className: "text-blue-500 hover:text-blue-600",
    },
    {
      label: <CheckCircle className="w-4 h-4" />,
      handler: (row) => markOrderAsDelivered(row), // ✅ Mark as Delivered
      className: "text-green-500 hover:text-green-600",
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
