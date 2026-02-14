import { useState, useEffect } from 'react';
import { Calendar, Target, Award, Plus, Edit3, BarChart3, Heart, Loader2, User as UserIcon, Mail, Phone, ShieldCheck, Crown } from 'lucide-react';
import { getUserProfile, type User } from '../../../services/userService';
import { useAuth } from '../../../contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setUserData(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  const goals = [
    { id: 1, name: 'Lose 5kg', target: 70, current: 75, unit: 'kg', completed: false },
    { id: 2, name: 'Maintain BMI 22', target: 22, current: 23.1, unit: '', completed: false },
    { id: 3, name: 'Drink 2L water daily', target: 2, current: 1.8, unit: 'L', completed: false },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100"><Target className="h-6 w-6 text-blue-600" /></div>
          <div className="ml-4">
            <p className="text-gray-500">Current Weight</p>
            <p className="text-2xl font-bold">75 kg</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100"><Heart className="h-6 w-6 text-green-600" /></div>
          <div className="ml-4">
            <p className="text-gray-500">BMI</p>
            <p className="text-2xl font-bold">23.1</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-100"><Calendar className="h-6 w-6 text-purple-600" /></div>
          <div className="ml-4">
            <p className="text-gray-500">Days Active</p>
            <p className="text-2xl font-bold">127</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-yellow-100"><Award className="h-6 w-6 text-yellow-600" /></div>
          <div className="ml-4">
            <p className="text-gray-500">Streak</p>
            <p className="text-2xl font-bold">14 days</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{goal.name}</h3>
                <p className="text-gray-600 mt-1">{goal.current} {goal.unit} / {goal.target} {goal.unit}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${goal.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {goal.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Subscription Plan</h3>
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user?.plan ? getPlanDisplayName(user.plan) : 'Free Plan'}</p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.plan === 'none' ? 'Upgrade to unlock premium features' : 'Active subscription'}
            </p>
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
            <a key={index} href={action.path} className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer group">
              <div className={`${action.color} p-3 rounded-lg inline-block group-hover:scale-105 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="mt-2 font-medium text-gray-800">{action.name}</p>
            </a>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'goals', name: 'Goals', icon: Target },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <tab.icon className="h-4 w-4 mr-2" /> {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'goals' && renderGoals()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
