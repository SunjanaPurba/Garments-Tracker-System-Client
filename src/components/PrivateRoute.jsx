// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import LoadingSpinner from "./LoadingSpinner";

// const PrivateRoute = ({ requiredRole }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <LoadingSpinner />;

//   if (!user) return <Navigate to="/login" replace />;

//   if (requiredRole && user.role !== requiredRole) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;


import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user is suspended
  if (user.status === "suspended") {
    // Define allowed routes for suspended users
    const allowedRoutes = [
      "/dashboard/profile",
    ];

    // Add role-specific allowed routes
    if (user.role === "buyer") {
      allowedRoutes.push("/dashboard/my-orders");
    } else if (user.role === "manager") {
      allowedRoutes.push(
        "/dashboard/manage-products",
        "/dashboard/approved-orders"
      );
    }

    // Check if current route is allowed
    const isRouteAllowed = allowedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (!isRouteAllowed) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-base-200">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="card-title justify-center text-red-600">
                Account Suspended
              </h2>
              <p className="text-gray-600 mt-2">
                Your account has been temporarily suspended.
              </p>
              
              {user.suspendFeedback && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="font-medium">Reason:</p>
                  <p className="text-sm text-gray-700">{user.suspendFeedback}</p>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500">You can still access:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {allowedRoutes.map((route) => (
                    <a
                      key={route}
                      href={route}
                      className="btn btn-xs btn-outline"
                    >
                      {route.split("/").pop()}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;