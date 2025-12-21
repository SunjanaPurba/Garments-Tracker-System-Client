// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { FaTag, FaBox, FaEye } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const isInStock = product.quantity > 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300">
      {/* Product Image */}
      <figure className="relative h-64">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop'}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop';
            e.target.onerror = null;
          }}
        />
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`badge badge-lg ${!isInStock ? 'badge-error' : isLowStock ? 'badge-warning' : 'badge-success'}`}>
            <FaBox className="mr-1" />
            {!isInStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary badge-lg">
            <FaTag className="mr-1" />
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
          </span>
        </div>
      </figure>
      
      {/* Product Details */}
      <div className="card-body p-6">
        {/* Title */}
        <h3 className="card-title text-lg font-bold line-clamp-1">
          {product.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 line-clamp-2 text-sm mb-4">
          {product.description}
        </p>
        
        {/* Price and Stock */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              <span className="text-gray-500 text-sm ml-2">per unit</span>
            </div>
            
            {/* Stock Indicator */}
            <div className={`text-right ${!isInStock ? 'text-error' : isLowStock ? 'text-warning' : 'text-success'}`}>
              <div className="font-semibold">
                {!isInStock ? 'Not Available' : `${product.quantity} units`}
              </div>
              <div className="text-xs">
                {product.minOrder} min order
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/products/${product._id}`}
            className={`btn w-full ${!isInStock ? 'btn-error btn-disabled' : 'btn-primary'}`}
          >
            <FaEye className="mr-2" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;