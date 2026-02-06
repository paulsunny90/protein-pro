import React, { useState } from 'react';
import { Dumbbell, Target, Timer, TrendingUp, Users, Star } from 'lucide-react';

interface FitnessPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  includes: string[];
  price: number;
  popular?: boolean;
}

const FitnessPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [duration, setDuration] = useState<string>('all');

  const plans: FitnessPlan[] = [
    {
      id: 'bulking-beginner',
      title: 'Beginner Bulking Program',
      description: 'Build muscle mass with this structured 12-week program designed for newcomers.',
      duration: '12 weeks',
      difficulty: 'beginner',
      category: 'bulking',
      rating: 4.8,
      reviews: 124,
      features: ['Full-body workouts', 'Nutrition guidance', 'Progress tracking'],
      includes: ['3 workouts per week', 'Meal plan templates', 'Supplement recommendations'],
      price: 29.99,
      popular: true
    },
    {
      id: 'cutting-intermediate',
      title: 'Intermediate Cutting Program',
      description: 'Lean out and define your muscles with this challenging 10-week cutting routine.',
      duration: '10 weeks',
      difficulty: 'intermediate',
      category: 'cutting',
      rating: 4.7,
      reviews: 89,
      features: ['Upper/Lower splits', 'Cardio protocols', 'Macronutrient tracking'],
      includes: ['5 workouts per week', 'Detailed nutrition plan', 'Weekly progress assessments'],
      price: 39.99
    },
    {
      id: 'strength-advanced',
      title: 'Advanced Strength Training',
      description: 'Maximize your strength gains with periodized training cycles.',
      duration: '16 weeks',
      difficulty: 'advanced',
      category: 'strength',
      rating: 4.9,
      reviews: 156,
      features: ['Periodization', 'Peaking protocols', 'Advanced techniques'],
      includes: ['6 workouts per week', 'Strength benchmarks', 'Injury prevention'],
      price: 49.99
    },
    {
      id: 'endurance-starter',
      title: 'Endurance Foundation',
      description: 'Build cardiovascular fitness and stamina for athletic performance.',
      duration: '8 weeks',
      difficulty: 'beginner',
      category: 'endurance',
      rating: 4.6,
      reviews: 78,
      features: ['Cardio progression', 'Recovery protocols', 'Hydration guidance'],
      includes: ['Daily cardio sessions', 'Recovery routines', 'Performance tracking'],
      price: 24.99
    },
    {
      id: 'functional-beginner',
      title: 'Functional Fitness Basics',
      description: 'Improve movement patterns and everyday functional strength.',
      duration: '8 weeks',
      difficulty: 'beginner',
      category: 'functional',
      rating: 4.5,
      reviews: 92,
      features: ['Movement patterns', 'Core strengthening', 'Balance training'],
      includes: ['3 workouts per week', 'Mobility exercises', 'Form guides'],
      price: 27.99
    },
    {
      id: 'bodyweight-advanced',
      title: 'Advanced Bodyweight Training',
      description: 'Master calisthenics and bodyweight movements for functional strength.',
      duration: '12 weeks',
      difficulty: 'advanced',
      category: 'bodyweight',
      rating: 4.8,
      reviews: 112,
      features: ['Calisthenics mastery', 'Gymnastic movements', 'Progressions'],
      includes: ['Daily skill work', 'Strength progressions', 'Flexibility training'],
      price: 34.99
    }
  ];

  const filteredPlans = plans.filter(plan => {
    const matchesCategory = filter === 'all' || plan.category === filter;
    const matchesDuration = duration === 'all' || plan.duration.includes(duration.replace('wk', 'week'));
    return matchesCategory && matchesDuration;
  });

  const categories = [
    { id: 'all', name: 'All Programs', icon: Target },
    { id: 'bulking', name: 'Bulking', icon: Dumbbell },
    { id: 'cutting', name: 'Cutting', icon: TrendingUp },
    { id: 'strength', name: 'Strength', icon: Target },
    { id: 'endurance', name: 'Endurance', icon: Timer },
    { id: 'functional', name: 'Functional', icon: Users },
    { id: 'bodyweight', name: 'Bodyweight', icon: Star }
  ];

  const durations = [
    { id: 'all', name: 'Any Duration' },
    { id: '8', name: '8 Weeks' },
    { id: '10', name: '10 Weeks' },
    { id: '12', name: '12 Weeks' },
    { id: '16', name: '16 Weeks' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedPlanDetails = selectedPlan ? plans.find(p => p.id === selectedPlan) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fitness Programs & Diet Plans
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Personalized fitness programs and nutrition plans tailored to your goals. 
            Whether you're bulking, cutting, or maintaining, we have the perfect plan for you.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setFilter(cat.id)}
                          className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                            filter === cat.id
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          <span className="text-sm">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Duration</h4>
                  <div className="space-y-2">
                    {durations.map((dur) => (
                      <button
                        key={dur.id}
                        onClick={() => setDuration(dur.id)}
                        className={`w-full px-3 py-2 rounded-lg text-left ${
                          duration === dur.id
                            ? 'bg-blue-100 text-blue-800'
                            : 'hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        <span className="text-sm">{dur.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filter === 'all' ? 'All Programs' : `${categories.find(c => c.id === filter)?.name} Programs`}
                </h2>
                <p className="text-gray-600">
                  Showing {filteredPlans.length} of {plans.length} programs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan === plan.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}
                  >
                    {plan.popular && (
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-t-xl text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{plan.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                          {plan.difficulty.charAt(0).toUpperCase() + plan.difficulty.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(plan.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {plan.rating} ({plan.reviews})
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">{plan.duration}</span>
                        <span className="text-xl font-bold text-blue-600">${plan.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Details Modal */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedPlanDetails.title}</h2>
                  <p className="text-gray-600">{selectedPlanDetails.description}</p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Program Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedPlanDetails.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(selectedPlanDetails.difficulty)}`}>
                          {selectedPlanDetails.difficulty.charAt(0).toUpperCase() + selectedPlanDetails.difficulty.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{selectedPlanDetails.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{selectedPlanDetails.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">What's Included</h3>
                    <ul className="space-y-2">
                      {selectedPlanDetails.includes.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Program Features</h3>
                    <ul className="space-y-3">
                      {selectedPlanDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Target className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">${selectedPlanDetails.price}</span>
                      <span className="text-gray-600">{selectedPlanDetails.duration}</span>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Purchase Plan
                    </button>
                    
                    <button className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Add to Favorites
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Programs?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Science-backed fitness programs designed by experts to help you achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Designed</h3>
              <p className="text-gray-600">Programs created by certified fitness professionals</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Goal Focused</h3>
              <p className="text-gray-600">Tailored specifically to your fitness objectives</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Timer className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h3>
              <p className="text-gray-600">Adaptable to your busy lifestyle</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your improvements over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from people who transformed their lives with our programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Bulking Program Graduate',
                quote: 'I gained 15 lbs of lean muscle in 12 weeks. The program was challenging but achievable.',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Cutting Program Graduate',
                quote: 'Lost 20 lbs while keeping my muscle mass. The nutrition plan was a game-changer.',
                rating: 5
              },
              {
                name: 'Emma Rodriguez',
                role: 'Strength Program Graduate',
                quote: 'My deadlift went from 225 to 315 lbs. The periodization really works!',
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FitnessPlans;