// // import { useForm } from "react-hook-form";
// // import { useAuth } from "../context/AuthContext";
// // import { toast } from "react-toastify";
// // import { useNavigate, Link } from "react-router-dom";
// // import axios from "axios";
// // import { Helmet } from "react-helmet-async";
// // import { FaUser, FaEnvelope, FaCamera, FaLock } from "react-icons/fa";

// // const Register = () => {
// //   const { register: firebaseRegister } = useAuth();
// //   const navigate = useNavigate();
// //   const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

// //   const {
// //     register,
// //     handleSubmit,
// //     watch,
// //     formState: { errors, isSubmitting },
// //   } = useForm();

// //   const password = watch("password");

// //   const onSubmit = async (data) => {
// //     // Password validation
// //     if (!/(?=.*[A-Z])/.test(data.password))
// //       return toast.error("Password must contain an uppercase letter");
// //     if (!/(?=.*[a-z])/.test(data.password))
// //       return toast.error("Password must contain a lowercase letter");
// //     if (data.password.length < 6)
// //       return toast.error("Password must be at least 6 characters");

// //     try {
// //       // Firebase-এ register
// //       await firebaseRegister(data.email, data.password);

// //       // Backend-এ user create/sync
// //       await axios.put(`${API_URL}/users`, {
// //         name: data.name,
// //         email: data.email,
// //         photoURL: data.photoURL || "",
// //         role: data.role || "buyer",
// //         status: "pending",
// //       });

// //       toast.success("Registration successful! Please login.");
// //       navigate("/login");
// //     } catch (err) {
// //       const message =
// //         err.code === "auth/email-already-in-use"
// //           ? "Email already registered. Please login."
// //           : err.message || "Registration failed";
// //       toast.error(message);
// //       console.error(err);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// //       <Helmet>
// //         <title>Register | GarmentPro</title>
// //       </Helmet>

// //       <div className="w-full max-w-md">
// //         {/* Brand Header */}
// //         <div className="text-center mb-8">
// //           <h1 className="text-4xl font-bold text-indigo-700 mb-2">
// //             GarmentPro
// //           </h1>
// //           <p className="text-gray-600">Create your account</p>
// //         </div>

// //         {/* Register Card */}
// //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
// //           <div className="p-8">
// //             <div className="mb-8">
// //               <h2 className="text-2xl font-bold text-gray-800">
// //                 Join GarmentPro
// //               </h2>
// //               <p className="text-gray-500 mt-1">
// //                 Fill in your details to get started
// //               </p>
// //             </div>

// //             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //               {/* Name Field */}
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
// //                   <FaUser className="text-gray-400" />
// //                   Full Name
// //                 </label>
// //                 <input
// //                   {...register("name", {
// //                     required: "Full name is required",
// //                     minLength: {
// //                       value: 2,
// //                       message: "Name must be at least 2 characters",
// //                     },
// //                   })}
// //                   type="text"
// //                   placeholder="John Doe"
// //                   className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
// //                 />
// //                 <div className="relative">
// //                   <FaUser className="absolute left-3 top-3 text-gray-400" />
// //                 </div>
// //                 {errors.name && (
// //                   <span className="text-sm text-red-600 flex items-center gap-1">
// //                     <svg
// //                       className="w-4 h-4"
// //                       fill="currentColor"
// //                       viewBox="0 0 20 20"
// //                     >
// //                       <path
// //                         fillRule="evenodd"
// //                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
// //                         clipRule="evenodd"
// //                       />
// //                     </svg>
// //                     {errors.name.message}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Email Field */}
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
// //                   <FaEnvelope className="text-gray-400" />
// //                   Email Address
// //                 </label>
// //                 <input
// //                   {...register("email", {
// //                     required: "Email is required",
// //                     pattern: {
// //                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
// //                       message: "Invalid email address",
// //                     },
// //                   })}
// //                   type="email"
// //                   placeholder="you@example.com"
// //                   className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
// //                 />
// //                 <div className="relative">
// //                   <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
// //                 </div>
// //                 {errors.email && (
// //                   <span className="text-sm text-red-600 flex items-center gap-1">
// //                     <svg
// //                       className="w-4 h-4"
// //                       fill="currentColor"
// //                       viewBox="0 0 20 20"
// //                     >
// //                       <path
// //                         fillRule="evenodd"
// //                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
// //                         clipRule="evenodd"
// //                       />
// //                     </svg>
// //                     {errors.email.message}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Photo URL Field */}
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
// //                   <FaCamera className="text-gray-400" />
// //                   Profile Photo URL (Optional)
// //                 </label>
// //                 <input
// //                   {...register("photoURL")}
// //                   type="url"
// //                   placeholder="https://example.com/photo.jpg"
// //                   className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
// //                 />
// //                 <div className="relative">
// //                   <FaCamera className="absolute left-3 top-3 text-gray-400" />
// //                 </div>
// //                 <p className="text-xs text-gray-500">
// //                   Provide a URL for your profile picture
// //                 </p>
// //               </div>

