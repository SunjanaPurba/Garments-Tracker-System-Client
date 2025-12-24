import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaShippingFast,
  FaHeadset,
  FaUsers,
  FaIndustry,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartLine,
  FaWarehouse,
  FaTshirt,
  FaCut,
  FaTools,
  FaBoxOpen,
  FaDollarSign,
  FaDatabase,
  FaMobileAlt,
  FaCloud,
  FaShieldAlt,
  FaTruck,
  FaFileAlt,
  FaCogs,
  FaLayerGroup,
  FaBell,
  FaClipboardList,
  FaExchangeAlt,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const [stats, setStats] = useState({
    activeOrders: 45,
    completedOrders: 120,
    factories: 8,
    monthlyRevenue: 125000,
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // ✅ আপনার Render সার্ভার URL
  const API_URL = import.meta.env.VITE_SERVER_URL || "https://garments-tracker-system-server.onrender.com/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("📡 Fetching dashboard data from:", API_URL);

        // Use Promise.allSettled to handle API failures gracefully
        const [statsPromise, productsPromise] = await Promise.allSettled([
          axios.get(`${API_URL}/dashboard/stats`).catch(err => {
            console.log("⚠️ Stats endpoint not available, using fallback data");
            return { data: { success: false } };
          }),
          axios.get(`${API_URL}/products?limit=6&sort=newest`).catch(err => {
            console.log("⚠️ Products endpoint not available, using fallback data");
            return { data: { success: false } };
          }),
        ]);

        // Handle stats response
        if (statsPromise.status === 'fulfilled' && 
            statsPromise.value.data?.success && 
            statsPromise.value.data?.stats) {
          console.log("✅ Stats loaded successfully:", statsPromise.value.data.stats);
          setStats(statsPromise.value.data.stats);
        } else {
          console.log("🔄 Using fallback stats data");
          setStats({
            activeOrders: 45,
            completedOrders: 120,
            factories: 8,
            monthlyRevenue: 125000,
          });
        }

        // Handle products response
        if (productsPromise.status === 'fulfilled' && 
            productsPromise.value.data?.success && 
            Array.isArray(productsPromise.value.data?.products)) {
          console.log("✅ Products loaded successfully:", productsPromise.value.data.products.length);
          setProducts(productsPromise.value.data.products);
        } else {
          console.log("🔄 Using fallback products data");
          setProducts(getFallbackProducts());
        }

      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        setError("Failed to load data. Showing sample data.");
        setStats({
          activeOrders: 45,
          completedOrders: 120,
          factories: 8,
          monthlyRevenue: 125000,
        });
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_URL]);

  // Production stages data
  const productionStages = [
    {
      id: 1,
      title: "Order Receiving",
      description: "Client places order with specifications",
      icon: <FaClipboardCheck className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      time: "1-2 hours",
    },
    {
      id: 2,
      title: "Fabric Cutting",
      description: "Precision cutting of fabric materials",
      icon: <FaCut className="text-2xl" />,
      color: "from-purple-500 to-pink-500",
      time: "4-6 hours",
    },
    {
      id: 3,
      title: "Sewing & Assembly",
      description: "Stitching and garment assembly",
      icon: <FaTools className="text-2xl" />,
      color: "from-green-500 to-emerald-500",
      time: "8-12 hours",
    },
    {
      id: 4,
      title: "Quality Control",
      description: "Inspection and quality checks",
      icon: <FaCheckCircle className="text-2xl" />,
      color: "from-yellow-500 to-orange-500",
      time: "2-3 hours",
    },
    {
      id: 5,
      title: "Finishing & Packaging",
      description: "Final finishing and packaging",
      icon: <FaBoxOpen className="text-2xl" />,
      color: "from-red-500 to-rose-500",
      time: "2-4 hours",
    },
    {
      id: 6,
      title: "Delivery",
      description: "Shipment and delivery to client",
      icon: <FaShippingFast className="text-2xl" />,
      color: "from-indigo-500 to-blue-500",
      time: "24-48 hours",
    },
  ];

  // Key features
  const features = [
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Real-time Tracking",
      description: "Monitor every order in real-time across all production stages",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "Deadline Management",
      description: "Set and track production deadlines with automated alerts",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: <FaLayerGroup className="text-3xl" />,
      title: "Inventory Control",
      description: "Manage fabric and material inventory efficiently",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <FaDollarSign className="text-3xl" />,
      title: "Cost Analysis",
      description: "Track production costs and profit margins",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Team Management",
      description: "Assign tasks and track worker productivity",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: <FaDatabase className="text-3xl" />,
      title: "Reporting & Analytics",
      description: "Generate detailed production reports and insights",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      text: "This system cut our order processing time by 60%! The real-time tracking feature is a game-changer.",
      name: "Rahim Ahmed",
      role: "Owner",
      company: "Premium Garments Ltd.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    },
    {
      id: 2,
      text: "Inventory management has never been easier. We reduced fabric waste by 25% in just 3 months.",
      name: "Fatima Begum",
      role: "Production Manager",
      company: "Style Stitches Factory",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d4b1?w=150&h=150&fit=crop",
    },
    {
      id: 3,
      text: "The deadline tracking system saved us from multiple penalties. Our on-time delivery rate is now 98%.",
      name: "Kamal Hossain",
      role: "Operations Head",
      company: "Dhaka Apparels",
      rating: 4,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    },
  ];

  // Benefits
  const benefits = [
    {
      title: "Increase Production Efficiency",
      percentage: "40%",
      description: "Streamline workflow and reduce bottlenecks",
      icon: <FaCogs />,
    },
    {
      title: "Reduce Order Processing Time",
      percentage: "60%",
      description: "Automate manual processes and tracking",
      icon: <FaClipboardList />,
    },
    {
      title: "Minimize Fabric Waste",
      percentage: "25%",
      description: "Better inventory and material management",
      icon: <FaExchangeAlt />,
    },
    {
      title: "Improve On-time Delivery",
      percentage: "98%",
      description: "Real-time deadline tracking and alerts",
      icon: <FaTruck />,
    },
  ];

  // Fallback products function
  const getFallbackProducts = () => [
    {
      _id: "1",
      title: "Premium Cotton T-Shirt",
      price: 24.99,
      category: "shirt",
      quantity: 50,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    },
    {
      _id: "2",
      title: "Denim Jeans",
      price: 49.99,
      category: "pant",
      quantity: 30,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"],
    },
    {
      _id: "3",
      title: "Leather Jacket",
      price: 129.99,
      category: "jacket",
      quantity: 15,
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"],
    },
    {
      _id: "4",
      title: "Casual Hoodie",
      price: 39.99,
      category: "hoodie",
      quantity: 45,
      images: ["https://images.unsplash.com/photo-1556821840-2e2d8e99d2db?w=400&h=400&fit=crop"],
    },
    {
      _id: "5",
      title: "Polo Shirt",
      price: 29.99,
      category: "shirt",
      quantity: 60,
      images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop"],
    },
    {
      _id: "6",
      title: "Formal Dress Shirt",
      price: 54.99,
      category: "shirt",
      quantity: 20,
      images: ["https://images.unsplash.com/photo-1594938298608-c6f7b2d7dc0c?w=400&h=400&fit=crop"],
    },
  ];

  // Display products
  const displayProducts = products.length > 0 ? products : getFallbackProducts();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Home | GarmentPro - Production Order Tracking System</title>
        <meta
          name="description"
          content="Streamline your garment factory operations with GarmentPro's comprehensive production tracking system. Manage orders, track production stages, and grow your business efficiently."
        />
      </Helmet>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 HERO SECTION */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Animated Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200 blur-3xl opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-200 blur-3xl opacity-20"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6"
              >
                <FaIndustry />
                <span className="font-semibold">
                  Trusted by {stats.factories || 8}+ Garment Factories
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Streamline Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Garment Production
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-600 mb-8 max-w-2xl"
              >
                Comprehensive order and production tracking system for small to medium 
                garment factories. Monitor every stage from cutting to delivery, 
                manage inventory, and ensure timely completion.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg rounded-lg px-8 group bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  <span>Start Free Trial</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/all-products"
                  className="btn btn-outline btn-lg rounded-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700"
                >
                  Browse Products
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              >
                {[
                  { label: "Active Orders", value: stats.activeOrders || 45, icon: <FaClipboardCheck /> },
                  { label: "Completed", value: stats.completedOrders || 120, icon: <FaCheckCircle /> },
                  { label: "Factories", value: stats.factories || 8, icon: <FaIndustry /> },
                  { label: "Monthly Revenue", value: `$${Number(stats.monthlyRevenue || 125000).toLocaleString()}`, icon: <FaDollarSign /> },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="text-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="text-blue-600 mb-2">{stat.icon}</div>
                    <div className="font-bold text-2xl">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-white text-sm ml-4">Production Dashboard</div>
                  </div>
                </div>
                <div className="p-6">
                  {/* Dashboard Preview */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Today's Orders</div>
                          <div className="text-2xl font-bold">12</div>
                        </div>
                        <FaFileAlt className="text-blue-600 text-xl" />
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">In Production</div>
                          <div className="text-2xl font-bold">45</div>
                        </div>
                        <FaCogs className="text-green-600 text-xl" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Production Progress */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Order #GAR-2345 - Mens T-Shirt</span>
                        <span>75%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Order #GAR-2346 - Denim Jeans</span>
                        <span>40%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "40%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔹 PRODUCTION STAGES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Track Every Production Stage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitor your garment production from start to finish with real-time updates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productionStages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stage.color} shadow-md`}>
                    <div className="text-white">{stage.icon}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{stage.title}</h3>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {stage.time}
                      </span>
                    </div>
                    <p className="text-gray-600">{stage.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Stage {stage.id}/6</span>
                      {index < productionStages.length - 1 && (
                        <div className="text-gray-300">
                          <FaArrowRight />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 RECENT PRODUCTS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Recent Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our latest garment products ready for production
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayProducts.slice(0, 6).map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border"
              >
                <figure className="h-64 relative">
                  <img
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop"}
                    alt={product.title || "Product Image"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary">
                      {product.category || "shirt"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`badge ${(product.quantity || 0) > 0 ? "badge-success" : "badge-error"}`}>
                      {(product.quantity || 0) > 0 ? `${product.quantity} in stock` : "Out of stock"}
                    </span>
                  </div>
                </figure>
                <div className="card-body p-6">
                  <h3 className="card-title text-lg font-bold line-clamp-1">
                    {product.title || "Product Title"}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-4">
                    ${product.price || "0.00"}
                  </p>
                  <div className="card-actions justify-end">
                    <Link
                      to={`/products/${product._id || "1"}`}
                      className="btn btn-primary btn-outline btn-sm"
                    >
                      View Details
                    </Link>
                    {(product.quantity || 0) > 0 && (
                      <Link
                        to={`/booking/${product._id || "1"}`}
                        className="btn btn-primary btn-sm"
                      >
                        Order Now
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/all-products"
              className="btn btn-outline btn-lg rounded-lg px-8 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🔹 KEY FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Manage Production
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for garment manufacturing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className={`p-3 rounded-lg ${feature.bgColor} inline-flex mb-4`}>
                  <span className={feature.color}>{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 BENEFITS SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Transform Your Factory Operations
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Join hundreds of garment factories that have revolutionized their production process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-colors"
              >
                <div className="text-5xl font-bold mb-2">{benefit.percentage}</div>
                <div className="text-blue-100 mb-3">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 HOW IT WORKS SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How GarmentPro Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your garment production management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Sign Up & Setup",
                description: "Register your factory and set up your profile in minutes",
                icon: "📋",
              },
              {
                step: 2,
                title: "Add Products & Orders",
                description: "Create product catalog and start receiving orders",
                icon: "👕",
              },
              {
                step: 3,
                title: "Track & Manage",
                description: "Monitor production stages and manage your team",
                icon: "📊",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-8 bg-white rounded-xl shadow-sm border"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-sm font-semibold text-blue-600 mb-2">Step {step.step}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Trusted by Garment Factory Owners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See what factory owners and production managers are saying
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Production?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Start your 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-lg rounded-lg px-8 bg-white text-gray-900 hover:bg-gray-100 border-none hover:shadow-lg transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/contact"
                className="btn btn-lg rounded-lg px-8 bg-transparent border-white text-white hover:bg-white/10 hover:border-white/50"
              >
                Schedule a Demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FaCloud className="text-green-400" />
                <span>Cloud-Based Solution</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-400" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeadset className="text-purple-400" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBell className="text-yellow-400" />
                <span>Real-time Notifications</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;



