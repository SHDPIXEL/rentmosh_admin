import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Image, Hash, ToggleRight, Info } from "lucide-react";
import { Helmet } from "react-helmet-async";
import API from "../../lib/utils"; // Import your API utility

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: null, // For updates
    benefitId: "",
    title: "",
    product_image: null,
    location: "",
    price: [
      { months: "3 months", amount: 600 },
      { months: "6 months", amount: 1500 },
    ],
    brand: "",
    size: "",
    material: "",
    colour: "",
    status: "",
  });

  const [benefits, setbenefits] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show a loading indicator

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await API.get("/admin/benefits");
        console.log("API Response:", response.data.benefits); // Log the API response for debugging

        if (
          response.data.benefits &&
          response.data.benefits &&
          response.data.benefits.length > 0
        ) {
          setbenefits(response.data.benefits);
        } else {
          toast.error("No categories found.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.", { position: "top-right" });
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBenefits();
  }, []);

  // Pre-fill data if we're editing an existing subcategory
  useEffect(() => {
    if (location.state?.productData) {
      const productData = location.state.productData;
      setFormData({
        id: productData.id || null,
        benefitId: productData.benefitId || "",
        title: productData.title || "",
        product_image: productData.product_image || null,
        location: productData.location || "",
        price: productData.price || [
          { months: "3 months", amount: 600 },
          { months: "6 months", amount: 1500 },
        ],
        brand: productData.brand || "",
        size: productData.size || "",
        material: productData.material || "",
        colour: productData.colour || "",
        status: productData.status || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.benefitId ||
      !formData.title ||
      !formData.location ||
      !formData.price.length
    ) {
      toast.error("Benefit, Title, Location, and Price are required fields.", {
        position: "top-right",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const productData = new FormData();
      productData.append("benefitId", formData.benefitId);
      productData.append("title", formData.title);
      productData.append("location", formData.location);
      productData.append("brand", formData.brand || "");
      productData.append("size", formData.size || "");
      productData.append("material", formData.material || "");
      productData.append("colour", formData.colour || "");
      productData.append("status", formData.status || "active");

      // Convert price array to JSON string
      productData.append("price", JSON.stringify(formData.price));

      if (formData.product_image && typeof formData.product_image !== "string") {
        productData.append("product_image", formData.product_image);
      }

      let response;

      if (formData.id) {
        // **Update existing product (PUT)**
        response = await API.put(
          `/admin/products/${formData.id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Product updated successfully!", {
            position: "top-right",
          });
          setTimeout(() => navigate("/products/list"), 1000);
        }
      } else {
        // **Create new product (POST)**
        response = await API.post("/admin/products", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data)
        if (response.status === 200 || response.status === 201) {
          toast.success("Product added successfully!", {
            position: "top-right",
          });
          setTimeout(() => navigate("/products/list"), 1000);
        }
      }

      // Reset form after success
      setFormData({
        id: null,
        benefitId: "",
        title: "",
        product_image: null,
        location: "",
        price: [
          { months: "3 months", amount: 600 },
          { months: "6 months", amount: 1500 },
        ],
        brand: "",
        size: "",
        material: "",
        colour: "",
        status: "",
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        error.response?.data?.message ||
          "Error processing product. Please try again.",
        {
          position: "top-right",
        }
      );
    }
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
          <label
            htmlFor="image"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Image className="h-4 w-4 text-gray-400" />
            Upload Image
          </label>
          <div className="relative w-full">
            <input
              type="file"
              name="product_image"
              id="product_image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="product_image"
              className="flex items-center justify-center w-1/3 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer shadow-sm hover:bg-white hover:text-black hover:border transition-all duration-200"
            >
              Choose File
            </label>
            {formData.product_image && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {formData.product_image.name}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label
            htmlFor="location"
            className="text-sm font-medium text-gray-700 mb-2"
          >
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
          <label
            htmlFor="price"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Price (Months)
          </label>
          {Array.isArray(formData.price) &&
            formData.price.map((item, index) => (
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
            <label
              htmlFor="brand"
              className="text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="size"
              className="text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="material"
              className="text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="colour"
              className="text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 mb-2"
            >
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
