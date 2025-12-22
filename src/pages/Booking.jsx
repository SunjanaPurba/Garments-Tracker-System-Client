
// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import LoadingSpinner from "../components/LoadingSpinner";
// import {
//   FaEnvelope,
//   FaBox,
//   FaDollarSign,
//   FaUser,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaStickyNote,
//   FaCreditCard,
//   FaMoneyBillWave,
//   FaCalculator,
//   FaCheckCircle,
//   FaArrowLeft,
// } from "react-icons/fa";
// import { Helmet } from "react-helmet-async";

// const Booking = () => {
//   const { productId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [availableQuantity, setAvailableQuantity] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("stripe"); // UI-এর জন্য রাখা

//   const API_URL =
//     import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server-wine.vercel.app/api";

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       contactNumber: "",
//       deliveryAddress: "",
//       additionalNotes: "",
//       orderQuantity: 1,
//     },
//   });

//   const watchQuantity = watch("orderQuantity");

//   // Auth check
//   useEffect(() => {
//     if (!user) {
//       toast.error("Please login to book a product");
//       navigate("/login", { state: { from: `/booking/${productId}` } });
//       return;
//     }
//     if (user.role !== "buyer") {
//       toast.error("Only buyers can place orders");
//       navigate("/all-products");
//     }
//   }, [user, navigate, productId]);

//   // Fetch product
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("access-token");
//         const res = await axios.get(`${API_URL}/products/${productId}`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (res.data.success && res.data.product) {
//           const p = res.data.product;
//           setProduct(p);
//           setAvailableQuantity(p.quantity);

//           const minQty = p.minOrder || 1;
//           setQuantity(minQty);
//           setValue("orderQuantity", minQty);
//           setTotalPrice(minQty * p.price);
//         } else {
//           toast.error("Product not found");
//           navigate("/all-products");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load product details");
//         navigate("/all-products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (productId) fetchProduct();
//   }, [productId, navigate, setValue, API_URL]);

//   // Update total price
//   useEffect(() => {
//     if (product && watchQuantity) {
//       const qty = parseInt(watchQuantity) || 0;
//       setTotalPrice(qty * product.price);
//       setQuantity(qty);
//     }
//   }, [watchQuantity, product]);

//   // Quantity handlers
//   const incrementQuantity = () => {
//     if (quantity < availableQuantity) {
//       const newQty = quantity + 1;
//       setQuantity(newQty);
//       setValue("orderQuantity", newQty);
//     } else {
//       toast.warning(`Only ${availableQuantity} units available`);
//     }
//   };

//   const decrementQuantity = () => {
//     const minQty = product?.minOrder || 1;
//     if (quantity > minQty) {
//       const newQty = quantity - 1;
//       setQuantity(newQty);
//       setValue("orderQuantity", newQty);
//     } else {
//       toast.warning(`Minimum order quantity is ${minQty} units`);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     let val = parseInt(e.target.value) || 0;
//     const min = product?.minOrder || 1;
//     const max = availableQuantity;

//     if (val < min) {
//       toast.warning(`Minimum order quantity is ${min} units`);
//       val = min;
//     }
//     if (val > max) {
//       toast.warning(`Only ${max} units available`);
//       val = max;
//     }

//     setQuantity(val);
//     setValue("orderQuantity", val);
//   };

//   // Form submission - FIXED FOR ENUM ISSUE
//   const onSubmit = async (formData) => {
//     if (!product || !user) return;

//     const orderQty = parseInt(formData.orderQuantity);
//     const minQty = product.minOrder || 1;

//     if (orderQty < minQty || orderQty > availableQuantity) {
//       toast.error("Please select a valid quantity");
//       return;
//     }

