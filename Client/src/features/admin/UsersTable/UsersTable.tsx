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
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>

        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700">
          <UserPlus className="w-4 h-4" />
          New User
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white"
          />
        </div>

        <select className="px-4 py-2 rounded-xl border bg-white">
          <option>All Roles</option>
        </select>

        <select className="px-4 py-2 rounded-xl border bg-white">
          <option>All Statuses</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card title="Total Users" value={total} />
        <Card title="Active Users" value={active} />
        <Card title="Suspended" value={suspended} />
        <Card title="Avg. Orders" value={avgOrders.toFixed(1)} />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow p-6 border">

        <h2 className="font-semibold mb-4">Users</h2>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-3">User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">

                {/* User */}
                <td className="py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed" />
                  <span className="font-medium">{u.name}</span>
                </td>

                <td>{u.email}</td>

                <td>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {u.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${badgeStyles[u.status]}`}
                  >
                    {u.status}
                  </span>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${planStyles[u.subscription]}`}
                  >
                    {u.subscription}
                  </span>
                </td>

                <td>{u.orders}</td>
                <td>{u.spent}</td>
                <td>{u.lastActive}</td>

                {/* Actions */}
                <td className="flex gap-2">
                  <ActionBtn icon={Eye} label="View" />
                  <ActionBtn icon={Pencil} label="Edit" />
                  <ActionBtn
                    icon={Power}
                    label={u.status === "Active" ? "Suspend" : "Activate"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- small components ---------- */

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <button className="flex items-center gap-1 px-3 py-1 border rounded-lg hover:bg-gray-100 text-xs">
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
