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
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">
        Order Management
      </h1>


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

        <StatCard icon={ShoppingCart} label="Total Orders" value="5" />
        <StatCard icon={Clock} label="Pending" value="0" />
        <StatCard icon={CheckCircle} label="Completed" value="2" />
        <StatCard icon={DollarSign} label="Revenue" value="$384.95" />

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
                    <div className="flex gap-2">

                      <ActionBtn icon={Eye} label="View" />
                      <ActionBtn icon={Pencil} label="Edit" />
                      <ActionBtn icon={FileText} label="Invoice" />

                    </div>
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

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-indigo-50 rounded-xl">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-emerald-100 text-emerald-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-lg font-medium ${styles[status]}`}
    >
      {status}
    </span>
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
    <button
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs
                 hover:bg-slate-100 transition"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
