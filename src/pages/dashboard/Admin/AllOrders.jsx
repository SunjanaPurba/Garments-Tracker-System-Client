import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      const response = await axios.patch(
        `${API}/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrders(
          orders.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: (
        <span className="badge badge-warning animate-pulse">Pending</span>
      ),
      approved: <span className="badge badge-primary">Approved</span>,
      processing: <span className="badge badge-info">Processing</span>,
      shipped: <span className="badge badge-accent">Shipped</span>,
      delivered: <span className="badge badge-success">Delivered</span>,
      cancelled: <span className="badge badge-error">Cancelled</span>,
      rejected: <span className="badge badge-error">Rejected</span>,
    };
    return (
      badges[status] || <span className="badge badge-neutral">{status}</span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-3">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* View Order Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-xl">Order Details</h3>
                <p className="text-gray-600">
                  Order #{selectedOrder._id?.slice(-8)}
                </p>
              </div>
              <button onClick={closeModal} className="btn btn-sm btn-circle">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <div>
                <h4 className="font-bold text-lg mb-3">Order Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span>{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>
                      {selectedOrder.paymentMethod || "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-primary">
                      ${selectedOrder.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="font-bold text-lg mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{selectedOrder.buyer?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedOrder.buyer?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedOrder.buyer?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="md:col-span-2">
                <h4 className="font-bold text-lg mb-3">Product Information</h4>
                <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded">
                      <img
                        src={
                          selectedOrder.product?.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={selectedOrder.product?.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-lg">
                      {selectedOrder.product?.name}
                    </h5>
                    <p className="text-gray-600 mb-2">
                      {selectedOrder.product?.category}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold ml-2">
                          ${selectedOrder.unitPrice?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-bold ml-2">
                          {selectedOrder.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">MOQ:</span>
                        <span className="font-bold ml-2">
                          {selectedOrder.product?.moq || 1}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-bold ml-2">
                          $
                          {(
                            selectedOrder.unitPrice * selectedOrder.quantity
                          )?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              {selectedOrder.tracking && selectedOrder.tracking.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="font-bold text-lg mb-3">Tracking History</h4>
                  <div className="space-y-3">
                    {[...selectedOrder.tracking]
                      .reverse()
                      .slice(0, 3)
                      .map((track, index) => (
                        <div key={index} className="bg-base-200 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{track.status}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(track.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{track.location}</p>
                          {track.note && (
                            <p className="text-sm text-gray-600 mt-1">
                              {track.note}
                            </p>
                          )}
                        </div>
                      ))}
                    {selectedOrder.tracking.length > 3 && (
                      <button
                        onClick={() => {
                          closeModal();
                          navigate(
                            `/dashboard/order-details/${selectedOrder._id}`
                          );
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        View Full Tracking History
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button onClick={closeModal} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all orders in the system
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID, customer, or product..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <div className="text-right">
            <button onClick={fetchOrders} className="btn btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh
            </button>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover">
                    <td>
                      <div className="font-mono text-sm">
                        #{order._id?.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
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
                            ${order.unitPrice?.toFixed(2)}/unit
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-bold">{order.quantity}</span>
                      <div className="text-xs text-gray-500">
                        Total: ${order.totalAmount?.toFixed(2)}
                      </div>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
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
                          View
                        </button>

                        {/* Status Action Buttons */}
                        {order.status === "pending" && (
                          <button
                            onClick={() => updateStatus(order._id, "approved")}
                            className="btn btn-sm btn-primary"
                            disabled={updatingStatus === order._id}
                          >
                            {updatingStatus === order._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Approve"
                            )}
                          </button>
                        )}

                        {order.status === "approved" && (
                          <button
                            onClick={() =>
                              updateStatus(order._id, "processing")
                            }
                            className="btn btn-sm btn-info"
                            disabled={updatingStatus === order._id}
                          >
                            {updatingStatus === order._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Process"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12">
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
                      <p className="text-gray-400">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search filters"
                          : "No orders have been placed yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Statistics */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="stat">
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{filteredOrders.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">
                $
                {filteredOrders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Pending Orders</div>
              <div className="stat-value text-warning">
                {filteredOrders.filter((o) => o.status === "pending").length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed Orders</div>
              <div className="stat-value text-success">
                {filteredOrders.filter((o) => o.status === "delivered").length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
