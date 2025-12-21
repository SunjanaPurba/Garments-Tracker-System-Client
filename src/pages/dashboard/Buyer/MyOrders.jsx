// pages/dashboard/Buyer/MyOrders.jsx
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

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
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
      const response = await axios.put(
        `${API}/orders/${orderToCancel._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");

        // Update local state
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

  const getPaymentBadge = (paymentMethod) => {
    if (paymentMethod === "Cash on Delivery") {
      return <span className="badge badge-success">Cash on Delivery</span>;
    } else if (paymentMethod === "PayFirst") {
      return <span className="badge badge-info">Paid</span>;
    }
    return <span className="badge badge-neutral">{paymentMethod}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
              Are you sure you want to cancel order #
              {orderToCancel._id?.slice(-8)}?
              <br />
              <strong>{orderToCancel.product?.name}</strong> (Qty:{" "}
              {orderToCancel.quantity})
            </p>
            <div className="modal-action">
              <button
                onClick={() => {
                  setCancelModalOpen(false);
                  setOrderToCancel(null);
                }}
                className="btn btn-ghost"
                disabled={cancellingOrderId === orderToCancel._id}
              >
                No, Keep Order
              </button>
              <button
                onClick={cancelOrder}
                className="btn btn-error"
                disabled={cancellingOrderId === orderToCancel._id}
              >
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
                <p className="text-gray-600">
                  Order #{selectedOrder._id?.slice(-8)}
                </p>
              </div>
              <button
                onClick={closeViewModal}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Order Information */}
              <div className="space-y-4">
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
                      <span>
                        {getPaymentBadge(selectedOrder.paymentMethod)}
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

                {/* Tracking Timeline */}
                {selectedOrder.tracking &&
                  selectedOrder.tracking.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg mb-3">
                        Tracking Updates
                      </h4>
                      <div className="space-y-3">
                        {[...selectedOrder.tracking]
                          .reverse()
                          .slice(0, 3)
                          .map((track, index) => (
                            <div
                              key={index}
                              className="bg-base-200 p-3 rounded-lg"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium">
                                  {track.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDateTime(track.timestamp)}
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
                      </div>
                    </div>
                  )}
              </div>

              {/* Product Information */}
              <div>
                <h4 className="font-bold text-lg mb-3">Product Information</h4>
                <div className="flex gap-4 p-4 bg-base-200 rounded-lg">
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
                    <div className="grid grid-cols-2 gap-2">
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
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-bold ml-2">
                          ${selectedOrder.product?.price?.toFixed(2)}
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
            </div>

            <div className="modal-action">
              <button onClick={closeViewModal} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-2">View and manage all your orders</p>
        </div>
        <Link to="/all-products" className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          New Order
        </Link>
      </div>

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
                {
                  orders.filter((o) =>
                    ["approved", "processing"].includes(o.status)
                  ).length
                }
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
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
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
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded">
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
                    <td>
                      {getStatusBadge(order.status)}
                      {order.tracking && order.tracking.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {order.tracking.length} update(s)
                        </div>
                      )}
                    </td>
                    <td>{getPaymentBadge(order.paymentMethod)}</td>
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

                        {order.status === "pending" && (
                          <button
                            onClick={() => showCancelModal(order)}
                            className="btn btn-sm btn-error"
                            disabled={cancellingOrderId === order._id}
                          >
                            {cancellingOrderId === order._id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Cancel
                              </>
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
                        No Orders Yet
                      </h3>
                      <p className="text-gray-400 mb-6">
                        You haven't placed any orders yet.
                      </p>
                      <Link to="/all-products" className="btn btn-primary">
                        Browse Products
                      </Link>
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
