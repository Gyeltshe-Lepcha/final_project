"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  List,
  Settings,
  LogOut,
  Save,
  Clock,
  Bell,
  Sun,
  Moon,
  User,
  Mail,
  Lock,
  Phone,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [restaurantFormData, setRestaurantFormData] = useState({
    restaurantName: "Gourmet House",
    openingHours: "09:00",
    closingHours: "22:00",
    notificationEnabled: true,
    theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light",
    taxRate: 8.5,
    serviceCharge: 10,
  });
  const [accountFormData, setAccountFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "",
    confirmPassword: "",
    contact: "+1234567890",
  });
  const [restaurantFormErrors, setRestaurantFormErrors] = useState({});
  const [accountFormErrors, setAccountFormErrors] = useState({});
  const [isSavingRestaurant, setIsSavingRestaurant] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRestaurantDropdownOpen, setIsRestaurantDropdownOpen] = useState(false);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);

  // Apply theme on mount and theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", restaurantFormData.theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", restaurantFormData.theme);
    }
  }, [restaurantFormData.theme]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Validation for Restaurant Settings
  const validateRestaurantForm = () => {
    const errors = {};
    if (!restaurantFormData.restaurantName.trim()) {
      errors.restaurantName = "Restaurant name is required";
    }
    if (!restaurantFormData.openingHours) {
      errors.openingHours = "Opening hours are required";
    }
    if (!restaurantFormData.closingHours) {
      errors.closingHours = "Closing hours are required";
    } else if (restaurantFormData.openingHours >= restaurantFormData.closingHours) {
      errors.closingHours = "Closing time must be after opening time";
    }
    if (restaurantFormData.taxRate < 0 || restaurantFormData.taxRate > 30) {
      errors.taxRate = "Tax rate must be between 0 and 30%";
    }
    if (restaurantFormData.serviceCharge < 0 || restaurantFormData.serviceCharge > 30) {
      errors.serviceCharge = "Service charge must be between 0 and 30%";
    }
    setRestaurantFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation for Account Settings
  const validateAccountForm = () => {
    const errors = {};
    if (!accountFormData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!accountFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountFormData.email)) {
      errors.email = "Invalid email format";
    }
    if (accountFormData.password && accountFormData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (accountFormData.password && accountFormData.password !== accountFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!accountFormData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^\+\d{10,15}$/.test(accountFormData.contact)) {
      errors.contact = "Invalid phone number (e.g., +1234567890)";
    }
    setAccountFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRestaurantInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurantFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setRestaurantFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleAccountInputChange = (e) => {
    const { name, value } = e.target;
    setAccountFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setAccountFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!validateRestaurantForm()) {
      showNotification("Please fix the errors in the restaurant settings", "error");
      return;
    }

    setIsSavingRestaurant(true);
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.2 ? resolve() : reject(new Error("Failed to save restaurant settings"));
        }, 1000);
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("restaurantSettings", JSON.stringify(restaurantFormData));
      }

      showNotification("Restaurant settings saved successfully", "success");
    } catch (error) {
      showNotification(error.message || "Failed to save restaurant settings", "error");
    } finally {
      setIsSavingRestaurant(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!validateAccountForm()) {
      showNotification("Please fix the errors in the account settings", "error");
      return;
    }

    setIsSavingAccount(true);
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.2 ? resolve() : reject(new Error("Failed to save account settings"));
        }, 1000);
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("accountSettings", JSON.stringify({
          name: accountFormData.name,
          email: accountFormData.email,
          contact: accountFormData.contact,
        }));
      }

      showNotification("Account settings saved successfully", "success");
      setAccountFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error) {
      showNotification(error.message || "Failed to save account settings", "error");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      router.push("/login");
    }
  };

  return (
    <div className={`flex min-h-screen ${restaurantFormData.theme === "dark" ? "dark bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"} font-sans transition-colors duration-300`}>
      {/* Sidebar Toggle Button */}
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
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-300 select-none">JD</span>
        </div>
        <nav className="flex flex-col gap-4 text-lg w-full flex-1">
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
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
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left text-purple-700 dark:text-purple-300"
            onClick={() => {
              router.push("/dashboard/setting");
              setSidebarOpen(false);
            }}
            aria-current="page"
          >
            <Settings size={20} /> Settings
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 text-red-500 dark:text-red-400 mt-auto w-full text-left"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          >
            <LogOut size={20} /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <span className="text-green-500 dark:text-green-400">✓</span>
            ) : (
              <span className="text-red-500 dark:text-red-400">✗</span>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setIsRestaurantDropdownOpen(!isRestaurantDropdownOpen);
                setIsAccountFormOpen(false); // Close account form if open
              }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-md text-white font-semibold text-lg transition-all duration-200 ${
                isRestaurantDropdownOpen
                  ? "bg-purple-600 dark:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
              }`}
            >
              <Settings size={24} />
              Restaurant Settings
              {isRestaurantDropdownOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <button
              onClick={() => {
                setIsAccountFormOpen(!isAccountFormOpen);
                setIsRestaurantDropdownOpen(false); // Close restaurant dropdown if open
              }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl shadow-md text-white font-semibold text-lg transition-all duration-200 ${
                isAccountFormOpen
                  ? "bg-blue-600 dark:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              }`}
            >
              <User size={24} />
              Account Settings
            </button>
          </div>
        </div>

        {/* Restaurant Settings Dropdown */}
        {isRestaurantDropdownOpen && (
          <form onSubmit={handleRestaurantSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300">
            {/* Restaurant Information Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                <Settings size={24} /> Restaurant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={restaurantFormData.restaurantName}
                    onChange={handleRestaurantInputChange}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      restaurantFormErrors.restaurantName ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {restaurantFormErrors.restaurantName && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{restaurantFormErrors.restaurantName}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock size={18} /> Opening Hours
                    </label>
                    <input
                      type="time"
                      name="openingHours"
                      value={restaurantFormData.openingHours}
                      onChange={handleRestaurantInputChange}
                      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                        restaurantFormErrors.openingHours ? "border-red-500 dark:border-red-400" : ""
                      }`}
                    />
                    {restaurantFormErrors.openingHours && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-2">{restaurantFormErrors.openingHours}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Clock size={18} /> Closing Hours
                    </label>
                    <input
                      type="time"
                      name="closingHours"
                      value={restaurantFormData.closingHours}
                      onChange={handleRestaurantInputChange}
                      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                        restaurantFormErrors.closingHours ? "border-red-500 dark:border-red-400" : ""
                      }`}
                    />
                    {restaurantFormErrors.closingHours && (
                      <p className="text-red-500 dark:text-red-400 text-sm mt-2">{restaurantFormErrors.closingHours}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                <Bell size={24} /> Notification Settings
              </h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificationEnabled"
                  name="notificationEnabled"
                  checked={restaurantFormData.notificationEnabled}
                  onChange={handleRestaurantInputChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="notificationEnabled"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable order notifications
                </label>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                {restaurantFormData.theme === "light" ? <Sun size={24} /> : <Moon size={24} />}{" "}
                Appearance
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="lightTheme"
                    name="theme"
                    value="light"
                    checked={restaurantFormData.theme === "light"}
                    onChange={handleRestaurantInputChange}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 dark:border-gray-600"
                  />
                  <label
                    htmlFor="lightTheme"
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Light Mode
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="darkTheme"
                    name="theme"
                    value="dark"
                    checked={restaurantFormData.theme === "dark"}
                    onChange={handleRestaurantInputChange}
                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 dark:border-gray-600"
                  />
                  <label
                    htmlFor="darkTheme"
                    className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Dark Mode
                  </label>
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Financial Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={restaurantFormData.taxRate}
                    onChange={handleRestaurantInputChange}
                    step="0.1"
                    min="0"
                    max="30"
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      restaurantFormErrors.taxRate ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {restaurantFormErrors.taxRate && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{restaurantFormErrors.taxRate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    name="serviceCharge"
                    value={restaurantFormData.serviceCharge}
                    onChange={handleRestaurantInputChange}
                    step="0.1"
                    min="0"
                    max="30"
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      restaurantFormErrors.serviceCharge ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {restaurantFormErrors.serviceCharge && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{restaurantFormErrors.serviceCharge}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button for Restaurant Settings */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg flex items-center gap-3 font-semibold text-lg disabled:opacity-50 transition-all duration-200"
                disabled={isSavingRestaurant}
              >
                {isSavingRestaurant ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Save Restaurant Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Account Settings Form */}
        {isAccountFormOpen && (
          <form onSubmit={handleAccountSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                <User size={24} /> Account Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User size={18} /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={accountFormData.name}
                    onChange={handleAccountInputChange}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      accountFormErrors.name ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {accountFormErrors.name && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{accountFormErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={18} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={accountFormData.email}
                    onChange={handleAccountInputChange}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      accountFormErrors.email ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {accountFormErrors.email && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{accountFormErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Lock size={18} /> New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={accountFormData.password}
                    onChange={handleAccountInputChange}
                    placeholder="Leave blank to keep current"
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      accountFormErrors.password ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {accountFormErrors.password && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{accountFormErrors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Lock size={18} /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={accountFormData.confirmPassword}
                    onChange={handleAccountInputChange}
                    placeholder="Leave blank to keep current"
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      accountFormErrors.confirmPassword ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {accountFormErrors.confirmPassword && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{accountFormErrors.confirmPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone size={18} /> Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={accountFormData.contact}
                    onChange={handleAccountInputChange}
                    placeholder="+1234567890"
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                      accountFormErrors.contact ? "border-red-500 dark:border-red-400" : ""
                    }`}
                  />
                  {accountFormErrors.contact && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-2">{accountFormErrors.contact}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button for Account Settings */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg flex items-center gap-3 font-semibold text-lg disabled:opacity-50 transition-all duration-200"
                disabled={isSavingAccount}
              >
                {isSavingAccount ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Save Account Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}