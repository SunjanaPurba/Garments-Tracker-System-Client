// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';
// import LoadingSpinner from '../components/LoadingSpinner';
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
//   FaTimesCircle
// } from 'react-icons/fa';

// const Booking = () => {
//   const { productId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [availableQuantity, setAvailableQuantity] = useState(0);
//   const [quantity, setQuantity] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');

//   const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:5000';

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       contactNumber: '',
//       deliveryAddress: '',
//       additionalNotes: '',
//       orderQuantity: 0
//     }
//   });

//   // Watch quantity for real-time calculation
//   const watchQuantity = watch('orderQuantity');

//   // Fetch product details
//   useEffect(() => {
//     if (!productId) {
//       toast.error('Product not specified');
//       navigate('/all-products');
//       return;
//     }

//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_URL}/products/${productId}`);

//         if (response.data.success && response.data.product) {
//           const productData = response.data.product;
//           setProduct(productData);
//           setAvailableQuantity(productData.quantity);

//           // Set default quantity to minimum order quantity
//           const minQty = productData.minOrder || 1;
//           setQuantity(minQty);
//           setValue('orderQuantity', minQty);

//           // Calculate initial total price
//           const initialPrice = minQty * productData.price;
//           setTotalPrice(initialPrice);
//         } else {
//           toast.error('Product not found');
//           navigate('/all-products');
//         }
//       } catch (error) {
//         console.error('Fetch product error:', error);
//         toast.error('Failed to load product details');
//         navigate('/all-products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId, navigate, setValue, API_URL]);

//   // Update total price when quantity changes
//   useEffect(() => {
//     if (product && watchQuantity) {
//       const qty = parseInt(watchQuantity) || 0;
//       const newTotal = qty * product.price;
//       setTotalPrice(newTotal);
//     }
//   }, [watchQuantity, product]);

//   // Handle quantity input changes with validation
//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value) || 0;
//     const minQty = product?.minOrder || 1;

//     if (value < minQty) {
//       toast.warning(`Minimum order quantity is ${minQty} units`);
//       setQuantity(minQty);
//       setValue('orderQuantity', minQty);
//     } else if (value > availableQuantity) {
//       toast.warning(`Maximum ${availableQuantity} units available`);
//       setQuantity(availableQuantity);
//       setValue('orderQuantity', availableQuantity);
//     } else {
//       setQuantity(value);
//       setValue('orderQuantity', value);
//     }
//   };

//   // Handle increment/decrement
//   const incrementQuantity = () => {
//     const newQuantity = quantity + 1;
//     if (newQuantity <= availableQuantity) {
//       setQuantity(newQuantity);
//       setValue('orderQuantity', newQuantity);
//     } else {
//       toast.warning(`Only ${availableQuantity} units available`);
//     }
//   };

//   const decrementQuantity = () => {
//     const minQty = product?.minOrder || 1;
//     const newQuantity = quantity - 1;
//     if (newQuantity >= minQty) {
//       setQuantity(newQuantity);
//       setValue('orderQuantity', newQuantity);
//     } else {
//       toast.warning(`Minimum order quantity is ${minQty} units`);
//     }
//   };

//   // Form submission handler
//   const onSubmit = async (formData) => {
//     if (!user) {
//       toast.error('Please login to place an order');
//       navigate('/login', { state: { from: `/booking/${productId}` } });
//       return;
//     }

//     // Check if user is buyer (not admin or manager)
//     if (user.role !== 'buyer') {
//       toast.error('Only buyers can place orders');
//       return;
//     }

//     // Validate quantity
//     const orderQty = parseInt(formData.orderQuantity) || 0;
//     const minQty = product?.minOrder || 1;

//     if (orderQty < minQty) {
//       toast.error(`Minimum order quantity is ${minQty} units`);
//       return;
//     }

//     if (orderQty > availableQuantity) {
//       toast.error(`Only ${availableQuantity} units available`);
//       return;
//     }

//     // Prepare order data
//     const orderData = {
//       productId: product._id,
//       productTitle: product.title,
//       productPrice: product.price,
//       orderQuantity: orderQty,
//       totalPrice: totalPrice,
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: user.email,
//       contactNumber: formData.contactNumber,
//       deliveryAddress: formData.deliveryAddress,
//       additionalNotes: formData.additionalNotes,
//       paymentMethod: paymentMethod,
//       paymentOptions: product.paymentOptions,
//       buyerId: user._id,
//       buyerName: user.name
//     };

