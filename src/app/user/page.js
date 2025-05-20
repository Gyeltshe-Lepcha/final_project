"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactPlayer from "react-player";
import Head from "next/head";
import { Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaUtensils } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';
import { toast } from "react-hot-toast";


export default function RestaurantWebsite() {
  
  // ======= Hooks =======
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuItems, setMenuItems] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    others: [],
  });
  const [activeTab, setActiveTab] = useState("breakfast");
  const [notification, setNotification] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [formData, setFormData] = useState({
  customerName: "",
  contact: "",
  menuItem: "",
  quantity: "1", // Default to "1" for number input
  dateTime: "",  // Will be validated as empty string initially
  partySize: "1", // Default to "1" for number input
  notes: "",
  status: "pending",
});
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState("light"); // Added theme state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);


  const [testimonials, setTestimonials] = useState([])

  
   const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [profession, setProfession] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState(""); // Added for newsletter

  const videoRef = useRef(null);

   const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState("");
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

 const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      router.push("/");
    }
  };


  
// Replace your testimonials useEffect with this:

  // Fetch testimonials on load
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/feedback')
        const data = await res.json()
        setTestimonials(data)
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      }
    }

    fetchTestimonials()
  }, [])
  const getProfileInitial = (name) => {
  return name?.charAt(0).toUpperCase()
}

  // Handle feedback form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, profession, rating, feedback }),
      })

      if (res.ok) {
        const newFeedback = await res.json()
        setTestimonials(prev => [newFeedback, ...prev])
        setSubmitted(true)
        setName('')
        setProfession('')
        setRating(0)
        setFeedback('')
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        const errorData = await res.json()
        console.error('Error submitting:', errorData.message)
      }
    } catch (err) {
      console.error('Something went wrong:', err)
    }
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }


  // ======= Data & Helpers =======
  const socialLinks = {
    facebook: "https://www.facebook.com/",
    whatsapp: "https://web.whatsapp.com/",
    instagram: "https://www.instagram.com/",
  };

  const originalUrl = "https://youtu.be/xiWU6HmpIU0";
  const convertToWatchUrl = (url) => {
    if (url.includes("watch?v=")) return url;
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return `https://www.youtube.com/watch?v=${shortsMatch[1]}`;
    const shortLinkMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortLinkMatch) return `https://www.youtube.com/watch?v=${shortLinkMatch[1]}`;
    return url;
  };
  const videoUrl = convertToWatchUrl(originalUrl);


  const images = [
    "https://bing.com/th?id=OSK.3f310703319c7b18d1d2718e2d3fa277",
    "https://th.bing.com/th/id/OIP.sVvjZiDL2RKdLoRmv_gAcAHaEK?r=0&cb=iwc2&rs=1&pid=ImgDetMain",
    "https://th.bing.com/th/id/OIP.C3Ep0grJrP7VQASs-3ocnwHaFY?rs=1&pid=ImgDetMain",
  ];

  // Apply theme
  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", theme === "dark");
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("theme", theme);
  //   }
  // }, [theme]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customerName.trim()) errors.customerName = "Customer name is required";
    if (!formData.date) errors.date = "Date is required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date))
      errors.date = "Date must be in format YYYY-MM-DD";
    if (!formData.time) errors.time = "Time is required";
    else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(formData.time))
      errors.time = "Time must be in format HH:MM (24-hour)";
    if (!formData.partySize) errors.partySize = "Party size is required";
    else if (!Number.isInteger(Number(formData.partySize)) || Number(formData.partySize) <= 0)
      errors.partySize = "Party size must be a positive integer";
    if (!formData.status) errors.status = "Status is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddReservation = () => {
    setFormData({
      customerName: "",
      contact: "",
      menuItem: "",
      quantity: "1", // Default to "1" for number input
      dateTime: "",  // Will be validated as empty string initially
      partySize: "1", // Default to "1" for number input
      notes: "",
      status: "pending",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };
  
  // Generate a unique token for the reservation
  const generateToken = () => {
    const restaurantName = "Lama Restaurant";
    const date = new Date(formData.dateTime).toLocaleDateString();
    const time = new Date(formData.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${restaurantName.substring(0, 3).toUpperCase()}-${formData.customerName.substring(0, 3).toUpperCase()}-${date.replace(/\//g, '')}-${time.replace(/:/g, '')}-${randomNum}`;
  };

  const handleEditReservation = (reservation) => {
    setCurrentReservation(reservation);
    setFormData({
      customerName: reservation.customerName,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize.toString(),
      notes: reservation.notes || "",
      status: reservation.status,
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
     const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate token
      const reservationToken = generateToken();
      
      // Show success toast with token
      toast.success(
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Reservation Confirmed!</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
            <p className="font-semibold mb-1">Your Reservation Token:</p>
            <p className="text-xl font-mono bg-yellow-100 p-2 rounded">{reservationToken}</p>
            <p className="text-sm mt-2 text-gray-600">Please screenshot this for your reference</p>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={() => {
              setIsAddModalOpen(false);
              toast.dismiss();
            }}
          >
            Close
          </button>
        </div>,
        {
          duration: 10000, // Show for 10 seconds
          position: 'top-center',
          style: {
            minWidth: '400px',
          },
        }
      );

      // Reset form
      setFormData({
        customerName: "",
        contact: "",
        menuItem: "",
        quantity: "1",
        dateTime: "",
        partySize: "1",
        notes: "",
      });
      
      // Close modal after a delay
      setTimeout(() => setIsAddModalOpen(false), 500);
    } catch (error) {
      showNotification("Failed to create reservation", "error");
    } finally {
      setIsSaving(false);
    }
  };

    setIsSaving(true);
    try {
      const url = "/api/reservations";
      const method = isEdit ? "PUT" : "POST";
      const body = JSON.stringify({
        id: isEdit ? currentReservation.id : undefined,
        customerName: formData.customerName.trim(),
        date: formData.date,
        time: formData.time,
        partySize: Number(formData.partySize),
        notes: formData.notes.trim() || null,
        status: formData.status,
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) throw new Error("Reservation not found");
        throw new Error(errorData.error || `Failed to ${isEdit ? "update" : "create"} reservation`);
      }

      showNotification(
        `Reservation for "${formData.customerName}" ${isEdit ? "updated" : "added"} successfully`,
        "success"
      );

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setFormData({
        customerName: "",
        contact: "",
        menuItem: "",
        quantity: "1", // Default to "1" for number input
        dateTime: "",  // Will be validated as empty string initially
        partySize: "1", // Default to "1" for number input
        notes: "",
        status: "pending",
      });
      setCurrentReservation(null);
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} reservation:`, error);
      showNotification(error.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setShowModal(false); // Added for popup modal
    setFormData({
      customerName: "",
      contact: "",
      menuItem: "",
      quantity: "1", // Default to "1" for number input
      dateTime: "",  // Will be validated as empty string initially
      partySize: "1", // Default to "1" for number input
      notes: "",
      status: "pending",
        });
    setFormErrors({});
    setCurrentReservation(null);
  };

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showNotification("Subscribed successfully!", "success");
      setNewsletterEmail("");
    } else {
      showNotification("Please enter a valid email", "error");
    }
  };

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      const categorizedItems = {
        breakfast: [],
        lunch: [],
        dinner: [],
        others: [],
      };
      data.forEach((item) => {
        const categoryKey = mapCategory(item.category).toLowerCase().replace("popular ", "").replace("special ", "").replace("lovely ", "");
        const itemWithDescription = {
          ...item,
          description: item.description || `Delicious ${item.name.toLowerCase()} prepared with fresh ingredients.`,
          currency: item.currency || "",
        };
        if (categoryKey === "breakfast") {
          categorizedItems.breakfast.push(itemWithDescription);
        } else if (categoryKey === "lunch") {
          categorizedItems.lunch.push(itemWithDescription);
        } else if (categoryKey === "dinner") {
          categorizedItems.dinner.push(itemWithDescription);
        } else {
          categorizedItems.others.push(itemWithDescription);
        }
      });
      setMenuItems(categorizedItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };
  fetch('/api/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Name',
    contact: '123',
    menuItemId: 1,
    quantity: 2,
    dateTime: '2025-05-20T18:00:00Z',
    partySize: 4,
    notes: 'Yo this is lit',
  }),
});


  const mapCategory = (category) => {
    const categoryMap = {
      "Popular Breakfast": "Popular Breakfast",
      "Special Lunch": "Special Lunch",
      "Lovely Dinner": "Lovely Dinner",
      "Starter": "Others",
      "Main Course": "Others",
      "Dessert": "Others",
    };
    return categoryMap[category] || "Others";
  };

  const filterMenu = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ======= Effects =======
  useEffect(() => {
    fetch("/api/display-member")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ======= Handlers =======
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showPrivacyPolicy = () => {
    setModalTitle("Privacy Policy");
    setModalContent(
      "At Lama Restaurant, we value your privacy. Your data is safe, and we don’t share it with anyone unless required by law."
    );
    setShowModal(true);
  };

  const showTermsConditions = () => {
    setModalTitle("Terms & Conditions");
    setModalContent(
      "By using Lama Restaurant’s services, you agree to follow our rules. Be kind, eat good food, and don’t misuse our platform."
    );
    setShowModal(true);
  };


  // ======= Early Return =======
  if (loading)
    return <p className="text-center text-gray-300">Loading......</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <Head>
        <title>Restaurant Website</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </Head>

     <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-green-700 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Login success notification */}
        {showLoginSuccess && (
          <div className="absolute top-16 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
            Login successful!
          </div>
        )}

        <div className="flex justify-between items-center">
          <a className="flex items-center" href="#">
            <span className="text-2xl">🍽️</span>
            <span className="text-yellow-500 font-bold ml-2 text-lg">
              Lama Restaurant
            </span>
          </a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white font-bold hover:text-blue-300 transition">
              Home
            </a>
            <a href="#about" className="text-white font-bold hover:text-blue-300 transition">
              About
            </a>
            <a href="#service" className="text-white font-bold hover:text-blue-300 transition">
              Service
            </a>
            <a href="#menu" className="text-white font-bold hover:text-blue-300 transition">
              Menu
            </a>
            <a href="#contact" className="text-white font-bold hover:text-blue-300 transition">
              Contact
            </a>

            {/* Book a Table button */}
            <a
              href="#book"
              className="bg-yellow-500 text-black font-bold px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Book Now
            </a>

            {isLoggedIn && (
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold ml-2">
                {getProfileInitial()}
              </div>
            )}

            {/* Always show the login/logout button */}
            <Link
              href={isLoggedIn ? "/" : "/login"}
              onClick={isLoggedIn ? handleLogout : undefined}
              className="text-white font-bold px-4 py-2 border border-white rounded transition-transform duration-300 ease-in-out hover:text-blue-300 hover:border-blue-300 hover:scale-105 active:scale-95"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <a href="#" className="block text-white font-bold hover:text-blue-300 transition">
              Home
            </a>
            <a href="#about" className="block text-white font-bold hover:text-blue-300 transition">
              About
            </a>
            <a href="#service" className="block text-white font-bold hover:text-blue-300 transition">
              Service
            </a>
            <a href="#menu" className="block text-white font-bold hover:text-blue-300 transition">
              Menu
            </a>
            <a href="#contact" className="block text-white font-bold hover:text-blue-300 transition">
              Contact
            </a>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 pt-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                   {getProfileInitial()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block text-white font-bold py-2 border-t border-gray-400 pt-3"
              >
                Logout
              </Link>
            )}
            <a
              href="#book"
              className="block bg-yellow-500 text-black font-bold px-4 py-2 rounded text-center hover:bg-yellow-600 transition duration-300"
            >
              Book Now
            </a>
          </div>
        )}
      </div>
    </nav>

      {/* Hero Section */}
      <header id="home" className="relative h-screen flex items-center bg-black pt-20">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Enjoy Our <br /> Delicious Meal</h1>
              <p className="text-gray-200 mb-6">
                Experience the best flavors crafted by our chefs. Indulge in a variety of delicious grilled and roasted meals.
              </p>
              <a href="#book" className="inline-block bg-yellow-500 text-black font-bold px-6 py-3 rounded hover:bg-yellow-600 transition duration-300">Reserve Now</a>
            </div>
            <div className="md:w-1/2 text-center">
              <img id="sliderImage" src={images[currentImageIndex]} alt="Grilled Food" className="w-3/4 rounded-lg mx-auto transition-opacity duration-500"/>
            </div>
          </div>
        </div>
      </header>

     {/* Rating Section */}
 <section id="testimonials" className="container mx-auto px-4 my-12">
      <h2 className="text-center text-3xl font-bold text-white">
        <span className="text-yellow-500">Our Clients Say!!!</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left: Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-600 rounded-lg p-5 text-center shadow-lg max-w-md mx-auto my-4">
                    <p><span className="text-3xl text-yellow-500">❝</span>{testimonial.feedback}</p>
                    <div className="flex items-center justify-center mt-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-xl mr-3">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-white">{testimonial.name}</strong>
                        <p className="text-gray-300">{testimonial.profession}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Right: Feedback Form */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Share Your Experience</h3>

          {submitted ? (
            <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
              Thank you for your feedback! We appreciate your time.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 mb-2">Your Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="profession" className="block text-gray-300 mb-2">Your Profession</label>
                <input
                  id="profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Student, Designer"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Your Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl"
                    >
                      <FaStar className={(hoverRating || rating) >= star ? 'text-yellow-500' : 'text-gray-500'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="feedback" className="block text-gray-300 mb-2">Your Feedback</label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </section>

      {/* Services Section */}
      <section id="service" className="container mx-auto px-4 my-12 relative pb-16">
        <h2 className="text-center text-3xl font-bold mb-8">
          <span className="text-yellow-500">Our Services</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:transform hover:-translate-y-1 transition duration-300 flex flex-col h-full">
            <div className="text-yellow-500 text-4xl mb-4">
              <i className="fas fa-user-tie"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Master Chefs</h4>
            <p className="flex-grow">Our Master Chefs bring world-class expertise, crafting every dish with precision.</p>
          </div>

          <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:transform hover:-translate-y-1 transition duration-300 flex ар flex-col h-full">
            <div className="text-yellow-500 text-4xl mb-4">
              <i className="fas fa-utensils"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Quality Food</h4>
            <p className="flex-grow">We take pride in serving high-quality food, made from fresh ingredients.</p>
          </div>

          <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:transform hover:-translate-y-1 transition duration-300 flex flex-col h-full">
            <div className="text-yellow-500 text-4xl mb-4">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">Online Order</h4>
            <p className="flex-grow">Enjoy the convenience of our seamless online ordering system.</p>
          </div>

          <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:transform hover:-translate-y-1 transition duration-300 flex flex-col h-full">
            <div className="text-yellow-500 text-4xl mb-4">
              <i className="fas fa-headset"></i>
            </div>
            <h4 className="text-xl font-bold mb-2">24/7 Service</h4>
            <p className="flex-grow">Our 24/7 service ensures delicious meals and customer satisfaction anytime.</p>
          </div>
        </div>

       <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0">
        <Link href="/service" scroll={true}>
          <span className="inline-block bg-yellow-500 text-black font-bold px-6 py-3 rounded hover:bg-yellow-600 transition duration-300">
            READ MORE
          </span>
        </Link>
      </div>
      </section>

      {/* About Section */}
       <section id="about" className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side: Images */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://www.travellersquest.com/blog/wp-content/uploads/2022/09/Bhutan-Restaurants-min.jpg" 
                  className="w-full h-auto rounded-lg shadow-lg" 
                  alt="Restaurant"
                />
                <img 
                  src="https://th.bing.com/th/id/OIP.qPhdTUygag9J5qLPpEMxQQHaE7?rs=1&pid=ImgDetMain" 
                  className="w-full h-auto rounded-lg shadow-lg" 
                  alt="Food"
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="https://www.heavenlybhutan.com/wp-content/uploads/bfi_thumb/d-p493hmq4gtlzs031rgf8th0ud2ixtigfac7omk4h3c.jpg" 
                  className="w-full h-auto rounded-lg shadow-lg" 
                  alt="Restaurant"
                />
                <img 
                  src="https://th.bing.com/th/id/OIP.X4O7zRxcP44EejExTdSdbAHaE8?rs=1&pid=ImgDetMain" 
                  className="w-full h-auto rounded-lg shadow-lg" 
                  alt="Food"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Text */}
          <div className="w-full md:w-1/2 md:pl-8">
            <h5 className="text-yellow-500 text-lg font-semibold mb-2">About Us</h5>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Welcome to <span className="text-yellow-500"><FaUtensils className="inline mr-1" /> Restaurant</span>
            </h2>
            <p className="text-gray-300 mb-4">
              Our restaurant offers a world-class dining experience with expertly crafted dishes by Master Chefs, ensuring top-quality food made from the freshest ingredients. With seamless online ordering and 24/7 service, we provide convenience, excellence, and unforgettable flavors anytime, anywhere.
            </p>
            <p className="text-gray-300 mb-6">
              Whether you dine in or order online, our commitment to quality, taste, and customer satisfaction makes every meal unforgettable.
            </p>

            <div className="flex items-center my-6">
              <div className="flex items-center mr-8">
                <h2 className="text-yellow-500 text-4xl md:text-5xl font-bold">15</h2>
                <p className="ml-2 text-white">
                  Years of <br /> <strong className="font-semibold">EXPERIENCE</strong>
                </p>
              </div>
              <div className="flex items-center">
                <h2 className="text-yellow-500 text-4xl md:text-5xl font-bold">4</h2>
                <p className="ml-2 text-white">
                  Popular <br /> <strong className="font-semibold">MASTER CHEFS</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Food Menu Section */}
      <section id="menu" className="w-11/12 max-w-6xl mx-auto my-8 text-center bg-gray-900 p-5 rounded-lg shadow-lg">
        <h2 className="text-yellow-500 text-xl font-bold uppercase">Food Menu</h2>
        <h3 className="text-gray-100 text-2xl font-bold my-4">Most Popular Items</h3>

        <div className="flex justify-center gap-5 my-6 flex-wrap">
          <span
            className={`cursor-pointer py-2 px-3 text-white ${activeTab === "breakfast" ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}
            onClick={() => filterMenu("breakfast")}
          >
            ☕ Popular <b>Breakfast</b>
          </span>
          <span
            className={`cursor-pointer py-2 px-3 text-white ${activeTab === "lunch" ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}
            onClick={() => filterMenu("lunch")}
          >
            🍔 Special <b>Lunch</b>
          </span>
          <span
            className={`cursor-pointer py-2 px-3 text-white ${activeTab === "dinner" ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}
            onClick={() => filterMenu("dinner")}
          >
            🍽️ Lovely <b>Dinner</b>
          </span>
          <span
            className={`cursor-pointer py-2 px-3 text-white ${activeTab === "others" ? "text-yellow-500 border-b-2 border-yellow-500" : ""}`}
            onClick={() => filterMenu("others")}
          >
            🥗 <b>Others</b>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {menuItems[activeTab].length === 0 ? (
            <p className="text-gray-400 col-span-2">No items available in this category.</p>
          ) : (
            menuItems[activeTab].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:transform hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={item.image || "https://via.placeholder.com/80?text=Image+Not+Found"}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/80?text=Image+Not+Found")}
                />
                <div className="flex-grow text-left">
                  <h4 className="text-lg font-bold text-gray-800">
                    {item.name} <span className="text-yellow-500">{item.currency}{item.price}</span>
                  </h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Reservation Section */}
      <section id="book" className="flex flex-col lg:flex-row items-center justify-between bg-gray-900 text-gray-100 p-8 lg:p-16">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 relative aspect-video">
          <ReactPlayer
            url={videoUrl}
            playing={isPlaying}
            controls={true}
            light={true}
            playIcon={
              <button
                className="bg-yellow-500 text-black text-3xl p-4 rounded-full shadow-xl"
                aria-label="Play video"
              >
                ▶
              </button>
            }
            onStart={() => setIsPlaying(true)}
            width="100%"
            height="100%"
            className="rounded-lg overflow-hidden"
          />
        </div>

       <div className="w-full lg:w-1/2 bg-gray-900 p-8 lg:p-10 rounded-lg">
      <h2 className="text-yellow-500 text-xl font-bold mb-2">Reservation</h2>
      <h3 className="text-2xl font-bold mb-6">Book A Table Online</h3>

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

          {/* Add Reservation Button */}
          <div className="p-6">
            <button
              onClick={handleAddReservation}
              className="flex items-center gap-3 px-6 py-3 rounded-xl shadow-md text-white font-semibold text-lg transition-all duration-200 ease-in-out bg-purple-500 dark:bg-purple-600 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
              aria-label="Add New Reservation"
            >
              <Plus size={24} />
              Reserve Now
            </button>
          </div>

          {/* Add Reservation Modal */}
          {isAddModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-modal-title"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2
                  id="add-modal-title"
                  className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100"
                >
                  Reserve Now
                </h2>
                <div className="max-h-[70vh] overflow-y-auto px-4">
                  <form onSubmit={(e) => handleFormSubmit(e, false)}>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-customer-name"
                      >
                        Customer Name
                      </label>
                      <input
                        id="add-customer-name"
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.customerName ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        autoFocus
                      />
                      {formErrors.customerName && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.customerName}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-contact"
                      >
                        Contact
                      </label>
                      <input
                        id="add-contact"
                        type="text"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.contact ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        placeholder="+975 12345678"
                      />
                      {formErrors.contact && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.contact}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-menu-item"
                      >
                        Menu Item
                      </label>
                      <select
                        id="add-menu-item"
                        value={formData.menuItem || ""}
                        onChange={(e) => setFormData({ ...formData, menuItem: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.menuItem ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      >
                        <option value="" disabled>
                          Select a menu item
                        </option>
                        {Object.keys(menuItems).flatMap((category) =>
                          menuItems[category].map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({category.charAt(0).toUpperCase() + category.slice(1)})
                            </option>
                          ))
                        )}
                      </select>
                      {formErrors.menuItem && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.menuItem}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-quantity"
                      >
                        Quantity of Items
                      </label>
                      <input
                        id="add-quantity"
                        type="number"
                        min="1"
                        value={formData.quantity || ""}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.quantity ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.quantity}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-datetime"
                      >
                        Date & Time
                      </label>
                      <input
                        id="add-datetime"
                        type="datetime-local"
                        value={formData.dateTime || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, dateTime: value });
                        }}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.dateTime ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        placeholder="mm/dd/yyyy : -- --"
                        min="2025-05-19T00:00"
                        max="2026-05-19T23:59"
                      />
                      {formErrors.dateTime && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.dateTime}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-party-size"
                      >
                        Party Size
                      </label>
                      <input
                        id="add-party-size"
                        type="number"
                        min="1"
                        value={formData.partySize}
                        onChange={(e) =>
                          setFormData({ ...formData, partySize: e.target.value })
                        }
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100 ${
                          formErrors.partySize ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      />
                      {formErrors.partySize && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.partySize}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="add-notes"
                      >
                        Notes (Optional)
                      </label>
                      <textarea
                        id="add-notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-black dark:text-gray-100"
                        rows="4"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                        aria-label="Cancel Add Reservation"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-500 dark:bg-purple-600 text-white rounded-lg flex items-center gap-3 font-semibold disabled:opacity-50 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                        disabled={isSaving}
                        aria-label="Add Reservation"
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
                            <Save size={20} /> Submit
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
          
              </div>
            </div>
          )}

          {/* Edit Reservation Modal */}
          {isEditModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-modal-title"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2
                  id="edit-modal-title"
                  className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100"
                >
                  Edit Reservation
                </h2>
               <div className="max-h-[70vh] overflow-y-auto px-4">
                  <form onSubmit={(e) => handleFormSubmit(e, true)}>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-customer-name"
                      >
                        Customer Name
                      </label>
                      <input
                        id="edit-customer-name"
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.customerName ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        autoFocus
                      />
                      {formErrors.customerName && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.customerName}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-contact"
                      >
                        Contact
                      </label>
                      <input
                        id="edit-contact"
                        type="text"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.contact ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        placeholder="+975 12345678"
                      />
                      {formErrors.contact && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.contact}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-menu-item"
                      >
                        Menu Item
                      </label>
                      <select
                        id="edit-menu-item"
                        value={formData.menuItem || ""}
                        onChange={(e) => setFormData({ ...formData, menuItem: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.menuItem ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      >
                        <option value="" disabled>
                          Select a menu item
                        </option>
                        {Object.keys(menuItems).flatMap((category) =>
                          menuItems[category].map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({category.charAt(0).toUpperCase() + category.slice(1)})
                            </option>
                          ))
                        )}
                      </select>
                      {formErrors.menuItem && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.menuItem}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-quantity"
                      >
                        Quantity of Items
                      </label>
                      <input
                        id="edit-quantity"
                        type="number"
                        min="1"
                        value={formData.quantity || ""}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.quantity ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.quantity}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-datetime"
                      >
                        Date & Time
                      </label>
                      <input
                        id="edit-datetime"
                        type="datetime-local"
                        value={formData.dateTime || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, dateTime: value });
                        }}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.dateTime ? "border-red-500 dark:border-red-400" : ""
                        }`}
                        min="2025-05-19T00:00"
                        max="2026-05-19T23:59"
                      />
                      {formErrors.dateTime && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.dateTime}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-party-size"
                      >
                        Party Size
                      </label>
                      <input
                        id="edit-party-size"
                        type="number"
                        min="1"
                        value={formData.partySize}
                        onChange={(e) =>
                          setFormData({ ...formData, partySize: e.target.value })
                        }
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.partySize ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      />
                      {formErrors.partySize && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.partySize}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-notes"
                      >
                        Notes (Optional)
                      </label>
                      <textarea
                        id="edit-notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                        rows="4"
                      ></textarea>
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        htmlFor="edit-status"
                      >
                        Status
                      </label>
                      <select
                        id="edit-status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${
                          formErrors.status ? "border-red-500 dark:border-red-400" : ""
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {formErrors.status && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                          {formErrors.status}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                        aria-label="Cancel Edit Reservation"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-purple-500 dark:bg-purple-600 text-white rounded-lg flex items-center gap-3 font-semibold disabled:opacity-50 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-purple-500/30"
                        disabled={isSaving}
                        aria-label="Save Reservation Changes"
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
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 rounded-lg my-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-yellow-500 text-lg font-bold uppercase tracking-wider">
              Team Members
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex justify-center">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-yellow-500 border-4 border-yellow-600 flex items-center justify-center">
                        <span className="text-white text-5xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-yellow-600 font-medium mt-1">
                      {member.role}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {member.status === 'active' ? 'Available' : 
                       member.status === 'on_leave' ? 'On Leave' : 'Not Available'}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 px-6 py-4 flex justify-center space-x-4">
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                    aria-label={`${member.name}'s Facebook`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    aria-label={`Chat with ${member.name} on WhatsApp`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 3.617c-.545 0-1.06-.113-1.534-.338l-.115-.05-1.12.33.3-1.092-.072-.114c-.334-.495-.52-1.07-.52-1.68 0-2.012 1.638-3.65 3.65-3.65.91 0 1.76.33 2.42.93.66.6 1.03 1.41 1.03 2.32 0 2.01-1.64 3.65-3.65 3.65zm5.93-11.93c-.165-.33-.53-.54-.91-.54h-.01c-.33 0-.65.17-.84.45l-.25.41-.48-.08c-.18-.03-.38-.04-.58-.04-2.53 0-4.59 2.06-4.59 4.59 0 .36.04.72.13 1.07l-.93-.26-.14-.03c-.01 0-.02 0-.03-.01-.31-.08-.63-.13-.96-.13-1.65 0-3 1.35-3 3 0 1.14.63 2.12 1.56 2.62l-.16.61c-.04.16-.02.34.06.49.08.15.22.26.38.29.04.01.07.01.11.01.12 0 .23-.03.33-.09l.86-.52.68.2c1.1.33 2.28.42 3.43.27 2.27-.3 4.25-1.51 5.42-3.29 1.17-1.78 1.41-3.94.69-5.91l-.47-1.52z"/>
                    </svg>
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-pink-600 transition-colors"
                    aria-label={`${member.name}'s Instagram`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-around flex-wrap gap-8">
            <div className="w-full md:w-1/4">
              <h3 className="text-yellow-500 text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-yellow-500 transition duration-300">About Us</a></li>
                <li><a href="#contact" className="hover:text-yellow-500 transition duration-300">Contact Us</a></li>
                <li><a href="#book" className="hover:text-yellow-500 transition duration-300">Reservation</a></li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-yellow-500 transition duration-300"
                    onClick={showPrivacyPolicy}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="hover:text-yellow-500 transition duration-300"
                    onClick={showTermsConditions}
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/4">
              <h3 className="text-yellow-500 text-lg font-bold mb-4">Contact</h3>
              <p className="mb-2">📍 Namkhaling, Gelephu, Sarpang, Bhutan</p>
              <p className="mb-2">📞 +975 17897655</p>
              <p className="mb-4">📧 lamastar2@gmail.com</p>
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://api.whatsapp.com/send?phone=%2B97577255610"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 3.617c-.545 0-1.06-.113-1.534-.338l-.115-.05-1.12.33.3-1.092-.072-.114c-.334-.495-.52-1.07-.52-1.68 0-2.012 1.638-3.65 3.65-3.65.91 0 1.76.33 2.42.93.66.6 1.03 1.41 1.03 2.32 0 2.01-1.64 3.65-3.65 3.65zm5.93-11.93c-.165-.33-.53-.54-.91-.54h-.01c-.33 0-.65.17-.84.45l-.25.41-.48-.08c-.18-.03-.38-.04-.58-.04-2.53 0-4.59 2.06-4.59 4.59 0 .36.04.72.13 1.07l-.93-.26-.14-.03c-.01 0-.02 0-.03-.01-.31-.08-.63-.13-.96-.13-1.65 0-3 1.35-3 3 0 1.14.63 2.12 1.56 2.62l-.16.61c-.04.16-.02.34.06.49.08.15.22.26.38.29.04.01.07.01.11.01.12 0 .23-.03.33-.09l.86-.52.68.2c1.1.33 2.28.42 3.43.27 2.27-.3 4.25-1.51 5.42-3.29 1.17-1.78 1.41-3.94.69-5.91l-.47-1.52z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/15EpwZLQeP/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.58 7.19c-.23-.86-.9-1.53-1.76-1.76C18.25 5 12 5 12 5s-6.25 0-7.82.42c-.86.23-1.53.9-1.76 1.76C3 8.75 3 12 3 12s0 3.25.42 4.82c.23.86.9 1.53 1.76 1.76C6.75 19 12 19 12 19s6.25 0 7.82-.42c.86-.23 1.53-.9 1.76-1.76C21 15.25 21 12 21 12s0-3.25-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c 0-1.327-.024-3.037-1.852-3.037-1.854 0-2.136 1.446-2.136 2.94v5.666H9.297V9.192h3.414v1.516h.048c.476-.9 1.636-1.852 3.365-1.852 3.6 0 4.262 2.368 4.262 5.455v6.141zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.067 0-1.14.92-2.066 2.063-2.066 1.143 0 2.063.926 2.063 2.066 0 1.141-.92 2.067-2.063 2.067zm1.782 13.019H3.555V9.192h3.564v11.26zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/4">
              <h3 className="text-yellow-500 text-lg font-bold mb-4">Opening</h3>
              <p className="mb-2">Monday - Saturday: 09AM - 09PM</p>
              <p>Sunday: 10AM - 08PM</p>
            </div>

            <div className="w-full md:w-1/4">
              <h3 className="text-yellow-500 text-lg font-bold mb-4">Newsletter</h3>
              <p className="mb-4">Subscribe to our newsletter for updates.</p>
              <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  required 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow p-2 rounded text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 text-black font-bold px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {showScrollButton && (
          <button 
            id="scrollTopBtn" 
            className="fixed bottom-5 right-5 bg-red-600 text-white p-3 rounded-full text-xl hover:bg-green-500 transition duration-300"
            onClick={scrollToTop}
          >
            ^
          </button>
        )}
      </footer>

      {/* Popup Modal */}
      {showModal && (
        <div id="popup-modal" className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div id="popup-content" className="bg-blue-600 p-8 rounded-lg max-w-md w-11/12 relative">
            <span 
              id="popup-close" 
              className="absolute top-3 right-5 text-2xl text-gray-300 cursor-pointer"
              onClick={closeModal}
            >
              ×
            </span>
            <h2 id="popup-title" className="text-2xl font-bold mb-4">{modalTitle}</h2>
            <p id="popup-text">{modalContent}</p>
          </div>
        </div>
      )}
    </>
  );
}