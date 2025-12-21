// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Helmet } from 'react-helmet-async';
// import {
//   FaSearch,
//   FaFilter,
//   FaTimes,
//   FaTag,
//   FaBox,
//   FaEye,
//   FaSortAmountDown,
//   FaSortAmountUp,
//   FaCheckCircle,
//   FaExclamationTriangle
// } from 'react-icons/fa';
// import LoadingSpinner from '../components/LoadingSpinner';

// const AllProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [stockFilter, setStockFilter] = useState('all'); // 'all', 'available', 'unavailable'
//   const [showFilters, setShowFilters] = useState(false);

//   const limit = 9;
//   const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || 'http://localhost:5000';

//   // Categories and filters
//   const categories = [
//     { value: 'all', label: 'All Categories' },
//     { value: 'shirt', label: 'Shirts' },
//     { value: 'pant', label: 'Pants' },
//     { value: 'jacket', label: 'Jackets' },
//     { value: 'accessories', label: 'Accessories' }
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Newest First', icon: FaSortAmountDown },
//     { value: 'oldest', label: 'Oldest First', icon: FaSortAmountUp },
//     { value: 'priceLow', label: 'Price: Low to High', icon: FaSortAmountDown },
//     { value: 'priceHigh', label: 'Price: High to Low', icon: FaSortAmountUp },
//     { value: 'quantityHigh', label: 'Stock: High to Low', icon: FaSortAmountDown },
//     { value: 'quantityLow', label: 'Stock: Low to High', icon: FaSortAmountUp }
//   ];

//   const stockOptions = [
//     { value: 'all', label: 'All Products' },
//     { value: 'available', label: 'Available Products', icon: FaCheckCircle },
//     { value: 'unavailable', label: 'Not Available', icon: FaExclamationTriangle }
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [page, search, selectedCategory, sortBy, stockFilter]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       // Build query parameters
//       const params = new URLSearchParams({
//         page: page,
//         limit: limit,
//         q: search,
//         sort: sortBy
//       });

//       if (selectedCategory !== 'all') {
//         params.append('category', selectedCategory);
//       }

//       if (stockFilter === 'available') {
//         params.append('inStock', 'true');
//       } else if (stockFilter === 'unavailable') {
//         params.append('inStock', 'false');
//       }

//       const response = await axios.get(`${API_URL}/products?${params}`);

//       if (response.data.success) {
//         setProducts(response.data.products || []);
//         setPages(response.data.pages || 1);
//         setTotal(response.data.total || 0);
//       } else {
//         toast.error('Failed to load products');
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error('Fetch products error:', error);
//       toast.error('Could not connect to server. Please try again.');
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setSearch('');
//     setSelectedCategory('all');
//     setSortBy('newest');
//     setStockFilter('all');
//     setPage(1);
//   };

//   // Get stock status text and color
//   const getStockStatus = (quantity) => {
//     if (quantity === 0) {
//       return {
//         text: 'Not Available',
//         color: 'error',
//         badgeColor: 'badge-error',
//         icon: FaExclamationTriangle
//       };
//     } else if (quantity <= 10) {
//       return {
//         text: `${quantity} Available`,
//         color: 'warning',
//         badgeColor: 'badge-warning',
//         icon: FaBox
//       };
//     } else if (quantity <= 50) {
//       return {
//         text: `${quantity} Available`,
//         color: 'info',
//         badgeColor: 'badge-info',
//         icon: FaBox
//       };
//     } else {
//       return {
//         text: `${quantity} Available`,
//         color: 'success',
//         badgeColor: 'badge-success',
//         icon: FaCheckCircle
//       };
//     }
//   };

//   const generatePaginationButtons = () => {
//     const buttons = [];
//     const maxVisibleButtons = 5;

