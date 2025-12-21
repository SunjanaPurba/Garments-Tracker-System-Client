import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Define menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { path: "/dashboard/profile", label: "My Profile", icon: "👤" },
    ];

    if (user?.status === "suspended") {
      // Limited menu for suspended users
      if (user.role === "buyer") {
        return [
          ...baseItems,
          { path: "/dashboard/my-orders", label: "My Orders", icon: "🛒" },
        ];
      } else if (user.role === "manager") {
        return [
          ...baseItems,
          {
            path: "/dashboard/manage-products",
            label: "Manage Products",
            icon: "🛠️",
          },
          {
            path: "/dashboard/approved-orders",
            label: "Approved Orders",
            icon: "✅",
          },
        ];
      }
      return baseItems;
    }

    // Full menu for active users
    if (user?.role === "admin") {
      return [
        ...baseItems,
        { path: "/dashboard/manage-users", label: "Manage Users", icon: "👥" },
        { path: "/dashboard/all-products", label: "All Products", icon: "📦" },
        { path: "/dashboard/all-orders", label: "All Orders", icon: "📋" },
        { path: "/dashboard/analytics", label: "Analytics", icon: "📊" },
      ];
    } else if (user?.role === "manager") {
      return [
        ...baseItems,
        { path: "/dashboard/add-product", label: "Add Product", icon: "➕" },
        {
          path: "/dashboard/manage-products",
          label: "Manage Products",
          icon: "🛠️",
        },
        {
          path: "/dashboard/pending-orders",
          label: "Pending Orders",
          icon: "⏳",
        },
        {
          path: "/dashboard/approved-orders",
          label: "Approved Orders",
          icon: "✅",
        },
      ];
    } else if (user?.role === "buyer") {
      return [
        ...baseItems,
        { path: "/dashboard/my-orders", label: "My Orders", icon: "🛒" },
        { path: "/dashboard/track-order", label: "Track Order", icon: "🚚" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-1">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-ghost drawer-button"
            >
              <FiMenu className="text-xl" />
            </label>
            <span className="text-xl font-bold ml-2">Dashboard</span>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={user?.photoURL || "https://i.pravatar.cc/300"}
                    alt={user?.name}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={user?.photoURL || "https://i.pravatar.cc/300"}
                      alt={user?.name}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{user?.name || "User"}</p>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-sm capitalize">
                      {user?.role}
                    </span>
                    {user?.status === "suspended" && (
                      <span className="badge badge-sm badge-error">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mt-auto pt-6 border-t">
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error w-full flex items-center gap-2"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
