import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaHome,
  FaBox,
  FaInfoCircle,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaUserPlus,
  FaShoppingCart,
} from "react-icons/fa";

const Navbar = ({ toggleTheme, theme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const commonLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/all-products", label: "Products", icon: <FaBox /> },
  ];

  const guestLinks = [
    { path: "/about", label: "About Us", icon: <FaInfoCircle /> },
    { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
  ];

  const userLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  ];

  return (
    <header className="sticky top-0 w-full z-50 backdrop-blur-md bg-base-100/95 border-b border-base-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Logo with Gradient and Animation */}
            <div className="relative">
              <div
                className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg 
                    group-hover:scale-105 transition-transform duration-300 
                    shadow-lg group-hover:shadow-xl"
              >
                {/* Garment/Tracking Icon */}
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {/* T-shirt outline with tracking lines */}
                  <path d="M4 4h16v2H4V4z" />
                  <path d="M20 8H4v10h16V8z" />
                  <path d="M12 8v10" />
                  <path d="M8 18v-4" />
                  <path d="M16 18v-4" />
                  {/* Tracking dot */}
                  <circle cx="18" cy="14" r="2" fill="#10B981" />
                </svg>
              </div>

              {/* Live/Active Indicator */}
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full 
                    border-2 border-white animate-pulse"
              ></div>
            </div>

            {/* Text */}
            <div>
              <div className="text-xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Garment
                </span>
                <span className="text-gray-800 dark:text-white">Pro</span>
              </div>
              <div className="text-xs text-gray-500 -mt-1 tracking-wide font-medium">
                Order & Production Tracker
              </div>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Common Links */}
            {commonLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-content font-semibold"
                    : "hover:bg-base-300 hover:text-primary"
                }`}
              >
                <span className="text-sm">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Conditional Links */}
            {!user
              ? guestLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? "bg-primary text-primary-content font-semibold"
                        : "hover:bg-base-300 hover:text-primary"
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))
              : userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? "bg-primary text-primary-content font-semibold"
                        : "hover:bg-base-300 hover:text-primary"
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <Link
                to="/cart"
                className="btn btn-circle btn-ghost btn-sm relative"
              >
                <FaShoppingCart className="text-lg" />
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            )}

            {/* Auth Buttons / User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm flex items-center gap-2"
                  >
                    <FaUser className="text-sm" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm flex items-center gap-2"
                  >
                    <FaUserPlus className="text-sm" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-primary to-secondary w-full h-full flex items-center justify-center text-white font-bold">
                          {user.displayName?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </label>
                  {isProfileOpen && (
                    <div className="mt-3 absolute right-0">
                      <ul className="menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                        <li className="p-3 border-b border-base-300">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-12 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                {user.photoURL ? (
                                  <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                  />
                                ) : (
                                  <div className="bg-gradient-to-br from-primary to-secondary w-full h-full flex items-center justify-center text-white font-bold text-xl">
                                    {user.displayName?.charAt(0) ||
                                      user.email?.charAt(0) ||
                                      "U"}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold truncate max-w-[120px]">
                                {user.displayName ||
                                  user.email?.split("@")[0] ||
                                  "User"}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                {user.email || "Guest"}
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaTachometerAlt />
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaUserCircle />
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FaBox />
                            My Orders
                          </Link>
                        </li>
                        <li className="border-t border-base-300 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-error hover:text-error"
                          >
                            <FaSignOutAlt />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden btn btn-circle btn-ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-base-300 py-4">
            <div className="flex flex-col gap-1">
              {/* Common Links */}
              {commonLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isActive(link.path)
                      ? "bg-primary text-primary-content font-semibold"
                      : "hover:bg-base-200"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Conditional Links */}
              {!user
                ? guestLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive(link.path)
                          ? "bg-primary text-primary-content font-semibold"
                          : "hover:bg-base-200"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))
                : userLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive(link.path)
                          ? "bg-primary text-primary-content font-semibold"
                          : "hover:bg-base-200"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}

              {/* Divider */}
              <div className="divider my-2"></div>

              {/* Auth Links */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200"
                  >
                    <FaUser />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-content font-semibold"
                  >
                    <FaUserPlus />
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <div className="p-3 flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-primary to-secondary w-full h-full flex items-center justify-center text-white font-bold">
                            {user.displayName?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {user.displayName ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200"
                  >
                    <FaTachometerAlt />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200"
                  >
                    <FaUserCircle />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg text-error hover:bg-error/10 text-left"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
