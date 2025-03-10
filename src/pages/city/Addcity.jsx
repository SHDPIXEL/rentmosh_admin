import React, { useState, useEffect } from "react";
import { Info, Image, Hash, ToggleRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../lib/utils";

const AddCity = () => {
  const [formData, setFormData] = useState({
    id: null, // Ensure ID is tracked for updates
    name: "",
    city_image: null,
    // slug: "",
    status: "",
  });

  const location = useLocation();
  const cityData = location.state?.cityData; // Data passed from list
  const cityId = location.state?.cityId; // Passed cityId
  const navigate = useNavigate();

  useEffect(() => {
    if (cityData) {
      setFormData({
        id: cityData.id || "", // Ensure id is set
        name: cityData.name || "",
        // slug: cityData.slug || "",
        status: cityData.status || "",
        city_image: cityData.city_image || "",
      });
    }
  }, [cityData]);

  useEffect(() => {
    if (cityId) {
      const fetchCityData = async () => {
        try {
          const response = await API.get(`/admin/cities/${cityId}`);
          console.log(response.data)
          setFormData({
            id: response.data.city.id, // Ensure ID is assigned
            name: response.data.city.name,
            // slug: response.data.city.slug,
            status: response.data.city.status,
            city_image: response.data.city.city_image || null,
          });
        } catch (error) {
          console.error("Error fetching city:", error);
          toast.error("Failed to fetch city data.", { position: "top-right" });
        }
      };
      fetchCityData();
    }
  }, [cityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, city_image: e.target.files[0] });
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
  
      const cityData = new FormData();
      cityData.append("status", formData.status);
  
      // Always append other fields, even if not updated
      if (formData.name) {
        cityData.append("name", formData.name);
      }
      // if (formData.slug) {
      //   cityData.append("slug", formData.slug);
      // }
  
      // Only append image if it's a new file (not an existing URL)
      if (formData.city_image && typeof formData.city_image !== "string") {
        cityData.append("city_image", formData.city_image);
      }
  
      let response;
      if (formData.id) {
        // **Update existing city (PUT)**
        response = await API.put(`/admin/update/cities/${formData.id}`, cityData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        if (response.status === 200) {
          toast.success("City updated successfully!", { position: "top-right" });
          setTimeout(() => navigate("/city/list"), 1000); // Delay navigation
        }
      } else {
        // **Add new city (POST)**
        response = await API.post("/admin/cities", cityData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (response.status === 200 || response.status === 201) {
          toast.success("City added successfully!", { position: "top-right" });
          setTimeout(() => navigate("/city/list"), 1000);
        }
      }
  
      // Reset form after success
      setFormData({ id: "", name: "", city_image: null, status: "" });
    } catch (error) {
      console.error("Error submitting city:", error);
      toast.error(
        error.response?.data?.message ||
          "Error processing city. Please try again.",
        { position: "top-right" }
      );
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {formData.id ? "Edit City" : "Add New City"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-gray-400" /> City Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter City Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Image className="h-4 w-4 text-gray-400" /> Upload Image
          </label>
          <label className="p-3 bg-black rounded-lg cursor-pointer text-center text-white hover:bg-white hover:border hover:border-gray-800 hover:text-black font-medium w-1/3 transition-all">
            Choose File
            <input
              type="file"
              name="city_image"
              id="city_image"
              accept="city_image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {formData.city_image && typeof formData.city_image === "string" && (
            <p className="text-sm text-gray-500 mt-2">
              Current: {formData.city_image}
            </p>
          )}
          {formData.city_image && formData.city_image instanceof File && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {formData.city_image.name}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col">
          <label
            htmlFor="slug"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-gray-400" /> Slug
          </label>
          <input
            type="text"
            name="slug"
            id="slug"
            placeholder="Enter City Slug"
            value={formData.slug}
            onChange={handleChange}
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            required
          />
        </div> */}
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <ToggleRight className="h-4 w-4 text-gray-400" /> Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg"
          >
            {formData.id ? "Update City" : "Add City"}
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCity;
