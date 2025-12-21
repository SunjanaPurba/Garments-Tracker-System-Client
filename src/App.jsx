import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import DashboardLayout from "./pages/dashboard/DashboardLayout";

// Admin Components
import ManageUsers from "./pages/dashboard/Admin/ManageUsers";
import AdminAllProducts from "./pages/dashboard/Admin/AdminAllProducts";
import AllOrders from "./pages/dashboard/Admin/AllOrders";
import Analytics from "./pages/dashboard/Admin/Analytics";
import Profile from "./pages/dashboard/Profile";

// Manager Components
import AddProduct from "./pages/dashboard/Manager/AddProduct";
import ManageProducts from "./pages/dashboard/Manager/ManageProducts";
import PendingOrders from "./pages/dashboard/Manager/PendingOrders";
import ApprovedOrders from "./pages/dashboard/Manager/ApprovedOrders";

// Buyer Components
import MyOrders from "./pages/dashboard/Buyer/MyOrders";
import TrackOrder from "./pages/dashboard/Buyer/TrackOrder";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div data-theme="light">
        <Router>
          <Navbar />

          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/booking/:productId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                {/* Default Dashboard Page */}
                <Route index element={<Profile />} />

                {/* Admin Only Routes */}
                <Route
                  path="manage-users"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <ManageUsers />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="all-products"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminAllProducts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="all-orders"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AllOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <Analytics />
                    </PrivateRoute>
                  }
                />

                {/* Manager Only Routes */}
                <Route
                  path="add-product"
                  element={
                    <PrivateRoute requiredRole="manager">
                      <AddProduct />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="manage-products"
                  element={
                    <PrivateRoute requiredRole="manager">
                      <ManageProducts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="pending-orders"
                  element={
                    <PrivateRoute requiredRole="manager">
                      <PendingOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="approved-orders"
                  element={
                    <PrivateRoute requiredRole="manager">
                      <ApprovedOrders />
                    </PrivateRoute>
                  }
                />

                {/* Buyer Only Routes */}
                <Route
                  path="my-orders"
                  element={
                    <PrivateRoute requiredRole="buyer">
                      <MyOrders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="track-order"
                  element={
                    <PrivateRoute requiredRole="buyer">
                      <TrackOrder />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="track-order/:orderId"
                  element={
                    <PrivateRoute requiredRole="buyer">
                      <TrackOrder />
                    </PrivateRoute>
                  }
                />

                {/* Common Routes */}
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </Router>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
}

export default App;
