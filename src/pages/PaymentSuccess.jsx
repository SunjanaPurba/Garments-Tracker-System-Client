// pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaBox, FaShippingFast } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const sessionId = searchParams.get("session_id");
  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

  useEffect(() => {
    if (sessionId) {
      processPaymentSuccess();
    } else {
      toast.error("No session ID found");
      navigate("/dashboard/my-orders");
    }
  }, [sessionId]);

  const processPaymentSuccess = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/success`,
        {
          sessionId: sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);
        toast.success("Payment successful! Order has been placed.");
      }
    } catch (error) {
      console.error("Payment success error:", error);
      toast.error("Failed to process payment success");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

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

          {order && (
            <div className="mt-6 p-4 bg-base-200 rounded-lg text-left">
              <h3 className="font-bold mb-2">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono">#{order._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span>{order.product?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span>{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold">${order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="btn btn-primary w-full"
            >
              <FaBox className="mr-2" />
              View My Orders
            </button>

            <button
              onClick={() => navigate("/dashboard/track-order")}
              className="btn btn-outline w-full"
            >
              <FaShippingFast className="mr-2" />
              Track Order
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
