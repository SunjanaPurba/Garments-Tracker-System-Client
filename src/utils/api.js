// utils/api.js
const API_BASE = "/api";

export const api = {
  // Auth
  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }),

  // Admin
  getUsers: () => fetch(`${API_BASE}/admin/users`),
  updateUserRole: (userId, data) =>
    fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  suspendUser: (userId, reason) =>
    fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reason),
    }),

  // Products
  getProducts: () => fetch(`${API_BASE}/products`),
  createProduct: (formData) =>
    fetch(`${API_BASE}/products`, {
      method: "POST",
      body: formData,
    }),
  updateProduct: (productId, data) =>
    fetch(`${API_BASE}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  deleteProduct: (productId) =>
    fetch(`${API_BASE}/products/${productId}`, {
      method: "DELETE",
    }),

  // Orders
  getOrders: () => fetch(`${API_BASE}/orders`),
  updateOrderStatus: (orderId, status) =>
    fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }),
  addTracking: (orderId, trackingData) =>
    fetch(`${API_BASE}/orders/${orderId}/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingData),
    }),
};
