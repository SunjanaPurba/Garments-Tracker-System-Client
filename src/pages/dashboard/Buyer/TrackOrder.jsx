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

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      // If no orderId provided, show a message or redirect
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
      setTracking(response.data.tracking || []);

      // Get latest tracking for current location
      if (response.data.tracking?.length > 0) {
        setCurrentLocation(
          response.data.tracking[response.data.tracking.length - 1]
        );
      }
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/dashboard/my-orders");
    } finally {
      setLoading(false);
    }
  };

  // Timeline steps configuration
  const timelineSteps = [
    {
      key: "cutting",
      label: "Cutting Completed",
      icon: <FaCut />,
      color: "text-blue-500",
    },
    {
      key: "sewing",
      label: "Sewing Started",
      icon: <FaShoePrints />,
      color: "text-purple-500",
    },
    {
      key: "finishing",
      label: "Finishing",
      icon: <FaCheckCircle />,
      color: "text-green-500",
    },
    {
      key: "qc",
      label: "QC Checked",
      icon: <FaCheckCircle />,
      color: "text-yellow-500",
    },
    {
      key: "packed",
      label: "Packed",
      icon: <FaBox />,
      color: "text-orange-500",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: <FaShippingFast />,
      color: "text-red-500",
    },
    {
      key: "delivery",
      label: "Out for Delivery",
      icon: <FaTruck />,
      color: "text-pink-500",
    },
  ];

  // Find completed steps
  const getCompletedSteps = () => {
    const completed = new Set(tracking.map((item) => item.status));
    return timelineSteps.map((step) => ({
      ...step,
      completed: completed.has(step.key),
      timestamp: tracking.find((t) => t.status === step.key)?.timestamp,
      details: tracking.find((t) => t.status === step.key),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading order details...</p>
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
          <h1 className="text-3xl font-bold">Track Order</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <p className="text-gray-600">
              Order ID:{" "}
              <span className="font-mono font-bold">
                {order?._id?.slice(-8)}
              </span>
            </p>
            <span
              className={`badge badge-lg ${
                order?.status === "delivered"
                  ? "badge-success"
                  : order?.status === "shipped"
                  ? "badge-info"
                  : order?.status === "pending"
                  ? "badge-warning"
                  : "badge-error"
              }`}
            >
              {order?.status?.toUpperCase()}
            </span>
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
                      "https://via.placeholder.com/100"
                    }
                    alt={order?.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold">{order?.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {order?.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ${order?.product?.price}/unit
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">
                      {order
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">
                      ${order?.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="badge badge-success">Paid</span>
                  </div>
                </div>

                {/* Current Location */}
                {currentLocation && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-bold mb-2">Current Location</h3>
                    <p className="text-lg font-medium">
                      {currentLocation.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Last updated:{" "}
                      {new Date(currentLocation.timestamp).toLocaleString()}
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
                  Contact our customer support for any queries regarding your
                  order.
                </p>
                <div className="mt-4 space-y-2">
                  <p>📞 +1 (555) 123-4567</p>
                  <p>✉️ support@garments.com</p>
                </div>
                <div className="card-actions mt-4">
                  <button className="btn btn-outline btn-sm">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">
                  Production & Shipping Timeline
                </h2>

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
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                            step.completed
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <div className="text-xl">{step.icon}</div>
                        </div>

                        {/* Content */}
                        <div className="ml-6 flex-1">
                          <div
                            className={`flex items-center justify-between ${
                              step.completed ? "" : "opacity-50"
                            }`}
                          >
                            <div>
                              <h3
                                className={`text-lg font-semibold ${step.color}`}
                              >
                                {step.label}
                              </h3>
                              {step.details && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {step.details.location}
                                  </p>
                                  {step.details.note && (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Note:</span>{" "}
                                      {step.details.note}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            {step.timestamp && (
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {new Date(
                                    step.timestamp
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(step.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Progress indicator */}
                          {index < timelineSteps.length - 1 && (
                            <div className="mt-4">
                              <div
                                className={`h-1 rounded-full ${
                                  step.completed
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Current step indicator */}
                        {currentLocation?.status === step.key && (
                          <div className="absolute -right-2 top-0">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Summary */}
                <div className="mt-8 p-4 bg-base-200 rounded-lg">
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
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-sm">Current Step</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary">
                  <h3 className="font-bold">Estimated Delivery</h3>
                  <p className="mt-2">
                    Your order is expected to arrive by{" "}
                    <span className="font-bold">
                      {order
                        ? new Date(
                            new Date(order.createdAt).getTime() +
                              14 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Map Section (Optional/Placeholder) */}
            <div className="card bg-base-100 shadow-xl mt-6">
              <div className="card-body">
                <h2 className="card-title">Delivery Route</h2>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">Interactive Map</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Map integration would show real-time location
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="btn btn-outline"
          >
            ← Back to My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
