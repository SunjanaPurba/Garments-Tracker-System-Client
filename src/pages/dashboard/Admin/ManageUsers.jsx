import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(""); // "role" or "suspend"
  const [newRole, setNewRole] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  const API = import.meta.env.VITE_REACT_APP_SERVER_URL;
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    axios
      .get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users || res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load users");
        setLoading(false);
      });
  }, [API, token]);

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalType("role");
  };

  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setSuspendReason(user.suspendFeedback || "");
    setModalType("suspend");
  };

  const handleUpdateRole = async () => {
    if (newRole === selectedUser.role) {
      setModalType("");
      return;
    }

    try {
      await axios.patch(
        `${API}/users/${selectedUser._id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((u) =>
          u._id === selectedUser._id ? { ...u, role: newRole } : u
        )
      );
      toast.success("Role updated successfully");
      setModalType("");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleToggleSuspend = async () => {
    const newStatus =
      selectedUser.status === "suspended" ? "approved" : "suspended";
    const feedback = newStatus === "suspended" ? suspendReason.trim() : "";

    if (newStatus === "suspended" && !feedback) {
      toast.error("Suspension reason is required");
      return;
    }

    try {
      await axios.patch(
        `${API}/users/${selectedUser._id}/status`,
        { status: newStatus, suspendFeedback: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((u) =>
          u._id === selectedUser._id
            ? { ...u, status: newStatus, suspendFeedback: feedback }
            : u
        )
      );
      toast.success(
        `User ${newStatus === "suspended" ? "suspended" : "approved"}`
      );
      setModalType("");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-20">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name || "N/A"}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge badge-primary capitalize">
                    {u.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.status === "suspended" ? "badge-error" : "badge-success"
                    } capitalize`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="space-x-2">
                  {u._id !== currentUser._id && (
                    <>
                      <button
                        onClick={() => openRoleModal(u)}
                        className="btn btn-xs btn-outline"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => openSuspendModal(u)}
                        className={`btn btn-xs ${
                          u.status === "suspended" ? "btn-success" : "btn-error"
                        }`}
                      >
                        {u.status === "suspended" ? "Approve" : "Suspend"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Modal */}
      {modalType === "role" && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Change Role - {selectedUser?.email}
            </h3>
            <select
              className="select select-bordered w-full mt-4"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <div className="modal-action">
              <button onClick={handleUpdateRole} className="btn btn-primary">
                Update
              </button>
              <button onClick={() => setModalType("")} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {modalType === "suspend" && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {selectedUser?.status === "suspended" ? "Approve" : "Suspend"}{" "}
              User
            </h3>
            <p className="py-4">{selectedUser?.email}</p>
            {selectedUser?.status !== "suspended" && (
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Enter suspension reason (required)"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            )}
            <div className="modal-action">
              <button onClick={handleToggleSuspend} className="btn btn-error">
                Confirm
              </button>
              <button onClick={() => setModalType("")} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
