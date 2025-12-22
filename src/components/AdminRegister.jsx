import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "admin",
    status: "approved",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "https://garments-tracker-system-server-wine.vercel.app/api/users",
        formData
      );
      toast.success(`✅ ${formData.role} user created: ${response.data.email}`);
      setFormData({ email: "", name: "", role: "admin", status: "approved" });
    } catch (error) {
      toast.error("❌ Error creating user: " + error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create Admin/Manager User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border rounded"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Admin Name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
