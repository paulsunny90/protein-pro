

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Manage Subscriptions
          </h1>
          <p className="text-slate-500 mt-1">Configure subscription plans and pricing</p>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
          + Add Plan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 hover:border-indigo-200 transition-all overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Subscription Plans</h2>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            {subscriptions.length} plans
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-sm font-semibold text-slate-600">
                <th className="p-4">Plan Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Features</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((plan, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {plan.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{plan.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">{plan.price}</td>
                  <td className="p-4">
                    <ul className="space-y-1">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                      plan.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      <ActionButton label="Edit" color="blue" />
                      <ActionButton label="Delete" color="red" />
                      <ActionButton 
                        label={plan.status === 'Active' ? 'Deactivate' : 'Activate'} 
                        color={plan.status === 'Active' ? 'red' : 'green'}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 text-center">
          <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Load More Plans
          </button>
        </div>
      </div>
    </div>
  );
};

// Action Button Component
function ActionButton({ label, color }: { label: string; color: "blue" | "green" | "red" | "gray" }) {
  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-50 hover:bg-green-100 text-green-600 border-green-200",
    red: "bg-red-50 hover:bg-red-100 text-red-600 border-red-200",
    gray: "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
  };
  
  return (
    <button className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-all hover:scale-105 ${colorClasses[color]}`}>
      {label}
    </button>
  );
}

export default AdminSubscriptionPage;
