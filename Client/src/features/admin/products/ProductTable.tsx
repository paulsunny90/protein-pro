

const ProductDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '5' },
    { label: 'In Stock', value: '4' },
    { label: 'Out of Stock', value: '1' },
    { label: 'Avg. Rating', value: '4.7' },
  ];

  const products = [
    { name: 'Whey Protein Powder', sku: 'WP-1001', category: 'Protein', price: '$29.99', stock: 150, status: 'Active', rating: '4.8', reviews: 124 },
    { name: 'Plant-Based Protein', sku: 'PP-1002', category: 'Protein', price: '$34.99', stock: 85, status: 'Inactive', rating: '4.6', reviews: 89 },
    { name: 'Protein Bars', sku: 'PB-1003', category: 'Protein', price: '$19.99', stock: 200, status: 'Active', rating: '4.5', reviews: 210 },
    { name: 'Pre-Workout Supplement', sku: 'PW-1004', category: 'Supplements', price: '$39.99', stock: 0, status: 'Inactive', rating: '4.7', reviews: 76 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          + New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-end gap-4 mb-10">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Search Products</label>
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm min-w-[140px] shadow-sm">
          <option>All Categories</option>
          <option>Protein</option>
          <option>Supplements</option>
          <option>Vitamins</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm min-w-[140px] shadow-sm">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">Products</h2>
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-sm font-semibold text-gray-600">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Reviews</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {products.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100" />
                  <span className="font-semibold">{item.name}</span>
                </td>
                <td className="p-4">{item.sku}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-600">
                    {item.category}
                  </span>
                </td>
                <td className="p-4 font-medium">{item.price}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${item.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">★ {item.rating}</td>
                <td className="p-4">{item.reviews}</td>
                <td className="p-4 flex flex-wrap gap-2">
                  {/* Edit Button */}
                  <button className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition">
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button className="px-3 py-1.5 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition">
                    Delete
                  </button>

                  {/* Activate/Deactivate */}
                  <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                    item.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}>
                    {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDashboard;
