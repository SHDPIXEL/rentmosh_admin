import React, { useState, useEffect } from "react";
import { Info, FileText, Hash, ToggleRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../lib/utils"; // Ensure API is configured properly
import "react-toastify/dist/ReactToastify.css";

const AddOffer = () => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    code: "",
    status: "",
  });

  const location = useLocation();
  const offerData = location.state?.offerData;
  const offerId = location.state?.offerId;
  const navigate = useNavigate();

  useEffect(() => {
    if (offerData) {
      setFormData({
        id: offerData.id || "",
        name: offerData.name || "",
        description: offerData.description || "",
        code: offerData.code || "",
        status: offerData.status || "",
      });
    }
  }, [offerData]);

  useEffect(() => {
    if (offerId) {
      const fetchOfferData = async () => {
        try {
          const response = await API.get(`/admin/offers/${offerId}`);
          setFormData({
            id: response.data.offer.id,
            name: response.data.offer.name,
            description: response.data.offer.description,
            code: response.data.offer.code,
            status: response.data.offer.status,
          });
        } catch (error) {
          console.error("Error fetching offer:", error);
          toast.error("Failed to fetch offer data.", { position: "top-right" });
        }
      };
      fetchOfferData();
    }
  }, [offerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.status) {
      toast.error("Please select a status.", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      let response;
      if (formData.id) {
        response = await API.put(`/admin/offers/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await API.post("/admin/offers", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          formData.id ? "Offer updated successfully!" : "Offer added successfully!",
          { position: "top-right" }
        );
        setTimeout(() => navigate("/offers/list"), 1000);
      }

      setFormData({ id: "", name: "", description: "", code: "", status: "" });
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error(error.response?.data?.message || "Error processing offer.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {formData.id ? "Edit Offer" : "Add New Offer"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" /> Offer Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter Offer Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" /> Description
          </label>
          <textarea
            name="description"
            placeholder="Enter Offer Description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Code */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-400" /> Offer Code
          </label>
          <input
            type="text"
            name="code"
            placeholder="Enter Offer Code"
            value={formData.code}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ToggleRight className="h-4 w-4 text-gray-400" /> Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-black text-white font-medium focus:outline-none rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {formData.id ? "Update Offer" : "Add Offer"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddOffer;
