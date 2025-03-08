import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { CheckCircle, Lock, RefreshCcw } from "lucide-react";
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
        setKycDetails(response.data.kycRecords);
      } catch (error) {
        console.error("Error fetching KYC details:", error);
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

  const confirmPassword = (message, onConfirm) => {
    let password = "";
  
    toast.info(
      <div className="flex flex-col items-center">
        <p className="text-gray-800">{message}</p>
        <input
          type="password"
          placeholder="Enter password"
          className="border p-2 rounded mt-2 w-full"
          onChange={(e) => (password = e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => {
              if (!password) {
                toast.error("Password is required!", { position: "top-right" });
                return;
              }
              toast.dismiss(); // Close the toast
              onConfirm(password);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false, // Hide close button
        draggable: false,
        style: { 
          width: "350px", 
          minHeight: "150px", 
          textAlign: "center", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center" 
        },
      }
    );
  };
  

  // ✅ Fix: Verify KYC correctly
  const verifyKyc = async (id) => {
    confirmAction("Are you sure you want to verify this KYC?", async () => {
      try {
        const response = await API.put(`/admin/kyc/${id}`, {
          isVerified: 1, // ✅ Fix: Use `1` instead of `true`
          status: "Verified",
        });
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
    confirmAction(
      "Are you sure you want to trigger re-verification for this KYC?",
      async () => {
        try {
          const response = await API.put(`/admin/kyc/${id}`, {
            isVerified: 2,
            status: "Reverification needed",
          });
          setKycDetails((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, status: "Reverification needed", isVerified: 2 }
                : item
            )
          );
          toast.success("KYC re-verification triggered successfully!", {
            position: "top-right",
          });
        } catch (error) {
          console.error("Error triggering re-verification:", error);
          toast.error("Failed to trigger re-verification.", {
            position: "top-right",
          });
        }
      }
    );
  };

  // Delete KYC
  // const deleteKyc = async (id) => {
  //   confirmAction("Are you sure you want to delete this KYC?", async () => {
  //     try {
  //       await API.delete(`/admin/kyc/${id}`);
  //       setKycDetails((prev) => prev.filter((item) => item.id !== id));
  //       toast.success("KYC deleted successfully!", { position: "top-right" });
  //     } catch (error) {
  //       console.error("Error deleting KYC:", error);
  //       toast.error("Failed to delete KYC.", { position: "top-right" });
  //     }
  //   });
  // };
  const handleDownload = (kycId) => {
    confirmPassword("Enter password to decrypt the file:", (password) => {
      downloadDecryptedFile(kycId, password);
    });
  };

  const downloadDecryptedFile = async (kycId, password) => {
    try {
      const authToken = localStorage.getItem("authToken"); // Ensure token is fetched correctly
  
      if (!authToken) {
        throw new Error("User authentication required.");
      }
  
      const response = await API.post(
        `/admin/kyc/decrypt/${kycId}`,
        { password }, // Use the passed password
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob", // Ensure response is treated as a file
        }
      );
  
      // Convert response to a blob
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const url = URL.createObjectURL(blob);
  
      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "decrypted-file.png"; // Adjust based on actual file type
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || error.message);
    }
  };
  

  // Table columns
  const columns = [
    { header: "ID Name", accessor: "idName" },
    // {
    //   header: "ID Image",
    //   accessor: "idProofImage",
    //   cell: (row) => (
    //     <img
    //       src={row.idProofImage}
    //       alt="ID"
    //       className="w-12 h-12 object-cover rounded"
    //     />
    //   ),
    // },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <CheckCircle className="w-4 h-4" />,
      handler: (row) => verifyKyc(row.id),
      className: "text-green-500 hover:text-green-600",
    },
    // {
    //   label: <Trash2 className="w-4 h-4" />,
    //   handler: (row) => deleteKyc(row.id),
    //   className: "text-red-500 hover:text-red-600",
    // },
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => reverifyKyc(row.id), // Call reverifyKyc for re-verification
      className: "text-blue-500 hover:text-blue-600",
    },
    {
      label: <Lock className="w-4 h-4" />, // Lock icon for encrypted file
      handler: (row) => handleDownload(row.id),
      className: "text-purple-500 hover:text-purple-600",
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