//     console.log('Order Data:', orderData);
//     setSubmitting(true);

//     try {
//       // Check payment method
//       if (product.paymentOptions === 'advancePayment' || product.paymentOptions === 'partialPayment') {
//         // Redirect to payment page
//         // You can implement Stripe/PayFast integration here
//         toast.info('Redirecting to payment gateway...');

//         // For now, create order with pending payment status
//         const response = await axios.post(
//           `${API_URL}/orders/create`,
//           {
//             ...orderData,
//             paymentStatus: 'pending',
//             orderStatus: 'pending_payment'
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//           }
//         );

//         if (response.data.success) {
//           // Redirect to payment page with order ID
//           navigate(`/payment/${response.data.order._id}`, {
//             state: { orderData: response.data.order }
//           });
//         }
//       } else {
//         // Cash on Delivery - create order directly
//         const response = await axios.post(
//           `${API_URL}/orders/create`,
//           {
//             ...orderData,
//             paymentStatus: 'pending',
//             orderStatus: 'confirmed'
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//             }
//           }
//         );

//         if (response.data.success) {
//           toast.success('Order placed successfully! You will pay on delivery.');
//           navigate('/dashboard/my-orders');
//         }
//       }
//     } catch (error) {
//       console.error('Order submission error:', error);
//       toast.error(
//         error.response?.data?.message ||
//         'Failed to place order. Please try again.'
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!product) return <div className="text-center py-20">Product not found</div>;

//   // Check if order button should be enabled
//   const isOrderValid = quantity >= (product.minOrder || 1) &&
//                        quantity <= availableQuantity;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Page Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(`/products/${productId}`)}
//             className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
//           >
//             ← Back to Product
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Place Your Order
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Complete the form below to order <span className="font-semibold">{product.title}</span>
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column: Order Summary */}
//           <div className="space-y-6">
//             {/* Product Summary Card */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <FaBox />
//                 Product Summary
//               </h2>

//               <div className="space-y-4">
//                 {/* Product Image */}
//                 {product.images && product.images.length > 0 && (
//                   <div className="rounded-lg overflow-hidden">
//                     <img
//                       src={product.images[0]}
//                       alt={product.title}
//                       className="w-full h-48 object-cover"
//                     />
//                   </div>
//                 )}

//                 {/* Product Details */}
//                 <div className="space-y-3">
//                   <div>
//                     <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
//                     <p className="text-gray-600 text-sm">{product.description?.substring(0, 100)}...</p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="space-y-1">
//                       <p className="text-gray-500">Category</p>
//                       <p className="font-medium capitalize">{product.category}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-gray-500">Available Stock</p>
//                       <p className={`font-medium ${
//                         availableQuantity > 10 ? 'text-green-600' :
//                         availableQuantity > 0 ? 'text-yellow-600' : 'text-red-600'
//                       }`}>
//                         {availableQuantity} units
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary Card */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <FaCalculator />
//                 Order Summary
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Unit Price</span>
//                   <span className="font-bold text-lg">${product.price}</span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Order Quantity</span>
//                   <span className="font-bold text-lg">{quantity} units</span>
//                 </div>

//                 <div className="border-t pt-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Total Amount</span>
//                     <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {quantity} × ${product.price} = ${totalPrice.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Info Card */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <FaCreditCard />
//                 Payment Information
//               </h2>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method</span>
//                   <span className="font-medium">
//                     {product.paymentOptions === 'cashOnDelivery' ? 'Cash on Delivery' :
//                      product.paymentOptions === 'advancePayment' ? 'Advance Payment' :
//                      'Partial Payment (50% Advance)'}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Required Action</span>
//                   <span className={`font-medium ${
//                     product.paymentOptions === 'cashOnDelivery' ? 'text-green-600' : 'text-blue-600'
//                   }`}>
//                     {product.paymentOptions === 'cashOnDelivery'
//                       ? 'Pay on Delivery'
//                       : 'Pay Now'}
//                   </span>
//                 </div>

