// pages/dashboard/Manager/ManageProducts.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const ManageProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    if (user?.role === "manager") {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/manager`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeletingId(productToDelete._id);
    try {
      await axios.delete(`${API}/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully!");
      // Remove from local state
      setProducts(products.filter((p) => p._id !== productToDelete._id));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format payment mode display
  const formatPaymentMode = (paymentOptions) => {
    if (Array.isArray(paymentOptions)) {
      return paymentOptions.join(", ");
    }
    return paymentOptions || "Cash on Delivery";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-3">Loading products...</span>
        </div>
      </div>
    );
  }

  if (user?.role !== "manager") {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          Access denied. This page is for managers only.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={cancelDelete}
                className="btn btn-ghost"
                disabled={deletingId === productToDelete?._id}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error"
                disabled={deletingId === productToDelete?._id}
              >
                {deletingId === productToDelete?._id ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link to="/dashboard/add-product" className="btn btn-primary">
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
          Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search products by name or category..."
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

      {/* Products Table */}
      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th className="w-20">Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Payment Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover">
                    <td>
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-lg">
                          <img
                            src={
                              product.images?.[0]?.url ||
                              product.images?.[0] ||
                              "https://via.placeholder.com/150?text=No+Image"
                            }
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        <span className="badge badge-sm badge-outline mr-2">
                          {product.category || "Uncategorized"}
                        </span>
                        <span className="text-xs">
                          Qty: {product.quantity || 0}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-primary">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {product.paymentOptions === "Both" ||
                        (Array.isArray(product.paymentOptions) &&
                          product.paymentOptions.includes(
                            "Cash on Delivery"
                          )) ? (
                          <span className="badge badge-sm badge-success">
                            Cash on Delivery
                          </span>
                        ) : null}

                        {product.paymentOptions === "Both" ||
                        product.paymentOptions === "PayFirst" ||
                        (Array.isArray(product.paymentOptions) &&
                          product.paymentOptions.includes("PayFirst")) ? (
                          <span className="badge badge-sm badge-info">
                            PayFirst
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/update-product/${product._id}`}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Update
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="btn btn-sm btn-error"
                          disabled={deletingId === product._id}
                        >
                          {deletingId === product._id ? (
                            <>
                              <span className="loading loading-spinner loading-xs"></span>
                            </>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-lg text-gray-500 mb-2">
                        {searchTerm
                          ? "No products found matching your search."
                          : "No products found."}
                      </p>
                      {!searchTerm && (
                        <Link
                          to="/dashboard/add-product"
                          className="btn btn-primary btn-sm mt-2"
                        >
                          Add Your First Product
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="stat">
              <div className="stat-title">Total Products</div>
              <div className="stat-value">{filteredProducts.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Total Value</div>
              <div className="stat-value">
                $
                {filteredProducts
                  .reduce(
                    (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
                    0
                  )
                  .toFixed(2)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Low Stock {"(<10)"}</div>
              <div className="stat-value text-warning">
                {filteredProducts.filter((p) => (p.quantity || 0) < 10).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
