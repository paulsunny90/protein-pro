import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Package,
  DollarSign,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";

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

import { fetchProducts } from "../../../store/slice/productSlice";
import { fetchAllOrders } from "../../../store/slice/orderSlice";
import { getAllUsers, type User } from "../../../services/userService";
import type { AppDispatch, RootState } from "../../../store";

/* ----------------------------- Config ----------------------------- */

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f97316", "#ec4899", "#8b5cf6"];

const statusStyle: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Cancelled: "bg-red-100 text-red-700",
};


/* --------------------------- Component --------------------------- */

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.product);
  const { orders, loading: ordersLoading } = useSelector((state: RootState) => state.order);
  
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchProducts(true)),
          dispatch(fetchAllOrders()),
          (async () => {
            const data = await getAllUsers();
            setUsers(data);
            setUsersLoading(false);
          })()
        ]);
        setError(null);
      } catch (err: any) {
        console.error("Dashboard Load Error:", err);
        setError("Failed to load dashboard data.");
      }
    };
    loadData();
  }, [dispatch]);

  // Calculations
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const activeSubs = users.filter(u => u.plan && u.plan !== 'none').length;

    return [
      { title: "Total Users", value: totalUsers.toLocaleString(), change: "+12%", icon: Users, color: "from-blue-500 to-cyan-500" },
      { title: "Total Orders", value: totalOrders.toLocaleString(), change: "+8%", icon: Package, color: "from-purple-500 to-indigo-500" },
      { title: "Revenue", value: `$${revenue.toLocaleString()}`, change: "+15%", icon: DollarSign, color: "from-green-500 to-emerald-500" },
      { title: "Active Subscriptions", value: activeSubs.toLocaleString(), change: "+5%", icon: CreditCard, color: "from-orange-500 to-red-500" },
    ];
  }, [users, orders]);

  const salesData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: { month: string; sales: number }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        last6Months.push({
            month: months[d.getMonth()],
            sales: 0
        });
    }

    orders.forEach(order => {
        if (!order.createdAt) return;
        const d = new Date(order.createdAt);
        const monthName = months[d.getMonth()];
        const dataPoint = last6Months.find(m => m.month === monthName);
        if (dataPoint) {
            dataPoint.sales += (order.totalAmount || 0);
        }
    });

    return last6Months;
  }, [orders]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
        const cat = p.category || "Uncategorized";
        counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  const loading = productsLoading || ordersLoading || usersLoading;

  if (loading && users.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Crunching dashboard data...</p>
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
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
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

          <div className="h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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

          <div className="h-80 min-h-[320px] flex items-center justify-center">
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                    <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                    >
                    {categoryData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />
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
            ) : (
                <div className="text-slate-400 text-sm">No product data available</div>
            )}
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">Recent Orders</h2>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {orders.slice(0, 5).length} orders
            </div>
          </div>
          <div className="overflow-hidden rounded-xl">
            <table className="w-full text-sm">
              <tbody>
                {orders.slice(0, 5).map((o, i) => (
                  <tr key={o._id || i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                    <td className="py-4 pl-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        #{o._id?.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">{(o.user as any)?.name || 'Guest'}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle[o.status] || 'bg-slate-100 text-slate-700'} shadow-sm`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right font-bold text-slate-800">${o.totalAmount?.toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                    <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">No orders found</td>
                    </tr>
                )}
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
            {users.slice(0, 5).map((u, i) => (
              <div
                key={u._id || i}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-all border border-transparent hover:border-green-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md uppercase">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{u.name}</p>
                    <p className="text-sm text-slate-500">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400 block">Joined</span>
                  <span className="text-sm font-semibold text-slate-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))}
            {users.length === 0 && (
                <div className="py-8 text-center text-slate-400">No users found</div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <button className="w-full py-2.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
              View All Users →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}