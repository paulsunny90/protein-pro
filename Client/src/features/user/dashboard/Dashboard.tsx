import React, { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, Award, Plus, Edit3, BarChart3, Heart, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for user
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'Jan 15, 2024',
    membership: 'Gold Plan',
    avatar: 'https://via.placeholder.com/100x100'
  };

  // Mock data for progress
  const progressData = [
    { date: 'Jan', weight: 85, bmi: 26.2 },
    { date: 'Feb', weight: 82, bmi: 25.3 },
    { date: 'Mar', weight: 80, bmi: 24.7 },
    { date: 'Apr', weight: 78, bmi: 24.1 },
    { date: 'May', weight: 76, bmi: 23.4 },
    { date: 'Jun', weight: 75, bmi: 23.1 },
  ];

  const goalData = [
    { name: 'Protein', value: 75 },
    { name: 'Carbs', value: 50 },
    { name: 'Fat', value: 25 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  const quickActions = [
    { name: 'BMI Calculator', icon: Heart, color: 'bg-red-500', path: '/bmi' },
    { name: 'Fitness Plans', icon: BarChart3, color: 'bg-green-500', path: '/fitness' },
    { name: 'Track Progress', icon: TrendingUp, color: 'bg-blue-500', path: '/progress' },
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
          <div className="p-3 rounded-lg bg-blue-100">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Current Weight</p>
            <p className="text-2xl font-bold">75 kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">BMI</p>
            <p className="text-2xl font-bold">23.1</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-purple-100">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Days Active</p>
            <p className="text-2xl font-bold">127</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-yellow-100">
            <Award className="h-6 w-6 text-yellow-600" />
          </div>
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
                <p className="text-gray-600 mt-1">
                  {goal.current} {goal.unit} / {goal.target} {goal.unit}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                goal.completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {goal.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span>{goal.target} {goal.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-4">Weight Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-semibold text-lg mb-4">Nutrition Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={goalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
            >
              {goalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-4 border-blue-100"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Hello, {user.name}!</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Member since {user.joinDate}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm font-medium text-blue-600">{user.membership}</span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.path}
              className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className={`${action.color} p-3 rounded-lg inline-block group-hover:scale-105 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="mt-2 font-medium text-gray-800">{action.name}</p>
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'goals', name: 'Goals', icon: Target },
                { id: 'activity', name: 'Activity', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'goals' && renderGoals()}
            {activeTab === 'activity' && renderActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
