import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { CheckCircle, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../lib/utils";

const ListKYC = () => {
  const navigate = useNavigate();
  const [kycDetails, setKycDetails] = useState([]);

  // Fetch KYC data
  useEffect(() => {
    const fetchKycDetails = async () => {
      try {
        const response = await API.get("/admin/kyc");
        console.log(response.data.kycRecords)
        setKycDetails(response.data.kycRecords);
      } catch (error) {
        console.error("Error fetching KYC details:", error);
        toast.error("Failed to fetch KYC details.", { position: "top-right" });
      }
    };
    fetchKycDetails();
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

// ✅ Fix: Verify KYC correctly
const verifyKyc = async (id) => {
  confirmAction("Are you sure you want to verify this KYC?", async () => {
    try {
      const response = await API.put(`/admin/kyc/${id}`, { 
        isVerified: 1,  // ✅ Fix: Use `1` instead of `true`
        status: "Verified"
      });
      console.log(response.data)
      setKycDetails((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "Verified", isVerified: 1 }
            : item
        )
      );
      toast.success("KYC verified successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC.", { position: "top-right" });
    }
  });
};

// ✅ Fix: Update Status when `isVerified: 2`
const reverifyKyc = async (id) => {
  confirmAction("Are you sure you want to trigger re-verification for this KYC?", async () => {
    try {
      const response = await API.put(`/admin/kyc/${id}`, { 
        isVerified: 2,  
        status: "Reverification needed"
      });
      console.log(response.data)
      setKycDetails((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "Reverification needed", isVerified: 2 }
            : item
        )
      );
      toast.success("KYC re-verification triggered successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error triggering re-verification:", error);
      toast.error("Failed to trigger re-verification.", { position: "top-right" });
    }
  });
};


  // Delete KYC
  const deleteKyc = async (id) => {
    confirmAction("Are you sure you want to delete this KYC?", async () => {
      try {
        await API.delete(`/admin/kyc/${id}`);
        setKycDetails((prev) => prev.filter((item) => item.id !== id));
        toast.success("KYC deleted successfully!", { position: "top-right" });
      } catch (error) {
        console.error("Error deleting KYC:", error);
        toast.error("Failed to delete KYC.", { position: "top-right" });
      }
    });
  };

  // Table columns
  const columns = [
    { header: "ID Name", accessor: "idName" },
    {
      header: "ID Image",
      accessor: "idProofImage",
      cell: (row) => (
        <img
          src={row.idProofImage}
          alt="ID"
          className="w-12 h-12 object-cover rounded"
        />
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
      handler: (row) => reverifyKyc(row.id),  // Call reverifyKyc for re-verification
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Rentmosh | KYC List</title>
        <meta name="KYC List" content="Eco Stay KYC List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">KYC List</h1>

      {kycDetails && kycDetails.length > 0 ? (
        <Table columns={columns} data={kycDetails} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">
          No KYC details found
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListKYC;
