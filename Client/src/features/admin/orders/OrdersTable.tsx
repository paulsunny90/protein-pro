import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  FileText,
  Copy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getAllOrders, type Order } from "../../../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to load orders. Please ensure you are logged in as an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o =>
    o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.orderStatus === "Pending").length;
  const completedOrders = orders.filter(o => o.orderStatus === "Delivered").length;

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching Order Directory...</p>
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
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-8 font-primary">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Order Management
        </h1>
        <p className="text-slate-500">Track and manage all customer orders</p>
      </div>


      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4 mb-8 items-end">
        <div>
          <label className="text-sm text-slate-600 block mb-1">
            Search Orders
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search by ID, name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-slate-300 text-sm
                         focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
        </div>

        <select className="px-3 py-2 rounded-lg border text-sm bg-white">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>

        <select className="px-3 py-2 rounded-lg border text-sm bg-white">
          <option>All Payments</option>
          <option>Paid</option>
          <option>Unpaid</option>
        </select>
      </div>


      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <EnhancedStatCard
          icon="📦"
          label="Total Orders"
          value={orders.length.toString()}
          color="from-blue-500 to-cyan-500"
          change="+12%"
        />
        <EnhancedStatCard
          icon="⏱️"
          label="Pending"
          value={pendingOrders.toString()}
          color="from-amber-500 to-orange-500"
          change="0"
        />
        <EnhancedStatCard
          icon="✅"
          label="Completed"
          value={completedOrders.toString()}
          color="from-green-500 to-emerald-500"
          change="+5%"
        />
        <EnhancedStatCard
          icon="💰"
          label="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="from-purple-500 to-indigo-500"
          change="+18%"
        />

      </div>


      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-4 font-semibold border-b text-slate-700">
          Order Directory
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* ---------- HEAD ---------- */}
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Status",
                  "Payment",
                  "Items",
                  "Total",
                  "Tracking",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-6 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ---------- BODY ---------- */}
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-slate-50 transition"
                >
                  {/* ID */}
                  <td className="px-6 py-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-slate-500">{order.user?.email || '-'}</p>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>

                  {/* PAYMENT */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${order.isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  {/* ITEMS */}
                  <td className="px-6 py-4">{order.orderItems.length}</td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>

                  {/* TRACKING */}
                  <td className="px-6 py-4">
                    {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        TRK-{order._id.slice(-8).toUpperCase()}
                        <Copy className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-600" />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <OrderActionButtons orderId={order._id} />
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/* ================= COMPONENTS ================= */

function EnhancedStatCard({
  icon,
  label,
  value,
  color,
  change
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  change: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-200 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-green-600 text-sm font-semibold">{change}</span>
            <span className="text-slate-400 text-xs">this month</span>
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
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-emerald-100 text-emerald-700 shadow-sm",
    Shipped: "bg-blue-100 text-blue-700 shadow-sm",
    Processing: "bg-amber-100 text-amber-700 shadow-sm",
    Pending: "bg-slate-100 text-slate-700 shadow-sm",
    Confirmed: "bg-indigo-100 text-indigo-700 shadow-sm",
    Cancelled: "bg-red-100 text-red-700 shadow-sm",
  };

  return (
    <span
      className={`px-3 py-1.5 text-xs rounded-full font-semibold ${styles[status] || styles.Pending} `}
    >
      {status}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  color,
  onClick
}: {
  icon: any;
  label: string;
  color: "blue" | "green" | "red" | "purple" | "gray";
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
    red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200",
    gray: "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
  };

  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 ${colorClasses[color]} `}
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// Order Action Buttons Component
function OrderActionButtons({ orderId }: { orderId: string }) {
  const navigate = useNavigate();

  const handleView = () => {
    console.log(`Viewing order ${orderId} `);
  };

  const handleEdit = () => {
    navigate(`/admin/orders/edit/${orderId}`);
  };

  const handleInvoice = () => {
    console.log(`Generating invoice for order ${orderId}`);
  };

  return (
    <div className="flex gap-2">
      <ActionButton icon={Eye} label="View" color="blue" onClick={handleView} />
      <ActionButton icon={Pencil} label="Edit" color="green" onClick={handleEdit} />
      <ActionButton icon={FileText} label="Invoice" color="purple" onClick={handleInvoice} />
    </div>
  );
}