// //               {/* Role Selection */}
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Account Type
// //                 </label>
// //                 <select
// //                   {...register("role")}
// //                   className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
// //                   defaultValue="buyer"
// //                 >
// //                   <option value="buyer">👤 Buyer - Purchase garments</option>
// //                   <option value="manager">
// //                     👔 Manager - Manage inventory & orders
// //                   </option>
// //                 </select>
// //                 <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
// //                   <svg
// //                     className="w-4 h-4 text-info"
// //                     fill="currentColor"
// //                     viewBox="0 0 20 20"
// //                   >
// //                     <path
// //                       fillRule="evenodd"
// //                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
// //                       clipRule="evenodd"
// //                     />
// //                   </svg>
// //                   <span>Choose your role based on your needs</span>
// //                 </div>
// //               </div>

// //               {/* Password Field */}
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
// //                   <FaLock className="text-gray-400" />
// //                   Password
// //                 </label>
// //                 <input
// //                   {...register("password", {
// //                     required: "Password is required",
// //                     minLength: {
// //                       value: 6,
// //                       message: "Password must be at least 6 characters",
// //                     },
// //                   })}
// //                   type="password"
// //                   placeholder="••••••••"
// //                   className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
// //                 />
// //                 <div className="relative">
// //                   <FaLock className="absolute left-3 top-3 text-gray-400" />
// //                 </div>

