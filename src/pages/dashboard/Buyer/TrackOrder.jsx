import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCut,
  FaShoePrints,
  FaCheckCircle,
  FaBox,
  FaShippingFast,
  FaTruck,
} from "react-icons/fa";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  // ✅ সঠিক API URL
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server.onrender.com";
  const API_BASE = `${API_URL}/api`; // ✅ /api যোগ করুন
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log("Fetching order details for ID:", orderId);
      console.log("API Base:", API_BASE);
      
      // ✅ সঠিক এন্ডপয়েন্ট
      const endpoint = `${API_BASE}/orders/${orderId}`;
      console.log("Full endpoint:", endpoint);
      
      const response = await axios.get(endpoint, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      console.log("Order response:", response.data);
      
      // ডেটা সঠিকভাবে প্রসেস করুন
      let orderData;
      if (response.data.success && response.data.order) {
        orderData = response.data.order;
      } else if (response.data.order) {
        orderData = response.data.order;
      } else if (response.data) {
        orderData = response.data;
      } else {
        throw new Error("Invalid order data structure");
      }
      
      setOrder(orderData);
      setTracking(orderData.tracking || []);

      // Get latest tracking for current location
      if (orderData.tracking?.length > 0) {
        const latestTracking = orderData.tracking.reduce((latest, current) => {
          return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
        });
        setCurrentLocation(latestTracking);
      }
    } catch (error) {
      console.error("Failed to load order details:", error);
      
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
        
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("access-token");
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 404) {
          toast.error("Order not found or you don't have permission to view it.");
          setTimeout(() => navigate("/dashboard/my-orders"), 2000);
        } else if (error.response.status === 403) {
          toast.error("You don't have permission to view this order.");
          setTimeout(() => navigate("/dashboard/my-orders"), 2000);
        } else {
          toast.error(error.response.data?.message || "Failed to load order details");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server not responding. Please check your connection.");
      } else {
        console.error("Request error:", error.message);
        toast.error("Failed to load order details: " + error.message);
      }
      
      navigate("/dashboard/my-orders");
    } finally {
      setLoading(false);
    }
  };

  // Timeline steps configuration
  const timelineSteps = [
    {
      key: "Order Placed",
      label: "Order Placed",
      icon: <FaCheckCircle />,
      color: "text-green-500",
    },
    {
      key: "Approved",
      label: "Approved",
      icon: <FaCheckCircle />,
      color: "text-blue-500",
    },
    {
      key: "Cutting Completed",
      label: "Cutting Completed",
      icon: <FaCut />,
      color: "text-purple-500",
    },
    {
      key: "Sewing Started",
      label: "Sewing Started",
      icon: <FaShoePrints />,
      color: "text-indigo-500",
    },
    {
      key: "Finishing",
      label: "Finishing",
      icon: <FaCheckCircle />,
      color: "text-teal-500",
    },
    {
      key: "QC Checked",
      label: "QC Checked",
      icon: <FaCheckCircle />,
      color: "text-yellow-500",
    },
    {
      key: "Packed",
      label: "Packed",
      icon: <FaBox />,
      color: "text-orange-500",
    },
    {
      key: "Shipped",
      label: "Shipped",
      icon: <FaShippingFast />,
      color: "text-red-500",
    },
    {
      key: "Out for Delivery",
      label: "Out for Delivery",
      icon: <FaTruck />,
      color: "text-pink-500",
    },
    {
      key: "Delivered",
      label: "Delivered",
      icon: <FaCheckCircle />,
      color: "text-green-600",
    },
  ];

  // Find completed steps
  const getCompletedSteps = () => {
    const completedStatuses = new Set(tracking.map((item) => item.status));
    return timelineSteps.map((step) => ({
      ...step,
      completed: completedStatuses.has(step.key),
      timestamp: tracking.find((t) => t.status === step.key)?.timestamp,
      details: tracking.find((t) => t.status === step.key),
    }));
  };

  // Progress percentage calculation
  const calculateProgress = () => {
    if (!tracking.length) return 0;
    const completedSteps = getCompletedSteps().filter(step => step.completed).length;
    return Math.round((completedSteps / timelineSteps.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading order details...</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Track Order</h1>
        <div className="alert alert-info">
          <div>
            <span>Please select an order to track from "My Orders" page.</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/my-orders")}
          className="btn btn-primary mt-4"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Track Order</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <p className="text-gray-600">
                  Order ID:{" "}
                  <span className="font-mono font-bold bg-base-300 px-2 py-1 rounded">
                    {order?._id?.slice(-8)}
                  </span>
                </p>
                <span
                  className={`badge badge-lg capitalize ${
                    order?.status === "delivered"
                      ? "badge-success"
                      : order?.status === "shipped"
                      ? "badge-info"
                      : order?.status === "approved"
                      ? "badge-primary"
                      : order?.status === "processing"
                      ? "badge-secondary"
                      : order?.status === "pending"
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {order?.status || "Unknown"}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-bold">{calculateProgress()}%</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={calculateProgress()} 
                max="100"
              ></progress>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Order Summary</h2>

                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                  <img
                    src={
                      order?.product?.images?.[0] ||
                      order?.product?.image ||
                      "https://via.placeholder.com/100"
                    }
                    alt={order?.product?.title || order?.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{order?.product?.title || order?.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: <span className="font-bold">{order?.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: <span className="font-bold">${order?.unitPrice?.toFixed(2)}/unit</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Category: {order?.product?.category}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {order
                        ? new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-primary">
                      ${order?.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="badge badge-outline">
                      {order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       order?.paymentMethod === 'stripe' ? 'Online Payment' : 
                       order?.paymentMethod || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`badge ${
                      order?.paymentStatus === 'paid' ? 'badge-success' : 
                      order?.paymentStatus === 'pending' ? 'badge-warning' : 
                      'badge-error'
                    }`}>
                      {order?.paymentStatus?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                {/* Shipping Information */}
                {order?.shippingAddress && (
                  <div className="mt-6 p-4 bg-base-200 rounded-lg">
                    <h3 className="font-bold mb-2">Shipping Information</h3>
                    <p className="text-sm">{order.shippingAddress}</p>
                    {order.phoneNumber && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Phone:</span> {order.phoneNumber}
                      </p>
                    )}
                    {order.notes && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Current Location */}
                {currentLocation && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="loading loading-spinner loading-xs"></span>
                      Current Status
                    </h3>
                    <p className="text-lg font-medium">{currentLocation.status}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Location:</span> {currentLocation.location || 'System'}
                    </p>
                    {currentLocation.note && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Note:</span> {currentLocation.note}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Updated: {new Date(currentLocation.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Support */}
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <h2 className="card-title">Need Help?</h2>
                <p className="text-sm text-gray-600">
                  Contact our customer support for any queries regarding your order.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <span>support@garments.com</span>
                  </div>
                </div>
                <div className="card-actions mt-4">
                  <button 
                    onClick={() => window.open('mailto:support@garments.com', '_blank')}
                    className="btn btn-outline btn-sm"
                  >
                    Contact Support
                  </button>
                  <button 
                    onClick={fetchOrderDetails}
                    className="btn btn-ghost btn-sm"
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="card-title">Production & Shipping Timeline</h2>
                  <div className="text-sm text-gray-500">
                    {getCompletedSteps().filter(s => s.completed).length} of {timelineSteps.length} steps completed
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {/* Timeline items */}
                  <div className="space-y-8">
                    {getCompletedSteps().map((step, index) => (
                      <div key={step.key} className="relative flex items-start">
                        {/* Icon circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-base-100 ${
                            step.completed
                              ? "bg-green-100 text-green-600"
                              : currentLocation?.status === step.key
                              ? "bg-primary/20 text-primary border-primary/30 animate-pulse"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <div className="text-xl">{step.icon}</div>
                        </div>

                        {/* Content */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-semibold ${step.color}`}>
                                  {step.label}
                                </h3>
                                {step.completed && (
                                  <span className="badge badge-success badge-xs">Completed</span>
                                )}
                                {currentLocation?.status === step.key && (
                                  <span className="badge badge-primary badge-xs animate-pulse">Current</span>
                                )}
                              </div>
                              
                              {step.details && (
                                <div className="mt-2 space-y-2 p-3 bg-base-200 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-xs font-medium text-gray-500">Location:</span>
                                      <p className="text-sm">{step.details.location || 'System'}</p>
                                    </div>
                                    {step.details.note && (
                                      <div>
                                        <span className="text-xs font-medium text-gray-500">Note:</span>
                                        <p className="text-sm">{step.details.note}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {step.timestamp && (
                              <div className="text-right ml-4">
                                <p className="text-sm font-medium whitespace-nowrap">
                                  {new Date(step.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(step.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Progress indicator */}
                          {index < timelineSteps.length - 1 && (
                            <div className="mt-4 ml-12">
                              <div
                                className={`h-2 rounded-full ${
                                  step.completed
                                    ? "bg-gradient-to-r from-green-500 to-green-400"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Summary */}
                <div className="mt-8 p-4 bg-base-200 rounded-lg">
                  <h3 className="font-bold mb-3">Status Legend</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-sm">Current Step</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-primary">
                      <FaShippingFast className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold">Estimated Delivery</h3>
                      <p className="mt-1">
                        Your order is expected to arrive by{" "}
                        <span className="font-bold text-primary">
                          {order
                            ? new Date(
                                new Date(order.createdAt).getTime() +
                                  14 * 24 * 60 * 60 * 1000
                              ).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        *Delivery times may vary based on production progress and shipping conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tracking Updates */}
            {tracking.length > 0 && (
              <div className="card bg-base-100 shadow-xl mt-6">
                <div className="card-body">
                  <h2 className="card-title">Recent Tracking Updates</h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {[...tracking]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 5)
                      .map((track, index) => (
                        <div key={index} className="p-3 bg-base-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{track.status}</p>
                              <p className="text-sm text-gray-600">{track.location || 'System'}</p>
                              {track.note && (
                                <p className="text-sm mt-1">{track.note}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                {new Date(track.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(track.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="btn btn-outline"
          >
            ← Back to My Orders
          </button>
          <button
            onClick={fetchOrderDetails}
            className="btn btn-primary"
          >
            ↻ Refresh Status
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-ghost"
          >
            🖨️ Print Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;