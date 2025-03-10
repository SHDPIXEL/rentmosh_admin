import React, { useState, useEffect } from "react";
import { Hash, Info, ToggleRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../lib/utils"; // Assuming you have an API utility to make requests

const AddBenefits = () => {
  const [formData, setFormData] = useState({
    id: null, // Ensure ID is null by default
    title: "",
    // slug: "",
    description: "",
    status: "",
  });

  const location = useLocation();
  const benefitData = location.state?.benefitData;
  const benefitId = location.state?.benefitId;
  const navigate = useNavigate();

  useEffect(() => {
    if (benefitData) {
      setFormData({
        id: benefitData.id || "", // Ensure ID is null if not available
        title: benefitData.title || "",
        // slug: benefitData.slug || "",
        description: benefitData.description || "",
        status: benefitData.status || "",
      });
    }
  }, [benefitData]);

  useEffect(() => {
    if (benefitId) {
      const fetchBenefitData = async () => {
        try {
          const response = await API.get(`/admin/benefits/${benefitId}`);
          setFormData({
            id: response.data.benefit.id, // Ensure ID is set properly
            title: response.data.benefit.title,
            // slug: response.data.benefit.slug,
            description: response.data.benefit.description,
            status: response.data.benefit.status,
          });
        } catch (error) {
          console.error("Error fetching benefit:", error);
          toast.error("Failed to fetch benefit data.");
        }
      };
      fetchBenefitData();
    }
  }, [benefitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status) {
      toast.error("Please select a status.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      let response;
      if (formData.id && formData.id !== "") {
        // If ID exists and is not an empty string, update the benefit
        response = await API.put(`/admin/benefits/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "multipart/form-data",
        });
        
      } else {
        // If no ID, create a new benefit
        response = await API.post("/admin/benefits", formData, {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "multipart/form-data",
        });
      }

      toast.success(response.data.message);
      setTimeout(() => navigate("/benefits/list"), 1000);
    } catch (error) {
      console.error("Error processing benefit:", error);
      toast.error(error.response?.data?.message || "Error processing benefit.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {formData.id ? "Update Benefit" : "Add New Benefit"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-gray-400" />
            Benefit Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Benefit title"
            required
          />
        </div>

        {/* Slug */}
        {/* <div className="flex flex-col">
          <label
            htmlFor="slug"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-gray-400" />
            Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            value={formData.slug}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Slug"
            required
          />
        </div> */}

        {/* Description */}
        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-gray-400" />
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Benefit description"
            rows="4"
            required
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <ToggleRight className="h-4 w-4 text-gray-400" />
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            {formData.id ? "Update Benefit" : "Add Benefit"}
          </button>
        </div>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddBenefits;
