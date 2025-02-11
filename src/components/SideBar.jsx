import React, { useState } from "react";
import RentmoshLogo from "../assets/Rentmosh-logo.png";
import { Link } from "react-router-dom";
import { NavLink } from "react-router";
import {
  Home,
  ClipboardList,
  LogIn,
  ChevronDown,
  ChevronUp,
  Plus,
  Rows3,
  LayoutGrid,
  Layers,
  Package,
  Gift,
  Tag,
  CreditCard,
  Users,
  Landmark,
  UserCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ setIsAuthenticated }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    setIsAuthenticated(false);
  };

  const menuStructure = [
    { path: "/dashboard", name: "Dashboard", icon: Home, type: "link" },
    {
      name: "City",
      icon: Landmark,
      type: "submenu",
      submenuItems: [
        { path: "/city/list", name: "City List", icon: Rows3 },
        { path: "/city/add", name: "Add city", icon: Plus },
      ],
    },
    {
      name: "Categories",
      icon: LayoutGrid,
      type: "submenu",
      submenuItems: [
        { path: "/categories/list", name: "Categories List", icon: Rows3 },
        { path: "/categories/add", name: "Add Categories", icon: Plus },
      ],
    },
    {
      name: "Sub-Categories",
      icon: Layers,
      type: "submenu",
      submenuItems: [
        {
          path: "/sub-Categories/list",
          name: "Sub-Categories List",
          icon: Rows3,
        },
        { path: "/sub-Categories/add", name: "Add Sub-Categories", icon: Plus },
      ],
    },
    {
      name: "Benefits",
      icon: Gift,
      type: "submenu",
      submenuItems: [
        { path: "/benefits/list", name: "Benefits List", icon: Rows3 },
        { path: "/benefit/add", name: "Add Benefit", icon: Plus },
      ],
    },
    {
      name: "Products",
      icon: Package,
      type: "submenu",
      submenuItems: [
        { path: "/products/list", name: "Products List", icon: Rows3 },
        { path: "/product/add", name: "Add Product", icon: Plus },
      ],
    },
    { path: "/kyclist", name: "KYC", icon: UserCheck, type: "link" },
    {
      name: "Offers",
      icon: Tag,
      type: "submenu",
      submenuItems: [
        { path: "/offers/list", name: "Offers List", icon: Rows3 },
        { path: "/offer/add", name: "Add Offer", icon: Plus },
      ],
    },
    {
      path: "/ordersplaced",
      name: `Order'${"s"} Placed`,
      icon: ClipboardList,
      type: "link",
    },
    {
      path: "/PaymentList",
      name: "Payment Info",
      icon: CreditCard,
      type: "link",
    },
    {
      path: "/customerList",
      name: `Customer'${"s"}`,
      icon: Users,
      type: "link",
    },
  ];

  const handleSubmenuToggle = (submenuName) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [submenuName]: !prevState[submenuName],
    }));
  };

  const renderMenuItem = (item) => {
    if (item.type === "link") {
      return (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 ${
              isActive
                ? "bg-[#960b22] text-white font-medium"
                : "text-black hover:bg-gray-300"
            }`
          }
          onClick={() => setIsSidebarOpen(false)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.name}</span>
        </NavLink>
      );
    }

    if (item.type === "submenu") {
      return (
        <>
          <button
            onClick={() => handleSubmenuToggle(item.name)}
            className="w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-150 text-black  hover:bg-gray-300"
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {openSubmenus[item.name] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {openSubmenus[item.name] && (
            <ul className="mt-1 ml-4 space-y-1 mb-1 text-xs">
              {item.submenuItems.map((subItem) => (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-[#960b22] text-white font-medium"
                          : "text-black hover:bg-gray-300"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </>
      );
    }
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 text-black"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed border border-black lg:static inset-y-0 left-0 z-40 w-72 h-screen bg-gray-100 text-gray-300 flex flex-col flex-shrink-0 text-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border items-center justify-center border-gray-700 bg-gray-100 flex-shrink-0">
          <Link to="/">
            <img src={RentmoshLogo} alt="RentMosh Logo" className="w-54 items-center justify-center" />
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow overflow-y-auto p-4">
          <div className="mb-4 px-4 text-xs font-semibold text-black uppercase">
            Main Menu
          </div>
          <ul className="space-y-1 text-black">
            {menuStructure.map((item, index) => (
              <li key={item.name || index}>{renderMenuItem(item)}</li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-700 bg-gray-100 border flex-shrink-0">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#960b22] flex items-center justify-center">
              <span className="text-sm font-medium text-gray-300">RM</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-black">Rent Mosho</h3>
              <p className="text-xs text-gray-800">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="hover:bg-gray-900 p-2 rounded-md text-black"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
