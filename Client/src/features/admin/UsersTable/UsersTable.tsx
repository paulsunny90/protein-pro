import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Power,
} from "lucide-react";

type User = {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  subscription: string;
  orders: number;
  spent: string;
  lastActive: string;
};

const users: User[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "customer",
    status: "Active",
    subscription: "Gold",
    orders: 12,
    spent: "$245.99",
    lastActive: "2023-06-10",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "customer",
    status: "Active",
    subscription: "Silver",
    orders: 8,
    spent: "$189.50",
    lastActive: "2023-06-08",
  },
  {
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "customer",
    status: "Suspended",
    subscription: "Platinum",
    orders: 24,
    spent: "$523.75",
    lastActive: "2023-05-22",
  },
];

const badgeStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-700",
};

const planStyles: Record<string, string> = {
  Gold: "bg-purple-100 text-purple-700",
  Silver: "bg-indigo-100 text-indigo-700",
  Platinum: "bg-pink-100 text-pink-700",
};

export default function UserManagement() {
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const suspended = users.filter((u) => u.status === "Suspended").length;
  const avgOrders =
    users.reduce((a, b) => a + b.orders, 0) / users.length;

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

        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105">
          <UserPlus className="w-5 h-5" />
          <span className="font-medium">New User</span>
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-80">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <select className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
          <option>All Roles</option>
          <option>Customer</option>
          <option>Admin</option>
        </select>

        <select className="px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Suspended</option>
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
          title="Active Users"
          value={active}
          icon="✅"
          color="from-green-500 to-emerald-500"
          change="+8%"
        />
        <StatCard
          title="Suspended"
          value={suspended}
          icon="⏸️"
          color="from-orange-500 to-red-500"
          change="-2%"
        />
        <StatCard
          title="Avg. Orders"
          value={avgOrders.toFixed(1)}
          icon="📊"
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
              {users.length} users
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">User</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Email</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Role</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Subscription</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Orders</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Spent</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Last Active</th>
                <th className="py-4 px-6 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  {/* User */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-500">Online</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 text-slate-600">{u.email}</td>

                  <td className="px-6">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${badgeStyles[u.status]}`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="px-6">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${planStyles[u.subscription]}`}
                    >
                      {u.subscription}
                    </span>
                  </td>

                  <td className="px-6 font-semibold text-slate-800">{u.orders}</td>
                  <td className="px-6 font-semibold text-slate-800">{u.spent}</td>
                  <td className="px-6 text-slate-500">{u.lastActive}</td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <ActionButton icon={Eye} label="View" color="blue" />
                      <ActionButton icon={Pencil} label="Edit" color="green" />
                      <ActionButton
                        icon={Power}
                        label={u.status === "Active" ? "Suspend" : "Activate"}
                        color={u.status === "Active" ? "red" : "green"}
                      />
                    </div>
                  </td>
                </tr>
              ))}
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
