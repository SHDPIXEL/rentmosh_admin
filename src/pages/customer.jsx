import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../lib/utils";

const ListCustomers = () => {
  const [customers, setCustomers] = useState([]);

  // Fetch Customers Data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get("/admin/users");
        console.log(response.data)
        console.log(response.data.users); // Debugging log
        setCustomers(response.data.users);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customer data.", { position: "top-right" });
      }
    };
    fetchCustomers();
  }, []);

  // Table columns
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "CreatedAt", accessor: "createdAt" },
  ];

  return (
    <div className="p-6">
      <Helmet>
        <title>Rentmosh | Customer List</title>
        <meta name="Customer List" content="Eco Stay Customer List" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4 text-gray-800">Customer List</h1>

      {customers.length > 0 ? (
        <Table columns={columns} data={customers} />
      ) : (
        <div className="text-center text-gray-600 mt-10">No customers found</div>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListCustomers;
