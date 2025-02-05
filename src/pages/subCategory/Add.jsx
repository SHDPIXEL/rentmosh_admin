import React, { useState, useEffect } from "react";
import { Image, Hash, ToggleRight, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubcategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    image: null,
    slug: "",
    status: "",
  });

  const categories = [
    { id: "1", category_name: "Furniture" },
    { id: "2", category_name: "Electronics" },
    { id: "3", category_name: "Appliances" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subcategory Form Submitted", formData);

    // Show success message
    toast.success("Subcategory added successfully!", {
        position: "top-right",
        autoClose: 3000,
    });

    // Delay navigation to allow toast to appear
    setTimeout(() => {
        // Navigate to the subcategory list page
        navigate("/subcategory/list");
    }, 1000); // Delay by 1 second
};


  // // Test Toast on component mount (for debugging)
  // useEffect(() => {
  //   toast.success("Test Toast Notification!");
  // }, []);

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Subcategory</title>
        <meta name="Subcategory Add" content="Eco Stay Subcategory Add!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Subcategory</h1>
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
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="flex text-sm font-medium text-gray-700 mb-2"
          >
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
          <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Image className="h-4 w-4 text-gray-400" />
            Upload Image
          </label>
          <div className="relative w-full">
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="flex items-center justify-center w-1/3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
            >
              Choose File
            </label>
            {formData.image && <p className="mt-2 text-sm text-gray-500">Selected: {formData.image.name}</p>}
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
            Add Subcategory
          </button>
        </div>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddSubcategory;
