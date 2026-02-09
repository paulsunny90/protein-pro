
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Heart, Users, Star, Shield } from 'lucide-react';

const HomePage = () => {
  const heroFeatures = [
    {
      icon: Package,
      title: 'Premium Products',
      description: 'High-quality protein and nutrition products tailored to your needs'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with advanced analytics'
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description: 'Expert nutrition advice for optimal wellness'
    }
  ];

  const subscriptionPlans = [
    {
      name: 'Silver Plan',
      price: '$29.99',
      period: '/month',
      features: [
        'Basic protein supplements',
        'Standard shipping',
        'Access to basic plans',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Gold Plan',
      price: '$49.99',
      period: '/month',
      features: [
        'Premium protein blends',
        'Free shipping',
        'Custom fitness plans',
        'Priority support',
        'Monthly consultations'
      ],
      popular: true
    },
    {
      name: 'Platinum Plan',
      price: '$79.99',
      period: '/month',
      features: [
        'Elite protein products',
        'Express shipping',
        'Personal trainer',
        'VIP support',
        'Custom meal plans',
        'Bi-weekly consultations'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[80px] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-3 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-10 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Premium Performance Nutrition</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter animate-slide-up">
            Science-Backed <br />
            <span className="text-emerald-600">Peak Performance</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 animate-slide-up [animation-delay:100ms]">
            NutriFit Pro delivers elite-grade supplements developed with one goal:
            to empower your body to achieve its natural maximum potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up [animation-delay:200ms]">
            <Link
              to="/products"
              className="group bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-700 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center"
            >
              Start Your Journey
              <Package className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/subscriptions"
              className="bg-white text-slate-700 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
            >
              Subscription Plans
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-32 px-4 animate-slide-up [animation-delay:300ms]">
          <div className="soft-card p-1.5 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&h=600&q=80"
              alt="Elite Fitness Environment"
              className="rounded-[2.4rem] w-full h-[550px] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-b-[2.4rem]">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">Pure Whey Elite</h3>
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Most Trusted in Performance</p>
                </div>
                <div className="text-right">
                  <span className="block text-emerald-400 text-xl font-black mb-1">$59.90</span>
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all active:scale-95">
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Optimized Formulation</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Every NutriFit Pro solution is crafted with pharmaceutical precision
              and athlete-level dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {heroFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="soft-card p-12 soft-card-hover group">
                  <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                    <IconComponent className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges / Stats Section */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Scientifically Tested', val: '100%', icon: Shield },
            { label: 'Active Subscribers', val: '50k+', icon: Users },
            { label: 'Energy Boost', val: '2x', icon: TrendingUp },
            { label: 'Satisfaction Rate', val: '98%', icon: Star }
          ].map((stat, idx) => (
            <div key={idx} className="soft-card p-10 text-center hover:scale-105 transition-all">
              <stat.icon className="h-10 w-10 text-emerald-500 mx-auto mb-6 opacity-20" />
              <span className="block text-4xl font-black text-emerald-600 mb-2">{stat.val}</span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Your Fitness Program</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Flexible options engineered to support your unique metabolic requirements
              and lifestyle goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`soft-card p-12 soft-card-hover flex flex-col ${plan.popular ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
                    Recommended
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-10">
                    <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 font-bold ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-5 mb-12">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-600 font-medium">
                        <div className="bg-emerald-100 p-1 rounded-full mr-4">
                          <Star className="w-3 h-3 text-emerald-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/subscriptions"
                  className={`w-full text-center py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${plan.popular
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700'
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 to-emerald-700"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Build Your Finest <br /> Self Today.
          </h2>
          <p className="text-xl mb-12 text-emerald-100 font-medium">
            Join the NutriFit Pro community and unlock the science of transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/products"
              className="bg-white text-emerald-600 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl active:scale-95"
            >
              Shop All Products
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-700 text-white border border-emerald-500 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-800 transition-all active:scale-95"
            >
              Join the Pro Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;