import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const Login = () => {
  const { login, googleLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || "https://garments-tracker-system-server-wine.vercel.app";

  // ✅ Admin/Manager emails list
  const adminManagerEmails = {
    "admin@garmentpro.com": { role: "admin", status: "approved" },
    "manager@garmentpro.com": { role: "manager", status: "approved" },
  };

  // ✅ Determine role based on email
  const getUserRoleAndStatus = (email) => {
    const lowerEmail = email.toLowerCase();

    if (adminManagerEmails[lowerEmail]) {
      return adminManagerEmails[lowerEmail];
    }

    return { role: "buyer", status: "pending" };
  };

  // Email/Password Login - FIXED
  const onSubmit = async (data) => {
    try {
      console.log("🔄 Email login attempt:", data.email);

      // 1. Firebase login
      await login(data.email, data.password);

      // 2. Determine role and status
      const { role, status } = getUserRoleAndStatus(data.email);

      console.log("📊 User role determined:", {
        email: data.email,
        role,
        status,
      });

      // 3. Backend sync WITH ROLE
      await axios.put(`${API_URL}/users`, {
        email: data.email,
        name: data.email.split("@")[0], // Temporary name
        role, // ✅ Role explicitly sent
        status, // ✅ Status explicitly sent
      });

      // 4. Get JWT token
      const jwtRes = await axios.post(`${API_URL}/jwt`, {
        email: data.email,
        role, // ✅ Role included in JWT payload
      });

      const token = jwtRes.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("access-token", token);

      // 5. Get full user info
      const userRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Login successful, user data:", {
        email: userRes.data.email,
        role: userRes.data.role,
        status: userRes.data.status,
      });

      setUser(userRes.data);

      toast.success("Login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Login error:", err);
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  // Google Login - FIXED
  const handleGoogle = async () => {
    try {
      console.log("🔄 Google login attempt...");

      const result = await googleLogin();
      const firebaseUser = result.user;

      console.log("👤 Firebase user:", firebaseUser.email);

      // Determine role and status
      const { role, status } = getUserRoleAndStatus(firebaseUser.email);

      console.log("📊 Google user role determined:", {
        email: firebaseUser.email,
        role,
        status,
      });

      // Backend sync WITH ROLE
      await axios.put(`${API_URL}/users`, {
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || "",
        role, // ✅ Role explicitly sent
        status, // ✅ Status explicitly sent
      });

      // Get JWT token
      const jwtRes = await axios.post(`${API_URL}/jwt`, {
        email: firebaseUser.email,
        role, // ✅ Role included in JWT payload
      });

      const token = jwtRes.data.token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("access-token", token);

      // Get full user info
      const userRes = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Google login successful, user data:", {
        email: userRes.data.email,
        role: userRes.data.role,
        status: userRes.data.status,
      });

      setUser(userRes.data);

      toast.success("Google login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Google login error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        toast.info("Google login popup was closed");
      } else if (err.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups for this site.");
      } else {
        toast.error(err.response?.data?.message || "Google login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Login | GarmentPro</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">
            GarmentPro
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-1">
                Please enter your credentials
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="admin@garmentpro.com or manager@garmentpro.com"
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
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

              {/* Demo Credentials Hint */}
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <span className="font-semibold">Demo:</span> Use{" "}
                  <code className="bg-white px-1 rounded">
                    admin@garmentpro.com
                  </code>{" "}
                  or{" "}
                  <code className="bg-white px-1 rounded">
                    manager@garmentpro.com
                  </code>
                </p>
              </div>

              {/* Remember Me & Submit Button */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary px-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-400 text-sm">
                Or continue with
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogle}
              className="btn btn-outline w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 transition-all duration-300 py-3 rounded-lg"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                >
                  Create one now
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
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Demo Credentials</h4>
              <p className="text-sm text-gray-500 mt-1">
                For testing purposes, use any registered email/password or use
                Google login
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-xs">
                  <span className="font-medium">Admin:</span>{" "}
                  admin@garmentpro.com / (Firebase password)
                </p>
                <p className="text-xs">
                  <span className="font-medium">Manager:</span>{" "}
                  manager@garmentpro.com / (Firebase password)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