//     if (pages <= maxVisibleButtons) {
//       for (let i = 1; i <= pages; i++) {
//         buttons.push(i);
//       }
//     } else {
//       if (page <= 3) {
//         for (let i = 1; i <= 4; i++) buttons.push(i);
//         buttons.push('...');
//         buttons.push(pages);
//       } else if (page >= pages - 2) {
//         buttons.push(1);
//         buttons.push('...');
//         for (let i = pages - 3; i <= pages; i++) buttons.push(i);
//       } else {
//         buttons.push(1);
//         buttons.push('...');
//         buttons.push(page - 1);
//         buttons.push(page);
//         buttons.push(page + 1);
//         buttons.push('...');
//         buttons.push(pages);
//       }
//     }

//     return buttons;
//   };

//   // Calculate statistics
//   const availableCount = products.filter(p => p.quantity > 0).length;
//   const unavailableCount = products.filter(p => p.quantity === 0).length;
//   const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

//   if (loading && products.length === 0) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
//       <Helmet>
//         <title>All Products | GarmentPro</title>
//         <meta name="description" content="Browse our complete collection of premium garments, shirts, pants, jackets, and accessories with real-time stock availability." />
//       </Helmet>

//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-12">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Collection</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
//             Explore our extensive range of quality garments with live stock availability
//           </p>

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
//             <div className="join w-full shadow-lg">
//               <input
//                 type="text"
//                 placeholder="Search products by name, description, category..."
//                 className="input input-bordered join-item flex-1 focus:ring-2 focus:ring-primary"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <button type="submit" className="btn btn-primary join-item">
//                 <FaSearch className="mr-2" />
//                 Search
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="btn btn-secondary join-item"
//               >
//                 <FaFilter className="mr-2" />
//                 Filters
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Stock Overview Banner */}
//         <div className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <h2 className="text-2xl font-bold mb-2">Inventory Overview</h2>
//               <p className="text-gray-600">Real-time stock information for all products</p>
//             </div>
//             <div className="flex flex-wrap gap-4">
//               <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
//                 <div className="stat-title">Total Products</div>
//                 <div className="stat-value text-primary">{total}</div>
//                 <div className="stat-desc">in collection</div>
//               </div>
//               <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
//                 <div className="stat-title">Available Now</div>
//                 <div className="stat-value text-success">{availableCount}</div>
//                 <div className="stat-desc">ready to ship</div>
//               </div>
//               <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
//                 <div className="stat-title">Total Stock Value</div>
//                 <div className="stat-value text-secondary">${totalStockValue.toFixed(2)}</div>
//                 <div className="stat-desc">inventory value</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8 border">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold flex items-center">
//                 <FaFilter className="mr-2" />
//                 Filter & Sort Products
//               </h2>
//               <div className="flex gap-2">
//                 <button
//                   onClick={clearFilters}
//                   className="btn btn-outline btn-sm"
//                 >
//                   <FaTimes className="mr-1" />
//                   Clear All
//                 </button>
//                 <button
//                   onClick={() => setShowFilters(false)}
//                   className="btn btn-ghost btn-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Category Filter */}
//               <div>
//                 <label className="label">
//                   <span className="label-text font-semibold">Product Category</span>
//                 </label>
//                 <div className="space-y-2">
//                   {categories.map(category => (
//                     <button
//                       key={category.value}
//                       onClick={() => {
//                         setSelectedCategory(category.value);
//                         setPage(1);
//                       }}
//                       className={`btn btn-sm w-full justify-start ${selectedCategory === category.value ? 'btn-primary' : 'btn-ghost'}`}
//                     >
//                       <FaTag className="mr-2" />
//                       {category.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Sort Filter */}
//               <div>
//                 <label className="label">
//                   <span className="label-text font-semibold">Sort Products By</span>
//                 </label>
//                 <div className="space-y-2">
//                   {sortOptions.map(option => {
//                     const Icon = option.icon;
//                     return (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setSortBy(option.value);
//                           setPage(1);
//                         }}
//                         className={`btn btn-sm w-full justify-start ${sortBy === option.value ? 'btn-primary' : 'btn-ghost'}`}
//                       >
//                         <Icon className="mr-2" />
//                         {option.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Availability Filter */}
//               <div>
//                 <label className="label">
//                   <span className="label-text font-semibold">Availability</span>
//                 </label>
//                 <div className="space-y-2">
//                   {stockOptions.map(option => {
//                     const Icon = option.icon || FaBox;
//                     return (
//                       <button
//                         key={option.value}
//                         onClick={() => {
//                           setStockFilter(option.value);
//                           setPage(1);
//                         }}
//                         className={`btn btn-sm w-full justify-start ${stockFilter === option.value ? 'btn-primary' : 'btn-ghost'}`}
//                       >
//                         <Icon className="mr-2" />
//                         {option.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Active Filters */}
//             <div className="mt-6 pt-6 border-t">
//               <h3 className="font-semibold mb-2">Active Filters:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {selectedCategory !== 'all' && (
//                   <span className="badge badge-primary gap-1">
//                     <FaTag />
//                     {categories.find(c => c.value === selectedCategory)?.label}
//                   </span>
//                 )}
//                 {sortBy !== 'newest' && (
//                   <span className="badge badge-secondary gap-1">
//                     <FaSortAmountDown />
//                     {sortOptions.find(s => s.value === sortBy)?.label}
//                   </span>
//                 )}
//                 {stockFilter !== 'all' && (
//                   <span className="badge badge-accent gap-1">
//                     {stockFilter === 'available' ? <FaCheckCircle /> : <FaExclamationTriangle />}
//                     {stockOptions.find(s => s.value === stockFilter)?.label}
//                   </span>
//                 )}
//                 {search && (
//                   <span className="badge badge-info gap-1">
//                     <FaSearch />
//                     Search: "{search}"
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h2 className="text-2xl font-bold">
//                 {search ? `Search Results: "${search}"` : 'Browse All Products'}
//               </h2>
//               <p className="text-gray-600 mt-1">
//                 Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} products
//                 {availableCount > 0 && ` • ${availableCount} available for immediate purchase`}
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Availability Quick Stats */}
//               <div className="hidden md:flex items-center gap-4 text-sm">
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 rounded-full bg-success"></div>
//                   <span className="font-medium">Available: {availableCount}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="w-3 h-3 rounded-full bg-error"></div>
//                   <span>Not Available: {unavailableCount}</span>
//                 </div>
//               </div>

