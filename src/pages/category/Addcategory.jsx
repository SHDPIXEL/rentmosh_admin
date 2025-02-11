import React, { useState, useEffect } from "react";
import { Info, Image, Hash, ToggleRight } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../lib/utils"; // Adjust based on your API configuration

const AddCategory = () => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category_image: null,
    slug: "",
    status: "",
  });

  const location = useLocation();
  const categoryData = location.state?.categoryData; // Data passed from category list
  const categoryId = location.state?.categoryId; // Passed categoryId
  const navigate = useNavigate();

  // Fetch category data for editing if categoryId is passed
  useEffect(() => {
    if (categoryData) {
      setFormData({
        id: categoryData.id || "",
        name: categoryData.name || "",
        slug: categoryData.slug || "",
        status: categoryData.status || "",
        category_image: categoryData.category_image || null,
      });
    }
  }, [categoryData]);

  useEffect(() => {
    if (categoryId) {
      const fetchCategoryData = async () => {
        try {
          const response = await API.get(`/admin/categories/${categoryId}`);
          setFormData({
            id: response.data.category.id,
            name: response.data.category.name,
            slug: response.data.category.slug,
            status: response.data.category.status,
            category_image: response.data.category.category_image || null,
          });
        } catch (error) {
          console.error("Error fetching category:", error);
          toast.error("Failed to fetch category data.", { position: "top-right" });
        }
      };
      fetchCategoryData();
    }
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, category_image: e.target.files[0] });
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

      const categoryData = new FormData();
      categoryData.append("status", formData.status);

      if (formData.name) {
        categoryData.append("name", formData.name);
      }
      if (formData.slug) {
        categoryData.append("slug", formData.slug);
      }

      if (formData.category_image && typeof formData.category_image !== "string") {
        categoryData.append("category_image", formData.category_image);
      }

      let response;
      if (formData.id) {
        // **Update existing category (PUT)**
        response = await API.put(`/admin/categories/${formData.id}`, categoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          toast.success("Category updated successfully!", { position: "top-right" });
          setTimeout(() => navigate("/categories/list"), 1000);
        }
      } else {
        // **Add new category (POST)**
        response = await API.post("/admin/categories", categoryData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success("Category added successfully!", { position: "top-right" });
          setTimeout(() => navigate("/categories/list"), 1000);
        }
      }

      // Reset form after success
      setFormData({ id: "", name: "", category_image: null, slug: "", status: "" });
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(
        error.response?.data?.message || "Error processing category. Please try again.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {formData.id ? "Edit Category" : "Add New Category"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Info className="h-4 w-4 text-gray-400" />
            Category Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Category name"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="category_image"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Image className="h-4 w-4 text-gray-400" />
            Upload Image
          </label>
          <div className="relative w-full">
            <input
              type="file"
              name="category_image"
              id="category_image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="category_image"
              className="flex items-center justify-center w-1/3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
            >
              Choose File
            </label>
            {formData.category_image && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {formData.category_image.name}
              </p>
            )}
          </div>
        </div>

        {/* Slug */}
        <div className="flex flex-col">
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
            {formData.id ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddCategory;
