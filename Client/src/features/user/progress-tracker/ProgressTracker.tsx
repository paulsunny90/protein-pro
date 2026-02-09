import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Target, BarChart3, Activity, Heart } from 'lucide-react';
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

  const [progressData] = useState<ProgressEntry[]>([
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

  const [goals] = useState<Goal[]>([
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
    <div className="min-h-screen bg-[#F8FAFC] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-8 animate-fade-in">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Activity className="h-3 w-3" />
              <span>Biometric Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Your Transformation</h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">Precision tracking for athlete-level performance monitoring.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span>Historical Data</span>
            </button>
            <button className="flex items-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              <TrendingUp className="h-5 w-5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="soft-card p-8 border-none soft-card-hover group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${stats.weightChange > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {stats.weightChange > 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weight Dynamics</p>
              <div className="flex items-baseline space-x-1 mt-2">
                <p className={`text-4xl font-black tracking-tighter ${stats.weightChange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="soft-card p-8 border-none soft-card-hover group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Target className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">Optimal</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Body Composition</p>
              <div className="flex items-baseline space-x-1 mt-2">
                <p className="text-4xl font-black tracking-tighter text-emerald-600">-{stats.bodyFatChange.toFixed(1)}%</p>
              </div>
            </div>

            <div className="soft-card p-8 border-none soft-card-hover group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Activity className="h-6 w-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg">Elite</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Muscle Mass</p>
              <div className="flex items-baseline space-x-1 mt-2">
                <p className="text-4xl font-black tracking-tighter text-emerald-600">+{stats.muscleGain.toFixed(1)}kg</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 transition-all text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/10 text-white group-hover:bg-emerald-500 transition-all">
                  <Heart className="h-6 w-6" />
                </div>
                <Link to="/bmi" className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-white px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Update</Link>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Health Score (BMI)</p>
              <div className="relative z-10 flex items-baseline space-x-2 mt-2">
                <p className="text-4xl font-black tracking-tighter text-white">22.4</p>
                <span className="text-xs font-bold text-emerald-400">Biological Optimal</span>
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'week'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'month'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('quarter')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'quarter'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  Quarter
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === 'year'
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="soft-card p-10 border-none">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Physiological Load</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Daily biometric variances in weight distribution</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#10B981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    name="Weight (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="soft-card p-10 border-none">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Core Biometrics</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Composition analysis trends</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#F43F5E"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#F43F5E', strokeWidth: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    name="Body Fat %"
                  />
                  <Line
                    type="monotone"
                    dataKey="muscleMass"
                    stroke="#10B981"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#10B981', strokeWidth: 4, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    name="Muscle Mass (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-[2rem] shadow-sm p-10 border border-slate-100 mb-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Active Goals</h3>
              <p className="text-slate-500 mt-1">Track your target achievements</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const isAchieved = goal.currentValue >= goal.targetValue;

              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    <span className={`text-sm font-medium ${isAchieved ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isAchieved ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <p className={`text-xs ${isAchieved ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    {isAchieved ? 'Goal achieved!' : `${(progress).toFixed(1)}% complete`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Entry */}
        <div className="bg-slate-900 rounded-[2.5rem] p-12 border border-slate-800 text-white overflow-hidden relative shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10 flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight">Log Biometrics</h3>
              <p className="text-slate-400 mt-2 font-medium">Keep your transformation data current for maximum precision.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl">
              <Activity className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Log Date</label>
              <input
                type="date"
                className="w-full bg-slate-800/50 border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-slate-800/50 border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-slate-800/50 border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="0.0"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Muscle (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-slate-800/50 border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="0.0"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full bg-emerald-600 text-white py-4.5 px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-2">
                <span>Commit Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;