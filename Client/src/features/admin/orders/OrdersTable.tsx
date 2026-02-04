import {
  Search,
  Eye,
  Pencil,
  FileText,
  Copy,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

type Order = {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
  payment: string;
  items: number;
  total: number;
  tracking?: string;
};

const orders: Order[] = [
  {
    id: "ORD-001",
    name: "John Doe",
    email: "john@example.com",
    date: "2023-06-15",
    status: "Delivered",
    payment: "Paid",
    items: 3,
    total: 49.99,
    tracking: "TRK-123456789",
  },
  {
    id: "ORD-002",
    name: "Jane Smith",
    email: "jane@example.com",
    date: "2023-06-14",
    status: "Shipped",
    payment: "Paid",
    items: 2,
    total: 79.99,
    tracking: "TRK-987654321",
  },
  {
    id: "ORD-003",
    name: "Robert Johnson",
    email: "robert@example.com",
    date: "2023-06-13",
    status: "Processing",
    payment: "Paid",
    items: 5,
    total: 129.99,
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
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
              placeholder="Search by customer or email..."
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-slate-300 text-sm
                         focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
        </div>

        <select className="px-3 py-2 rounded-lg border text-sm bg-white">
          <option>All Statuses</option>
        </select>

        <select className="px-3 py-2 rounded-lg border text-sm bg-white">
          <option>All Payments</option>
        </select>
      </div>


      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <EnhancedStatCard 
          icon="📦" 
          label="Total Orders" 
          value="5" 
          color="from-blue-500 to-cyan-500"
          change="+12%"
        />
        <EnhancedStatCard 
          icon="⏱️" 
          label="Pending" 
          value="0" 
          color="from-amber-500 to-orange-500"
          change="0"
        />
        <EnhancedStatCard 
          icon="✅" 
          label="Completed" 
          value="2" 
          color="from-green-500 to-emerald-500"
          change="+5%"
        />
        <EnhancedStatCard 
          icon="💰" 
          label="Revenue" 
          value="$384.95" 
          color="from-purple-500 to-indigo-500"
          change="+18%"
        />

      </div>


      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="px-6 py-4 font-semibold border-b text-slate-700">
          Orders
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition"
                >
                  {/* ID */}
                  <td className="px-6 py-4 font-medium">{order.id}</td>

                  {/* CUSTOMER */}
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">{order.date}</td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  {/* PAYMENT */}
                  <td className="px-6 py-4">
                    <span className="text-emerald-600 font-medium">
                      {order.payment}
                    </span>
                  </td>

                  {/* ITEMS */}
                  <td className="px-6 py-4">{order.items}</td>

                  {/* TOTAL */}
                  <td className="px-6 py-4 font-semibold">
                    ${order.total}
                  </td>

                  {/* TRACKING */}
                  <td className="px-6 py-4">
                    {order.tracking ? (
                      <div className="flex items-center gap-2 text-xs font-mono">
                        {order.tracking}
                        <Copy className="w-4 h-4 cursor-pointer text-slate-400 hover:text-slate-600" />
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <OrderActionButtons orderId={order.id} />
                  </td>
                </tr>
              ))}
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
            <span className="text-slate-400 text-xs">this week</span>
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
  };

  return (
    <span
      className={`px-3 py-1.5 text-xs rounded-full font-semibold ${styles[status]}`}
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 ${colorClasses[color]}`}
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
    console.log(`Viewing order ${orderId}`);
    // In a real app, navigate to view order page
  };
  
  const handleEdit = () => {
    navigate(`/EditOrder/${orderId}`);
  };
  
  const handleInvoice = () => {
    console.log(`Generating invoice for order ${orderId}`);
    // In a real app, navigate to generate invoice page
  };
  
  return (
    <div className="flex gap-2">
      <ActionButton icon={Eye} label="View" color="blue" onClick={handleView} />
      <ActionButton icon={Pencil} label="Edit" color="green" onClick={handleEdit} />
      <ActionButton icon={FileText} label="Invoice" color="purple" onClick={handleInvoice} />
    </div>
  );
}
