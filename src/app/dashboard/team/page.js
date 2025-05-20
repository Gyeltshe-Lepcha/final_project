"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  List,
  Settings,
  LogOut,
  Plus,
  Loader2,
  X,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    status: "active",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light"
  );
  const [isLoading, setIsLoading] = useState(true);
  const imageInputRef = useRef(null);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Clean up preview image URL
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/display-member");
        if (!response.ok) {
          throw new Error("Failed to fetch team members");
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Error fetching team members:", error);
        showNotification("Failed to load team members", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showNotification("Please upload an image file", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size should be less than 5MB", "error");
        return;
      }

      // Validate image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width > 1024 || img.height > 1024) {
          showNotification("Image dimensions should not exceed 1024x1024", "error");
          return;
        }
        if (previewImage) {
          URL.revokeObjectURL(previewImage);
        }
        setFormData((prev) => ({ ...prev, profileImage: file }));
        setPreviewImage(URL.createObjectURL(file));
      };
      img.onerror = () => {
        showNotification("Invalid image file", "error");
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const openAddModal = () => {
    setCurrentMember(null);
    setFormData({
      name: "",
      role: "",
      email: "",
      status: "active",
      profileImage: null,
    });
    setPreviewImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      status: member.status,
      profileImage: null,
    });
    setPreviewImage(member.profileImage || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.email) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    try {
      let response;
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("role", formData.role);
      submitData.append("email", formData.email);
      submitData.append("status", formData.status);
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      if (currentMember) {
        // Update member
        response = await fetch(`/api/update-member/${currentMember.id}`, {
          method: "PUT",
          body: submitData,
        });
      } else {
        // Add new member
        response = await fetch("/api/add-member", {
          method: "POST",
          body: submitData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${currentMember ? "update" : "add"} member`);
      }

      const memberData = await response.json();
      if (currentMember) {
        setTeamMembers((prev) =>
          prev.map((member) => (member.id === memberData.id ? memberData : member))
        );
        showNotification(`${formData.name} updated successfully`, "success");
      } else {
        setTeamMembers((prev) => [...prev, memberData]);
        showNotification(`${formData.name} added to team`, "success");
      }

      setIsModalOpen(false);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeleteMember = async (id) => {
    const member = teamMembers.find((member) => member.id === id);
    if (window.confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      setLoadingStates((prev) => ({ ...prev, [id]: "delete" }));
      try {
        const response = await fetch(`/api/delete-member/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to delete member");
        }

        setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
        showNotification(`${member.name} removed from team`, "success");
      } catch (error) {
        showNotification(error.message, "error");
      } finally {
        setLoadingStates((prev) => ({ ...prev, [id]: undefined }));
      }
    }
  };

  const handleStatusChange = async (id) => {
    const member = teamMembers.find((member) => member.id === id);
    const newStatus = member.status === "active" ? "inactive" : "active";
    setLoadingStates((prev) => ({ ...prev, [id]: "status" }));

    try {
      const response = await fetch(`/api/update-member/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update status");
      }

      setTeamMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === id ? { ...member, status: newStatus } : member
        )
      );
      showNotification(`Status updated for ${member.name}`, "success");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      router.push("/login");
    }
  };

  return (
    <div
      className={`flex min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "dark bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
      }`}
    >
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
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-300 select-none">
            JD
          </span>
        </div>
        <nav className="flex flex-col gap-4 text-lg w-full flex-1">
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard");
              setSidebarOpen(false);
            }}
            aria-label="Go to Dashboard"
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left text-purple-700 dark:text-purple-300"
            onClick={() => {
              router.push("/dashboard/team");
              setSidebarOpen(false);
            }}
            aria-label="Go to Team"
          >
            <Users size={20} /> Team
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/menu");
              setSidebarOpen(false);
            }}
            aria-label="Go to Menu"
          >
            <List size={20} /> Menu
          </button>
          <button
            className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30 w-full text-left dark:text-gray-100"
            onClick={() => {
              router.push("/dashboard/setting");
              setSidebarOpen(false);
            }}
            aria-label="Go to Settings"
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                : notification.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
                : "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
            }`}
            role="alert"
            aria-live="assertive"
          >
            {notification.type === "success" ? (
              <span className="text-green-500 dark:text-green-400">✓</span>
            ) : notification.type === "error" ? (
              <span className="text-red-500 dark:text-red-400">✗</span>
            ) : (
              <span className="text-blue-500 dark:text-blue-400">i</span>
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Add/Edit Member Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-gray-800 dark:text-gray-100"
                >
                  {currentMember ? "Edit Team Member" : "Add New Team Member"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    if (previewImage) {
                      URL.revokeObjectURL(previewImage);
                      setPreviewImage(null);
                    }
                    if (imageInputRef.current) {
                      imageInputRef.current.value = null;
                    }
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">No image</span>
                        )}
                      </div>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={imageInputRef}
                        className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900 dark:file:text-purple-200 dark:hover:file:bg-purple-800"
                        aria-describedby="profileImage-help"
                      />
                    </div>
                    <p
                      id="profileImage-help"
                      className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                    >
                      Max 5MB, 1024x1024 pixels
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Name <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Role <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      if (previewImage) {
                        URL.revokeObjectURL(previewImage);
                        setPreviewImage(null);
                      }
                      if (imageInputRef.current) {
                        imageInputRef.current.value = null;
                      }
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md w-full sm:w-auto"
                  >
                    {currentMember ? "Update Member" : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Team Management
          </h1>
          <button
            onClick={openAddModal}
            className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto"
            aria-label="Add New Team Member"
          >
            <Plus size={20} />
            Add Member
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Team Members
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"} in team
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2
                className="h-8 w-8 animate-spin text-purple-500 dark:text-purple-400"
                aria-label="Loading team members"
              />
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {teamMembers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No team members found
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add your first team member to get started
                  </p>
                </div>
              ) : (
                teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {member.profileImage ? (
                            <img
                              src={member.profileImage}
                              alt={`${member.name}'s profile`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xl">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-800 dark:text-gray-100">
                              {member.name}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                member.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : member.status === "on leave"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {member.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>
                              <span className="font-medium">Role:</span> {member.role}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              <a
                                href={`mailto:${member.email}`}
                                className="hover:underline text-gray-600 dark:text-gray-400"
                              >
                                {member.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[120px]">
                        <button
                          onClick={() => handleStatusChange(member.id)}
                          disabled={loadingStates[member.id] === "status"}
                          className={`${
                            loadingStates[member.id] === "status"
                              ? "bg-gray-600 dark:bg-gray-500"
                              : member.status === "active"
                              ? "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                              : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                          } text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto`}
                          aria-label={`${
                            member.status === "active" ? "Deactivate" : "Activate"
                          } ${member.name}`}
                        >
                          {loadingStates[member.id] === "status" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : member.status === "active" ? (
                            <>
                              <span>🟡</span>
                              Deactivate
                            </>
                          ) : (
                            <>
                              <span>🟢</span>
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(member)}
                          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
                          aria-label={`Edit ${member.name}`}
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          disabled={loadingStates[member.id] === "delete"}
                          className={`${
                            loadingStates[member.id] === "delete"
                              ? "bg-red-600 dark:bg-red-700"
                              : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                          } text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto`}
                          aria-label={`Remove ${member.name}`}
                        >
                          {loadingStates[member.id] === "delete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <span>🗑️</span>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}