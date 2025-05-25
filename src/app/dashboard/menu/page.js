"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  List,
  Settings,
  LogOut,
  Plus,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "",
    category: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );
  const [isSaving, setIsSaving] = useState(false);

  // Currency options
  const currencyOptions = [
    { symbol: "$", name: "USD" },
    { symbol: "Nu.", name: "Bhutanese Ngultrum" },
    { symbol: "₹", name: "Indian currency" },
    { symbol: "€", name: "Euro" },
    { symbol: "£", name: "British Pound" },
    { symbol: "¥", name: "Japanese Yen" },
  ];

  // New category options
  const categoryOptions = [
    "Popular Breakfast",
    "Special Lunch",
    "Lovely Dinner",
    "Others",
  ];

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      // Ensure backward compatibility: set default currency and map old categories
      const updatedData = data.map(item => ({
        ...item,
        currency: item.currency || "",
        category: mapCategory(item.category),
      }));
      setMenuItems(updatedData);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      showNotification('Failed to fetch menu items', 'error');
    }
  };

  // Map old categories to new ones for backward compatibility
  const mapCategory = (category) => {
    const oldToNew = {
      "Starter": "Others",
      "Main Course": "Others",
      "Dessert": "Others",
    };
    return categoryOptions.includes(category) ? category : oldToNew[category] || "Others";
  };

  // Group and sort menu items by category
  const getGroupedMenuItems = () => {
    const grouped = categoryOptions.reduce((acc, category) => {
      acc[category] = menuItems
        .filter(item => item.category === category)
        .sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {});
    return grouped;
  };

  // Load menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Apply theme on mount and theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
   if (!formData.price.trim()) {
  errors.price = "Price is required";
} else if (!/^[^\d\s]*\d+(\.\d{2})?$/.test(formData.price)) {
  errors.price = "Price must be in the format XX.XX (e.g., 12.99)";
}

if (!formData.currency?.trim()) {
  errors.currency = "Currency is required";
}

    if (!formData.category.trim()) errors.category = "Category is required";
    if (
      formData.image &&
      !/^(https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$|\/[\w\-\/]+\.\w+$)/.test(formData.image)
    )
      errors.image = "Image must be a valid URL or file path (e.g., https://example.com/image.jpg or /images/food.jpg)";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = () => {
    setFormData({ name: "", price: "", currency: "", category: "", image: "" });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleEditItem = (id) => {
    const item = menuItems.find((item) => item.id === id);
    setCurrentItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      currency: item.currency || "",
      category: item.category,
      image: item.image || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    setIsSaving(true);
    try {
      const url = '/api/menu';
      const method = isEdit ? 'PUT' : 'POST';
      const body = JSON.stringify({
        id: isEdit ? currentItem.id : undefined,
        name: formData.name,
        price: formData.price,
        currency: formData.currency,
        category: formData.category,
        image: formData.image || null,
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} menu item`);

      // Refresh the menu items after successful operation
      await refreshMenuItems();

      showNotification(
        `"${formData.name}" ${isEdit ? 'updated' : 'added'} successfully`,
        "success"
      );

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setFormData({ name: "", price: "", currency: "", category: "", image: "" });
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      showNotification("Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

 const handleDeleteItem = async (id) => {
  try {
    const item = menuItems.find((item) => item.id === id);
    if (window.confirm(`Are you sure you want to delete "${item.name}" from the menu?`)) {
      try {
        const response = await fetch('/api/menu', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete menu item');

        // Refresh the menu items after successful deletion
        await fetchMenuItems();

        showNotification(`"${item.name}" deleted from menu`, "success");
      } catch (error) {
        console.error('Error deleting menu item:', error);
        showNotification("Failed to delete item", "error");
      }
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      router.push("/");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({ name: "", price: "", currency: "", category: "", image: "" });
    setFormErrors({});
    setCurrentItem(null);
  };

  const groupedMenuItems = getGroupedMenuItems();

  return (
    <div className={`flex min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"} font-sans transition-colors duration-300`}>
      {/* Sidebar Toggle Button */}
      <button
        aria-label={sidebarOpen ? "Hide Menu" : "Show Menu"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed left-4 z-50 p-2 rounded-md bg-transparent text-purple-700 dark:text-purple-300 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
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
            aria-label="Navigate to Dashboard"
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/team");
              setSidebarOpen(false);
            }}
            aria-label="Navigate to Team"
          >
            <Users size={20} /> Team
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left text-purple-700 dark:text-purple-300"
            onClick={() => {
              router.push("/dashboard/menu");
              setSidebarOpen(false);
            }}
            aria-current="page"
            aria-label="Navigate to Menu"
          >
            <List size={20} /> Menu
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/setting");
              setSidebarOpen(false);
            }}
            aria-label="Navigate to Settings"
          >
            <Settings size={20} /> Settings
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 text-red-500 dark:text-red-400 mt-auto w-full text-left"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            aria-label="Log Out"
          >
            <LogOut size={20} /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
            }`}
            role="alert"
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">Menu Management</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddItem}
              className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-md text-white font-semibold text-lg transition-all duration-200 ease-in-out bg-purple-500 dark:bg-purple-600 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
              aria-label="Add New Menu Item"
            >
              <Plus size={24} />
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Menu Items
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {menuItems.length} {menuItems.length === 1 ? "item" : "items"} in menu
            </p>
          </div>

          <div className="divide-y dark:divide-gray-700">
            {menuItems.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  No menu items found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Add your first menu item to get started
                </p>
              </div>
            ) : (
              categoryOptions.map((category) => (
                groupedMenuItems[category].length > 0 && (
                  <div key={category} className="py-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-6 mb-4">
                      {category}
                    </h3>
                    {groupedMenuItems[category].map((item) => (
                      <div
                        key={item.id}
                        className="px-6 py-4 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg dark:hover:shadow-purple-500/30"
                      >
                        <div className="flex f
                              lex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div className="flex items-center gap-4 flex-1">
                            <Image
                              src={item.image || "https://via.placeholder.com/80?text=Image+Not+Found"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-lg object-cover mr-4"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80?text=Image+Not+Found";
                              }}
                            />
                            <div>
                              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                                {item.name}
                              </h4>
                              <div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>Price: {item.currency}{item.price}</span>
                                <span>Category: {item.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => handleEditItem(item.id)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                              aria-label={`Edit ${item.name}`}
                            >
                              <span>✏️</span>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                              aria-label={`Delete ${item.name}`}
                            >
                              <span>🗑️</span>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))
            )}
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
              Add New Menu Item
            </h2>
            <form onSubmit={(e) => handleFormSubmit(e, false)}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="add-name">
                  Name
                </label>
                <input
                  id="add-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.name ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  autoFocus
                />
                {formErrors.name && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="add-currency">
                  Currency
                </label>
                <select
                  id="add-currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.currency ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">Select a currency</option>
                  {currencyOptions.map((option) => (
                    <option key={option.symbol} value={option.symbol}>
                      {option.name} ({option.symbol})
                    </option>
                  ))}
                </select>
                {formErrors.currency && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.currency}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="add-price">
                  Price
                </label>
                <input
                  id="add-price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={`${formData.currency || "Nu."}XX.XX`}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.price ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                {formErrors.price && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="add-category">
                  Category
                </label>
                <select
                  id="add-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.category ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.category}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="add-image">
                  Image URL or File Path
                </label>
                <input
                  id="add-image"
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg or /images/food.jpg"
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.image ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                {formErrors.image && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.image}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  aria-label="Cancel Add Menu Item"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 dark:bg-purple-600 text-white rounded-lg flex items-center gap-3 font-semibold disabled:opacity-50 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  disabled={isSaving}
                  aria-label="Add Menu Item"
                >
                  {isSaving ? (
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
                      <Save size={20} /> Add Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
              Edit Menu Item
            </h2>
            <form onSubmit={(e) => handleFormSubmit(e, true)}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="edit-name">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.name ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  autoFocus
                />
                {formErrors.name && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="edit-currency">
                  Currency
                </label>
                <select
                  id="edit-currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.currency ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">Select a currency</option>
                  {currencyOptions.map((option) => (
                    <option key={option.symbol} value={option.symbol}>
                      {option.name} ({option.symbol})
                    </option>
                  ))}
                </select>
                {formErrors.currency && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.currency}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="edit-price">
                  Price
                </label>
                <input
                  id="edit-price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={`${formData.currency || "Nu."}XX.XX`}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.price ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                {formErrors.price && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="edit-category">
                  Category
                </label>
                <select
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.category ? "border-red-500 dark:border-red-400" : ""
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.category}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="edit-image">
                  Image URL or File Path
                </label>
                <input
                  id="edit-image"
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg or /images/food.jpg"
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                    formErrors.image ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                {formErrors.image && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                    {formErrors.image}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  aria-label="Cancel Edit Menu Item"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 dark:bg-purple-600 text-white rounded-lg flex items-center gap-3 font-semibold disabled:opacity-50 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  disabled={isSaving}
                  aria-label="Save Menu Item Changes"
                >
                  {isSaving ? (
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
                      <Save size={20} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}