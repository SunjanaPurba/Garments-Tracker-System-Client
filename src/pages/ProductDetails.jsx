

// import { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { Helmet } from "react-helmet-async";
// import {
//   FaHeart,
//   FaShare,
//   FaShoppingCart,
//   FaBox,
//   FaExclamationTriangle,
//   FaTag,
//   FaShippingFast,
// } from "react-icons/fa";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [wishlisted, setWishlisted] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   const API_URL =
//     import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server-wine.vercel.app";

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/products/${id}`);

//       if (response.data.success) {
//         setProduct(response.data.product);

//         if (user && response.data.product.wishlistedBy?.includes(user._id)) {
//           setWishlisted(true);
//         }

//         fetchRelatedProducts(response.data.product.category);
//       } else {
//         toast.error("Product not found");
//         navigate("/all-products");
//       }
//     } catch (error) {
//       console.error("Fetch product error:", error);
//       toast.error("Failed to load product");
//       navigate("/all-products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRelatedProducts = async (category) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/products/category/${category}?limit=4`
//       );

//       if (response.data.success) {
//         const filtered = response.data.products.filter((p) => p._id !== id);
//         setRelatedProducts(filtered.slice(0, 3));
//       }
//     } catch (error) {
//       console.error("Fetch related products error:", error);
//     }
//   };