//                 {product.paymentOptions !== 'cashOnDelivery' && (
//                   <div className="bg-blue-50 p-3 rounded-lg">
//                     <p className="text-sm text-blue-700">
//                       {product.paymentOptions === 'advancePayment'
//                         ? 'Full payment required before order processing.'
//                         : '50% advance payment required, remaining on delivery.'}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Order Form */}
//           <div className="space-y-6">
//             {/* Order Form Card */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">
//                 Order Details
//               </h2>

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Read-only Fields Section */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-700 mb-2">Product Information</h3>

//                   {/* Email (auto-filled) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaEnvelope className="inline mr-2" />
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={user?.email || ''}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
//                   </div>

//                   {/* Product Title (read-only) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaBox className="inline mr-2" />
//                       Product
//                     </label>
//                     <input
//                       type="text"
//                       value={product.title}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
//                     />
//                   </div>

//                   {/* Price (read-only) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaDollarSign className="inline mr-2" />
//                       Unit Price
//                     </label>
//                     <input
//                       type="text"
//                       value={`$${product.price} per unit`}
//                       readOnly
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 {/* Order Quantity Section */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Order Quantity *
//                   </label>

//                   <div className="space-y-4">
//                     {/* Quantity Controls */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <button
//                           type="button"
//                           onClick={decrementQuantity}
//                           disabled={quantity <= (product.minOrder || 1)}
//                           className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <span className="text-xl">-</span>
//                         </button>

//                         <div className="text-center">
//                           <input
//                             type="number"
//                             {...register('orderQuantity', {
//                               required: 'Order quantity is required',
//                               min: {
//                                 value: product.minOrder || 1,
//                                 message: `Minimum order is ${product.minOrder || 1} units`
//                               },
//                               max: {
//                                 value: availableQuantity,
//                                 message: `Maximum ${availableQuantity} units available`
//                               },
//                               onChange: handleQuantityChange
//                             })}
//                             className="w-24 text-center text-2xl font-bold border-0 focus:ring-0"
//                             min={product.minOrder || 1}
//                             max={availableQuantity}
//                           />
//                           <div className="text-sm text-gray-500">units</div>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={incrementQuantity}
//                           disabled={quantity >= availableQuantity}
//                           className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <span className="text-xl">+</span>
//                         </button>
//                       </div>

//                       {/* Quick Actions */}
//                       <div className="flex gap-2">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setQuantity(product.minOrder || 1);
//                             setValue('orderQuantity', product.minOrder || 1);
//                           }}
//                           className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
//                         >
//                           Min ({product.minOrder || 1})
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setQuantity(availableQuantity);
//                             setValue('orderQuantity', availableQuantity);
//                           }}
//                           className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
//                         >
//                           Max ({availableQuantity})
//                         </button>
//                       </div>
//                     </div>

//                     {/* Quantity Info */}
//                     <div className="flex justify-between text-sm">
//                       <span className={`${
//                         quantity === (product.minOrder || 1)
//                           ? 'text-orange-600 font-medium'
//                           : 'text-gray-600'
//                       }`}>
//                         Min: {product.minOrder || 1} units
//                       </span>
//                       <span className={`${
//                         quantity === availableQuantity
//                           ? 'text-orange-600 font-medium'
//                           : 'text-gray-600'
//                       }`}>
//                         Max: {availableQuantity} units
//                       </span>
//                     </div>

//                     {errors.orderQuantity && (
//                       <p className="text-red-600 text-sm">{errors.orderQuantity.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Calculated Total Price (read-only) */}
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium text-gray-700">Total Order Value</span>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</div>
//                       <p className="text-sm text-gray-600">
//                         {quantity} units × ${product.price}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information Section */}
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* First Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         <FaUser className="inline mr-2" />
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         {...register('firstName', {
//                           required: 'First name is required',
//                           minLength: {
//                             value: 2,
//                             message: 'First name must be at least 2 characters'
//                           }
//                         })}
//                         className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                           errors.firstName ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         placeholder="Enter your first name"
//                       />
//                       {errors.firstName && (
//                         <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
//                       )}
//                     </div>

//                     {/* Last Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         {...register('lastName', {
//                           required: 'Last name is required',
//                           minLength: {
//                             value: 2,
//                             message: 'Last name must be at least 2 characters'
//                           }
//                         })}
//                         className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                           errors.lastName ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                         placeholder="Enter your last name"
//                       />
//                       {errors.lastName && (
//                         <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Contact Number */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaPhone className="inline mr-2" />
//                       Contact Number *
//                     </label>
//                     <input
//                       type="tel"
//                       {...register('contactNumber', {
//                         required: 'Contact number is required',
//                         pattern: {
//                           value: /^[0-9+\-\s()]{10,}$/,
//                           message: 'Enter a valid phone number'
//                         }
//                       })}
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.contactNumber ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter your phone number"
//                     />
//                     {errors.contactNumber && (
//                       <p className="text-red-600 text-sm mt-1">{errors.contactNumber.message}</p>
//                     )}
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaMapMarkerAlt className="inline mr-2" />
//                       Delivery Address *
//                     </label>
//                     <textarea
//                       {...register('deliveryAddress', {
//                         required: 'Delivery address is required',
//                         minLength: {
//                           value: 10,
//                           message: 'Address must be at least 10 characters'
//                         }
//                       })}
//                       rows={3}
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter complete delivery address (street, city, zip code)"
//                     />
//                     {errors.deliveryAddress && (
//                       <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.message}</p>
//                     )}
//                   </div>

//                   {/* Additional Notes */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       <FaStickyNote className="inline mr-2" />
//                       Additional Notes / Instructions
//                     </label>
//                     <textarea
//                       {...register('additionalNotes')}
//                       rows={3}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Any special instructions, delivery preferences, or notes..."
//                     />
//                   </div>
//                 </div>

//                 {/* Payment Method Selection (if applicable) */}
//                 {product.paymentOptions !== 'cashOnDelivery' && (
//                   <div className="border-t pt-6">
//                     <h3 className="font-semibold text-gray-700 mb-4">Select Payment Method</h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <label className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                         paymentMethod === 'stripe'
//                           ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                           : 'border-gray-300 hover:bg-gray-50'
//                       }`}>
//                         <input
//                           type="radio"
//                           name="paymentMethod"
//                           value="stripe"
//                           checked={paymentMethod === 'stripe'}
//                           onChange={(e) => setPaymentMethod(e.target.value)}
//                           className="mr-2"
//                         />
//                         <div>
//                           <div className="font-medium">Stripe</div>
//                           <div className="text-sm text-gray-600">Credit/Debit Card</div>
//                         </div>
//                       </label>

//                       <label className={`border rounded-lg p-4 cursor-pointer transition-all ${
//                         paymentMethod === 'payfast'
//                           ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                           : 'border-gray-300 hover:bg-gray-50'
//                       }`}>
//                         <input
//                           type="radio"
//                           name="paymentMethod"
//                           value="payfast"
//                           checked={paymentMethod === 'payfast'}
//                           onChange={(e) => setPaymentMethod(e.target.value)}
//                           className="mr-2"
//                         />
//                         <div>
//                           <div className="font-medium">PayFast</div>
//                           <div className="text-sm text-gray-600">Online Payment</div>
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="pt-6 border-t">
//                   <button
//                     type="submit"
//                     disabled={submitting || !isOrderValid || user?.role !== 'buyer'}
//                     className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
//                       submitting || !isOrderValid || user?.role !== 'buyer'
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {submitting ? (
//                       <span className="flex items-center justify-center">
//                         <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
//                         Processing...
//                       </span>
//                     ) : product.paymentOptions === 'cashOnDelivery' ? (
//                       'Place Order (Cash on Delivery)'
//                     ) : (
//                       `Proceed to Payment - $${totalPrice.toFixed(2)}`
//                     )}
//                   </button>

//                   {/* Validation Messages */}
//                   <div className="mt-4 space-y-2">
//                     {user?.role !== 'buyer' && (
//                       <div className="flex items-center gap-2 text-red-600">
//                         <FaTimesCircle />
//                         <span>Only buyer accounts can place orders</span>
//                       </div>
//                     )}

//                     {!isOrderValid && (
//                       <div className="flex items-center gap-2 text-orange-600">
//                         <FaTimesCircle />
//                         <span>Please enter a valid quantity</span>
//                       </div>
//                     )}

//                     {isOrderValid && user?.role === 'buyer' && (
//                       <div className="flex items-center gap-2 text-green-600">
//                         <FaCheckCircle />
//                         <span>Order is ready to be placed</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </form>
//             </div>

//             {/* Terms and Conditions */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-700 mb-2">Terms & Conditions</h4>
//               <ul className="text-sm text-gray-600 space-y-1">
//                 <li>• Order quantity cannot exceed available stock ({availableQuantity} units)</li>
//                 <li>• Minimum order quantity is {product.minOrder || 1} units</li>
//                 <li>• Delivery time: 3-7 business days</li>
//                 <li>• Payment method: {product.paymentOptions === 'cashOnDelivery'
//                   ? 'Cash on Delivery'
//                   : product.paymentOptions === 'advancePayment'
//                   ? 'Advance payment required'
//                   : '50% advance, 50% on delivery'}</li>
//                 <li>• Returns accepted within 7 days of delivery</li>
//               </ul>
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
  FaEnvelope,
  FaBox,
  FaDollarSign,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaStickyNote,
  FaCreditCard,
  FaMoneyBillWave,
  FaCalculator,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
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
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");

  const API_URL =
    import.meta.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5000";

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
      orderQuantity: 0,
    },
  });

  const watchQuantity = watch("orderQuantity");

  // Check authentication and user role
  useEffect(() => {
    if (!user) {
      toast.error("Please login to book a product");
      navigate("/login", {
        state: { from: `/booking/${productId}` },
      });
      return;
    }

    if (user.role !== "buyer") {
      toast.error("Only buyers can place orders");
      navigate("/all-products");
    }
  }, [user, navigate, productId]);

  // Fetch product details
  useEffect(() => {
    if (!productId) {
      toast.error("Product not specified");
      navigate("/all-products");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access-token");
        const response = await axios.get(`${API_URL}/products/${productId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.data.success && response.data.product) {
          const productData = response.data.product;
          setProduct(productData);
          setAvailableQuantity(productData.quantity);

          // Set default quantity to minimum order quantity
          const minQty = productData.minOrder || 1;
          setQuantity(minQty);
          setValue("orderQuantity", minQty);

          // Calculate initial total price
          const initialPrice = minQty * productData.price;
          setTotalPrice(initialPrice);
        } else {
          toast.error("Product not found");
          navigate("/all-products");
        }
      } catch (error) {
        console.error("Fetch product error:", error);
        toast.error("Failed to load product details");
        navigate("/all-products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate, setValue, API_URL]);

  // Update total price when quantity changes
  useEffect(() => {
    if (product && watchQuantity) {
      const qty = parseInt(watchQuantity) || 0;
      const newTotal = qty * product.price;
      setTotalPrice(newTotal);
    }
  }, [watchQuantity, product]);

  // Handle quantity input changes with validation
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const minQty = product?.minOrder || 1;

    if (value < minQty) {
      toast.warning(`Minimum order quantity is ${minQty} units`);
      setQuantity(minQty);
      setValue("orderQuantity", minQty);
    } else if (value > availableQuantity) {
      toast.warning(`Maximum ${availableQuantity} units available`);
      setQuantity(availableQuantity);
      setValue("orderQuantity", availableQuantity);
    } else {
      setQuantity(value);
      setValue("orderQuantity", value);
    }
  };

  // Handle increment/decrement
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= availableQuantity) {
      setQuantity(newQuantity);
      setValue("orderQuantity", newQuantity);
    } else {
      toast.warning(`Only ${availableQuantity} units available`);
    }
  };

  const decrementQuantity = () => {
    const minQty = product?.minOrder || 1;
    const newQuantity = quantity - 1;
    if (newQuantity >= minQty) {
      setQuantity(newQuantity);
      setValue("orderQuantity", newQuantity);
    } else {
      toast.warning(`Minimum order quantity is ${minQty} units`);
    }
  };

  // Form submission handler - FIXED VERSION
  const onSubmit = async (formData) => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login", { state: { from: `/booking/${productId}` } });
      return;
    }

    // Check if user is buyer
    if (user.role !== "buyer") {
      toast.error("Only buyers can place orders");
      return;
    }

    // Validate quantity
    const orderQty = parseInt(formData.orderQuantity) || 0;
    const minQty = product?.minOrder || 1;

    if (orderQty < minQty) {
      toast.error(`Minimum order quantity is ${minQty} units`);
      return;
    }

    if (orderQty > availableQuantity) {
      toast.error(`Only ${availableQuantity} units available`);
      return;
    }

    // Prepare order data according to your backend schema
    const orderData = {
      productId: product._id,
      productTitle: product.title,
      productPrice: product.price,
      quantity: orderQty, // Note: using 'quantity' not 'orderQuantity'
      totalPrice: totalPrice,
      buyerName: `${formData.firstName} ${formData.lastName}`,
      email: user.email,
      phone: formData.contactNumber,
      shippingAddress: formData.deliveryAddress,
      notes: formData.additionalNotes,
      paymentMethod: paymentMethod,
      paymentType: product.paymentOptions,
      buyerId: user._id,
      productImage: product.images?.[0] || "",
      productCategory: product.category,
      // Status will be set by backend based on payment type
    };

    console.log("Order Data to send:", orderData);
    console.log("API URL:", `${API_URL}/orders`);

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access-token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      // 🔴 IMPORTANT: Use POST /orders (not /orders/create)
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Server Response:", response.data);

      if (response.data.success) {
        toast.success("Order placed successfully!");

        // Update product stock locally
        setAvailableQuantity((prev) => prev - orderQty);

        // If it's advance payment, redirect to payment page
        if (
          product.paymentOptions === "advancePayment" ||
          product.paymentOptions === "partialPayment"
        ) {
          navigate(`/payment/${response.data.order._id}`, {
            state: {
              order: response.data.order,
              totalAmount: totalPrice,
            },
          });
        } else {
          // For cash on delivery, redirect to orders page
          navigate("/dashboard/my-orders");
        }
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order submission error:", error);

      // Detailed error logging for debugging
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
        console.error("Response Headers:", error.response.headers);

        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else if (error.response.status === 400) {
          toast.error(
            error.response.data.message ||
              "Invalid request. Please check your information."
          );
        } else if (error.response.status === 404) {
          toast.error("Order endpoint not found. Please contact support.");
        } else if (error.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(error.response.data.message || "An error occurred");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Error: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  // Check if order button should be enabled
  const isOrderValid =
    quantity >= (product.minOrder || 1) && quantity <= availableQuantity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-8">
      <Helmet>
        <title>Book Product | GarmentPro</title>
        <meta
          name="description"
          content="Place your order for quality garments"
        />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            to={`/products/${productId}`}
            className="text-primary hover:text-primary-focus mb-4 inline-flex items-center gap-2 transition-colors"
          >
            <FaArrowLeft />
            Back to Product Details
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Place Your Order
          </h1>
          <p className="text-gray-600 mt-2">
            Complete the form below to order{" "}
            <span className="font-semibold text-primary">{product.title}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary */}
          <div className="space-y-6">
            {/* Product Summary Card */}
            <div className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaBox className="text-primary" />
                  Product Summary
                </h2>

                <div className="space-y-4">
                  {/* Product Image */}
                  {product.images && product.images.length > 0 && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {product.description?.substring(0, 100)}...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-500">Category</p>
                        <p className="font-medium capitalize">
                          {product.category}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-500">Available Stock</p>
                        <p
                          className={`font-medium ${
                            availableQuantity > 10
                              ? "text-success"
                              : availableQuantity > 0
                              ? "text-warning"
                              : "text-error"
                          }`}
                        >
                          {availableQuantity} units
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaCalculator className="text-primary" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit Price</span>
                    <span className="font-bold text-lg text-primary">
                      ${product.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Quantity</span>
                    <span className="font-bold text-lg">{quantity} units</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-lg font-semibold">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {quantity} × ${product.price} = ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <FaCreditCard className="text-primary" />
                  Payment Information
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">
                      {product.paymentOptions === "cashOnDelivery"
                        ? "Cash on Delivery"
                        : product.paymentOptions === "advancePayment"
                        ? "Advance Payment"
                        : "Partial Payment (50% Advance)"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Required Action</span>
                    <span
                      className={`font-medium ${
                        product.paymentOptions === "cashOnDelivery"
                          ? "text-success"
                          : "text-primary"
                      }`}
                    >
                      {product.paymentOptions === "cashOnDelivery"
                        ? "Pay on Delivery"
                        : "Pay Now"}
                    </span>
                  </div>

                  {product.paymentOptions !== "cashOnDelivery" && (
                    <div className="alert alert-info">
                      <FaMoneyBillWave />
                      <div>
                        <p className="text-sm">
                          {product.paymentOptions === "advancePayment"
                            ? "Full payment required before order processing."
                            : "50% advance payment required, remaining on delivery."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Form */}
          <div className="space-y-6">
            {/* Order Form Card */}
            <div className="card bg-base-100 shadow-lg border">
              <div className="card-body">
                <h2 className="card-title text-xl">Order Details</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Read-only Fields Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Product Information
                    </h3>

                    {/* Email (auto-filled) */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" />
                          Email Address
                        </span>
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        readOnly
                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                      />
                      <label className="label">
                        <span className="label-text-alt text-gray-500">
                          Auto-filled from your account
                        </span>
                      </label>
                    </div>

                    {/* Product Title (read-only) */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaBox className="text-gray-400" />
                          Product
                        </span>
                      </label>
                      <input
                        type="text"
                        value={product.title}
                        readOnly
                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                      />
                    </div>

                    {/* Price (read-only) */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaDollarSign className="text-gray-400" />
                          Unit Price
                        </span>
                      </label>
                      <input
                        type="text"
                        value={`$${product.price} per unit`}
                        readOnly
                        className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Order Quantity Section */}
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        Order Quantity *
                      </span>
                    </label>

                    <div className="space-y-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={decrementQuantity}
                            disabled={quantity <= (product.minOrder || 1)}
                            className="btn btn-circle btn-outline"
                          >
                            <span className="text-xl">-</span>
                          </button>

                          <div className="text-center">
                            <input
                              type="number"
                              {...register("orderQuantity", {
                                required: "Order quantity is required",
                                min: {
                                  value: product.minOrder || 1,
                                  message: `Minimum order is ${
                                    product.minOrder || 1
                                  } units`,
                                },
                                max: {
                                  value: availableQuantity,
                                  message: `Maximum ${availableQuantity} units available`,
                                },
                                onChange: handleQuantityChange,
                              })}
                              className="input input-bordered w-24 text-center text-2xl font-bold"
                              min={product.minOrder || 1}
                              max={availableQuantity}
                            />
                            <div className="text-sm text-gray-500 mt-1">
                              units
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={incrementQuantity}
                            disabled={quantity >= availableQuantity}
                            className="btn btn-circle btn-outline"
                          >
                            <span className="text-xl">+</span>
                          </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setQuantity(product.minOrder || 1);
                              setValue("orderQuantity", product.minOrder || 1);
                            }}
                            className="btn btn-sm btn-outline"
                          >
                            Min ({product.minOrder || 1})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuantity(availableQuantity);
                              setValue("orderQuantity", availableQuantity);
                            }}
                            className="btn btn-sm btn-outline"
                          >
                            Max ({availableQuantity})
                          </button>
                        </div>
                      </div>

                      {/* Quantity Info */}
                      <div className="flex justify-between text-sm">
                        <span
                          className={`${
                            quantity === (product.minOrder || 1)
                              ? "text-warning font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          Min: {product.minOrder || 1} units
                        </span>
                        <span
                          className={`${
                            quantity === availableQuantity
                              ? "text-warning font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          Max: {availableQuantity} units
                        </span>
                      </div>

                      {errors.orderQuantity && (
                        <div className="alert alert-error p-2">
                          <span className="text-sm">
                            {errors.orderQuantity.message}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculated Total Price (read-only) */}
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 text-lg">
                        Total Order Value
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${totalPrice.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {quantity} units × ${product.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label className="label">
                          <span className="label-text flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            First Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                            minLength: {
                              value: 2,
                              message:
                                "First name must be at least 2 characters",
                            },
                          })}
                          className={`input input-bordered w-full ${
                            errors.firstName ? "input-error" : ""
                          }`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.firstName.message}
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="label">
                          <span className="label-text">Last Name *</span>
                        </label>
                        <input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                            minLength: {
                              value: 2,
                              message:
                                "Last name must be at least 2 characters",
                            },
                          })}
                          className={`input input-bordered w-full ${
                            errors.lastName ? "input-error" : ""
                          }`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {errors.lastName.message}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          Contact Number *
                        </span>
                      </label>
                      <input
                        type="tel"
                        {...register("contactNumber", {
                          required: "Contact number is required",
                          pattern: {
                            value: /^[0-9+\-\s()]{10,}$/,
                            message: "Enter a valid phone number",
                          },
                        })}
                        className={`input input-bordered w-full ${
                          errors.contactNumber ? "input-error" : ""
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.contactNumber && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.contactNumber.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          Delivery Address *
                        </span>
                      </label>
                      <textarea
                        {...register("deliveryAddress", {
                          required: "Delivery address is required",
                          minLength: {
                            value: 10,
                            message: "Address must be at least 10 characters",
                          },
                        })}
                        rows={3}
                        className={`textarea textarea-bordered w-full ${
                          errors.deliveryAddress ? "textarea-error" : ""
                        }`}
                        placeholder="Enter complete delivery address (street, city, zip code)"
                      />
                      {errors.deliveryAddress && (
                        <label className="label">
                          <span className="label-text-alt text-error">
                            {errors.deliveryAddress.message}
                          </span>
                        </label>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <FaStickyNote className="text-gray-400" />
                          Additional Notes / Instructions
                        </span>
                      </label>
                      <textarea
                        {...register("additionalNotes")}
                        rows={3}
                        className="textarea textarea-bordered w-full"
                        placeholder="Any special instructions, delivery preferences, or notes..."
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection (if applicable) */}
                  {product.paymentOptions !== "cashOnDelivery" && (
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-gray-700 mb-4">
                        Select Payment Method
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            paymentMethod === "stripe"
                              ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                              : "border-base-300 hover:bg-base-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={paymentMethod === "stripe"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">Stripe</div>
                            <div className="text-sm text-gray-600">
                              Credit/Debit Card
                            </div>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                            paymentMethod === "payfast"
                              ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                              : "border-base-300 hover:bg-base-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="payfast"
                            checked={paymentMethod === "payfast"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="radio radio-primary"
                          />
                          <div>
                            <div className="font-medium">PayFast</div>
                            <div className="text-sm text-gray-600">
                              Online Payment
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6 border-t">
                    <button
                      type="submit"
                      disabled={
                        submitting || !isOrderValid || user?.role !== "buyer"
                      }
                      className={`btn w-full btn-lg ${
                        submitting || !isOrderValid || user?.role !== "buyer"
                          ? "btn-disabled"
                          : "btn-primary"
                      }`}
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="loading loading-spinner loading-sm"></span>
                          Processing...
                        </span>
                      ) : product.paymentOptions === "cashOnDelivery" ? (
                        <>
                          <FaCheckCircle />
                          Place Order (Cash on Delivery)
                        </>
                      ) : (
                        <>
                          <FaCreditCard />
                          Proceed to Payment - ${totalPrice.toFixed(2)}
                        </>
                      )}
                    </button>

                    {/* Validation Messages */}
                    <div className="mt-4 space-y-2">
                      {user?.role !== "buyer" && (
                        <div className="alert alert-warning">
                          <FaTimesCircle />
                          <span>Only buyer accounts can place orders</span>
                        </div>
                      )}

                      {!isOrderValid && (
                        <div className="alert alert-warning">
                          <FaTimesCircle />
                          <span>Please enter a valid quantity</span>
                        </div>
                      )}

                      {isOrderValid && user?.role === "buyer" && (
                        <div className="alert alert-success">
                          <FaCheckCircle />
                          <span>Order is ready to be placed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="card bg-base-100 shadow border">
              <div className="card-body">
                <h4 className="card-title">Terms & Conditions</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Order quantity cannot exceed available stock (
                      {availableQuantity} units)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Minimum order quantity is {product.minOrder || 1} units
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Delivery time: 3-7 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Payment method:{" "}
                      {product.paymentOptions === "cashOnDelivery"
                        ? "Cash on Delivery"
                        : product.paymentOptions === "advancePayment"
                        ? "Advance payment required"
                        : "50% advance, 50% on delivery"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Returns accepted within 7 days of delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
