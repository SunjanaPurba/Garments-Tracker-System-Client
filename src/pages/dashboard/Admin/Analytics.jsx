import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaDollarSign,
  FaUsers,
  FaBox,
  FaChartLine,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaDownload,
  FaEye,
  FaStar,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data for charts
  const monthlySalesData = [
    { month: "Jan", revenue: 42000, orders: 42, profit: 21000 },
    { month: "Feb", revenue: 38000, orders: 38, profit: 19000 },
    { month: "Mar", revenue: 52000, orders: 52, profit: 26000 },
    { month: "Apr", revenue: 68000, orders: 68, profit: 34000 },
    { month: "May", revenue: 82000, orders: 82, profit: 41000 },
    { month: "Jun", revenue: 75000, orders: 75, profit: 37500 },
    { month: "Jul", revenue: 94000, orders: 94, profit: 47000 },
    { month: "Aug", revenue: 88000, orders: 88, profit: 44000 },
    { month: "Sep", revenue: 92000, orders: 92, profit: 46000 },
    { month: "Oct", revenue: 101000, orders: 101, profit: 50500 },
    { month: "Nov", revenue: 115000, orders: 115, profit: 57500 },
    { month: "Dec", revenue: 125000, orders: 125, profit: 62500 },
  ];

  const categoryData = [
    { name: "Shirts", value: 35, color: "#4f46e5" },
    { name: "Pants", value: 28, color: "#10b981" },
    { name: "Jackets", value: 22, color: "#f59e0b" },
    { name: "Accessories", value: 15, color: "#ef4444" },
  ];

  const orderStatusData = [
    { status: "Pending", count: 24, color: "#fbbf24" },
    { status: "Processing", count: 42, color: "#3b82f6" },
    { status: "Shipped", count: 68, color: "#8b5cf6" },
    { status: "Delivered", count: 156, color: "#10b981" },
    { status: "Cancelled", count: 8, color: "#ef4444" },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Premium Cotton Shirt",
      category: "Shirt",
      sales: 245,
      revenue: 36750,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Designer Denim Jacket",
      category: "Jacket",
      sales: 189,
      revenue: 56700,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Casual Chino Pants",
      category: "Pant",
      sales: 167,
      revenue: 33400,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Leather Wallet",
      category: "Accessories",
      sales: 132,
      revenue: 19800,
      rating: 4.5,
    },
    {
      id: 5,
      name: "Wool Winter Coat",
      category: "Jacket",
      sales: 98,
      revenue: 39200,
      rating: 4.9,
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1001",
      customer: "John Doe",
      amount: 450,
      status: "Delivered",
      date: "2024-01-15",
    },
    {
      id: "#ORD-1002",
      customer: "Jane Smith",
      amount: 320,
      status: "Shipped",
      date: "2024-01-14",
    },
    {
      id: "#ORD-1003",
      customer: "Robert Johnson",
      amount: 890,
      status: "Processing",
      date: "2024-01-14",
    },
    {
      id: "#ORD-1004",
      customer: "Sarah Williams",
      amount: 540,
      status: "Pending",
      date: "2024-01-13",
    },
    {
      id: "#ORD-1005",
      customer: "Michael Brown",
      amount: 230,
      status: "Delivered",
      date: "2024-01-12",
    },
  ];

  const stats = {
    totalRevenue: 125000,
    totalOrders: 156,
    activeProducts: 42,
    totalCustomers: 89,
    growthRate: 12.5,
    averageOrderValue: 450,
    conversionRate: 3.8,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "badge-success",
      Shipped: "badge-info",
      Processing: "badge-warning",
      Pending: "badge-error",
      Cancelled: "badge-neutral",
    };
    return colors[status] || "badge-neutral";
  };

  const exportReport = () => {
    toast.success("Report exported successfully!");
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your business performance in real-time
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="form-control">
            <select
              className="select select-bordered select-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
          </div>

          <button className="btn btn-outline btn-sm">
            <FaFilter className="mr-2" />
            Filter
          </button>

          <button className="btn btn-primary btn-sm" onClick={exportReport}>
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </a>
        <a
          className={`tab ${activeTab === "sales" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("sales")}
        >
          Sales
        </a>
        <a
          className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </a>
        <a
          className={`tab ${activeTab === "customers" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="p-3 rounded-full bg-primary/20">
                <FaDollarSign className="text-2xl text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <FaArrowUp className="text-green-500" />
              <span className="text-sm text-green-500 font-medium">+12.5%</span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {formatNumber(stats.totalOrders)}
                </div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="p-3 rounded-full bg-secondary/20">
                <FaShoppingCart className="text-2xl text-secondary" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Avg: {formatCurrency(stats.averageOrderValue)} per order
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-accent">
                  {formatNumber(stats.activeProducts)}
                </div>
                <div className="text-sm text-gray-600">Active Products</div>
              </div>
              <div className="p-3 rounded-full bg-accent/20">
                <FaBox className="text-2xl text-accent" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              5 categories • 28 in stock
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">
                  {formatNumber(stats.totalCustomers)}
                </div>
                <div className="text-sm text-gray-600">Active Customers</div>
              </div>
              <div className="p-3 rounded-full bg-success/20">
                <FaUsers className="text-2xl text-success" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Conversion: {stats.conversionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Revenue & Orders Trend</h3>
              <span className="badge badge-ghost">{timeRange}</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Product Categories</h3>
              <Link
                to="/dashboard/all-products"
                className="btn btn-xs btn-ghost"
              >
                View All
              </Link>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Top Selling Products</h3>
              <span className="badge badge-primary">This Month</span>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold">
                                #{product.id}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FaStar className="text-yellow-500" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <span className="font-medium">{product.sales}</span>
                      </td>
                      <td className="font-bold text-primary">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Recent Orders</h3>
              <Link to="/dashboard/all-orders" className="btn btn-xs btn-ghost">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono text-sm">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="font-bold">
                        {formatCurrency(order.amount)}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="card mt-6">
        <div className="card-body">
          <h3 className="card-title mb-4">Order Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Order Count" radius={[4, 4, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="font-bold mb-2">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-bold text-success">
                  {stats.conversionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-bold text-success">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Rate</span>
                <span className="font-bold text-warning">2.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="font-bold mb-2">Inventory Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-bold text-warning">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-bold text-error">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stock Value</span>
                <span className="font-bold text-primary">
                  {formatCurrency(125000)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="font-bold mb-2">Today's Overview</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Orders</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Today</span>
                <span className="font-bold text-primary">
                  {formatCurrency(4500)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Customers</span>
                <span className="font-bold">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">
          Data refreshes automatically •{" "}
          <span className="text-success">● System Operational</span>
        </p>
      </div>
    </div>
  );
};

export default Analytics;
