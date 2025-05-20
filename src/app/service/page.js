"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });
  const [isScrollBtnVisible, setIsScrollBtnVisible] = useState(false);

  // Handle Modal for Privacy Policy and Terms & Conditions
  const handleModalOpen = (title, text) => {
    setModalContent({ title, text });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle Scroll-to-Top Button Visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrollBtnVisible(true);
      } else {
        setIsScrollBtnVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Services Data
  const services = [
    { icon: "fas fa-user-tie", title: "Master Chefs", desc: "Our Master Chefs bring world-class expertise, crafting every dish with precision." },
    { icon: "fas fa-utensils", title: "Quality Food", desc: "We take pride in serving high-quality food, made from fresh ingredients." },
    { icon: "fas fa-shopping-cart", title: "Online Order", desc: "Enjoy the convenience of our seamless online ordering system." },
    { icon: "fas fa-headset", title: "24/7 Service", desc: "Our 24/7 service ensures delicious meals and customer satisfaction anytime." },
    { icon: "fas fa-truck", title: "Fast Delivery", desc: "We ensure quick and reliable delivery, bringing your favorite meals straight to your doorstep." },
    { icon: "fas fa-seedling", title: "Fresh Ingredients", desc: "Our commitment to quality starts with fresh, locally sourced ingredients in every dish." },
    { icon: "fas fa-concierge-bell", title: "Premium Hospitality", desc: "Experience top-tier hospitality with attentive service and a welcoming atmosphere." },
    { icon: "fas fa-wifi", title: "Free Wi-Fi", desc: "Enjoy seamless connectivity with complimentary high-speed Wi-Fi while dining with us." },
  ];

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen flex flex-col pt-20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-green-600 to-green-400 shadow-lg z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl">🍽️</span>
            <span className="text-yellow-400 font-bold ml-2">Lama Restaurant</span>
          </Link>
          <button
            className="navbar-toggler md:hidden text-white"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon">☰</span>
          </button>
          <div className="hidden md:flex md:items-center md:space-x-4" id="navbarNav">
            <ul className="navbar-nav flex space-x-4">
              <li className="nav-item">
                <Link href="/user" className="nav-link text-white font-bold hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user" className="nav-link text-white font-bold hover:text-blue-600 transition">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/service" className="nav-link text-white font-bold hover:text-blue-600 transition">
                  Service
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user" className="nav-link text-white font-bold hover:text-blue-600 transition">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/" className="nav-link text-white font-bold hover:text-blue-600 transition">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/order" className="btn bg-yellow-500 text-black font-bold px-4 py-2 rounded hover:bg-yellow-400 transition">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Top Section */}
      <section className="bg-black py-16 text-center">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wide text-white mb-2">
            Services
          </h1>
          <p className="text-lg font-medium uppercase tracking-wide text-white">
            HOME / PAGES / SERVICES
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="service" className="container my-12 mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-8">
          <span className="text-yellow-500">Our Services</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:-translate-y-1 transition-transform flex flex-col justify-between"
            >
              <div className="text-yellow-500 text-4xl mb-4">
                <i className={service.icon}></i>
              </div>
              <h4 className="text-xl font-bold mb-2">{service.title}</h4>
              <p className="text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 flex flex-wrap justify-around max-w-7xl">
          {/* Company Section */}
          <div className="mb-6 w-48">
            <h3 className="text-yellow-500 mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-yellow-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-yellow-500 transition">
                  Reservation
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() =>
                    handleModalOpen("Privacy Policy", "This is the Privacy Policy content.")
                  }
                  className="hover:text-yellow-500 transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() =>
                    handleModalOpen("Terms & Conditions", "This is the Terms & Conditions content.")
                  }
                  className="hover:text-yellow-500 transition"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="mb-6 w-48">
            <h3 className="text-yellow-500 mb-4 text-lg">Contact</h3>
            <p>📍 Namkhaling, Gelephu, Sarpang, Bhutan</p>
            <p>📞 +975 17897655</p>
            <p>📧 lamastar2@gmail.com</p>
            <div className="flex gap-2 mt-4">
              <a
                href="https://api.whatsapp.com/send?phone=%2B97577255610"
                className="bg-gray-600 rounded-full p-2 hover:bg-blue-600 transition-transform hover:scale-125"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="https://www.facebook.com/share/15EpwZLQeP/"
                className="bg-gray-600 rounded-full p-2 hover:bg-blue-600 transition-transform hover:scale-125"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://www.youtube.com/"
                className="bg-gray-600 rounded-full p-2 hover:bg-blue-600 transition-transform hover:scale-125"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://www.linkedin.com/"
                className="bg-gray-600 rounded-full p-2 hover:bg-blue-600 transition-transform hover:scale-125"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Opening Hours Section */}
          <div className="mb-6 w-48">
            <h3 className="text-yellow-500 mb-4 text-lg">Opening</h3>
            <p>Monday - Saturday: 09AM - 09PM</p>
            <p>Sunday: 10AM - 08PM</p>
          </div>

          {/* Newsletter Section */}
          <div className="mb-6 w-48">
            <h3 className="text-yellow-500 mb-4 text-lg">Newsletter</h3>
            <p>Subscribe to our newsletter for updates.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                required
                className="p-2 border-none rounded text-black w-2/3"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white p-2 rounded hover:bg-orange-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-blue-600 p-8 rounded-lg max-w-md w-11/12 text-center relative shadow-lg">
            <span
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 text-2xl cursor-pointer"
            >
              ×
            </span>
            <h2 className="text-2xl mb-4">{modalContent.title}</h2>
            <p>{modalContent.text}</p>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full cursor-pointer transition-all duration-300 hover:bg-green-500 ${
          isScrollBtnVisible ? "block" : "hidden"
        }`}
      >
        ^
      </button>
    </div>
  );
}