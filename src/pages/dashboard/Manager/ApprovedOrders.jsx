// pages/dashboard/Manager/ApprovedOrders.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingHistoryModal, setTrackingHistoryModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    location: "",
    note: "",
    status: "Cutting Completed",
  });
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  const statusOptions = [
    "Cutting Completed",
    "Sewing Started",
    "Finishing",
    "QC Checked",
    "Packed",
    "Shipped",
    "Out for Delivery",
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders/approved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load approved orders");
    } finally {
      setLoading(false);
    }
  };

  const openTrackingModal = (order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      location: "",
      note: "",
      status:
        order.tracking?.length > 0
          ? getNextStatus(order.tracking[order.tracking.length - 1].status)
          : "Cutting Completed",
    });
    setTrackingModal(true);
  };

  const openTrackingHistory = (order) => {
    setSelectedOrder(order);
    setTrackingHistoryModal(true);
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    return currentIndex < statusOptions.length - 1
      ? statusOptions[currentIndex + 1]
      : currentStatus;
  };

  const getStatusColor = (status) => {
    const colors = {
      "Cutting Completed": "bg-blue-100 text-blue-800",
      "Sewing Started": "bg-purple-100 text-purple-800",
      Finishing: "bg-yellow-100 text-yellow-800",
      "QC Checked": "bg-orange-100 text-orange-800",
      Packed: "bg-indigo-100 text-indigo-800",
      Shipped: "bg-green-100 text-green-800",
      "Out for Delivery": "bg-teal-100 text-teal-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const addTracking = async () => {
    if (!trackingInfo.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!trackingInfo.status) {
      toast.error("Status is required");
      return;
    }

    try {
      const trackingUpdate = {
        ...trackingInfo,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(
        `${API}/orders/${selectedOrder._id}/tracking`,
        trackingUpdate,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Tracking update added successfully!");
        setTrackingModal(false);
        setTrackingInfo({
          location: "",
          note: "",
          status: "Cutting Completed",
        });
        fetchOrders(); // Refresh orders to show updated tracking

        // Update selected order tracking if modal is open
        if (selectedOrder) {
          const updatedOrder = {
            ...selectedOrder,
            tracking: [...(selectedOrder.tracking || []), trackingUpdate],
          };
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error(
        error.response?.data?.message || "Failed to add tracking update"
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStatus = (order) => {
    if (!order.tracking || order.tracking.length === 0) {
      return "Processing Started";
    }
    return order.tracking[order.tracking.length - 1].status;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-3">Loading approved orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Add Tracking Modal */}
      {trackingModal && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">Add Tracking Update</h3>
              <button
                onClick={() => setTrackingModal(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-base-200 rounded-lg">
              <p className="font-medium">{selectedOrder.product?.name}</p>
              <p className="text-sm text-gray-600">
                Order ID: {selectedOrder._id?.slice(-8)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={trackingInfo.status}
                  onChange={(e) =>
                    setTrackingInfo({ ...trackingInfo, status: e.target.value })
                  }
                >
                  {statusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter location (e.g., Factory Floor, QC Room, Warehouse)"
                  className="input input-bordered w-full"
                  value={trackingInfo.location}
                  onChange={(e) =>
                    setTrackingInfo({
                      ...trackingInfo,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Notes (Optional)
                  </span>
                </label>
                <textarea
                  placeholder="Add any additional notes or observations..."
                  className="textarea textarea-bordered w-full h-24"
                  value={trackingInfo.note}
                  onChange={(e) =>
                    setTrackingInfo({ ...trackingInfo, note: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => setTrackingModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={addTracking} className="btn btn-primary">
                Add Tracking Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking History Modal */}
      {trackingHistoryModal && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-xl">Tracking Timeline</h3>
                <p className="text-gray-600">
                  {selectedOrder.product?.name} - Order #
                  {selectedOrder._id?.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setTrackingHistoryModal(false)}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <div className="timeline">
              {selectedOrder.tracking && selectedOrder.tracking.length > 0 ? (
                [...selectedOrder.tracking].reverse().map((track, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`badge ${getStatusColor(track.status)}`}
                        >
                          {track.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(track.timestamp)}
                        </span>
                      </div>
                      <p className="font-medium">{track.location}</p>
                      {track.note && (
                        <p className="text-sm text-gray-600 mt-1">
                          {track.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mx-auto mb-3"
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
                  <p className="text-gray-500">No tracking updates yet.</p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setTrackingHistoryModal(false)}
                className="btn"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTrackingHistoryModal(false);
                  openTrackingModal(selectedOrder);
                }}
                className="btn btn-primary"
              >
                Add New Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Approved Orders</h1>
          <p className="text-gray-600 mt-2">
            Track and manage production progress
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Approved</div>
            <div className="stat-value text-primary">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Order ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Approved Date</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover">
                    <td>
                      <div className="font-mono text-sm">
                        {order._id?.slice(-8) || order.orderId}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">
                          {order.buyer?.name || order.buyer?.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.buyer?.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded">
                            <img
                              src={
                                order.product?.images?.[0] ||
                                "https://via.placeholder.com/150"
                              }
                              alt={order.product?.name}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {order.product?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${order.product?.price?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">{order.quantity}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        {formatDate(order.approvedAt || order.updatedAt)}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusColor(
                          getOrderStatus(order)
                        )}`}
                      >
                        {getOrderStatus(order)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.tracking?.length || 0} update(s)
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openTrackingModal(order)}
                          className="btn btn-sm btn-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Tracking
                        </button>
                        <button
                          onClick={() => openTrackingHistory(order)}
                          className="btn btn-sm btn-outline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          View Tracking
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
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
                        No Approved Orders
                      </h3>
                      <p className="text-gray-400">
                        All orders are pending approval
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS for Timeline */}
      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 2rem;
        }
        .timeline::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #e5e7eb;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .timeline-marker {
          position: absolute;
          left: -2rem;
          top: 0.25rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 2px solid white;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        .timeline-content {
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default ApprovedOrders;
