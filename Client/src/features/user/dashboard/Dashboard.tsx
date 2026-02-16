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
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header Card */}
        <div className="soft-card p-6 sm:p-10 mb-8 sm:mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#a3e635]/5 blur-[80px] rounded-full -z-0"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/20 to-transparent rounded-[2rem]"></div>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 justify-center md:justify-start">
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tighter uppercase ">
                  {user?.name?.split(' ')[0] || 'WARRIOR'}!
                </h1>
                {user?.role === 'admin' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#a3e635]/10 text-[#a3e635] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#a3e635]/20 self-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    System Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 text-slate-400">
                <div className="flex items-center text-sm font-bold tracking-tight">
                  <Mail className="w-4 h-4 mr-2 text-[#a3e635]" />
                  {user?.email || 'No email'}
                </div>
                {user?.phoneNumber && (
                  <div className="flex items-center text-sm font-bold tracking-tight">
                    <Phone className="w-4 h-4 mr-2 text-[#a3e635]" />
                    {user.phoneNumber}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center mt-6 gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  DEVOPS STATUS: <span className="text-[#a3e635]">{user?.isVerified ? 'VERIFIED' : 'PENDING'}</span>
                </span>
                <div className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  RANK: <span className="text-white">{user?.plan ? getPlanDisplayName(user.plan).toUpperCase() : 'FREE PLAN'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-[2rem] p-8 border border-white/5 hover:border-[#a3e635]/20 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Protocol</h3>
              <UserIcon className="w-5 h-5 text-[#a3e635]" />
            </div>
            <p className="text-base font-normal font-black text-white mb-2">{user?.role || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Provider: {user?.authProvider || 'SYSTEM'}</p>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 hover:border-[#a3e635]/20 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Status</h3>
              <ShieldCheck className={`w-5 h-5 ${user?.isVerified ? 'text-[#a3e635]' : 'text-slate-600'}`} />
            </div>
            <p className={`text-base font-normal font-black uppercase   mb-2 ${user?.isVerified ? 'text-white' : 'text-slate-400'}`}>
              {user?.isVerified ? 'OPTIMAL' : 'PENDING'}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {user?.isVerified ? 'All systems authorized' : 'Verification required'}
            </p>
          </div>

          <div className="glass rounded-[2rem] p-8 border border-white/5 hover:border-[#a3e635]/20 transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timeline</h3>
              <Plus className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-base font-normal font-black text-white  mb-2">
              EST. {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Since {user?.createdAt ? formatDate(user.createdAt).toUpperCase() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className="soft-card p-6 text-center hover:bg-[#111] transition-all group border-white/5">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#a3e635]/10 group-hover:scale-110 transition-all`}>
                <action.icon className="h-6 w-6 text-[#a3e635]" />
              </div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{action.name}</p>
            </Link>
          ))}
        </div>

        {/* Saved Addresses Section */}
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 border border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <h2 className="text-2xl  sm:text-3xl  font-normal font-black text-white flex items-center gap-3">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3e635]" />
              LOGISTICS NODES
            </h2>
            <Link to="/saved-addresses" className="text-[10px] font-black text-[#a3e635] uppercase tracking-widest hover:underline px-4 py-2 bg-[#a3e635]/5 rounded-xl border border-[#a3e635]/10 transition-all">
              MANAGE DATABASE
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address._id} className={`p-6 sm:p-8 rounded-[2rem] border-2 transition-all group ${address.isDefault ? 'border-[#a3e635]/20 bg-[#a3e635]/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      {address.label || 'ADDRESS'}
                      {address.isDefault && (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-[#a3e635] text-black px-2 py-0.5 rounded-full">DEFAULT</span>
                      )}
                    </h3>
                  </div>
                  <div className="space-y-3 font-medium">
                    <p className="text-sm text-slate-300 leading-relaxed">{address.houseNoOrName && `${address.houseNoOrName}, `}{address.street}</p>
                    {address.landmark && <p className="text-[10px] text-slate-500 uppercase tracking-wider"><span className="text-[#a3e635]/60">LANDMARK:</span> {address.landmark}</p>}
                    <p className="text-sm text-slate-300"><span className="text-white font-black">{address.city}</span>, {address.state} — <span className="text-[#a3e635] font-black">{address.postalCode}</span></p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{address.country}</p>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-[#a3e635]" />
                      <span className="text-xs font-bold font-mono tracking-tighter">{address.phone}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-[2rem] border border-white/5 border-dashed">
                <MapPin className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-50" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs mb-6">NO DEPLOYMENT NODES CONFIGURED</p>
                <Link to="/saved-addresses" className="inline-flex bg-[#a3e635] text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#b4f04a] transition-all">
                  INITIALIZE ADDRESS
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