//     // 🔥 CRITICAL FIX: backend-এর enum-এর সাথে match করা value পাঠাও
//     const orderData = {
//       productId: product._id,
//       quantity: orderQty,
//       shippingAddress: formData.deliveryAddress,
//       phoneNumber: formData.contactNumber,
//       notes: formData.additionalNotes || "",
//       paymentMethod: product.paymentOptions === "cashOnDelivery" ? "cod" : "payFirst", // ← এখানে "payFirst" পাঠাও
//       totalAmount: totalPrice,
//     };

//     console.log("Sending order data:", orderData);

//     setSubmitting(true);
//     try {
//       const token = localStorage.getItem("access-token");
//       if (!token) {
//         toast.error("Please login again");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.post(`${API_URL}/orders`, orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.success) {
//         toast.success("Order placed successfully!");

//         if (product.paymentOptions === "cashOnDelivery") {
//           navigate("/dashboard/my-orders");
//         } else {
//           // Online payment হলে payment page-এ যাও
//           navigate(`/payment/${response.data.order._id}`, {
//             state: {
//               order: response.data.order,
//               totalAmount: totalPrice,
//               selectedGateway: paymentMethod, // UI-এর জন্য রাখো, কিন্তু backend-এ payFirst পাঠানো হয়েছে
//             },
//           });
//         }
//       } else {
//         toast.error(response.data.message || "Failed to place order");
//       }
//     } catch (error) {
//       console.error("Order submission error:", error);
//       if (error.response) {
//         console.error("Server response:", error.response.data);
//         toast.error(error.response.data.message || "Failed to place order");
//       } else {
//         toast.error("Network error. Please try again.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!product) return <div className="text-center py-20">Product not found</div>;

//   const requiresOnlinePayment =
//     product.paymentOptions === "advancePayment" ||
//     product.paymentOptions === "partialPayment";

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
//       <Helmet>
//         <title>Book Product | GarmentPro</title>
//       </Helmet>

//       <div className="container mx-auto px-4 max-w-6xl">
//         <Link
//           to={`/products/${productId}`}
//           className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
//         >
//           <FaArrowLeft /> Back to Product
//         </Link>

//         <h1 className="text-3xl md:text-4xl font-bold mb-8">Place Your Order</h1>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Summary - same as before */}
//           <div className="space-y-6">
//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h2 className="card-title"><FaBox /> Product Summary</h2>
//                 {product.images?.[0] && (
//                   <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover rounded-lg" />
//                 )}
//                 <h3 className="text-2xl font-bold mt-4">{product.title}</h3>
//                 <p className="text-gray-600">{product.description}</p>
//                 <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
//                   <div><strong>Category:</strong> {product.category}</div>
//                   <div>
//                     <strong>Available Stock:</strong>{" "}
//                     <span className={availableQuantity <= 5 ? "text-error" : "text-success"}>
//                       {availableQuantity} units
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h2 className="card-title"><FaCalculator /> Order Summary</h2>
//                 <div className="space-y-4">
//                   <div className="flex justify-between"><span>Unit Price</span><span className="font-bold">${product.price}</span></div>
//                   <div className="flex justify-between"><span>Quantity</span><span className="font-bold">{quantity} units</span></div>
//                   <div className="border-t pt-4">
//                     <div className="flex justify-between text-2xl">
//                       <span>Total</span>
//                       <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="card bg-base-100 shadow-xl">
//               <div className="card-body">
//                 <h2 className="card-title"><FaCreditCard /> Payment Information</h2>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span>Payment Type</span>
//                     <span className="font-medium">
//                       {product.paymentOptions === "cashOnDelivery" ? "Cash on Delivery" :
//                        product.paymentOptions === "advancePayment" ? "Full Advance Payment" : "Partial Payment (50% Advance)"}
//                     </span>
//                   </div>
//                   {requiresOnlinePayment && (
//                     <div className="alert alert-info">
//                       <FaMoneyBillWave />
//                       <span>You will be redirected to the payment gateway after placing the order.</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Form */}
//           <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//               <h2 className="card-title text-2xl mb-6">Order Details</h2>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Read-only fields */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200 p-4 rounded-lg">
//                   <div>
//                     <label className="label"><span className="label-text">Product (Read-only)</span></label>
//                     <input type="text" value={product.title} readOnly className="input input-bordered bg-base-300 w-full cursor-not-allowed" />
//                   </div>
//                   <div>
//                     <label className="label"><span className="label-text">Price per Unit</span></label>
//                     <input type="text" value={`$${product.price}`} readOnly className="input input-bordered bg-base-300 w-full cursor-not-allowed" />
//                   </div>
//                 </div>

