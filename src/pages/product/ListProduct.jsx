import React, { useState,useEffect } from "react";
import Table from "../../components/Table";
import { SquarePen, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../lib/utils";

const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedRentalDuration, setSelectedRentalDuration] = useState("3 months");

  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/admin/products");
        console.log(response.data.products)
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
          <button onClick={() => toast.dismiss()} className="bg-gray-500 text-white px-3 py-1 rounded">
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  // Delete product
  const deleteProduct = async (id) => {
    confirmAction("Are you sure you want to delete this product?", async () => {
      try {
        await API.delete(`/admin/products/${id}`);
        setProducts((prev) => prev.filter((item) => item.id !== id));
        toast.success("Product deleted successfully!", { position: "top-right" });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.", { position: "top-right" });
      }
    });
  };

  // Toggle product status
  const updateStatus = async (row) => {
    confirmAction("Are you sure you want to change the status?", async () => {
      try {
        const newStatus = row.status === "Active" ? "Inactive" : "Active";
        await API.put(`/admin/products/${row.id}`, { status: newStatus });
        setProducts((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item)));
        toast.info(`Status changed to ${newStatus}!`, { position: "top-right" });
      } catch (error) {
        console.error("Error updating product status:", error);
        toast.error("Failed to update status.", { position: "top-right" });
      }
    });
  };

  const toggleInStock = async (row) => {
    try {
      const newInStockValue = !row.inStock;
      
      // Send the updated value to the backend (adjust as necessary)
      await API.put(`/admin/products/${row.id}`, { inStock: newInStockValue });
  
      // Update the local state
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.id === row.id ? { ...item, inStock: newInStockValue } : item
        )
      );
  
      toast.info(`Product is now ${newInStockValue ? "In Stock" : "Out of Stock"}`, {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error updating inStock status:", error);
      toast.error("Failed to update inStock status.", { position: "top-right" });
    }
  };
  
  // Table columns
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Subcategories", accessor: "subcategoryId" },
    { header: "Benefits", accessor: "benefitId" },
    { header: "Description", accessor: "description" },
    {
      header: "Image",
      accessor: "product_image",
      cell: (row) => <img src={row.product_image} alt="Product" className="w-12 h-12 object-cover rounded" />,
    },
    { header: "Location", accessor: "location" },
    {
      header: "Price",
      accessor: "price",
      cell: (row) => {
        const selectedPrice = row.price.find((p) => p.months === selectedRentalDuration);
        return selectedPrice ? `$${selectedPrice.amount}` : "N/A";
      },
    },
    { header: "Brand", accessor: "brand" },
    { header: "Size", accessor: "size" },
    { header: "Material", accessor: "material" },
    { header: "Colour", accessor: "colour" },
    { header: "Status", accessor: "status" },
    {
      header: "In Stock",
      accessor: "inStock",
      cell: (row) => (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={row.row.original.inStock === true} // Use row.original to access the actual data object
            onChange={() => toggleInStock(row.row.original)} // Ensure you're passing the correct object to toggleInStock
            className="w-6 h-6 cursor-pointer rounded-full border-2 border-gray-400 checked:bg-[#960B22] checked:border-[#960B22] checked:accent-[#960B22] focus:ring-0"
          />
        </div>
      ),
    }
  ];

  // Table actions
  const actions = [
    {
      label: <SquarePen className="w-4 h-4" />,
      handler: (row) => navigate("/product/add", { state: { productData: row } }),
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
        <title>Rentmosh | Product List</title>
        <meta name="Product List" content="Eco Stay Product List!" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Product List</h1>

      {/* Dropdown or selection for rental duration
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
      </div> */}

      {products.length > 0 ? (
        <Table columns={columns} data={products} globalActions={actions}  toggleInStock={toggleInStock} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No products found</div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListProduct;
