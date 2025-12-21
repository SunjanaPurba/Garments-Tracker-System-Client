import { useParams } from "react-router-dom";
// Add fetch logic similar to others
const OrderDetails = () => {
  const { id } = useParams();
  // Fetch single order and show full details
  return <div>Order Details for {id}</div>;
};

export default OrderDetails;
