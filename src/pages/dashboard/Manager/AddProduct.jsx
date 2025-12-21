// pages/dashboard/Manager/AddProduct.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Shirt",
    price: "",
    quantity: "",
    moq: "1",
    demoVideo: "",
    paymentOptions: "Cash on Delivery",
    showOnHome: false,
  });

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  // Check if user is manager
  useEffect(() => {
    if (user?.role !== "manager") {
      toast.error("Access denied. Only managers can add products.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!formData.moq || parseInt(formData.moq) <= 0) {
      toast.error("MOQ must be at least 1");
      return;
    }
    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();

      // Append form fields
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description);
      submitFormData.append("category", formData.category);
      submitFormData.append("price", parseFloat(formData.price));
      submitFormData.append("quantity", parseInt(formData.quantity));
      submitFormData.append("moq", parseInt(formData.moq));
      submitFormData.append("demoVideo", formData.demoVideo);
      submitFormData.append("paymentOptions", formData.paymentOptions);
      submitFormData.append("showOnHome", formData.showOnHome);
      submitFormData.append("createdBy", user._id);

      // Append images
      images.forEach((image) => {
        submitFormData.append("images", image);
      });

      const response = await axios.post(`${API}/products`, submitFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Product added successfully!");

        // Reset form
        setFormData({
          name: "",
          description: "",
          category: "Shirt",
          price: "",
          quantity: "",
          moq: "1",
          demoVideo: "",
          paymentOptions: "Cash on Delivery",
          showOnHome: false,
        });
        setImages([]);
        setImagePreviews([]);

        // Redirect to products page after 2 seconds
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (user?.role !== "manager") {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          Access denied. Only managers can add products.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Product Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Product Name *</span>
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Description *</span>
          </label>
          <textarea
            placeholder="Enter detailed product description"
            className="textarea textarea-bordered w-full h-32"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Category *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="Shirt">Shirt</option>
              <option value="Pant">Pant</option>
              <option value="Jacket">Jacket</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Price */}
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
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Quantity */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Available Quantity *
              </span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="Enter available quantity"
              className="input input-bordered w-full"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
          </div>

          {/* MOQ */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Minimum Order Quantity (MOQ) *
              </span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="Minimum order quantity"
              className="input input-bordered w-full"
              value={formData.moq}
              onChange={(e) =>
                setFormData({ ...formData, moq: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Images Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Product Images *</span>
            <span className="label-text-alt">Max 5 images</span>
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            disabled={images.length >= 5}
          />
          <label className="label">
            <span className="label-text-alt">
              {images.length}/5 images selected
            </span>
          </label>
        </div>

        {/* Demo Video Link */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">
              Demo Video Link (Optional)
            </span>
          </label>
          <input
            type="url"
            placeholder="https://example.com/video"
            className="input input-bordered w-full"
            value={formData.demoVideo}
            onChange={(e) =>
              setFormData({ ...formData, demoVideo: e.target.value })
            }
          />
        </div>

        {/* Payment Options */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Payment Options *</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={formData.paymentOptions}
            onChange={(e) =>
              setFormData({ ...formData, paymentOptions: e.target.value })
            }
            required
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="PayFirst">PayFirst</option>
            <option value="Both">Both (Cash on Delivery & PayFirst)</option>
          </select>
        </div>

        {/* Show on Home Page */}
        <div className="form-control">
          <label className="cursor-pointer label justify-start gap-4">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={formData.showOnHome}
              onChange={(e) =>
                setFormData({ ...formData, showOnHome: e.target.checked })
              }
            />
            <span className="label-text font-semibold">Show on Home Page</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="form-control pt-4">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading || user?.status === "suspended"}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

          {user?.status === "suspended" && (
            <p className="text-error text-sm mt-2">
              Your account is suspended. You cannot add new products.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
