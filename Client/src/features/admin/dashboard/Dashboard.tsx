
import { Link } from "react-router-dom";

import {
  Bell,
  Users,
  Package,
  DollarSign,
  CreditCard,
  LayoutDashboard,
  ShoppingCart,
  UserCircle,
  Settings,
} from "lucide-react";

/*
  ✅ UPDATED: Using chart libraries as requested
  Libraries used:
  - recharts (BarChart, AreaChart, PieChart)

  Install first:
  npm install recharts
*/

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";


/* ----------------------------- Data ----------------------------- */

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2800 },
  { month: "May", sales: 1900 },
  { month: "Jun", sales: 2400 },
];

const categories = [
  { name: "Protein", value: 45 },
  { name: "Fitness", value: 25 },
  { name: "Baby Nutrition", value: 20 },
  { name: "Supplements", value: 10 },
];

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f97316"];

const orders = [
  { id: "#ORD-0001", customer: "Customer 1", status: "Processing", amount: "$50" },
  { id: "#ORD-0002", customer: "Customer 2", status: "Pending", amount: "$60" },
  { id: "#ORD-0003", customer: "Customer 3", status: "Delivered", amount: "$70" },
  { id: "#ORD-0004", customer: "Customer 4", status: "Processing", amount: "$80" },
  { id: "#ORD-0005", customer: "Customer 5", status: "Pending", amount: "$90" },
];

const users = [
  { name: "User 1", email: "user1@example.com", date: "2023-01-15" },
  { name: "User 2", email: "user2@example.com", date: "2023-02-15" },
  { name: "User 3", email: "user3@example.com", date: "2023-03-15" },
  { name: "User 4", email: "user4@example.com", date: "2023-04-15" },
  { name: "User 5", email: "user5@example.com", date: "2023-05-15" },
];

const statusStyle: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};


/* --------------------------- Component --------------------------- */

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "1,248", change: "+12%", icon: Users },
    { title: "Total Orders", value: "3,562", change: "+8%", icon: Package },
    { title: "Revenue", value: "$42,568", change: "+15%", icon: DollarSign },
    { title: "Active Subscriptions", value: "842", change: "+5%", icon: CreditCard },
  ];

  const nav = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Users", icon: UserCircle, path: "/UserManagement" },
    { label: "Products", icon: Package, path: "/ProductDashboard" },
    { label: "Orders", icon: ShoppingCart, path: "/OrdersPage" },
    { label: "Subscriptions", icon: CreditCard, path: "/SubscriptionPage" },
    { label: "Settings", icon: Settings, path: "/Settings" }, // you can add a page later
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white hidden md:flex flex-col">
        <div className="px-6 py-6 text-xl font-bold border-b border-white/10">
          Admin Panel
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition hover:bg-white/10 ${
                i === 0 ? "bg-white/10" : "text-slate-200"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="w-9 h-9 rounded-full border-2 border-dashed" />
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <item.icon className="w-8 h-8 text-indigo-600" />
                  <span className="text-green-600 text-sm font-medium">
                    {item.change}
                  </span>
                </div>
                <p className="text-gray-500 mt-4 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold">{item.value}</h3>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview (Area Chart) */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-6">Sales Overview</h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#4f46e5"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-6">Product Categories</h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {categories.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Tables */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 overflow-auto">
              <h2 className="font-semibold mb-4">Recent Orders</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {orders.map((o, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 font-medium">{o.id}</td>
                      <td>{o.customer}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[o.status]}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="text-right font-medium">{o.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="font-semibold mb-4">Recent Users</h2>
              <div className="space-y-4">
                {users.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-dashed" />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{u.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
