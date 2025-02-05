import React, { useState } from "react";
import Table from "../components/Table";
import { CheckCircle, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListKYC = () => {
  const navigate = useNavigate();

  // Static KYC data
  const [kycDetails, setKycDetails] = useState([
    {
      id: 1,
      idname: "John Doe",
      idimage: "https://via.placeholder.com/50",
      status: "Pending",
    },
    {
      id: 2,
      idname: "Jane Smith",
      idimage: "https://via.placeholder.com/50",
      status: "Pending",
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

  // Verify KYC
  const verifyKyc = (id) => {
    confirmAction("Are you sure you want to verify this KYC?", () => {
      setKycDetails((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Verified" } : item
        )
      );
      toast.success("KYC verified successfully!", { position: "top-right" });
    });
  };

  // Delete KYC
  const deleteKyc = (id) => {
    confirmAction("Are you sure you want to delete this KYC?", () => {
      setKycDetails((prev) => prev.filter((item) => item.id !== id));
      toast.success("KYC deleted successfully!", { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "ID Name", accessor: "idname" },
    {
      header: "ID Image",
      accessor: "idimage",
      cell: (row) => (
        <img src={row.idimage} alt="ID" className="w-12 h-12 object-cover rounded" />
      ),
    },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <CheckCircle className="w-4 h-4" />,
      handler: (row) => verifyKyc(row.id),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteKyc(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => navigate("/kyc/edit", { state: { kycData: row } }),
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | KYC List</title>
        <meta name="KYC List" content="Eco Stay KYC List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">KYC List</h1>

      {kycDetails.length > 0 ? (
        <Table columns={columns} data={kycDetails} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No KYC details found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListKYC;
