// pages/dashboard/Manager/PendingOrders.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await axios.patch(
        `${API}/orders/${orderId}/status`,
        {
          status,
          approvedAt: status === "approved" ? new Date().toISOString() : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(
          `Order ${
            status === "approved" ? "Approved" : "Rejected"
          } successfully!`
        );

        // Update local state
        setOrders(orders.filter((order) => order._id !== orderId));

        // If approved, show additional info
        if (status === "approved") {
          toast.info("Order has been moved to Approved Orders");
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-3">Loading pending orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Order Details Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">Order Details</h3>
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
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono">{selectedOrder._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="badge badge-warning">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
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
                    <div className="w-16 h-16 rounded">
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
                    <h5 className="font-bold">{selectedOrder.product?.name}</h5>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.product?.category}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <span className="text-gray-600">Price: </span>
                        <span className="font-bold">
                          ${selectedOrder.product?.price?.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-bold">
                          {selectedOrder.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subtotal: </span>
                        <span className="font-bold">
                          $
                          {(
                            selectedOrder.product?.price *
                            selectedOrder.quantity
                          )?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          <h1 className="text-3xl font-bold">Pending Orders</h1>
          <p className="text-gray-600 mt-2">
            Orders awaiting approval from managers
          </p>
        </div>
        <div className="badge badge-lg badge-warning">
          {orders.length} Pending
        </div>
      </div>

      {/* Stats Summary */}
      {orders.length > 0 && (
        <div className="mb-6 p-4 bg-base-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="stat">
              <div className="stat-title">Total Pending Orders</div>
              <div className="stat-value text-warning">{orders.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Value</div>
              <div className="stat-value">
                $
                {orders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toFixed(2)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Avg. Order Value</div>
              <div className="stat-value">
                $
                {orders.length > 0
                  ? (
                      orders.reduce(
                        (sum, order) => sum + (order.totalAmount || 0),
                        0
                      ) / orders.length
                    ).toFixed(2)
                  : "0.00"}
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
                <th>User</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Order Date</th>
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
                      <div className="text-xs text-gray-500">
                        MOQ: {order.product?.moq || 1}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "approved")
                          }
                          className="btn btn-sm btn-success"
                          disabled={updatingOrderId === order._id}
                        >
                          {updatingOrderId === order._id ? (
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
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "rejected")
                          }
                          className="btn btn-sm btn-error"
                          disabled={updatingOrderId === order._id}
                        >
                          {updatingOrderId === order._id ? (
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
                              Reject
                            </>
                          )}
                        </button>
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
                        No Pending Orders
                      </h3>
                      <p className="text-gray-400">
                        All orders have been processed
                      </p>
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

export default PendingOrders;