//                 {/* Quantity */}
//                 <div>
//                   <label className="label"><span className="label-text font-semibold">Order Quantity *</span></label>
//                   <div className="flex items-center gap-4">
//                     <button type="button" onClick={decrementQuantity} className="btn btn-circle btn-outline">-</button>
//                     <input
//                       type="number"
//                       {...register("orderQuantity", { required: true })}
//                       onChange={handleQuantityChange}
//                       className="input input-bordered w-32 text-center text-xl font-bold"
//                       min={product.minOrder || 1}
//                       max={availableQuantity}
//                     />
//                     <button type="button" onClick={incrementQuantity} className="btn btn-circle btn-outline">+</button>
//                   </div>
//                   <div className="text-sm text-gray-500 mt-2">
//                     Min: {product.minOrder || 1} | Max: {availableQuantity} units
//                   </div>
//                 </div>

//                 {/* Total */}
//                 <div className="bg-primary/10 p-6 rounded-lg text-center border border-primary/30">
//                   <div className="text-3xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
//                   <div className="text-lg">Total Amount</div>
//                 </div>

//                 {/* Buyer info */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="label"><span className="label-text"><FaUser className="inline mr-1" /> First Name *</span></label>
//                     <input {...register("firstName", { required: "First name required" })} className="input input-bordered w-full" placeholder="John" />
//                   </div>
//                   <div>
//                     <label className="label"><span className="label-text">Last Name *</span></label>
//                     <input {...register("lastName", { required: "Last name required" })} className="input input-bordered w-full" placeholder="Doe" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="label"><span className="label-text"><FaPhone className="inline mr-1" /> Contact Number *</span></label>
//                   <input type="tel" {...register("contactNumber", { required: "Phone number required" })} className="input input-bordered w-full" placeholder="+88017xxxxxxxx" />
//                 </div>

//                 <div>
//                   <label className="label"><span className="label-text"><FaMapMarkerAlt className="inline mr-1" /> Delivery Address *</span></label>
//                   <textarea rows="3" {...register("deliveryAddress", { required: "Address required" })} className="textarea textarea-bordered w-full" placeholder="Full address..." />
//                 </div>

//                 <div>
//                   <label className="label"><span className="label-text"><FaStickyNote className="inline mr-1" /> Additional Notes (Optional)</span></label>
//                   <textarea rows="3" {...register("additionalNotes")} className="textarea textarea-bordered w-full" placeholder="Any special instructions..." />
//                 </div>

//                 {/* Gateway Selection */}
//                 {requiresOnlinePayment && (
//                   <div>
//                     <label className="label"><span className="label-text font-semibold">Select Payment Gateway</span></label>
//                     <div className="grid grid-cols-2 gap-4">
//                       <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === "stripe" ? "border-primary bg-primary/10" : ""}`}>
//                         <input type="radio" value="stripe" checked={paymentMethod === "stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="radio radio-primary" />
//                         <div><div className="font-medium">Stripe</div><div className="text-sm text-gray-600">Card Payment</div></div>
//                       </label>
//                       <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${paymentMethod === "payfast" ? "border-primary bg-primary/10" : ""}`}>
//                         <input type="radio" value="payfast" checked={paymentMethod === "payfast"} onChange={(e) => setPaymentMethod(e.target.value)} className="radio radio-primary" />
//                         <div><div className="font-medium">PayFast</div><div className="text-sm text-gray-600">Online Banking</div></div>
//                       </label>
//                     </div>
//                   </div>
//                 )}

