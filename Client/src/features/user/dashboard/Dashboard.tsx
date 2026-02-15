import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Loader2, User as UserIcon, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { getUserProfile, type User } from '../../../services/userService';
import { useAuth } from '../../../contexts/AuthContext';
import { getAllAddresses, type Address } from '../../../services/addressService';

const Dashboard = () => {

  const [userData, setUserData] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, addressData] = await Promise.all([
          getUserProfile(),
          getAllAddresses()
        ]);
        setUserData(profileData);
        setAddresses(addressData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPlanDisplayName = (plan: string) => {
    const planNames: Record<string, string> = {
      none: 'Free Plan',
      silver: 'Silver Plan',
      gold: 'Gold Plan',
      platinum: 'Platinum Plan'
    };
    return planNames[plan] || 'Free Plan';
  };

  const getPlanColor = (plan: string) => {
    const planColors: Record<string, string> = {
      none: 'text-gray-600 bg-gray-50',
      silver: 'text-indigo-600 bg-indigo-50',
      gold: 'text-yellow-600 bg-yellow-50',
      platinum: 'text-purple-600 bg-purple-50'
    };
    return planColors[plan] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const quickActions = [
    { name: 'BMI Calculator', icon: Heart, color: 'bg-red-500', path: '/bmi' },
    { name: 'View Products', icon: Plus, color: 'bg-purple-500', path: '/products' },
  ];





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const user = userData || authUser;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name || 'User'}!</h1>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-1" />
                    {user?.email || 'No email'}
                  </div>
                  {user?.phoneNumber && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {user.phoneNumber}
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-2 gap-3">
                  <span className="text-sm text-gray-500">
                    Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${getPlanColor(user?.plan || 'none')}`}>
                    {user?.plan ? getPlanDisplayName(user.plan) : 'Free Plan'}
                  </span>
                  {user?.isVerified && (
                    <>
                      <span className="mx-1 text-gray-300">•</span>
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Account Type</h3>
              <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role || 'User'}</p>
            <p className="text-sm text-gray-500 mt-1">Authentication: {user?.authProvider || 'N/A'}</p>
          </div>



          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Account Status</h3>
              <ShieldCheck className={`w-5 h-5 ${user?.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            <p className={`text-2xl font-bold ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.isVerified ? 'Account is verified' : 'Please verify your account'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer group">
              <div className={`${action.color} p-3 rounded-lg inline-block group-hover:scale-105 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="mt-2 font-medium text-gray-800">{action.name}</p>
            </Link>
          ))}
        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              Saved Addresses
            </h2>
            <Link to="/saved-addresses" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
              Manage Addresses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address._id} className={`p-4 rounded-xl border-2 transition-all ${address.isDefault ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {address.label || 'Address'}
                      {address.isDefault && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2 py-0.5 rounded">Default</span>
                      )}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-slate-800">{address.houseNoOrName && `${address.houseNoOrName}, `}{address.street}</p>
                    {address.landmark && <p className="text-xs text-gray-500"><span className="font-bold uppercase text-[9px]">Landmark:</span> {address.landmark}</p>}
                    <p>{address.city}, {address.state} - <span className="font-bold text-emerald-600">{address.postalCode}</span></p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{address.country}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {address.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No saved addresses found</p>
                <Link to="/saved-addresses" className="inline-block mt-4 text-emerald-600 font-bold hover:underline">
                  Add your first address
                </Link>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
