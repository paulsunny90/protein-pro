import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts, deleteProduct } from '../../../store/slice/productSlice';

const ProductDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();



  // ✅ MUST match store.ts => products: productReducer
  const { products, loading } = useAppSelector(
    (state) => state.product
  );

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchProducts(true)); // Include inactive products
  }, [dispatch]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full" />
      </div>
    );
  }

  // ================= STATS =================
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inactiveProducts = products.filter((p) => !p.isActive).length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '📦' },
    { label: 'Active', value: activeProducts, icon: '✅' },
    { label: 'Inactive', value: inactiveProducts, icon: '⚠️' },
    { label: 'Categories', value: categoriesCount, icon: '🏷️' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Dashboard</h1>
        <Link
          to="/admin/products/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

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
                <td className="p-4 flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={item.image}
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
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${item.isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${item._id}`)}
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
    </div>
  );
};

// ================= STAT CARD =================
const StatCard = ({ label, value, icon }: any) => (
  <div className="p-6 bg-white rounded-xl shadow">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-2xl font-bold mt-2">
      {icon} {value}
    </p>
  </div>
);

export default ProductDashboard;
