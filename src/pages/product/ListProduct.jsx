import React, { useState } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListProduct = () => {
  const navigate = useNavigate();

  // Static product data
  const [products, setProducts] = useState([
    {
      id: 1,
      benefitId: "Easy Payment",
      title: "Sofa Set",
      image: "https://via.placeholder.com/50",
      location: "New York",
      price: [
        { months: "3 months", amount: 600 },
        { months: "6 months", amount: 1500 },
      ],
      brand: "Ikea",
      size: "Medium",
      material: "Leather",
      colour: "Black",
      status: "Active",
    },
    {
      id: 2,
      benefitId: "Free Delivery",
      title: "Dining Table",
      image: "https://via.placeholder.com/50",
      location: "California",
      price: [
        { months: "3 months", amount: 800 },
        { months: "6 months", amount: 1800 },
      ],
      brand: "HomeCenter",
      size: "Large",
      material: "Wood",
      colour: "Brown",
      status: "Inactive",
    },
  ]);

  // Selected rental duration (could be dynamic based on user input)
  const [selectedRentalDuration, setSelectedRentalDuration] = useState("3 months");

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

  // Delete product
  const deleteProduct = (id) => {
    confirmAction("Are you sure you want to delete this product?", () => {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Product deleted successfully!", { position: "top-right" });
    });
  };

  // Toggle product status
  const updateStatus = (row) => {
    confirmAction("Are you sure you want to change the status?", () => {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      setProducts((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: newStatus } : item
        )
      );
      toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
    });
  };

  // Table columns
  const columns = [
    { header: "Title", accessor: "title" },
    {
      header: "Benefits",
      accessor: "benefitId",
      cell: (row) => row.benefitId || "N/A",
    },
    {
      header: "Image",
      accessor: "image",
      cell: (row) => (
        <img src={row.image} alt="Product" className="w-12 h-12 object-cover rounded" />
      ),
    },
    { header: "Location", accessor: "location" },
    {
      header: "Price",
      accessor: "price",
      cell: (row) => {
        // Filter price by selectedRentalDuration
        const selectedPrice = row.price.find(
          (p) => p.months === selectedRentalDuration
        );
        return selectedPrice ? `$${selectedPrice.amount}` : "N/A";
      },
    },
    { header: "Brand", accessor: "brand" },
    { header: "Size", accessor: "size" },
    { header: "Material", accessor: "material" },
    { header: "Colour", accessor: "colour" },
    { header: "Status", accessor: "status" },
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/product/edit", { state: { productData: row } }),
      className: "text-green-500 hover:text-green-600",
    },
    {
      label: <Trash2 className="w-4 h-4" />,
      handler: (row) => deleteProduct(row.id),
      className: "text-red-500 hover:text-red-600",
    },
    {
      label: <RefreshCcw className="w-4 h-4" />,
      handler: (row) => updateStatus(row),
      className: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Eco Stay | Product List</title>
        <meta name="Product List" content="Eco Stay Product List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Product List</h1>

      {/* Dropdown or selection for rental duration */}
      <div className="mb-4">
        <label htmlFor="rental-duration" className="mr-2">Select Rental Duration:</label>
        <select
          id="rental-duration"
          value={selectedRentalDuration}
          onChange={(e) => setSelectedRentalDuration(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
        </select>
      </div>

      {products.length > 0 ? (
        <Table columns={columns} data={products} globalActions={actions} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No products found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListProduct;