//                 <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
//                   {submitting ? "Processing..." : product.paymentOptions === "cashOnDelivery" ? "Place Order (Cash on Delivery)" : `Proceed to Payment - $${totalPrice.toFixed(2)}`}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Booking;


import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FaBox,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCalculator,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Booking = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // DEBUG: Log environment variables
  console.log("Environment Variables:", {
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
    VITE_REACT_APP_SERVER_URL: import.meta.env.VITE_REACT_APP_SERVER_URL
  });

  // FIXED: Use VITE_SERVER_URL which already has /api in it
  const API_URL = import.meta.env.VITE_SERVER_URL || "https://garments-tracker-system-server-wine.vercel.app/api";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      deliveryAddress: "",
      additionalNotes: "",
      orderQuantity: 1,
    },
  });

  const watchQuantity = watch("orderQuantity");

  // Auth check
  useEffect(() => {
    if (!user) {
      toast.error("Please login to book a product");
      navigate("/login", { state: { from: `/booking/${productId}` } });
      return;
    }
    if (user.role !== "buyer") {
      toast.error("Only buyers can place orders");
      navigate("/all-products");
    }
  }, [user, navigate, productId]);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access-token");
        
        // FIXED: Use correct endpoint - products should be at root, not /api/products
        const fetchUrl = `https://garments-tracker-system-server-wine.vercel.app/api/products/${productId}`;
        console.log("Fetching product from:", fetchUrl);
        
        const res = await axios.get(fetchUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Product response:", res.data);

        if (res.data.success && res.data.product) {
          const p = res.data.product;
          setProduct(p);
          setAvailableQuantity(p.quantity);

          const minQty = p.minOrder || 1;
          setQuantity(minQty);
          setValue("orderQuantity", minQty);
          setTotalPrice(minQty * p.price);
          
          // Pre-fill user data
          if (user) {
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("contactNumber", user.phoneNumber || "");
          }
        } else {
          toast.error("Product not found");
          navigate("/all-products");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        toast.error("Failed to load product details");
        navigate("/all-products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, navigate, setValue, user]);

  // Update total price
  useEffect(() => {
    if (product && watchQuantity) {
      const qty = parseInt(watchQuantity) || 0;
      setTotalPrice(qty * product.price);
      setQuantity(qty);
    }
  }, [watchQuantity, product]);

  // Quantity handlers
  const incrementQuantity = () => {
    if (quantity < availableQuantity) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      setValue("orderQuantity", newQty);
    } else {
      toast.warning(`Only ${availableQuantity} units available`);
    }
  };

  const decrementQuantity = () => {
    const minQty = product?.minOrder || 1;
    if (quantity > minQty) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      setValue("orderQuantity", newQty);
    } else {
      toast.warning(`Minimum order quantity is ${minQty} units`);
    }
  };

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value) || 0;
    const min = product?.minOrder || 1;
    const max = availableQuantity;

    if (val < min) {
      toast.warning(`Minimum order quantity is ${min} units`);
      val = min;
    }
    if (val > max) {
      toast.warning(`Only ${max} units available`);
      val = max;
    }

    setQuantity(val);
    setValue("orderQuantity", val);
  };

  // Form submission
  const onSubmit = async (formData) => {
    if (!product || !user) {
      toast.error("Product or user information missing");
      return;
    }

    const orderQty = parseInt(formData.orderQuantity);
    const minQty = product.minOrder || 1;

    if (orderQty < minQty) {
      toast.error(`Minimum order quantity is ${minQty} units`);
      return;
    }
    
    if (orderQty > availableQuantity) {
      toast.error(`Only ${availableQuantity} units available`);
      return;
    }

    const orderData = {
      productId: product._id,
      quantity: orderQty,
      shippingAddress: formData.deliveryAddress,
      phoneNumber: formData.contactNumber,
      notes: formData.additionalNotes || "",
      paymentMethod: product.paymentOptions === "cashOnDelivery" ? "cod" : "payFirst",
      totalAmount: totalPrice,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    console.log("Sending order data to server:", orderData);
    console.log("API URL for orders:", `${API_URL}/orders`);

    setSubmitting(true);
    try {
      const token = localStorage.getItem("access-token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      console.log("Making POST request to:", `${API_URL}/orders`);
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Order response:", response.data);

      if (response.data.success) {
        toast.success("Order placed successfully!");

        if (product.paymentOptions === "cashOnDelivery") {
          navigate("/dashboard/my-orders");
        } else {
          navigate(`/payment/${response.data.order._id}`, {
            state: {
              order: response.data.order,
              totalAmount: totalPrice,
            },
          });
        }
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      if (error.response) {
        console.error("Server response error:", error.response.data);
        toast.error(error.response.data.message || "Failed to place order. Please check your information.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        toast.error("Error placing order: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const isOutOfStock = availableQuantity <= 0;
  const isLowStock = availableQuantity > 0 && availableQuantity <= 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
      <Helmet>
        <title>Book Product | GarmentPro</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          to={`/products/${productId}`}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <FaArrowLeft /> Back to Product
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Place Your Order</h1>

        {isOutOfStock && (
          <div className="alert alert-error mb-6">
            <FaExclamationTriangle />
            <div>
              <span className="font-bold">This product is out of stock!</span>
              <p>Please check back later or choose another product.</p>
            </div>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="alert alert-warning mb-6">
            <FaExclamationTriangle />
            <div>
              <span className="font-bold">Low Stock Warning!</span>
              <p>Only {availableQuantity} units left. Order soon!</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Summary */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <FaBox /> Product Summary
                </h2>
                {product.images?.[0] && (
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-64 object-cover rounded-lg" 
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                      e.target.onerror = null;
                    }}
                  />
                )}
                <h3 className="text-2xl font-bold mt-4">{product.title}</h3>
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <strong>Category:</strong> {product.category}
                  </div>
                  <div>
                    <strong>Unit Price:</strong> ${product.price}
                  </div>
                  <div>
                    <strong>Minimum Order:</strong> {product.minOrder || 1} units
                  </div>
                  <div>
                    <strong>Available Stock:</strong>{" "}
                    <span className={isOutOfStock ? "text-error font-bold" : isLowStock ? "text-warning font-bold" : "text-success"}>
                      {availableQuantity} units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <FaCalculator /> Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Unit Price</span>
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span className="font-bold">{quantity} units</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-2xl">
                      <span>Total</span>
                      <span className="font-bold text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <span className="font-medium">
                      {product.paymentOptions === "cashOnDelivery" 
                        ? "Cash on Delivery" 
                        : product.paymentOptions === "advancePayment" 
                          ? "Full Advance Payment" 
                          : "Partial Payment (50% Advance)"}
                    </span>
                  </div>
                  {product.paymentOptions !== "cashOnDelivery" && (
                    <div className="alert alert-info">
                      <div>
                        <span>You will be redirected to the payment gateway after placing the order.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Order Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Order Quantity *</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button 
                      type="button" 
                      onClick={decrementQuantity} 
                      className="btn btn-circle btn-outline"
                      disabled={quantity <= (product.minOrder || 1) || isOutOfStock}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      {...register("orderQuantity", { 
                        required: "Quantity is required",
                        min: {
                          value: product.minOrder || 1,
                          message: `Minimum order is ${product.minOrder || 1} units`
                        },
                        max: {
                          value: availableQuantity,
                          message: `Maximum available is ${availableQuantity} units`
                        }
                      })}
                      onChange={handleQuantityChange}
                      className="input input-bordered w-32 text-center text-xl font-bold"
                      min={product.minOrder || 1}
                      max={availableQuantity}
                      disabled={isOutOfStock}
                    />
                    <button 
                      type="button" 
                      onClick={incrementQuantity} 
                      className="btn btn-circle btn-outline"
                      disabled={quantity >= availableQuantity || isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Min: {product.minOrder || 1} | Max: {availableQuantity} units
                    {isOutOfStock && <span className="text-error ml-2">(Out of Stock)</span>}
                  </div>
                  {errors.orderQuantity && (
                    <span className="text-error text-sm">{errors.orderQuantity.message}</span>
                  )}
                </div>

                {/* Total Price Display */}
                <div className="bg-primary/10 p-6 rounded-lg text-center border border-primary/30">
                  <div className="text-3xl font-bold text-primary">${totalPrice.toFixed(2)}</div>
                  <div className="text-lg">Total Amount</div>
                </div>

                {/* Buyer Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text flex items-center gap-1">
                        <FaUser /> First Name *
                      </span>
                    </label>
                    <input 
                      {...register("firstName", { 
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters"
                        }
                      })} 
                      className="input input-bordered w-full" 
                      placeholder="John" 
                      disabled={isOutOfStock}
                    />
                    {errors.firstName && (
                      <span className="text-error text-sm">{errors.firstName.message}</span>
                    )}
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text">Last Name *</span>
                    </label>
                    <input 
                      {...register("lastName", { 
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters"
                        }
                      })} 
                      className="input input-bordered w-full" 
                      placeholder="Doe" 
                      disabled={isOutOfStock}
                    />
                    {errors.lastName && (
                      <span className="text-error text-sm">{errors.lastName.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <FaPhone /> Contact Number *
                    </span>
                  </label>
                  <input 
                    type="tel" 
                    {...register("contactNumber", { 
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[0-9\s\-\(\)]{10,}$/,
                        message: "Please enter a valid phone number"
                      }
                    })} 
                    className="input input-bordered w-full" 
                    placeholder="+88017xxxxxxxx" 
                    disabled={isOutOfStock}
                  />
                  {errors.contactNumber && (
                    <span className="text-error text-sm">{errors.contactNumber.message}</span>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <FaMapMarkerAlt /> Delivery Address *
                    </span>
                  </label>
                  <textarea 
                    rows="3" 
                    {...register("deliveryAddress", { 
                      required: "Delivery address is required",
                      minLength: {
                        value: 10,
                        message: "Please provide a complete address"
                      }
                    })} 
                    className="textarea textarea-bordered w-full" 
                    placeholder="House #, Street, City, Postal Code..." 
                    disabled={isOutOfStock}
                  />
                  {errors.deliveryAddress && (
                    <span className="text-error text-sm">{errors.deliveryAddress.message}</span>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-1">
                      <FaStickyNote /> Additional Notes (Optional)
                    </span>
                  </label>
                  <textarea 
                    rows="3" 
                    {...register("additionalNotes")} 
                    className="textarea textarea-bordered w-full" 
                    placeholder="Any special instructions, delivery preferences, etc..." 
                    disabled={isOutOfStock}
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={submitting || isOutOfStock} 
                  className="btn btn-primary btn-lg w-full mt-6"
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
                  ) : isOutOfStock ? (
                    "Out of Stock - Cannot Order"
                  ) : product.paymentOptions === "cashOnDelivery" ? (
                    `Place Order - $${totalPrice.toFixed(2)}`
                  ) : (
                    `Proceed to Payment - $${totalPrice.toFixed(2)}`
                  )}
                </button>

                {isOutOfStock && (
                  <div className="alert alert-error mt-4">
                    <FaExclamationTriangle />
                    <div>
                      <span className="font-bold">This product is currently out of stock.</span>
                      <p>Please check back later or contact us for availability updates.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