//               {/* Results Count */}
//               <div className="badge badge-lg badge-primary">
//                 Page {page} of {pages}
//               </div>
//             </div>
//           </div>

//           {/* Quick Filter Bar */}
//           <div className="mt-4 bg-base-200 rounded-lg p-4">
//             <div className="flex flex-wrap justify-between items-center gap-2">
//               <div className="flex items-center gap-4">
//                 <span className="text-sm font-medium">Quick Categories:</span>
//                 <div className="flex flex-wrap gap-2">
//                   {categories.slice(1).map(cat => (
//                     <button
//                       key={cat.value}
//                       onClick={() => {
//                         setSelectedCategory(cat.value);
//                         setPage(1);
//                       }}
//                       className={`badge ${selectedCategory === cat.value ? 'badge-primary' : 'badge-outline'} hover:badge-primary transition-colors`}
//                     >
//                       {cat.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="btn btn-ghost btn-sm"
//                 >
//                   <FaFilter className="mr-1" />
//                   {showFilters ? 'Hide Filters' : 'Show Filters'}
//                 </button>
//                 {unavailableCount > 0 && (
//                   <button
//                     onClick={() => setStockFilter('available')}
//                     className="btn btn-success btn-sm"
//                   >
//                     <FaCheckCircle className="mr-1" />
//                     Show Available Only
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         {products.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="inline-block p-6 bg-base-200 rounded-full mb-4">
//               <FaBox className="text-6xl text-gray-400" />
//             </div>
//             <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto">
//               {search
//                 ? `No products found matching "${search}". Try different keywords.`
//                 : selectedCategory !== 'all'
//                 ? `No products available in "${categories.find(c => c.value === selectedCategory)?.label}" category.`
//                 : stockFilter === 'available'
//                 ? 'No available products at the moment. Check back later.'
//                 : 'No products in the inventory yet.'}
//             </p>
//             {(search || selectedCategory !== 'all' || stockFilter !== 'all') && (
//               <button
//                 onClick={clearFilters}
//                 className="btn btn-primary"
//               >
//                 Clear All Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Products Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//               {products.map(product => {
//                 const stockStatus = getStockStatus(product.quantity);
//                 const Icon = stockStatus.icon;
//                 const isAvailable = product.quantity > 0;

//                 return (
//                   <div
//                     key={product._id}
//                     className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${isAvailable ? 'border-base-300' : 'border-error/30'}`}
//                   >
//                     {/* Product Image */}
//                     <figure className="relative h-64">
//                       <img
//                         src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop'}
//                         alt={product.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop';
//                           e.target.onerror = null;
//                         }}
//                       />

//                       {/* Availability Badge */}
//                       <div className="absolute top-3 right-3">
//                         <span className={`badge badge-lg ${stockStatus.badgeColor}`}>
//                           <Icon className="mr-1" />
//                           {stockStatus.text}
//                         </span>
//                       </div>

//                       {/* Category Badge */}
//                       <div className="absolute top-3 left-3">
//                         <span className="badge badge-primary badge-lg">
//                           <FaTag className="mr-1" />
//                           {product.category?.charAt(0).toUpperCase() + product.category?.slice(1)}
//                         </span>
//                       </div>

//                       {/* Overlay for unavailable products */}
//                       {!isAvailable && (
//                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
//                           <span className="badge badge-error badge-lg p-4">
//                             Currently Unavailable
//                           </span>
//                         </div>
//                       )}

//                       {/* Featured Badge */}
//                       {product.showOnHome && isAvailable && (
//                         <div className="absolute bottom-3 left-3">
//                           <span className="badge badge-secondary badge-lg">
//                             Featured Product
//                           </span>
//                         </div>
//                       )}
//                     </figure>

//                     {/* Product Details */}
//                     <div className="card-body p-6">
//                       {/* Title */}
//                       <h3 className="card-title text-lg font-bold line-clamp-1">
//                         {product.title}
//                         {!isAvailable && (
//                           <span className="badge badge-error badge-sm ml-2">Unavailable</span>
//                         )}
//                       </h3>

//                       {/* Description */}
//                       <p className="text-gray-600 line-clamp-2 text-sm mb-4">
//                         {product.description}
//                       </p>

//                       {/* Price and Stock Info */}
//                       <div className="space-y-4">
//                         {/* Price Row */}
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <span className="text-3xl font-bold text-primary">
//                               ${product.price}
//                             </span>
//                             <span className="text-gray-500 text-sm ml-2">per unit</span>
//                           </div>

//                           {/* Stock Info */}
//                           <div className={`text-right ${stockStatus.color === 'error' ? 'text-error' : stockStatus.color === 'warning' ? 'text-warning' : 'text-success'}`}>
//                             <div className="font-semibold text-lg">
//                               {stockStatus.text}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Minimum order: {product.minOrder} units
//                             </div>
//                           </div>
//                         </div>

//                         {/* Stock Visualization */}
//                         {isAvailable && (
//                           <div className="space-y-2">
//                             <div className="flex justify-between text-xs">
//                               <span>Stock Level</span>
//                               <span>{product.quantity} units in inventory</span>
//                             </div>
//                             <div className={`radial-progress ${stockStatus.color === 'warning' ? 'text-warning' : stockStatus.color === 'info' ? 'text-info' : 'text-success'}`}
//                                  style={{"--value": Math.min(product.quantity, 100), "--size": "3rem"}}>
//                               {Math.min(product.quantity, 100)}%
//                             </div>
//                           </div>
//                         )}

//                         {/* Product Details */}
//                         <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
//                           <div>
//                             <span className="font-medium">Category: </span>
//                             <span className="capitalize">{product.category}</span>
//                           </div>
//                           <div>
//                             <span className="font-medium">Payment: </span>
//                             <span>{product.paymentOptions === 'cashOnDelivery' ? 'COD' : 'Advance'}</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Action Button */}
//                       <div className="card-actions justify-end mt-4">
//                         <Link
//                           to={`/products/${product._id}`}
//                           className={`btn w-full ${!isAvailable ? 'btn-error' : 'btn-primary'}`}
//                         >
//                           <FaEye className="mr-2" />
//                           {!isAvailable ? 'View Details' : 'View Details & Order'}
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {pages > 1 && (
//               <div className="flex flex-col items-center gap-6">
//                 {/* Page Navigation */}
//                 <div className="join shadow-lg">
//                   <button
//                     className="join-item btn"
//                     onClick={() => setPage(1)}
//                     disabled={page === 1}
//                   >
//                     First
//                   </button>

//                   <button
//                     className="join-item btn"
//                     onClick={() => setPage(page - 1)}
//                     disabled={page === 1}
//                   >
//                     « Previous
//                   </button>

//                   <div className="join-item px-6 flex items-center bg-base-200">
//                     <span className="font-bold">Page {page} of {pages}</span>
//                   </div>

//                   <button
//                     className="join-item btn"
//                     onClick={() => setPage(page + 1)}
//                     disabled={page === pages}
//                   >
//                     Next »
//                   </button>

//                   <button
//                     className="join-item btn"
//                     onClick={() => setPage(pages)}
//                     disabled={page === pages}
//                   >
//                     Last
//                   </button>
//                 </div>

//                 {/* Page Numbers */}
//                 <div className="join">
//                   {generatePaginationButtons().map((btn, index) => (
//                     <button
//                       key={index}
//                       className={`join-item btn ${btn === page ? 'btn-active btn-primary' : ''} ${btn === '...' ? 'btn-disabled' : ''}`}
//                       onClick={() => typeof btn === 'number' ? setPage(btn) : null}
//                       disabled={btn === '...'}
//                     >
//                       {btn}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Page Jump */}
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-medium">Go to page:</span>
//                   <input
//                     type="number"
//                     min="1"
//                     max={pages}
//                     value={page}
//                     onChange={(e) => {
//                       const value = Math.max(1, Math.min(pages, parseInt(e.target.value) || 1));
//                       setPage(value);
//                     }}
//                     className="input input-bordered input-sm w-20 text-center"
//                   />
//                   <span className="text-sm text-gray-500">
//                     of {pages} pages
//                   </span>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Footer CTA */}
//       <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
//         <div className="container mx-auto px-4 text-center">
//           <div className="max-w-3xl mx-auto">
//             <h3 className="text-2xl font-bold mb-4">Need Bulk Quantities?</h3>
//             <p className="text-gray-600 mb-6">
//               For large orders, custom designs, or wholesale pricing, contact our dedicated sales team.
//               We offer special discounts for bulk purchases and corporate orders.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <button className="btn btn-primary">
//                 Request Bulk Quote
//               </button>
//               <button className="btn btn-outline">
//                 Contact Sales Team
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaTag,
  FaBox,
  FaEye,
  FaShoppingCart,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const limit = 9;
  const API_URL =
    import.meta.env.VITE_REACT_APP_SERVER_URL || "http://localhost:5000";

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "shirt", label: "Shirts" },
    { value: "pant", label: "Pants" },
    { value: "jacket", label: "Jackets" },
    { value: "accessories", label: "Accessories" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: FaSortAmountDown },
    { value: "oldest", label: "Oldest First", icon: FaSortAmountUp },
    { value: "priceLow", label: "Price: Low to High", icon: FaSortAmountDown },
    { value: "priceHigh", label: "Price: High to Low", icon: FaSortAmountUp },
    {
      value: "quantityHigh",
      label: "Stock: High to Low",
      icon: FaSortAmountDown,
    },
    { value: "quantityLow", label: "Stock: Low to High", icon: FaSortAmountUp },
  ];

  const stockOptions = [
    { value: "all", label: "All Products" },
    { value: "available", label: "Available Products", icon: FaCheckCircle },
    {
      value: "unavailable",
      label: "Not Available",
      icon: FaExclamationTriangle,
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory, sortBy, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page,
        limit: limit,
        q: search,
        sort: sortBy,
      });

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (stockFilter === "available") {
        params.append("inStock", "true");
      } else if (stockFilter === "unavailable") {
        params.append("inStock", "false");
      }

      const response = await axios.get(`${API_URL}/products?${params}`);

      if (response.data.success) {
        setProducts(response.data.products || []);
        setPages(response.data.pages || 1);
        setTotal(response.data.total || 0);
      } else {
        toast.error("Failed to load products");
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Could not connect to server. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("newest");
    setStockFilter("all");
    setPage(1);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        text: "Not Available",
        color: "error",
        badgeColor: "badge-error",
        icon: FaExclamationTriangle,
      };
    } else if (quantity <= 10) {
      return {
        text: `${quantity} Available`,
        color: "warning",
        badgeColor: "badge-warning",
        icon: FaBox,
      };
    } else if (quantity <= 50) {
      return {
        text: `${quantity} Available`,
        color: "info",
        badgeColor: "badge-info",
        icon: FaBox,
      };
    } else {
      return {
        text: `${quantity} Available`,
        color: "success",
        badgeColor: "badge-success",
        icon: FaCheckCircle,
      };
    }
  };

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (pages <= maxVisibleButtons) {
      for (let i = 1; i <= pages; i++) {
        buttons.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) buttons.push(i);
        buttons.push("...");
        buttons.push(pages);
      } else if (page >= pages - 2) {
        buttons.push(1);
        buttons.push("...");
        for (let i = pages - 3; i <= pages; i++) buttons.push(i);
      } else {
        buttons.push(1);
        buttons.push("...");
        buttons.push(page - 1);
        buttons.push(page);
        buttons.push(page + 1);
        buttons.push("...");
        buttons.push(pages);
      }
    }

    return buttons;
  };

  const availableCount = products.filter((p) => p.quantity > 0).length;
  const unavailableCount = products.filter((p) => p.quantity === 0).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <Helmet>
        <title>All Products | GarmentPro</title>
        <meta
          name="description"
          content="Browse our complete collection of premium garments, shirts, pants, jackets, and accessories with real-time stock availability."
        />
      </Helmet>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Product Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Explore our extensive range of quality garments with live stock
            availability
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="join w-full shadow-lg">
              <input
                type="text"
                placeholder="Search products by name, description, category..."
                className="input input-bordered join-item flex-1 focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary join-item">
                <FaSearch className="mr-2" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary join-item"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stock Overview Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Inventory Overview</h2>
              <p className="text-gray-600">
                Real-time stock information for all products
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
                <div className="stat-title">Total Products</div>
                <div className="stat-value text-primary">{total}</div>
                <div className="stat-desc">in collection</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
                <div className="stat-title">Available Now</div>
                <div className="stat-value text-success">{availableCount}</div>
                <div className="stat-desc">ready to ship</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4 min-w-[140px]">
                <div className="stat-title">Total Stock Value</div>
                <div className="stat-value text-secondary">
                  ${totalStockValue.toFixed(2)}
                </div>
                <div className="stat-desc">inventory value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-base-100 rounded-xl shadow-lg p-6 mb-8 border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <FaFilter className="mr-2" />
                Filter & Sort Products
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="btn btn-outline btn-sm"
                >
                  <FaTimes className="mr-1" />
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Product Category
                  </span>
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setPage(1);
                      }}
                      className={`btn btn-sm w-full justify-start ${
                        selectedCategory === category.value
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      <FaTag className="mr-2" />
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Sort Products By
                  </span>
                </label>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setPage(1);
                        }}
                        className={`btn btn-sm w-full justify-start ${
                          sortBy === option.value ? "btn-primary" : "btn-ghost"
                        }`}
                      >
                        <Icon className="mr-2" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Availability</span>
                </label>
                <div className="space-y-2">
                  {stockOptions.map((option) => {
                    const Icon = option.icon || FaBox;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStockFilter(option.value);
                          setPage(1);
                        }}
                        className={`btn btn-sm w-full justify-start ${
                          stockFilter === option.value
                            ? "btn-primary"
                            : "btn-ghost"
                        }`}
                      >
                        <Icon className="mr-2" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <span className="badge badge-primary gap-1">
                    <FaTag />
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                  </span>
                )}
                {sortBy !== "newest" && (
                  <span className="badge badge-secondary gap-1">
                    <FaSortAmountDown />
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                  </span>
                )}
                {stockFilter !== "all" && (
                  <span className="badge badge-accent gap-1">
                    {stockFilter === "available" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaExclamationTriangle />
                    )}
                    {stockOptions.find((s) => s.value === stockFilter)?.label}
                  </span>
                )}
                {search && (
                  <span className="badge badge-info gap-1">
                    <FaSearch />
                    Search: "{search}"
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {search ? `Search Results: "${search}"` : "Browse All Products"}
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} products
                {availableCount > 0 &&
                  ` • ${availableCount} available for immediate purchase`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="font-medium">
                    Available: {availableCount}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <span>Not Available: {unavailableCount}</span>
                </div>
              </div>

              <div className="badge badge-lg badge-primary">
                Page {page} of {pages}
              </div>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-4 bg-base-200 rounded-lg p-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quick Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setPage(1);
                      }}
                      className={`badge ${
                        selectedCategory === cat.value
                          ? "badge-primary"
                          : "badge-outline"
                      } hover:badge-primary transition-colors`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-ghost btn-sm"
                >
                  <FaFilter className="mr-1" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                {unavailableCount > 0 && (
                  <button
                    onClick={() => setStockFilter("available")}
                    className="btn btn-success btn-sm"
                  >
                    <FaCheckCircle className="mr-1" />
                    Show Available Only
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-base-200 rounded-full mb-4">
              <FaBox className="text-6xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {search
                ? `No products found matching "${search}". Try different keywords.`
                : selectedCategory !== "all"
                ? `No products available in "${
                    categories.find((c) => c.value === selectedCategory)?.label
                  }" category.`
                : stockFilter === "available"
                ? "No available products at the moment. Check back later."
                : "No products in the inventory yet."}
            </p>
            {(search ||
              selectedCategory !== "all" ||
              stockFilter !== "all") && (
              <button onClick={clearFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.quantity);
                const Icon = stockStatus.icon;
                const isAvailable = product.quantity > 0;

                return (
                  <div
                    key={product._id}
                    className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${
                      isAvailable ? "border-base-300" : "border-error/30"
                    }`}
                  >
                    {/* Product Image */}
                    <figure className="relative h-64">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop";
                          e.target.onerror = null;
                        }}
                      />

                      {/* Availability Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`badge badge-lg ${stockStatus.badgeColor}`}
                        >
                          <Icon className="mr-1" />
                          {stockStatus.text}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary badge-lg">
                          <FaTag className="mr-1" />
                          {product.category?.charAt(0).toUpperCase() +
                            product.category?.slice(1)}
                        </span>
                      </div>

                      {/* Overlay for unavailable products */}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="badge badge-error badge-lg p-4">
                            Currently Unavailable
                          </span>
                        </div>
                      )}

                      {/* Featured Badge */}
                      {product.showOnHome && isAvailable && (
                        <div className="absolute bottom-3 left-3">
                          <span className="badge badge-secondary badge-lg">
                            Featured Product
                          </span>
                        </div>
                      )}
                    </figure>

                    {/* Product Details */}
                    <div className="card-body p-6">
                      {/* Title */}
                      <h3 className="card-title text-lg font-bold line-clamp-1">
                        {product.title}
                        {!isAvailable && (
                          <span className="badge badge-error badge-sm ml-2">
                            Unavailable
                          </span>
                        )}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                        {product.description}
                      </p>

                      {/* Price and Stock Info */}
                      <div className="space-y-4">
                        {/* Price Row */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-primary">
                              ${product.price}
                            </span>
                            <span className="text-gray-500 text-sm ml-2">
                              per unit
                            </span>
                          </div>

                          {/* Stock Info */}
                          <div
                            className={`text-right ${
                              stockStatus.color === "error"
                                ? "text-error"
                                : stockStatus.color === "warning"
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            <div className="font-semibold text-lg">
                              {stockStatus.text}
                            </div>
                            <div className="text-xs text-gray-500">
                              Minimum order: {product.minOrder} units
                            </div>
                          </div>
                        </div>

                        {/* Stock Visualization */}
                        {isAvailable && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Stock Level</span>
                              <span>{product.quantity} units in inventory</span>
                            </div>
                            <div
                              className={`radial-progress ${
                                stockStatus.color === "warning"
                                  ? "text-warning"
                                  : stockStatus.color === "info"
                                  ? "text-info"
                                  : "text-success"
                              }`}
                              style={{
                                "--value": Math.min(product.quantity, 100),
                                "--size": "3rem",
                              }}
                            >
                              {Math.min(product.quantity, 100)}%
                            </div>
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                          <div>
                            <span className="font-medium">Category: </span>
                            <span className="capitalize">
                              {product.category}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Payment: </span>
                            <span>
                              {product.paymentOptions === "cashOnDelivery"
                                ? "COD"
                                : "Advance"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="card-actions justify-between mt-4">
                        <Link
                          to={`/products/${product._id}`}
                          className={`btn ${
                            !isAvailable
                              ? "btn-error btn-outline"
                              : "btn-outline btn-primary"
                          }`}
                        >
                          <FaEye className="mr-2" />
                          View Details
                        </Link>

                        {isAvailable && (
                          <Link
                            to={`/booking/${product._id}`}
                            className="btn btn-primary"
                          >
                            <FaShoppingCart className="mr-2" />
                            Order Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex flex-col items-center gap-6">
                {/* Page Navigation */}
                <div className="join shadow-lg">
                  <button
                    className="join-item btn"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    First
                  </button>

                  <button
                    className="join-item btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    « Previous
                  </button>

                  <div className="join-item px-6 flex items-center bg-base-200">
                    <span className="font-bold">
                      Page {page} of {pages}
                    </span>
                  </div>

                  <button
                    className="join-item btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pages}
                  >
                    Next »
                  </button>

                  <button
                    className="join-item btn"
                    onClick={() => setPage(pages)}
                    disabled={page === pages}
                  >
                    Last
                  </button>
                </div>

                {/* Page Numbers */}
                <div className="join">
                  {generatePaginationButtons().map((btn, index) => (
                    <button
                      key={index}
                      className={`join-item btn ${
                        btn === page ? "btn-active btn-primary" : ""
                      } ${btn === "..." ? "btn-disabled" : ""}`}
                      onClick={() =>
                        typeof btn === "number" ? setPage(btn) : null
                      }
                      disabled={btn === "..."}
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* Page Jump */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={pages}
                    value={page}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(pages, parseInt(e.target.value) || 1)
                      );
                      setPage(value);
                    }}
                    className="input input-bordered input-sm w-20 text-center"
                  />
                  <span className="text-sm text-gray-500">
                    of {pages} pages
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Bulk Quantities?</h3>
            <p className="text-gray-600 mb-6">
              For large orders, custom designs, or wholesale pricing, contact
              our dedicated sales team. We offer special discounts for bulk
              purchases and corporate orders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn btn-primary">Request Bulk Quote</button>
              <button className="btn btn-outline">Contact Sales Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
