
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
    { title: "Total Users", value: "1,248", change: "+12%", icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Total Orders", value: "3,562", change: "+8%", icon: Package, color: "from-purple-500 to-indigo-500" },
    { title: "Revenue", value: "$42,568", change: "+15%", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { title: "Active Subscriptions", value: "842", change: "+5%", icon: CreditCard, color: "from-orange-500 to-red-500" },
  ];

  const nav = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/", active: true },
    { label: "Users", icon: UserCircle, path: "/UserManagement" },
    { label: "Products", icon: Package, path: "/ProductDashboard" },
    { label: "Orders", icon: ShoppingCart, path: "/OrdersPage" },
    { label: "Subscriptions", icon: CreditCard, path: "/SubscriptionPage" },
    { label: "Settings", icon: Settings, path: "/Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-slate-400 text-sm">ProteinPro Dashboard</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 hover:translate-x-1 ${
                item.active 
                  ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`p-1.5 rounded-lg ${item.active ? "bg-indigo-500" : "bg-slate-700"}`}>
                <item.icon className="w-5 h-5" />
              </div>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-slate-800/50 rounded-xl p-3">
            <p className="text-xs text-slate-400">System Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:border-indigo-200 group"
              >
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-md group-hover:scale-110 transition-transform`}>  
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                    {item.change}
                  </span>
                </div>
                <p className="text-slate-500 mt-4 text-sm font-medium">{item.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{item.value}</h3>
                <div className="mt-3 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full w-3/4 animate-pulse`}></div>
                </div>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview (Area Chart) */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-slate-800">Sales Overview</h2>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  Last 6 Months
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b" }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366f1"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      strokeWidth={3}
                      activeDot={{ r: 6, fill: "#6366f1" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-slate-800">Product Categories</h2>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>

              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={60}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categories.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Tables */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-slate-800">Recent Orders</h2>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {orders.length} orders
                </div>
              </div>
              <div className="overflow-hidden rounded-xl">
                <table className="w-full text-sm">
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                        <td className="py-4 pl-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            {o.id}
                          </div>
                        </td>
                        <td className="py-4 text-slate-600">{o.customer}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle[o.status]} shadow-sm`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right font-bold text-slate-800">{o.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <button className="w-full py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                  View All Orders →
                </button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-green-200 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-slate-800">Recent Users</h2>
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  New users
                </div>
              </div>
              <div className="space-y-4">
                {users.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-all border border-transparent hover:border-green-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-sm text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-400 block">Joined</span>
                      <span className="text-sm font-semibold text-slate-600">{u.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <button className="w-full py-2.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                  View All Users →
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
