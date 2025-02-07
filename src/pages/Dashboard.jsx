import React from "react";
import Card from "../components/Card";
import { Users, LayoutGrid , Layers, Package } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import renderActiveShape from "../components/pieCharShape";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  // Static data for the dashboard
  const data = 10; // Example static data for total bookings
  const totalUsers = 100; // Example static data for total users
  const totalProducts = 40; // Example static data for total agents
  const totalsubcategories = 20; // Example static data for total rooms

  const bookingChartData = [
    { date: "2023-12-01", bookings: 30 },
    { date: "2023-12-02", bookings: 45 },
    { date: "2023-12-03", bookings: 60 },
    { date: "2023-12-04", bookings: 25 },
    { date: "2023-12-05", bookings: 75 },
    { date: "2023-12-06", bookings: 50 },
    { date: "2023-12-07", bookings: 90 },
  ];

  const UserAgentPieCharData = [
    { name: "User", value: totalUsers },
    { name: "Products", value: totalProducts },
  ];

  const onPieEnter = (_, index) => {
    // Logic for handling pie chart interaction can go here
  };

  const COLORS = ["#0088FE", "#00C49F"];

  const LinechartData = [
    { date: "2023-12-01", bookings: 30 },
    { date: "2023-12-02", bookings: 45 },
    { date: "2023-12-03", bookings: 60 },
    { date: "2023-12-04", bookings: 25 },
    { date: "2023-12-05", bookings: 75 },
    { date: "2023-12-06", bookings: 50 },
    { date: "2023-12-07", bookings: 90 },
  ];

  const DashboardItems = [
    {
      title: "Total Categories",
      value: data,
      icon: <LayoutGrid className="w-5 h-5" />, // Use Folder if preferred
    },
    {
      title: "Total Sub-Categories",
      value: totalsubcategories,
      icon: <Layers className="w-5 h-5" />, // Alternative: <ListTree className="w-5 h-5" />
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <Package className="w-5 h-5" />, // Alternative: <ShoppingBag className="w-5 h-5" /> or <Boxes className="w-5 h-5" />
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Rentmosh | Dashboard</title>
        <meta name="Dashboard" content="Rentmosh Dashboard!" />
      </Helmet>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-6 mt-20">
        {DashboardItems.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-6">
        <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
          <ResponsiveContainer>
            <LineChart
              data={LinechartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#333" }}
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}-${
                    date.getMonth() + 1
                  }-${date.getFullYear()}`;
                }}
              />
              <YAxis tick={{ fill: "#333" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                }}
                itemStyle={{ color: "#333" }}
              />
              <Legend wrapperStyle={{ color: "#333" }} />
              <Line
                type="monotone"
                dataKey="booking"
                stroke="#00C49F"
                strokeWidth={2}
                activeDot={{ r: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="font-bold text-gray-600 text-xl mt-2">Rented Furniture Trends</p>
        </div>

        {/* Pie Chart */}
        <div className="h-80 flex flex-col items-center justify-center shadow-sm bg-white p-6 space-y-5">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                activeIndex={0}
                activeShape={renderActiveShape}
                data={UserAgentPieCharData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {UserAgentPieCharData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="font-bold text-gray-600 text-xl mt-2">
            Users <span className="text-[#00C49F]">vs</span> Products
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
