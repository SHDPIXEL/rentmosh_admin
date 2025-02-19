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
    subcategoryId: "",
    benefitId: "",
    title: "",
    product_image: [],
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
    inStock: true, // Added inStock with a default value of true
  });

  const [benefits, setbenefits] = useState([]);
  const [subcategories, setsubcategories] = useState([]);
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

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await API.get("/admin/subcategories");
        console.log("API Response:", response.data.subcategories); // Log the API response for debugging

        if (
          response.data.subcategories &&
          response.data.subcategories &&
          response.data.subcategories.length > 0
        ) {
          setsubcategories(response.data.subcategories);
        } else {
          toast.error("No subcategories found.", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories.", { position: "top-right" });
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchSubcategories();
  }, []);

  // Pre-fill data if we're editing an existing subcategory
  useEffect(() => {
    if (location.state?.productData) {
      const productData = location.state.productData;
      setFormData({
        id: productData.id || null,
        subcategoryId: productData.subcategoryId || "",
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
        inStock: productData.inStock !== undefined ? productData.inStock : true, // Added inStock with default value
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Ensure previous images remain, and filter out previews to avoid duplicates
    const existingImages = Array.isArray(formData.product_image)
      ? formData.product_image.filter((img) => !img.preview)
      : [];

    // Limit to 5 images
    if (existingImages.length + files.length > 5) {
      toast.error("You can only upload up to 5 images.", {
        position: "top-right",
      });
      return;
    }

    // Convert selected files into preview objects
    const newImages = files.slice(0, 5 - existingImages.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      product_image: [...existingImages, ...newImages], // Preserve previous valid images
    }));
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      product_image: prev.product_image.filter(
        (_, index) => index !== indexToDelete
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.subcategoryId ||
      !formData.benefitId ||
      !formData.title ||
      !formData.location
    ) {
      toast.error("Subcategory, Benefit, Title, and Location are required.", {
        position: "top-right",
      });
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token is missing");

      const productData = new FormData();
      productData.append("subcategoryId", formData.subcategoryId);
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

      // Append inStock as a boolean value
      productData.append(
        "inStock",
        formData.inStock !== undefined ? formData.inStock : true
      );

      // Append images (only files, not preview URLs)
      if (formData.product_image && formData.product_image.length > 0) {
        formData.product_image.forEach((imgObj) => {
          if (imgObj.file) {
            productData.append("product_image", imgObj.file);
          }
        });
      }

      let response;

      if (formData.id) {
        // Update product
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
        // Create new product
        response = await API.post("/admin/products", productData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("Product added successfully!", {
            position: "top-right",
          });
          setTimeout(() => navigate("/products/list"), 1000);
        }
      }

      // Reset form
      setFormData({
        id: null,
        subcategoryId: "",
        benefitId: "",
        title: "",
        product_image: [], // Clear images after successful submission
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
        inStock: true, // Reset inStock to true by default
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
        {/* Subcategory ID */}
        <div className="flex flex-col">
          <label
            htmlFor="subcategoryId"
            className="text-sm flex font-medium text-gray-700 mb-2"
          >
            <Info className="h-4 mr-2 w-4 text-gray-400" />
            Select Subcategory
          </label>
          <select
            name="subcategoryId"
            id="subcategoryId"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
            value={formData.subcategoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

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

        <div className="flex flex-col">
          <label
            htmlFor="product_image"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Image className="h-4 w-4 text-gray-400" />
            Upload Images
            {formData.product_image?.length > 0 && (
              <span className="text-gray-500 text-xs italic">
                (Upload a new image only if you wish to update)
              </span>
            )}
          </label>

          {/* Image File Input */}
          <label className="p-3 bg-black rounded-lg cursor-pointer text-center text-white hover:bg-white hover:border hover:border-gray-800 hover:text-black font-medium w-1/3 transition-all">
            Choose File
            <input
              type="file"
              name="product_image"
              id="product_image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
          </label>
          {/* Display selected image previews */}
          {Array.isArray(formData.product_image) &&
            formData.product_image.length > 0 && (
              <div className="mt-3 flex gap-3 flex-wrap">
                {formData.product_image.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview || URL.createObjectURL(image.file)}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    {/* Optionally, add delete button for new images */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
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
