import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${API_URL}/orders/my`, {
          withCredentials: true, // crucial for JWT cookie
        });

        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("Unexpected response:", res.data);
          toast.error("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (!orders.length)
    return (
      <p className="text-center mt-10 text-lg">
        No orders yet. Place your first order!
      </p>
    );

  return (
    <div className="container mx-auto py-20 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="card p-4 mb-4 shadow bg-base-100">
          <p>
            <strong>Product:</strong> {order.productTitle}
          </p>
          <p>
            <strong>Quantity:</strong> {order.quantity}
          </p>
          <p>
            <strong>Price per Unit:</strong> ${order.pricePerUnit}
          </p>
          <p>
            <strong>Total:</strong> ${order.totalPrice}
          </p>
          <p>
            <strong>Payment:</strong>{" "}
            {order.payment === "payFirst" ? "Paid Online" : "Cash on Delivery"}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Ordered on:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
