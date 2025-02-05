import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { Image, Hash, ToggleRight, Info } from "lucide-react";
import { Helmet } from "react-helmet-async";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    benefitId: "",
    title: "",
    image: null,
    location: "",
    price: [{ months: "3 months", amount: 600 }, { months: "6 months", amount: 1500 }],
    brand: "",
    size: "",
    material: "",
    colour: "",
    status: "",
  });

  const benefits = [
    { id: "1", title: "Easy Payment" },
    { id: "2", title: "Free Delivery" },
    { id: "3", title: "Discounted Rent" },
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
    console.log("Product Form Submitted", formData);

    // Show success message
    toast.success("Product added successfully!", {
      position: "top-right",
      autoClose: 3000,
    });

    // Delay navigation to allow toast to appear
    setTimeout(() => {
      // Navigate to the product list page
      navigate("/product/list");
    }, 1000); // Delay by 1 second
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Add Product</title>
        <meta name="Product Add" content="Eco Stay Product Add!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Benefit ID */}
        <div className="flex flex-col">
          <label
            htmlFor="benefitId"
            className="text-sm flex font-medium text-gray-700 mb-2"
          >
            <Info className="h-4 mr-2 w-4 text-gray-400" />
            Select Benefit
          </label>
          <select
            name="benefitId"
            id="benefitId"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={formData.benefitId}
            onChange={handleChange}
            required
          >
            <option value="">Select Benefit</option>
            {benefits.map((benefit) => (
              <option key={benefit.id} value={benefit.id}>
                {benefit.title}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Product Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Product Title"
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

        {/* Location */}
        <div className="flex flex-col">
          <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            placeholder="Enter Location"
            required
          />
        </div>

        {/* Price (Months) */}
        <div className="flex flex-col">
          <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2">
            Price (Months)
          </label>
          {formData.price.map((item, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                type="text"
                value={item.months}
                readOnly
                disabled
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
              <input
                type="number"
                name="price"
                value={item.amount}
                onChange={(e) => {
                  const newPrice = [...formData.price];
                  newPrice[index].amount = e.target.value;
                  setFormData({ ...formData, price: newPrice });
                }}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
            </div>
          ))}
        </div>

        {/* Brand, Size, Material, Colour, Status */}
        <div className="flex flex-col space-y-4">
          {/* Brand */}
          <div className="flex flex-col">
            <label htmlFor="brand" className="text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              value={formData.brand}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Enter Brand"
              required
            />
          </div>

          {/* Size */}
          <div className="flex flex-col">
            <label htmlFor="size" className="text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <input
              type="text"
              name="size"
              id="size"
              value={formData.size}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Enter Size"
              required
            />
          </div>

          {/* Material */}
          <div className="flex flex-col">
            <label htmlFor="material" className="text-sm font-medium text-gray-700 mb-2">
              Material
            </label>
            <input
              type="text"
              name="material"
              id="material"
              value={formData.material}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Enter Material"
              required
            />
          </div>

          {/* Colour */}
          <div className="flex flex-col">
            <label htmlFor="colour" className="text-sm font-medium text-gray-700 mb-2">
              Colour
            </label>
            <input
              type="text"
              name="colour"
              id="colour"
              value={formData.colour}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="Enter Colour"
              required
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2">
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
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddProduct;