// //                 {/* Password Requirements */}
// //                 <div className="space-y-1 mt-2">
// //                   <p className="text-xs font-medium text-gray-600 mb-2">
// //                     Password must contain:
// //                   </p>
// //                   <div className="flex items-center gap-2">
// //                     <div
// //                       className={`w-2 h-2 rounded-full ${
// //                         password?.length >= 6 ? "bg-green-500" : "bg-gray-300"
// //                       }`}
// //                     ></div>
// //                     <span
// //                       className={`text-xs ${
// //                         password?.length >= 6
// //                           ? "text-green-600"
// //                           : "text-gray-500"
// //                       }`}
// //                     >
// //                       At least 6 characters
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <div
// //                       className={`w-2 h-2 rounded-full ${
// //                         /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"
// //                       }`}
// //                     ></div>
// //                     <span
// //                       className={`text-xs ${
// //                         /[A-Z]/.test(password)
// //                           ? "text-green-600"
// //                           : "text-gray-500"
// //                       }`}
// //                     >
// //                       One uppercase letter
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <div
// //                       className={`w-2 h-2 rounded-full ${
// //                         /[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"
// //                       }`}
// //                     ></div>
// //                     <span
// //                       className={`text-xs ${
// //                         /[a-z]/.test(password)
// //                           ? "text-green-600"
// //                           : "text-gray-500"
// //                       }`}
// //                     >
// //                       One lowercase letter
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {errors.password && (
// //                   <span className="text-sm text-red-600 flex items-center gap-1">
// //                     <svg
// //                       className="w-4 h-4"
// //                       fill="currentColor"
// //                       viewBox="0 0 20 20"
// //                     >
// //                       <path
// //                         fillRule="evenodd"
// //                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
// //                         clipRule="evenodd"
// //                       />
// //                     </svg>
// //                     {errors.password.message}
// //                   </span>
// //                 )}
// //               </div>

// //               {/* Terms & Conditions */}
// //               <div className="flex items-start space-x-3">
// //                 <input
// //                   type="checkbox"
// //                   id="terms"
// //                   className="checkbox checkbox-sm checkbox-primary mt-1"
// //                   required
// //                 />
// //                 <label htmlFor="terms" className="text-sm text-gray-600">
// //                   I agree to the{" "}
// //                   <a
// //                     href="#"
// //                     className="text-indigo-600 hover:underline font-medium"
// //                   >
// //                     Terms of Service
// //                   </a>{" "}
// //                   and{" "}
// //                   <a
// //                     href="#"
// //                     className="text-indigo-600 hover:underline font-medium"
// //                   >
// //                     Privacy Policy
// //                   </a>
// //                 </label>
// //               </div>

// //               {/* Submit Button */}
// //               <button
// //                 type="submit"
// //                 disabled={isSubmitting}
// //                 className="btn btn-primary w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
// //               >
// //                 {isSubmitting ? (
// //                   <span className="flex items-center gap-2">
// //                     <span className="loading loading-spinner loading-sm"></span>
// //                     Creating Account...
// //                   </span>
// //                 ) : (
// //                   "Create Account"
// //                 )}
// //               </button>
// //             </form>

// //             {/* Login Link */}
// //             <div className="mt-8 pt-6 border-t border-gray-100">
// //               <p className="text-center text-gray-600">
// //                 Already have an account?{" "}
// //                 <Link
// //                   to="/login"
// //                   className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
// //                 >
// //                   Sign in here
// //                   <svg
// //                     className="w-4 h-4"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     viewBox="0 0 24 24"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth="2"
// //                       d="M14 5l7 7m0 0l-7 7m7-7H3"
// //                     />
// //                   </svg>
// //                 </Link>
// //               </p>
// //             </div>
// //           </div>

// //           {/* Card Footer */}
// //           <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
// //             <p className="text-xs text-center text-gray-500">
// //               Your information is protected with industry-standard encryption
// //             </p>
// //           </div>
// //         </div>

// //         {/* Benefits Card */}
// //         <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
// //           <div className="flex items-center gap-3 mb-3">
// //             <div className="bg-green-100 p-2 rounded-lg">
// //               <svg
// //                 className="w-5 h-5 text-green-600"
// //                 fill="currentColor"
// //                 viewBox="0 0 20 20"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //             </div>
// //             <h4 className="font-medium text-gray-700">Why Join GarmentPro?</h4>
// //           </div>
// //           <ul className="space-y-2 text-sm text-gray-600">
// //             <li className="flex items-center gap-2">
// //               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
// //               Access to premium garment collections
// //             </li>
// //             <li className="flex items-center gap-2">
// //               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
// //               Manage orders and inventory (for managers)
// //             </li>
// //             <li className="flex items-center gap-2">
// //               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
// //               Secure payment processing
// //             </li>
// //             <li className="flex items-center gap-2">
// //               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
// //               24/7 customer support
// //             </li>
// //           </ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Register;

// import { useForm } from "react-hook-form";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { Helmet } from "react-helmet-async";
// import { FaUser, FaEnvelope, FaCamera, FaLock } from "react-icons/fa";

// const Register = () => {
//   const { register: firebaseRegister } = useAuth();
//   const navigate = useNavigate();
  
//   // ✅ CORRECT API URL
//   const API_URL = import.meta.env.VITE_SERVER_URL || "https://garments-tracker-system-server-wine.vercel.app";

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const password = watch("password");

//   const onSubmit = async (data) => {
//     // Password validation
//     if (!/(?=.*[A-Z])/.test(data.password))
//       return toast.error("Password must contain an uppercase letter");
//     if (!/(?=.*[a-z])/.test(data.password))
//       return toast.error("Password must contain a lowercase letter");
//     if (data.password.length < 6)
//       return toast.error("Password must be at least 6 characters");

//     try {
//       console.log("🔄 Starting registration for:", data.email);

//       // 1. Firebase-এ register
//       const firebaseResult = await firebaseRegister(data.email, data.password);
//       console.log("✅ Firebase registration successful");

//       // 2. Backend-এ user create/sync
//       const userData = {
//         name: data.name,
//         email: data.email,
//         photoURL: data.photoURL || "",
//         role: data.role || "buyer",
//         status: "pending",
//       };

//       console.log("📤 Sending user data to backend:", userData);
      
//       const userRes = await axios.put(`${API_URL}/api/users`, userData);
      
//       console.log("✅ Backend user creation:", userRes.data);

//       // 3. Set user in localStorage (optional)
//       const userInfo = {
//         email: data.email,
//         name: data.name,
//         role: data.role || "buyer",
//         status: "pending",
//         uid: firebaseResult.user.uid,
//       };

//       localStorage.setItem("user", JSON.stringify(userInfo));

//       toast.success("Registration successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       console.error("❌ Registration error:", {
//         code: err.code,
//         message: err.message,
//         response: err.response?.data,
//       });

//       let message = "Registration failed";
      
//       if (err.code === "auth/email-already-in-use") {
//         message = "Email already registered. Please login.";
//       } else if (err.code === "auth/weak-password") {
//         message = "Password is too weak. Use at least 6 characters with mix of letters and numbers.";
//       } else if (err.code === "auth/invalid-email") {
//         message = "Invalid email address.";
//       } else if (err.response?.status === 404) {
//         message = "Server endpoint not found. Please contact administrator.";
//       } else if (err.response?.data?.message) {
//         message = err.response.data.message;
//       }
      
//       toast.error(message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <Helmet>
//         <title>Register | GarmentPro</title>
//       </Helmet>

//       <div className="w-full max-w-md">
//         {/* Brand Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-indigo-700 mb-2">
//             GarmentPro
//           </h1>
//           <p className="text-gray-600">Create your account</p>
//         </div>

//         {/* Register Card */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
//           <div className="p-8">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Join GarmentPro
//               </h2>
//               <p className="text-gray-500 mt-1">
//                 Fill in your details to get started
//               </p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Name Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <FaUser className="text-gray-400" />
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <FaUser className="absolute left-3 top-3 text-gray-400 z-10" />
//                   <input
//                     {...register("name", {
//                       required: "Full name is required",
//                       minLength: {
//                         value: 2,
//                         message: "Name must be at least 2 characters",
//                       },
//                     })}
//                     type="text"
//                     placeholder="John Doe"
//                     className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
//                   />
//                 </div>
//                 {errors.name && (
//                   <span className="text-sm text-red-600 flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.name.message}
//                   </span>
//                 )}
//               </div>

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <FaEnvelope className="text-gray-400" />
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3 top-3 text-gray-400 z-10" />
//                   <input
//                     {...register("email", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                         message: "Invalid email address",
//                       },
//                     })}
//                     type="email"
//                     placeholder="you@example.com"
//                     className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
//                   />
//                 </div>
//                 {errors.email && (
//                   <span className="text-sm text-red-600 flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.email.message}
//                   </span>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <FaLock className="text-gray-400" />
//                   Password
//                 </label>
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-3 text-gray-400 z-10" />
//                   <input
//                     {...register("password", {
//                       required: "Password is required",
//                       minLength: {
//                         value: 6,
//                         message: "Password must be at least 6 characters",
//                       },
//                     })}
//                     type="password"
//                     placeholder="••••••••"
//                     className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
//                   />
//                 </div>

//                 {/* Password Requirements */}
//                 <div className="space-y-1 mt-2">
//                   <p className="text-xs font-medium text-gray-600 mb-2">
//                     Password must contain:
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         password?.length >= 6 ? "bg-green-500" : "bg-gray-300"
//                       }`}
//                     ></div>
//                     <span
//                       className={`text-xs ${
//                         password?.length >= 6
//                           ? "text-green-600"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       At least 6 characters
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"
//                       }`}
//                     ></div>
//                     <span
//                       className={`text-xs ${
//                         /[A-Z]/.test(password)
//                           ? "text-green-600"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       One uppercase letter
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-2 h-2 rounded-full ${
//                         /[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"
//                       }`}
//                     ></div>
//                     <span
//                       className={`text-xs ${
//                         /[a-z]/.test(password)
//                           ? "text-green-600"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       One lowercase letter
//                     </span>
//                   </div>
//                 </div>

//                 {errors.password && (
//                   <span className="text-sm text-red-600 flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {errors.password.message}
//                   </span>
//                 )}
//               </div>

//               {/* Role Selection */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Account Type
//                 </label>
//                 <select
//                   {...register("role")}
//                   className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
//                   defaultValue="buyer"
//                 >
//                   <option value="buyer">👤 Buyer - Purchase garments</option>
//                   <option value="manager">
//                     👔 Manager - Manage inventory & orders
//                   </option>
//                 </select>
//                 <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
//                   <svg
//                     className="w-4 h-4 text-info"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span>Choose your role based on your needs</span>
//                 </div>
//               </div>

//               {/* Terms & Conditions */}
//               <div className="flex items-start space-x-3">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   className="checkbox checkbox-sm checkbox-primary mt-1"
//                   required
//                 />
//                 <label htmlFor="terms" className="text-sm text-gray-600">
//                   I agree to the{" "}
//                   <a
//                     href="#"
//                     className="text-indigo-600 hover:underline font-medium"
//                   >
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a
//                     href="#"
//                     className="text-indigo-600 hover:underline font-medium"
//                   >
//                     Privacy Policy
//                   </a>
//                 </label>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="btn btn-primary w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <span className="loading loading-spinner loading-sm"></span>
//                     Creating Account...
//                   </span>
//                 ) : (
//                   "Create Account"
//                 )}
//               </button>
//             </form>

//             {/* Login Link */}
//             <div className="mt-8 pt-6 border-t border-gray-100">
//               <p className="text-center text-gray-600">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
//                 >
//                   Sign in here
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M14 5l7 7m0 0l-7 7m7-7H3"
//                     />
//                   </svg>
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Card Footer */}
//           <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
//             <p className="text-xs text-center text-gray-500">
//               Your information is protected with industry-standard encryption
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;




import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { FaUser, FaEnvelope, FaCamera, FaLock } from "react-icons/fa";

const Register = () => {
  const { register: firebaseRegister } = useAuth();
  const navigate = useNavigate();
  
  // ✅ FIXED: আপনার Render সার্ভার URL ব্যবহার করুন
  const API_URL = "https://garments-tracker-system-server.onrender.com/api";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    // Password validation
    if (!/(?=.*[A-Z])/.test(data.password))
      return toast.error("Password must contain an uppercase letter");
    if (!/(?=.*[a-z])/.test(data.password))
      return toast.error("Password must contain a lowercase letter");
    if (data.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      console.log("🔄 Starting registration for:", data.email);

      // 1. Firebase-এ register
      const firebaseResult = await firebaseRegister(data.email, data.password);
      console.log("✅ Firebase registration successful");

      // 2. Backend-এ user create/sync
      const userData = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL || "",
        role: data.role || "buyer",
        status: "pending",
      };

      console.log("📤 Sending user data to backend:", userData);
      
      const userRes = await axios.put(`${API_URL}/users`, userData);
      
      console.log("✅ Backend user creation:", userRes.data);

      // 3. Set user in localStorage (optional)
      const userInfo = {
        email: data.email,
        name: data.name,
        role: data.role || "buyer",
        status: "pending",
        uid: firebaseResult.user.uid,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration error:", {
        code: err.code,
        message: err.message,
        response: err.response?.data,
      });

      let message = "Registration failed";
      
      if (err.code === "auth/email-already-in-use") {
        message = "Email already registered. Please login.";
      } else if (err.code === "auth/weak-password") {
        message = "Password is too weak. Use at least 6 characters with mix of letters and numbers.";
      } else if (err.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (err.response?.status === 404) {
        message = "Server endpoint not found. Please contact administrator.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Register | GarmentPro</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            GarmentPro
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Join GarmentPro
              </h2>
              <p className="text-gray-500 mt-1">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400 z-10" />
                  <input
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  />
                </div>
                {errors.name && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400 z-10" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  />
                </div>
                {errors.email && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaLock className="text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400 z-10" />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 pl-10"
                  />
                </div>

                {/* Password Requirements */}
                <div className="space-y-1 mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Password must contain:
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password?.length >= 6 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        password?.length >= 6
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-xs ${
                        /[a-z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      One lowercase letter
                    </span>
                  </div>
                </div>

                {errors.password && (
                  <span className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  {...register("role")}
                  className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                  defaultValue="buyer"
                >
                  <option value="buyer">👤 Buyer - Purchase garments</option>
                  <option value="manager">
                    👔 Manager - Manage inventory & orders
                  </option>
                </select>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <svg
                    className="w-4 h-4 text-info"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Choose your role based on your needs</span>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox checkbox-sm checkbox-primary mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                >
                  Sign in here
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              Your information is protected with industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
