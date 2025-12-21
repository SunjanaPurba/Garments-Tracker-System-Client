// pages/dashboard/Admin/AdminAllProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingHome, setUpdatingHome] = useState(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleHome = async (id, current) => {
    setUpdatingHome(id);
    try {
      await axios.patch(
        `${API}/products/${id}/show-home`,
        { showOnHome: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(
        products.map((p) => (p._id === id ? { ...p, showOnHome: !current } : p))
      );
      toast.success(
        `Product ${!current ? "added to" : "removed from"} home page`
      );
    } catch (error) {
      console.error("Error updating home status:", error);
      toast.error("Failed to update");
    } finally {
      setUpdatingHome(null);
    }
  };

  const showDeleteConfirmation = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await axios.delete(`${API}/products/${deletingProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((p) => p._id !== deletingProduct._id));
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { _id, ...updates } = editingProduct;

      const response = await axios.patch(`${API}/products/${_id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProducts(
          products.map((p) => (p._id === _id ? response.data.product : p))
        );
        toast.success("Product updated successfully!");
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const categories = ["all", "Shirt", "Pant", "Jacket", "Accessories"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  return (
    <div className="p-6">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingProduct && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Product</h3>
            <p className="py-4">
              Are you sure you want to delete{" "}
              <strong>{deletingProduct.name}</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingProduct(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={deleteProduct} className="btn btn-error">
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-xl">Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="btn btn-sm btn-circle"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Product Name *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Product Name"
                  className="input input-bordered w-full"
                  value={editingProduct.name || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Price and Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Price *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="input input-bordered w-full pl-8"
                    value={editingProduct.price || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingProduct.category || "Shirt"}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="Shirt">Shirt</option>
                  <option value="Pant">Pant</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Description */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  placeholder="Product description"
                  className="textarea textarea-bordered w-full h-32"
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Quantity and MOQ */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Available Quantity
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  className="input input-bordered w-full"
                  value={editingProduct.quantity || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Minimum Order Quantity
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="MOQ"
                  className="input input-bordered w-full"
                  value={editingProduct.moq || 1}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      moq: e.target.value,
                    })
                  }
                />
              </div>

              {/* Payment Options */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Payment Options
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editingProduct.paymentOptions || "Cash on Delivery"}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      paymentOptions: e.target.value,
                    })
                  }
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="PayFirst">PayFirst</option>
                  <option value="Both">
                    Both (Cash on Delivery & PayFirst)
                  </option>
                </select>
              </div>

              {/* Show on Home Page */}
              <div className="form-control md:col-span-2">
                <label className="cursor-pointer label justify-start gap-4">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={editingProduct.showOnHome || false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        showOnHome: e.target.checked,
                      })
                    }
                  />
                  <span className="label-text font-semibold">
                    Show on Home Page
                  </span>
                </label>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={saveEdit} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-600 mt-2">
            Manage all products in the system
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Products</div>
            <div className="stat-value">{products.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or category..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <div className="text-right">
            <button
              onClick={() => navigate("/dashboard/add-product")}
              className="btn btn-primary"
            >
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
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-base-100 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Show on Home</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover">
                    <td>
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-lg">
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
                      <div className="text-xs text-gray-500">
                        Qty: {product.quantity} | MOQ: {product.moq || 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(product.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-primary">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">
                          {product.createdBy?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.createdBy?.email || ""}
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={product.showOnHome || false}
                        onChange={() =>
                          toggleHome(product._id, product.showOnHome)
                        }
                        disabled={updatingHome === product._id}
                      />
                      {updatingHome === product._id && (
                        <span className="loading loading-spinner loading-xs ml-2"></span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
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
                          Edit
                        </button>
                        <button
                          onClick={() => showDeleteConfirmation(product)}
                          className="btn btn-sm btn-error"
                        >
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
                          Delete
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-500 mb-2">
                        No Products Found
                      </h3>
                      <p className="text-gray-400">
                        {searchTerm || selectedCategory !== "all"
                          ? "Try adjusting your search filters"
                          : "Add your first product to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="stat">
              <div className="stat-title">Total Products</div>
              <div className="stat-value">{filteredProducts.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">On Home Page</div>
              <div className="stat-value text-success">
                {filteredProducts.filter((p) => p.showOnHome).length}
              </div>
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

export default AdminAllProducts;
