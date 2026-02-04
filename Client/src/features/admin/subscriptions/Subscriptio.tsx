

const AdminSubscriptionPage = () => {
  const subscriptions = [
    {
      name: 'Silver',
      price: '$29/mo',
      features: ['1 Product Box per month', 'Email Support', 'Basic Content Access'],
      status: 'Active',
    },
    {
      name: 'Gold',
      price: '$49/mo',
      features: ['2 Product Boxes per month', 'Priority Support', 'Premium Content Access'],
      status: 'Active',
    },
    {
      name: 'Platinum',
      price: '$79/mo',
      features: ['4 Product Boxes per month', '24/7 Support', 'Exclusive Content & Gifts'],
      status: 'Inactive',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Manage Subscriptions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          + Add Plan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-sm font-semibold text-gray-600">
              <th className="p-4">Plan Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Features</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {subscriptions.map((plan, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">{plan.name}</td>
                <td className="p-4">{plan.price}</td>
                <td className="p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {plan.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    plan.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {plan.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 flex-wrap">
                  <button className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition">
                    Delete
                  </button>
                  <button className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                    plan.status === 'Active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}>
                    {plan.status === 'Active' ? 'Deactivate' : 'Activate'}
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

export default AdminSubscriptionPage;
