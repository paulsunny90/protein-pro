import { Link, Outlet, useLocation } from "react-router-dom";
import {
    Bell,
    Package,
    CreditCard,
    LayoutDashboard,
    ShoppingCart,
    UserCircle,
    Settings,
} from "lucide-react";

export default function AdminLayout() {
    const location = useLocation();

    const nav = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin", exact: true },
        { label: "Users", icon: UserCircle, path: "/admin/users" },
        { label: "Products", icon: Package, path: "/admin/products" },
        { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
        { label: "Subscriptions", icon: CreditCard, path: "/admin/subscriptions" },
        { label: "userpage", icon: Settings, path: "/" },
    ];

    const isActive = (path: string, exact: boolean = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

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
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all duration-300 hover:translate-x-1 ${isActive(item.path, item.exact)
                                ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 shadow-lg font-semibold"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <div className={`p-1.5 rounded-lg ${isActive(item.path, item.exact) ? "bg-indigo-500" : "bg-slate-700"}`}>
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

            {/* Main Container */}
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

                {/* Content Outlet */}
                <main className="flex-1 p-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