//   const handleWishlistToggle = async () => {
//     if (!user) {
//       toast.error("Please login to add to wishlist");
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/products/${id}/wishlist`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access-token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         setWishlisted(response.data.isWishlisted);
//         toast.success(
//           response.data.isWishlisted
//             ? "Added to wishlist!"
//             : "Removed from wishlist"
//         );
//       }
//     } catch (error) {
//       console.error("Wishlist toggle error:", error);
//       toast.error("Failed to update wishlist");
//     }
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.title,
//         text: product.description.substring(0, 100),
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success("Link copied to clipboard!");
//     }
//   };

//   if (loading || authLoading) return <LoadingSpinner />;
//   if (!product)
//     return <div className="text-center py-20">Product not found</div>;

//   const isBuyer = user && user.role === "buyer";
//   const isInStock = product.quantity > 0;
//   const isLowStock = product.quantity > 0 && product.quantity <= 10;
//   const outOfStockText = !isInStock
//     ? "Out of Stock"
//     : isLowStock
//     ? `Only ${product.quantity} left!`
//     : `${product.quantity} available`;

//   return (
//     <div className="py-20 container mx-auto px-4">
//       <Helmet>
//         <title>{product.title} | GarmentPro</title>
//         <meta
//           name="description"
//           content={product.description.substring(0, 160)}
//         />
//       </Helmet>

//       {/* Breadcrumb */}
//       <div className="text-sm breadcrumbs mb-6">
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/all-products">Products</Link>
//           </li>
//           <li className="font-semibold">{product.title}</li>
//         </ul>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Left Column - Product Images */}
//         <div className="lg:w-1/2">
//           <div className="sticky top-24">
//             {/* Main Image */}
//             <div className="relative mb-4 rounded-xl overflow-hidden border">
//               <img
//                 src={product.images?.[selectedImage] || "/placeholder.jpg"}
//                 alt={product.title}
//                 className="w-full h-96 object-cover"
//                 onError={(e) => {
//                   e.target.src = "/placeholder.jpg";
//                   e.target.onerror = null;
//                 }}
//               />

//               {/* Stock Status Overlay */}
//               {!isInStock && (
//                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                   <div className="text-center text-white p-4">
//                     <FaExclamationTriangle className="text-5xl mx-auto mb-3 text-error" />
//                     <h3 className="text-2xl font-bold">Out of Stock</h3>
//                     <p className="mt-2">
//                       This product is currently unavailable
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="absolute top-4 right-4 flex flex-col gap-2">
//                 <button
//                   onClick={handleWishlistToggle}
//                   className={`btn btn-circle ${
//                     wishlisted
//                       ? "btn-error"
//                       : "btn-ghost bg-white/90 hover:bg-white"
//                   }`}
//                   title={
//                     wishlisted ? "Remove from Wishlist" : "Add to Wishlist"
//                   }
//                 >
//                   <FaHeart
//                     className={wishlisted ? "text-white" : "text-gray-700"}
//                   />
//                 </button>

//                 <button
//                   onClick={handleShare}
//                   className="btn btn-circle btn-ghost bg-white/90 hover:bg-white"
//                   title="Share Product"
//                 >
//                   <FaShare className="text-gray-700" />
//                 </button>
//               </div>
//             </div>

//             {/* Thumbnail Gallery */}
//             {product.images && product.images.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto pb-2">
//                 {product.images.map((img, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
//                       selectedImage === index
//                         ? "border-primary"
//                         : "border-transparent"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`${product.title} ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Column - Product Details */}
//         <div className="lg:w-1/2">
//           <div className="bg-base-100 rounded-xl p-6 shadow-lg border">
//             <div className="flex justify-between items-start mb-4">
//               <h1 className="text-3xl font-bold">{product.title}</h1>

//               {/* Stock Status Badge */}
//               <div
//                 className={`badge badge-lg ${
//                   !isInStock
//                     ? "badge-error"
//                     : isLowStock
//                     ? "badge-warning"
//                     : "badge-success"
//                 }`}
//               >
//                 <FaBox className="mr-2" />
//                 {outOfStockText}
//               </div>
//             </div>

//             {/* Category and Tags */}
//             <div className="flex items-center gap-2 mb-6">
//               <span className="badge badge-primary">
//                 <FaTag className="mr-1" />
//                 {product.category?.charAt(0).toUpperCase() +
//                   product.category?.slice(1)}
//               </span>
//               <span className="text-gray-500">•</span>
//               <span className="text-gray-600">
//                 Added {new Date(product.createdAt).toLocaleDateString()}
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="mb-6 p-4 bg-base-200 rounded-lg">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="text-4xl font-bold text-primary">
//                     ${product.price}
//                   </div>
//                   <p className="text-gray-600 mt-1">per unit</p>
//                 </div>

//                 {/* Stock Warning */}
//                 {isLowStock && (
//                   <div className="alert alert-warning shadow-lg">
//                     <div>
//                       <FaExclamationTriangle />
//                       <span>Low stock! Only {product.quantity} units left</span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Stock Progress */}
//               {isInStock && (
//                 <div className="mt-4">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="font-medium">Stock Level</span>
//                     <span>{product.quantity} of 100 units remaining</span>
//                   </div>
//                   <progress
//                     className={`progress w-full ${
//                       product.quantity <= 10
//                         ? "progress-warning"
//                         : product.quantity <= 30
//                         ? "progress-info"
//                         : "progress-success"
//                     }`}
//                     value={product.quantity}
//                     max="100"
//                   ></progress>
//                 </div>
//               )}
//             </div>

//             {/* Product Details Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//               <div className="stat bg-base-200 rounded-lg p-4">
//                 <div className="stat-title">Available Quantity</div>
//                 <div
//                   className={`stat-value ${
//                     !isInStock
//                       ? "text-error"
//                       : isLowStock
//                       ? "text-warning"
//                       : "text-success"
//                   }`}
//                 >
//                   {product.quantity}
//                 </div>
//                 <div className="stat-desc">units</div>
//               </div>

//               <div className="stat bg-base-200 rounded-lg p-4">
//                 <div className="stat-title">Minimum Order</div>
//                 <div className="stat-value">{product.minOrder}</div>
//                 <div className="stat-desc">units required</div>
//               </div>

//               <div className="stat bg-base-200 rounded-lg p-4">
//                 <div className="stat-title">Payment Options</div>
//                 <div className="stat-value text-lg capitalize">
//                   {product.paymentOptions === "cashOnDelivery"
//                     ? "Cash on Delivery"
//                     : "Pay First"}
//                 </div>
//               </div>

//               <div className="stat bg-base-200 rounded-lg p-4">
//                 <div className="stat-title">Category</div>
//                 <div className="stat-value text-lg capitalize">
//                   {product.category}
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mb-8">
//               <h3 className="font-bold text-xl mb-4">Description</h3>
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 whitespace-pre-line">
//                   {product.description}
//                 </p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-8 space-y-4">
//               {user ? (
//                 isBuyer ? (
//                   isInStock ? (
//                     <>
//                       {/* সরাসরি Booking পেজে লিঙ্ক */}
//                       <Link
//                         to={`/booking/${product._id}`}
//                         className="btn btn-primary btn-lg w-full"
//                       >
//                         <FaShoppingCart className="mr-2" />
//                         Order Now / Book Product
//                       </Link>

//                       {/* Quick Info */}
//                       <div className="alert alert-info">
//                         <FaShippingFast />
//                         <div>
//                           <span className="font-bold">Shipping:</span>
//                           <span className="ml-2">
//                             Estimated delivery 5-7 business days
//                           </span>
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="space-y-4">
//                       <button className="btn btn-error btn-lg w-full btn-disabled">
//                         <FaBox className="mr-2" />
//                         Out of Stock
//                       </button>

//                       <div className="alert alert-warning">
//                         <FaExclamationTriangle />
//                         <div>
//                           <span className="font-bold">
//                             This product is currently out of stock.
//                           </span>
//                           <p className="text-sm mt-1">
//                             Check back later or contact us for restock updates.
//                           </p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() =>
//                           toast.info(
//                             "We will notify you when this product is back in stock"
//                           )
//                         }
//                         className="btn btn-outline w-full"
//                       >
//                         Notify Me When Available
//                       </button>
//                     </div>
//                   )
//                 ) : (
//                   <div className="alert alert-warning">
//                     <div>
//                       <span>
//                         {user.role === "admin" ? "Admin" : "Manager"} cannot
//                         place orders.
//                         {user.role === "manager" && (
//                           <Link
//                             to={`/dashboard/manage-products/${product._id}/edit`}
//                             className="link link-primary ml-2"
//                           >
//                             Edit this product
//                           </Link>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 )
//               ) : (
//                 <div className="space-y-4">
//                   <p className="text-lg text-center">
//                     Please{" "}
//                     <Link
//                       to="/login"
//                       className="link link-primary font-semibold"
//                     >
//                       login
//                     </Link>{" "}
//                     to place an order.
//                   </p>
//                   <div className="flex gap-4">
//                     <Link
//                       to="/login"
//                       state={{ from: `/booking/${product._id}` }}
//                       className="btn btn-primary btn-lg flex-1"
//                     >
//                       Login to Order
//                     </Link>
//                     <Link
//                       to="/register"
//                       className="btn btn-outline btn-lg flex-1"
//                     >
//                       Register
//                     </Link>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Additional Information */}
//             <div className="mt-8 pt-6 border-t">
//               <h3 className="font-bold text-lg mb-4">Product Information</h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Product ID:</span>
//                   <span className="font-medium ml-2">{product._id}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Created By:</span>
//                   <span className="font-medium ml-2">
//                     {product.createdBy?.name || "Admin"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Last Updated:</span>
//                   <span className="font-medium ml-2">
//                     {new Date(product.updatedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Featured:</span>
//                   <span
//                     className={`badge ml-2 ${
//                       product.showOnHome ? "badge-success" : "badge-ghost"
//                     }`}
//                   >
//                     {product.showOnHome ? "Yes" : "No"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-16">
//           <h2 className="text-2xl font-bold mb-8">Related Products</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {relatedProducts.map((relatedProduct) => {
//               const isRelatedInStock = relatedProduct.quantity > 0;

//               return (
//                 <div
//                   key={relatedProduct._id}
//                   className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
//                 >
//                   <figure className="h-48 relative">
//                     <img
//                       src={relatedProduct.images?.[0] || "/placeholder.jpg"}
//                       alt={relatedProduct.title}
//                       className="w-full h-full object-cover"
//                     />
//                     {!isRelatedInStock && (
//                       <div className="absolute inset-0 bg-black/40"></div>
//                     )}
//                     <div className="absolute top-2 right-2">
//                       <span
//                         className={`badge ${
//                           isRelatedInStock ? "badge-success" : "badge-error"
//                         }`}
//                       >
//                         {isRelatedInStock ? "In Stock" : "Out of Stock"}
//                       </span>
//                     </div>
//                   </figure>
//                   <div className="card-body p-4">
//                     <h3 className="card-title text-sm font-bold">
//                       {relatedProduct.title}
//                     </h3>
//                     <p className="text-primary font-bold">
//                       ${relatedProduct.price}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {isRelatedInStock
//                         ? `${relatedProduct.quantity} units available`
//                         : "Not available"}
//                     </p>
//                     <div className="card-actions justify-end mt-2">
//                       <Link
//                         to={`/products/${relatedProduct._id}`}
//                         className={`btn btn-sm ${
//                           isRelatedInStock
//                             ? "btn-primary"
//                             : "btn-error btn-disabled"
//                         }`}
//                       >
//                         View Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;


import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet-async";
import {
  FaHeart,
  FaShare,
  FaShoppingCart,
  FaBox,
  FaExclamationTriangle,
  FaTag,
  FaShippingFast,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // FIXED: Use the correct base URL
 const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server.onrender.com";

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log("Fetching product from:", `${API_URL}/api/products/${id}`);
      
      const response = await axios.get(`${API_URL}/api/products/${id}`);

      if (response.data.success) {
        setProduct(response.data.product);

        if (user && response.data.product.wishlistedBy?.includes(user._id)) {
          setWishlisted(true);
        }

        fetchRelatedProducts(response.data.product.category);
      } else {
        toast.error("Product not found");
        navigate("/all-products");
      }
    } catch (error) {
      console.error("Fetch product error:", error);
      toast.error("Failed to load product");
      navigate("/all-products");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/products/category/${category}?limit=4`
      );

      if (response.data.success) {
        const filtered = response.data.products.filter((p) => p._id !== id);
        setRelatedProducts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Fetch related products error:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("access-token");
      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/products/${id}/wishlist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setWishlisted(response.data.isWishlisted);
        toast.success(
          response.data.isWishlisted
            ? "Added to wishlist!"
            : "Removed from wishlist"
        );
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description.substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading || authLoading) return <LoadingSpinner />;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  const isBuyer = user && user.role === "buyer";
  const isInStock = product.quantity > 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const outOfStockText = !isInStock
    ? "Out of Stock"
    : isLowStock
    ? `Only ${product.quantity} left!`
    : `${product.quantity} available`;

  return (
    <div className="py-20 container mx-auto px-4">
      <Helmet>
        <title>{product.title} | GarmentPro</title>
        <meta
          name="description"
          content={product.description.substring(0, 160)}
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/all-products">Products</Link>
          </li>
          <li className="font-semibold">{product.title}</li>
        </ul>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Product Images */}
        <div className="lg:w-1/2">
          <div className="sticky top-24">
            {/* Main Image */}
            <div className="relative mb-4 rounded-xl overflow-hidden border">
              <img
                src={product.images?.[selectedImage] || "/placeholder.jpg"}
                alt={product.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                  e.target.onerror = null;
                }}
              />

              {/* Stock Status Overlay */}
              {!isInStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <FaExclamationTriangle className="text-5xl mx-auto mb-3 text-error" />
                    <h3 className="text-2xl font-bold">Out of Stock</h3>
                    <p className="mt-2">
                      This product is currently unavailable
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`btn btn-circle ${
                    wishlisted
                      ? "btn-error"
                      : "btn-ghost bg-white/90 hover:bg-white"
                  }`}
                  title={
                    wishlisted ? "Remove from Wishlist" : "Add to Wishlist"
                  }
                >
                  <FaHeart
                    className={wishlisted ? "text-white" : "text-gray-700"}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="btn btn-circle btn-ghost bg-white/90 hover:bg-white"
                  title="Share Product"
                >
                  <FaShare className="text-gray-700" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:w-1/2">
          <div className="bg-base-100 rounded-xl p-6 shadow-lg border">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>

              {/* Stock Status Badge */}
              <div
                className={`badge badge-lg ${
                  !isInStock
                    ? "badge-error"
                    : isLowStock
                    ? "badge-warning"
                    : "badge-success"
                }`}
              >
                <FaBox className="mr-2" />
                {outOfStockText}
              </div>
            </div>

            {/* Category and Tags */}
            <div className="flex items-center gap-2 mb-6">
              <span className="badge badge-primary">
                <FaTag className="mr-1" />
                {product.category?.charAt(0).toUpperCase() +
                  product.category?.slice(1)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">
                Added {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-6 p-4 bg-base-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold text-primary">
                    ${product.price}
                  </div>
                  <p className="text-gray-600 mt-1">per unit</p>
                </div>

                {/* Stock Warning */}
                {isLowStock && (
                  <div className="alert alert-warning shadow-lg">
                    <div>
                      <FaExclamationTriangle />
                      <span>Low stock! Only {product.quantity} units left</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Progress */}
              {isInStock && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Stock Level</span>
                    <span>{product.quantity} of 100 units remaining</span>
                  </div>
                  <progress
                    className={`progress w-full ${
                      product.quantity <= 10
                        ? "progress-warning"
                        : product.quantity <= 30
                        ? "progress-info"
                        : "progress-success"
                    }`}
                    value={product.quantity}
                    max="100"
                  ></progress>
                </div>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Available Quantity</div>
                <div
                  className={`stat-value ${
                    !isInStock
                      ? "text-error"
                      : isLowStock
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {product.quantity}
                </div>
                <div className="stat-desc">units</div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Minimum Order</div>
                <div className="stat-value">{product.minOrder}</div>
                <div className="stat-desc">units required</div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Payment Options</div>
                <div className="stat-value text-lg capitalize">
                  {product.paymentOptions === "cashOnDelivery"
                    ? "Cash on Delivery"
                    : "Pay First"}
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-4">
                <div className="stat-title">Category</div>
                <div className="stat-value text-lg capitalize">
                  {product.category}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-bold text-xl mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {user ? (
                isBuyer ? (
                  isInStock ? (
                    <>
                      {/* সরাসরি Booking পেজে লিঙ্ক */}
                      <Link
                        to={`/booking/${product._id}`}
                        className="btn btn-primary btn-lg w-full"
                      >
                        <FaShoppingCart className="mr-2" />
                        Order Now / Book Product
                      </Link>

                      {/* Quick Info */}
                      <div className="alert alert-info">
                        <FaShippingFast />
                        <div>
                          <span className="font-bold">Shipping:</span>
                          <span className="ml-2">
                            Estimated delivery 5-7 business days
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <button className="btn btn-error btn-lg w-full btn-disabled">
                        <FaBox className="mr-2" />
                        Out of Stock
                      </button>

                      <div className="alert alert-warning">
                        <FaExclamationTriangle />
                        <div>
                          <span className="font-bold">
                            This product is currently out of stock.
                          </span>
                          <p className="text-sm mt-1">
                            Check back later or contact us for restock updates.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          toast.info(
                            "We will notify you when this product is back in stock"
                          )
                        }
                        className="btn btn-outline w-full"
                      >
                        Notify Me When Available
                      </button>
                    </div>
                  )
                ) : (
                  <div className="alert alert-warning">
                    <div>
                      <span>
                        {user.role === "admin" ? "Admin" : "Manager"} cannot
                        place orders.
                        {user.role === "manager" && (
                          <Link
                            to={`/dashboard/manage-products/${product._id}/edit`}
                            className="link link-primary ml-2"
                          >
                            Edit this product
                          </Link>
                        )}
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-center">
                    Please{" "}
                    <Link
                      to="/login"
                      className="link link-primary font-semibold"
                    >
                      login
                    </Link>{" "}
                    to place an order.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to="/login"
                      state={{ from: `/booking/${product._id}` }}
                      className="btn btn-primary btn-lg flex-1"
                    >
                      Login to Order
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-outline btn-lg flex-1"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-bold text-lg mb-4">Product Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-medium ml-2">{product._id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created By:</span>
                  <span className="font-medium ml-2">
                    {product.createdBy?.name || "Admin"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium ml-2">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Featured:</span>
                  <span
                    className={`badge ml-2 ${
                      product.showOnHome ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {product.showOnHome ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const isRelatedInStock = relatedProduct.quantity > 0;

              return (
                <div
                  key={relatedProduct._id}
                  className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                >
                  <figure className="h-48 relative">
                    <img
                      src={relatedProduct.images?.[0] || "/placeholder.jpg"}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                    {!isRelatedInStock && (
                      <div className="absolute inset-0 bg-black/40"></div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`badge ${
                          isRelatedInStock ? "badge-success" : "badge-error"
                        }`}
                      >
                        {isRelatedInStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm font-bold">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-primary font-bold">
                      ${relatedProduct.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isRelatedInStock
                        ? `${relatedProduct.quantity} units available`
                        : "Not available"}
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <Link
                        to={`/products/${relatedProduct._id}`}
                        className={`btn btn-sm ${
                          isRelatedInStock
                            ? "btn-primary"
                            : "btn-error btn-disabled"
                        }`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
