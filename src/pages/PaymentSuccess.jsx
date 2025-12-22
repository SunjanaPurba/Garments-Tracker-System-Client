
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaBox, FaShippingFast } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        const token = localStorage.getItem("access-token");
        
        // Update order status
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/orders/payment-success`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Payment successful! Your order has been placed.");
        
        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate("/dashboard/my-orders");
        }, 3000);
      } catch (error) {
        console.error("Payment success processing error:", error);
        toast.error("Payment was successful but there was an error processing your order.");
        navigate("/dashboard/my-orders");
      }
    };

    if (sessionId) {
      processPaymentSuccess();
    } else {
      // If no session ID, just redirect
      navigate("/dashboard/my-orders");
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>

          <h2 className="card-title justify-center text-2xl">
            Payment Successful!
          </h2>

          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className="mt-6 space-y-3">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="text-gray-500">Redirecting to your orders...</p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="btn btn-primary w-full"
            >
              <FaBox className="mr-2" />
              View My Orders
            </button>

            <button
              onClick={() => navigate("/all-products")}
              className="btn btn-ghost w-full"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;