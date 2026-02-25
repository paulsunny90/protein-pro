import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Power,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getAllUsers, type User } from "../../../services/userService";

const badgeStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
  Verified: "bg-blue-100 text-blue-700",
  Unverified: "bg-yellow-100 text-yellow-700",
};

const planStyles: Record<string, string> = {
  gold: "bg-purple-100 text-purple-700",
  silver: "bg-indigo-100 text-indigo-700",
  platinum: "bg-pink-100 text-pink-700",
  none: "bg-slate-100 text-slate-700",
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to load users. Please check if you are logged in as an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = users.length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const premiumCount = users.filter((u) => u.plan !== "none").length;

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching User Directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 border border-red-200 text-red-700">
          <AlertCircle className="w-6 h-6" />
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-500 mt-1">Manage your customer base and user accounts</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-80">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <select className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
          <option>All Roles</option>
          <option>User</option>
          <option>Admin</option>
        </select>

        <select className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
          <option>All Statuses</option>
          <option>Verified</option>
          <option>Unverified</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={total}
          icon="👥"
          color="from-blue-500 to-cyan-500"
          change="+12%"
        />
        <StatCard
          title="Verified Users"
          value={verifiedCount}
          icon="✅"
          color="from-green-500 to-emerald-500"
          change="+8%"
        />
        <StatCard
          title="Admins"
          value={adminCount}
          icon="🛡️"
          color="from-orange-500 to-red-500"
          change="0%"
        />
        <StatCard
          title="Premium Plans"
          value={premiumCount}
          icon="✨"
          color="from-purple-500 to-indigo-500"
          change="+5%"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-indigo-200 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
              {filteredUsers.length} users found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700 min-w-[200px]">User</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Plan</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* User */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                          <span className="text-xs text-slate-500">{u.isVerified ? 'Verified' : 'Unverified'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 text-slate-600">{u.email}</td>

                  <td className="px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${u.isVerified ? badgeStyles.Verified : badgeStyles.Unverified}`}
                    >
                      {u.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>

                  <td className="px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm uppercase ${planStyles[u.plan] || planStyles.none}`}
                    >
                      {u.plan}
                    </span>
                  </td>

                  <td className="px-6 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <ActionButton icon={Eye} label="View" color="blue" />
                      <ActionButton
                        icon={Power}
                        label={u.isVerified ? "Suspend" : "Activate"}
                        color={u.isVerified ? "red" : "green"}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-center">
          <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Load More Users
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- small components ---------- */

function StatCard({
  title,
  value,
  icon,
  color,
  change
}: {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  change: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-indigo-200 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-green-600 text-sm font-semibold">{change}</span>
            <span className="text-slate-400 text-xs">from last month</span>
          </div>
        </div>
        <div className={`text-2xl p-3 rounded-xl bg-gradient-to-r ${color} shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full w-3/4 animate-pulse`}></div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  color
}: {
  icon: any;
  label: string;
  color: "blue" | "green" | "red" | "gray";
}) {
  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
    red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
    gray: "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
  };

  return (
    <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all hover:scale-105 ${colorClasses[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
