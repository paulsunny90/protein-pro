import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts, deleteProduct } from '../../../store/slice/productSlice';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  CreditCard,
  UserCircle,
} from 'lucide-react';

const ProductDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '';
    return imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : imageUrl;
  };

  // ✅ MUST match store.ts => products: productReducer
  const { products, loading } = useAppSelector(
    (state) => state.product
  );

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full" />
      </div>
    );
  }

  // ================= STATS =================
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const categories = new Set(products.map((p) => p.category)).size;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '📦' },
    { label: 'Active', value: activeProducts, icon: '✅' },
    { label: 'Inactive', value: inactiveProducts, icon: '⚠️' },
    { label: 'Categories', value: categories, icon: '🏷️' },
  ];

  // ================= NAV =================
  const nav = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Users', icon: UserCircle, path: '/UserManagement' },
    { label: 'Products', icon: Package, path: '/ProductDashboard', active: true },
    { label: 'Orders', icon: ShoppingCart, path: '/OrdersPage' },
    { label: 'Subscriptions', icon: CreditCard, path: '/SubscriptionPage' },
    { label: 'Settings', icon: DollarSign, path: '/Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-2xl">
        <div className="p-6 text-lg font-bold">Admin Panel</div>

        <nav className="flex-1 px-3 space-y-2">
          {nav.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.active
                  ? 'bg-indigo-600'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <h1 className="text-2xl font-bold">Product Dashboard</h1>

          <Link
            to="/AddProduct"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Product
          </Link>
        </header>

        {/* CONTENT */}
        <main className="p-6 flex-1">

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} />
            ))}
          </div>

          {/* ================= TABLE ================= */}
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="p-4 border-b font-semibold">
              {products.length} Products
            </div>

            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-slate-50">

                    {/* Product */}
                    <td className="p-4 flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={getImageUrl(item.imageUrl)}
                          className="w-10 h-10 rounded object-cover"
                          alt={item.name}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded">
                          {item.name?.charAt(0)?.toUpperCase() || ''}
                        </div>
                      )}
                      {item.name}
                    </td>

                    <td className="p-4">{item.brand}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 font-semibold">${item.price}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.isActive
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/EditProduct/${item._id}`)}
                          className="px-3 py-1 bg-blue-100 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => item._id && dispatch(deleteProduct(item._id))}
                          className="px-3 py-1 bg-red-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

//
// ================= STAT CARD =================
//
const StatCard = ({ label, value, icon }: any) => (
  <div className="p-6 bg-white rounded-xl shadow">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-2">
      {icon} {value}
    </p>
  </div>
);

export default ProductDashboard;
