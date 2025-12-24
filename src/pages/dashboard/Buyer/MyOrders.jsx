import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ✅ API URL - পরীক্ষা করার জন্য দুটি ভিন্ন উপায়
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server.onrender.com";
  
  // টেস্ট করার জন্য দুটি ভিন্ন বেস URL
  const API_BASE_OPTIONS = [
    `${API_URL}/api`,      // অপশন ১: /api সহ
    `${API_URL}`,          // অপশন ২: /api ছাড়া
    "https://garments-tracker-system-server.onrender.com/api", // সরাসরি URL
    "https://garments-tracker-system-server.onrender.com"      // সরাসরি URL /api ছাড়া
  ];

  const [currentApiBase, setCurrentApiBase] = useState(API_BASE_OPTIONS[0]);
  const [apiTestResults, setApiTestResults] = useState([]);

  console.log("API_URL:", API_URL);
  console.log("Current API Base:", currentApiBase);

  // Token নেওয়ার ফাংশন
  const getToken = () => {
    let token = localStorage.getItem("access-token");
    
    if (!token) {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    return token;
  };

  useEffect(() => {
    fetchOrders();
  }, [currentApiBase]);

  // সব API endpoint টেস্ট করার ফাংশন
  const testAllEndpoints = async () => {
    const token = getToken();
    if (!token) {
      toast.error("No token found. Please login first.");
      return;
    }

    const results = [];
    
    for (const base of API_BASE_OPTIONS) {
      try {
        const endpoint = `${base}/orders/my-orders`;
        console.log(`Testing: ${endpoint}`);
        
        const response = await axios.get(endpoint, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        results.push({
          base,
          endpoint,
          status: '✅ Success',
          data: response.data,
          statusCode: response.status
        });
      } catch (error) {
        results.push({
          base,
          endpoint: `${base}/orders/my-orders`,
          status: '❌ Failed',
          error: error.message,
          statusCode: error.response?.status || 'No response'
        });
      }
    }
    
    setApiTestResults(results);
    console.log("API Test Results:", results);
    
    // প্রথম সফল endpoint ব্যবহার করুন
    const successful = results.find(r => r.status === '✅ Success');
    if (successful) {
      toast.success(`Using API: ${successful.base}`);
      setCurrentApiBase(successful.base);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      if (!token) {
        toast.error("Please login to view orders");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const endpoint = `${currentApiBase}/orders/my-orders`;
      console.log("Fetching from:", endpoint);
      
      const response = await axios.get(endpoint, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 10000
      });
      
      console.log("API Response:", response.data);
      
      // ডেটা প্রসেসিং
      if (response.data.success && response.data.orders) {
        setOrders(response.data.orders);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
        console.warn("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      
      if (error.response) {
        console.error("Error Status:", error.response.status);
        console.error("Error Data:", error.response.data);
        console.error("Error URL:", error.config?.url);
        
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("access-token");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else if (error.response.status === 404) {
          toast.error(`API endpoint not found: ${error.config?.url}`);
          
          // স্বয়ংক্রিয়ভাবে অন্য API টেস্ট করুন
          if (apiTestResults.length === 0) {
            toast.info("Testing other API endpoints...");
            testAllEndpoints();
          }
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server not responding. Please check connection.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("Failed to load orders: " + error.message);
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // সার্ভার হেলথ চেক
  const checkServerHealth = async () => {
    try {
      const healthEndpoints = [
        `${API_URL}/api/health`,
        `${API_URL}/health`,
        "https://garments-tracker-system-server.onrender.com/api/health",
        "https://garments-tracker-system-server.onrender.com/health"
      ];
      
      for (const endpoint of healthEndpoints) {
        try {
          console.log("Checking health at:", endpoint);
          const response = await axios.get(endpoint, { timeout: 3000 });
          console.log(`Health check success (${endpoint}):`, response.data);
          toast.success(`Server is running: ${endpoint}`);
          return;
        } catch (e) {
          console.log(`Health check failed (${endpoint}):`, e.message);
        }
      }
      
      toast.error("Server health check failed on all endpoints");
    } catch (error) {
      console.error("Server health check error:", error);
      toast.error("Failed to check server health");
    }
  };

  const showCancelModal = (order) => {
    if (order.status !== "pending") {
      toast.error("Only pending orders can be cancelled");
      return;
    }
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel._id);
    try {
      const token = getToken();
      const response = await axios.put(
        `${currentApiBase}/orders/${orderToCancel._id}/cancel`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        setOrders(
          orders.map((order) =>
            order._id === orderToCancel._id
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
      setCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-warning">Pending</span>,
      approved: <span className="badge badge-primary">Approved</span>,
      processing: <span className="badge badge-info">Processing</span>,
      shipped: <span className="badge badge-accent">Shipped</span>,
      delivered: <span className="badge badge-success">Delivered</span>,
      cancelled: <span className="badge badge-error">Cancelled</span>,
      rejected: <span className="badge badge-error">Rejected</span>,
    };
    return badges[status] || <span className="badge badge-neutral">{status}</span>;
  };

  const getPaymentBadge = (paymentMethod) => {
    if (paymentMethod === "cod") {
      return <span className="badge badge-success">Cash on Delivery</span>;
    } else if (paymentMethod === "stripe" || paymentMethod === "payFirst") {
      return <span className="badge badge-info">Paid Online</span>;
    }
    return <span className="badge badge-neutral">{paymentMethod}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-3">Loading your orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && orderToCancel && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel Order</h3>
            <p className="py-4">
              Are you sure you want to cancel order #{orderToCancel._id?.slice(-8)}?
              <br />
              <strong>{orderToCancel.product?.title || orderToCancel.product?.name}</strong> (Qty: {orderToCancel.quantity})
            </p>
            <div className="modal-action">
              <button onClick={() => setCancelModalOpen(false)} className="btn btn-ghost">
                No, Keep Order
              </button>
              <button onClick={cancelOrder} className="btn btn-error">
                {cancellingOrderId === orderToCancel._id ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-xl">Order Details</h3>
                <p className="text-gray-600">Order #{selectedOrder._id?.slice(-8)}</p>
              </div>
              <button onClick={closeViewModal} className="btn btn-sm btn-circle">✕</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-lg mb-3">Order Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span>{getPaymentBadge(selectedOrder.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-primary">${selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-3">Product Information</h4>
                <div className="flex gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded">
                      <img
                        src={selectedOrder.product?.images?.[0] || "https://via.placeholder.com/150"}
                        alt={selectedOrder.product?.title}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-lg">{selectedOrder.product?.title}</h5>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold ml-2">${selectedOrder.unitPrice?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-bold ml-2">{selectedOrder.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-action">
              <button onClick={closeViewModal} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-2">View and manage all your orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={fetchOrders} className="btn btn-outline btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <button onClick={testAllEndpoints} className="btn btn-info btn-sm">
            Test API Endpoints
          </button>
          <button onClick={checkServerHealth} className="btn btn-warning btn-sm">
            Check Server
          </button>
          <Link to="/all-products" className="btn btn-primary btn-sm">
            New Order
          </Link>
        </div>
      </div>

      {/* API Debug Panel */}
      {apiTestResults.length > 0 && (
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-bold mb-2">API Test Results:</h3>
          <div className="space-y-2">
            {apiTestResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-base-100 rounded">
                <div>
                  <span className="font-mono text-sm">{result.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${result.status === '✅ Success' ? 'badge-success' : 'badge-error'}`}>
                    {result.status}
                  </span>
                  <button 
                    onClick={() => setCurrentApiBase(result.base)}
                    className="btn btn-xs"
                    disabled={currentApiBase === result.base}
                  >
                    {currentApiBase === result.base ? 'Using' : 'Use This'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm">
            Current API Base: <span className="font-mono">{currentApiBase}</span>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {orders.length > 0 && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{orders.length}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {orders.filter((o) => o.status === "pending").length}
              </div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">In Progress</div>
              <div className="stat-value text-primary">
                {orders.filter((o) => ["approved", "processing"].includes(o.status)).length}
              </div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Delivered</div>
              <div className="stat-value text-success">
                {orders.filter((o) => o.status === "delivered").length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover">
                    <td>
                      <div className="font-mono text-sm">#{order._id?.slice(-8)}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded">
                            <img
                              src={order.product?.images?.[0] || "https://via.placeholder.com/150"}
                              alt={order.product?.title}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="font-medium truncate max-w-[150px]">
                          {order.product?.title}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">{order.quantity}</span>
                    </td>
                    <td>
                      <div className="font-bold text-primary">
                        ${order.totalAmount?.toFixed(2)}
                      </div>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{getPaymentBadge(order.paymentMethod)}</td>
                    <td>
                      <div className="text-sm">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="btn btn-xs btn-outline"
                        >
                          View
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => showCancelModal(order)}
                            className="btn btn-xs btn-error"
                            disabled={cancellingOrderId === order._id}
                          >
                            {cancellingOrderId === order._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-500 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-gray-400 mb-4">
                        You haven't placed any orders yet or there's an API connection issue.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={fetchOrders} className="btn btn-sm">
                          Try Again
                        </button>
                        <button onClick={testAllEndpoints} className="btn btn-sm btn-info">
                          Test API Connection
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;