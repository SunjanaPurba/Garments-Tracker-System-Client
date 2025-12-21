// pages/NotFound.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found | GarmentPro";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
          <Link to="/all-products" className="btn btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
