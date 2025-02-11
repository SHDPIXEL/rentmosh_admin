import React, { useState, useEffect } from "react";
import { Image, Hash, ToggleRight, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../lib/utils"; // Import your API utility

const AddSubcategory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: null, // For updates
    categoryId: "",
    name: "",
    subcategory_image: null,
    slug: "",
    status: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state to show a loading indicator

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/admin/categories");
        console.log("API Response:", response.data);  // Log the API response for debugging

        if (response.data && response.data && response.data.length > 0) {
          setCategories(response.data);
        } else {
          toast.error("No categories found.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.", { position: "top-right" });
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchCategories();
  }, []);

  // Pre-fill data if we're editing an existing subcategory
  useEffect(() => {
    if (location.state?.subcategoryData) {
      const subcategoryData = location.state.subcategoryData;
      setFormData({
        id: subcategoryData.id || "",
        categoryId: subcategoryData.categoryId || "",
        name: subcategoryData.name || "",
        slug: subcategoryData.slug || "",
        status: subcategoryData.status || "",
        subcategory_image: subcategoryData.subcategory_image || null,
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, subcategory_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.categoryId || !formData.name || !formData.slug) {
      toast.error("Category, Name, and Slug are required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const subcategoryData = new FormData();
      subcategoryData.append("categoryId", formData.categoryId);
      subcategoryData.append("name", formData.name);
      subcategoryData.append("slug", formData.slug);
      subcategoryData.append("status", formData.status || "active");

      if (formData.subcategory_image && typeof formData.subcategory_image !== "string") {
        subcategoryData.append("subcategory_image", formData.subcategory_image);
      }

      let response;

      if (formData.id) {
        // **Update existing subcategory (PUT)**
        response = await API.put(`/admin/subcategories/${formData.id}`, subcategoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Subcategory updated successfully!", { position: "top-right" });
          setTimeout(() => navigate("/sub-Categories/list"), 1000); // Delay navigation
        }
      } else {
        // **Create new subcategory (POST)**
        response = await API.post("/admin/subcategories", subcategoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Subcategory added successfully!", { position: "top-right" });
          setTimeout(() => navigate("/sub-Categories/list"), 1000); // Delay navigation
        }
      }

      // Reset form after success
      setFormData({
        id: null,
        categoryId: "",
        name: "",
        subcategory_image: null,
        slug: "",
        status: "",
      });
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      toast.error(error.response?.data?.message || "Error processing subcategory. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Subcategory</title>
        <meta name="Subcategory Add" content="Eco Stay Subcategory Add!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Subcategory</h1>
      {loading ? (  // Show loading spinner while categories are being fetched
        <div className="text-center py-4">
          <span>Loading categories...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* Category ID */}
          <div className="flex flex-col">
            <label
              htmlFor="categoryId"
              className="text-sm flex font-medium text-gray-700 mb-2"
            >
              <Info className="h-4 mr-2 w-4 text-gray-400" />
              Select Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              className="p-3 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
              <Info className="h-4 mr-2 w-4 text-gray-400" />
              Subcategory Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Enter Subcategory Name"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label htmlFor="subcategory_image" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Image className="h-4 w-4 text-gray-400" />
              Upload Image
            </label>
            <div className="relative w-full">
              <input
                type="file"
                name="subcategory_image"
                id="subcategory_image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="subcategory_image"
                className="flex items-center justify-center w-1/3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
              >
                Choose File
              </label>
              {formData.subcategory_image && <p className="mt-2 text-sm text-gray-500">Selected: {formData.subcategory_image.name}</p>}
            </div>
          </div>

          {/* Slug */}
          <div className="flex flex-col">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
              className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
            >
              {formData.id ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </div>
        </form>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddSubcategory;
