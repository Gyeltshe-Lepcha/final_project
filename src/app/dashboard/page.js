"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  List,
  Settings,
  LogOut,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 500 },
  { name: "Apr", uv: 200 },
  { name: "May", uv: 700 },
];

const initialOrders = [
  {
    id: 1,
    name: "Fried Rice",
    clientName: "Alex",
    contact: "123-456-7890",
    people: 3,
    amount: 2,
    unit: "plates",
    status: "pending",
  },
  {
    id: 2,
    name: "Grilled Chicken",
    clientName: "Jamie",
    contact: "987-654-3210",
    people: 2,
    amount: 5,
    unit: "pieces",
    status: "pending",
  },
  {
    id: 3,
    name: "Caesar Salad",
    clientName: "Taylor",
    contact: "555-666-7777",
    people: 4,
    amount: 1,
    unit: "bowl",
    status: "pending",
  },
  {
    id: 4,
    name: "Spaghetti Carbonara",
    clientName: "Morgan",
    contact: "444-333-2222",
    people: 5,
    amount: 3,
    unit: "plates",
    status: "pending",
  },
];

const initialMenuItems = [
  { id: 1, name: "Pasta Bolognese" },
  { id: 2, name: "Grilled Chicken" },
  { id: 3, name: "Chocolate Cake" },
  { id: 4, name: "Greek Salad" },
];

export default function DashboardPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState({
    completed: 25,
    pending: initialOrders.length,
    cancelled: 7,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [shake, setShake] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );

  // Apply theme on mount and theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Auto renumber orderNo whenever orders array changes length or resets
  useEffect(() => {
    setOrders((prevOrders) =>
      prevOrders.map((order, index) => ({
        ...order,
        orderNo: index + 1,
      }))
    );
  }, [orders.length]);

  const handleOrderAction = (id, action) => {
    const order = orders.find((order) => order.id === id);
    if (!order) return;

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this order?\n\n${order.name} - Client: ${order.clientName}`
    );

    if (!confirmed) return;

    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));

    setOrderSummary((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      [action === "accept" ? "completed" : "cancelled"]:
        prev[action === "accept" ? "completed" : "cancelled"] + 1,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setShake(true);

    setTimeout(() => {
      setOrders(initialOrders);
      setOrderSummary({
        completed: 25,
        pending: initialOrders.length,
        cancelled: 7,
      });
      setRefreshing(false);
    }, 1000);

    setTimeout(() => setShake(false), 500);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      router.push("/login");
    }
  };

  const handleDeleteMenuItem = (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}" from the menu?`
    );
    if (confirmed) {
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  const handleEditMenuItem = (id) => {
    router.push(`/dashboard/menu?edit=${id}`);
  };

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "dark bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
      {/* Sidebar Toggle Button (visible only on smaller screens) */}
      <button
        aria-label={sidebarOpen ? "Hide Menu" : "Show Menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed left-4 z-50 p-2 rounded-md bg-transparent hover:bg-purple-50 text-purple-700 dark:hover:bg-purple-900 dark:text-purple-300 flex items-center justify-center"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        {sidebarOpen ? <ChevronRightIcon size={28} /> : <ChevronLeftIcon size={28} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-gray-800 p-6 flex flex-col items-center shadow-lg rounded-tr-3xl rounded-br-3xl fixed top-0 left-0 h-full min-h-screen transform transition-transform duration-300 ease-in-out z-40 md:static md:min-h-0 md:h-auto md:flex md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full mb-6 flex items-center justify-center">
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-300 select-none">
            JD
          </span>
        </div>
        <nav className="flex flex-col gap-4 text-lg w-full flex-1">
          <Link href="/dashboard">
            <button className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 text-purple-700 dark:text-purple-300 w-full text-left">
              <LayoutDashboard size={20} /> Dashboard
            </button>
          </Link>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/team");
              setSidebarOpen(false);
            }}
          >
            <Users size={20} /> Team
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/menu");
              setSidebarOpen(false);
            }}
          >
            <List size={20} /> Menu
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/setting");
              setSidebarOpen(false);
            }}
          >
            <Settings size={20} /> Settings
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 text-red-500 dark:text-red-400 mt-auto w-full text-left"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Restaurant Dashboard
          </h1>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Revenue
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={theme === "dark" ? 0.3 : 1} />
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#a0aec0" : "#666"} />
                  <YAxis stroke={theme === "dark" ? "#a0aec0" : "#666"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#2d3748" : "#fff",
                      border: "1px solid",
                      borderColor: theme === "dark" ? "#4a5568" : "#e2e8f0",
                      color: theme === "dark" ? "#e2e8f0" : "#4a5568",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-gray-800 dark:text-gray-200">Completed Orders</span>
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {orderSummary.completed}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-800 dark:text-gray-200">Pending Orders</span>
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {orderSummary.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-gray-800 dark:text-gray-200">Cancelled Orders</span>
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-100">
                  {orderSummary.cancelled}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incoming Orders Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Incoming Orders
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                    <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {orderSummary.pending} pending{" "}
                      {orderSummary.pending === 1 ? "order" : "orders"}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Completed: {orderSummary.completed}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Cancelled: {orderSummary.cancelled}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className={`text-sm text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-400 font-medium flex items-center gap-2 ${
                    shake ? "animate-shake" : ""
                  }`}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <svg
                      className="animate-spin h-5 w-5 text-purple-600 dark:text-purple-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Refresh Orders"
                  )}
                </button>
              </div>
            </div>

            <div className="divide-y dark:divide-gray-700">
              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-300 mb-2">🎉</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No pending orders
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    All caught up!
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800 dark:text-gray-100">
                            {order.name}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                            #{order.orderNo}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="font-medium">Client:</span>{" "}
                            {order.clientName}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>{" "}
                            {order.contact}
                          </div>
                          <div>
                            <span className="font-medium">People:</span>{" "}
                            {order.people}
                          </div>
                          <div>
                            <span className="font-medium">Amount:</span>{" "}
                            {order.amount} {order.unit}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleOrderAction(order.id, "complete")}
                          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Completed
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, "cancel")}
                          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Menu Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Menu Management
              </h2>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {menuItems.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 dark:text-gray-300 mb-2">🍽️</div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No menu items
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add some dishes!
                  </p>
                </div>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {item.name}
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditMenuItem(item.id)}
                          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id, item.name)}
                          className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}