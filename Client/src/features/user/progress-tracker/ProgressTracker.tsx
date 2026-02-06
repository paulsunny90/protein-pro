import React, { useState } from 'react';
import { Calendar, TrendingUp, Target, Eye, EyeOff, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  calories: number;
  workoutHours: number;
}

interface Goal {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
}

const ProgressTracker = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showData, setShowData] = useState({
    weight: true,
    bodyFat: true,
    muscleMass: true,
    calories: true,
    workoutHours: true
  });

  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    { date: 'Jan 01', weight: 78, bodyFat: 18, muscleMass: 35, calories: 2200, workoutHours: 4.5 },
    { date: 'Jan 08', weight: 77.2, bodyFat: 17.5, muscleMass: 35.2, calories: 2300, workoutHours: 5.2 },
    { date: 'Jan 15', weight: 76.5, bodyFat: 17, muscleMass: 35.5, calories: 2250, workoutHours: 4.8 },
    { date: 'Jan 22', weight: 75.8, bodyFat: 16.5, muscleMass: 35.8, calories: 2400, workoutHours: 5.5 },
    { date: 'Jan 29', weight: 75.2, bodyFat: 16, muscleMass: 36.2, calories: 2350, workoutHours: 5.0 },
    { date: 'Feb 05', weight: 74.6, bodyFat: 15.5, muscleMass: 36.5, calories: 2450, workoutHours: 5.8 },
    { date: 'Feb 12', weight: 74.1, bodyFat: 15, muscleMass: 36.8, calories: 2400, workoutHours: 5.2 },
    { date: 'Feb 19', weight: 73.5, bodyFat: 14.5, muscleMass: 37.2, calories: 2500, workoutHours: 6.0 },
    { date: 'Feb 26', weight: 73.0, bodyFat: 14, muscleMass: 37.5, calories: 2450, workoutHours: 5.7 },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Weight Loss',
      currentValue: 73.0,
      targetValue: 70,
      unit: 'kg',
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    },
    {
      id: '2',
      title: 'Body Fat %',
      currentValue: 14,
      targetValue: 12,
      unit: '%',
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    },
    {
      id: '3',
      title: 'Muscle Mass',
      currentValue: 37.5,
      targetValue: 40,
      unit: 'kg',
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    },
    {
      id: '4',
      title: 'Workout Hours',
      currentValue: 5.7,
      targetValue: 6,
      unit: 'hrs/week',
      startDate: '2024-01-01',
      endDate: '2024-06-30'
    }
  ]);

  const toggleDataVisibility = (key: keyof typeof showData) => {
    setShowData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getChartData = () => {
    return progressData.map(entry => ({
      date: entry.date,
      ...(showData.weight ? { weight: entry.weight } : {}),
      ...(showData.bodyFat ? { bodyFat: entry.bodyFat } : {}),
      ...(showData.muscleMass ? { muscleMass: entry.muscleMass } : {}),
      ...(showData.calories ? { calories: entry.calories } : {}),
      ...(showData.workoutHours ? { workoutHours: entry.workoutHours } : {})
    }));
  };

  const getStats = () => {
    if (progressData.length < 2) return null;
    
    const latest = progressData[progressData.length - 1];
    const initial = progressData[0];
    
    return {
      weightChange: ((initial.weight - latest.weight) / initial.weight) * 100,
      bodyFatChange: initial.bodyFat - latest.bodyFat,
      muscleGain: latest.muscleMass - initial.muscleMass
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
          <p className="text-gray-600">Monitor your fitness journey and achievements</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weight Change</p>
                  <p className={`text-2xl font-bold ${stats.weightChange > 0 ? 'text-red-600' : 'text-green-600'} mt-1`}>
                    {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">from start</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Body Fat Reduction</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    -{stats.bodyFatChange.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">from start</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Muscle Gain</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    +{stats.muscleGain.toFixed(1)} kg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">from start</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'week'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'month'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('quarter')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'quarter'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Quarter
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === 'year'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Show:</span>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showData.weight}
                  onChange={() => toggleDataVisibility('weight')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Weight</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showData.bodyFat}
                  onChange={() => toggleDataVisibility('bodyFat')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Body Fat</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showData.muscleMass}
                  onChange={() => toggleDataVisibility('muscleMass')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Muscle</span>
              </label>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weight Progress</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    name="Weight (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Body Composition</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Body Fat %"
                  />
                  <Line
                    type="monotone"
                    dataKey="muscleMass"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Muscle Mass (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const isAchieved = goal.currentValue >= goal.targetValue;
              
              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className={`text-sm font-medium ${
                      isAchieved ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isAchieved ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-xs ${
                    isAchieved ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isAchieved ? 'Goal achieved!' : `${(progress).toFixed(1)}% complete`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Entry */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Entry</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="70.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="15.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muscle (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="35.0"
              />
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;