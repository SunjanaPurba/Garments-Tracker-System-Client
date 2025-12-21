import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "shirt",
    price: "",
    quantity: "",
    moq: "1",
    demoVideo: "",
    showOnHome: false,
  });

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(response.data);
    } catch (error) {
      toast.error("Failed to load product");
      navigate("/dashboard/manage-products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`${API}/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product updated successfully!");
      navigate("/dashboard/manage-products");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text">Product Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="shirt">Shirt</option>
              <option value="pant">Pant</option>
              <option value="jacket">Jacket</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="label">Price ($)</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Available Quantity</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="label">Minimum Order Quantity (MOQ)</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.moq}
              onChange={(e) =>
                setFormData({ ...formData, moq: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Demo Video Link (Optional)</label>
          <input
            type="url"
            className="input input-bordered w-full"
            placeholder="https://youtube.com/..."
            value={formData.demoVideo}
            onChange={(e) =>
              setFormData({ ...formData, demoVideo: e.target.value })
            }
          />
        </div>

        <div className="form-control">
          <label className="cursor-pointer label justify-start gap-4">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={formData.showOnHome}
              onChange={(e) =>
                setFormData({ ...formData, showOnHome: e.target.checked })
              }
            />
            <span className="label-text">Show on Home Page</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary flex-1">
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/manage-products")}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
