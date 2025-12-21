// pages/dashboard/Profile.jsx
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = "My Profile | GarmentPro Dashboard";
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* User Info */}
          <div className="flex items-center gap-6 mb-8">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img
                  src={user?.photoURL || "https://i.pravatar.cc/300"}
                  alt={user?.name}
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="badge badge-primary capitalize">
                  {user?.role}
                </span>
                {user?.status === "suspended" && (
                  <span className="badge badge-error">Suspended</span>
                )}
              </div>
            </div>
          </div>

          {/* Suspension Feedback */}
          {user?.status === "suspended" && user?.suspendFeedback && (
            <div className="alert alert-error mb-6">
              <div>
                <h3 className="font-bold">Account Suspended</h3>
                <div className="text-sm mt-2">
                  <p className="font-medium">Reason:</p>
                  <p>{user.suspendFeedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={user?.name || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={user?.email || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={user?.role || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    user?.status === "suspended"
                      ? "border-red-500"
                      : "border-green-500"
                  }`}
                  value={user?.status || ""}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-8">
            <button onClick={logout} className="btn btn-error">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
