import { Link } from 'react-router-dom';
import { Package, Heart, Users, Star, Shield, Award, Zap, Target, Activity, Apple, Droplets } from 'lucide-react';

const PremiumHomePage = () => {
  const heroFeatures = [
    {
      icon: Package,
      title: 'Premium Products',
      description: 'High-quality protein and nutrition products tailored to your needs'
    },
    {
      icon: Activity,
      title: 'Fitness Tracking',
      description: 'Monitor your fitness journey with advanced analytics and insights'
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description: 'Expert nutrition advice for optimal wellness and performance'
    }
  ];

  const stats = [
    { label: 'Scientifically Tested', val: '100%', icon: Shield },
    { label: 'Active Members', val: '50k+', icon: Users },
    { label: 'Energy Boost', val: '2x', icon: Zap },
    { label: 'Satisfaction Rate', val: '98%', icon: Star }
  ];

  const subscriptionPlans = [
    {
      name: 'Essential Plan',
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
      name: 'Performance Plan',
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
      name: 'Elite Plan',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden section-padding">
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-[80px] opacity-40"></div>

        <div className="relative container-max text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest mb-8 animate-slide-up">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Science-Backed Nutrition</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter display-font animate-slide-up">
            Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Fitness Journey</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up [animation-delay:100ms]">
            NutriFit Pro delivers elite-grade supplements and personalized fitness plans
            designed to unlock your body's natural potential and elevate your performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up [animation-delay:200ms]">
            <Link
              to="/products"
              className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-5 rounded-3xl font-black text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center"
            >
              Start Your Journey
              <Package className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/subscriptions"
              className="bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/50 px-10 py-5 rounded-3xl font-black text-lg hover:bg-white transition-all shadow-lg shadow-slate-200/50 flex items-center justify-center"
            >
              View Plans
            </Link>
          </div>
        </div>

        <div className="container-max mt-24 animate-slide-up [animation-delay:300ms]">
          <div className="premium-card premium-card-hover overflow-hidden group">
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2rem] flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                  <Apple className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Premium Nutrition</h3>
                <p className="text-slate-600 font-medium max-w-md mx-auto">Discover our flagship supplement line crafted with precision</p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-[2rem]">
              <div className="flex items-end justify-between text-white">
                <div>
                  <h3 className="text-2xl font-black mb-1">NutriFit Elite</h3>
                  <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Premium Formula</p>
                </div>
                <div className="text-right">
                  <span className="block text-emerald-300 text-xl font-black mb-2">$59.90</span>
                  <button className="bg-white text-slate-900 px-6 py-2.5 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all active:scale-95 shadow-lg">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white/50">
        <div className="container-max">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight display-font">Optimized Performance</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Every NutriFit Pro solution is crafted with pharmaceutical precision
              and athlete-level dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="premium-card premium-card-hover group p-10">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-emerald-500/10">
                    <IconComponent className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 display-font">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container-max">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="premium-card text-center p-8 hover:scale-105 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/20">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <span className="block text-4xl font-black text-slate-800 mb-2 display-font">{stat.val}</span>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Focus */}
      <section className="py-32 bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100/50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Droplets className="h-3 w-3" />
                <span>Nutrition Science</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 display-font">Precision Nutrition</h2>
              <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                Our scientifically-formulated supplements are designed to fuel your body with
                the exact nutrients it needs for peak performance and recovery.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Personalized Plans</h3>
                    <p className="text-slate-600 font-medium">Tailored nutrition programs based on your fitness goals and body composition.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Quality Assurance</h3>
                    <p className="text-slate-600 font-medium">Rigorous testing ensures purity, potency, and safety in every batch.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 mb-2">Fast Results</h3>
                    <p className="text-slate-600 font-medium">Experience noticeable improvements in energy, recovery, and performance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="premium-card premium-card-hover overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1532029837206-abbe2b761516?auto=format&fit=crop&w=800&h=600&q=80"
                alt="Nutrition Focus"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl -ml-48 opacity-30"></div>
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 display-font">Fitness Programs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Flexible options engineered to support your unique metabolic requirements
              and lifestyle goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`premium-card premium-card-hover flex flex-col p-10 ${plan.popular ? 'ring-2 ring-emerald-500 scale-105 shadow-2xl shadow-emerald-500/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    Most Popular
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="text-2xl font-black text-slate-800 mb-2 display-font">{plan.name}</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-black text-slate-800">{plan.price}</span>
                    <span className="text-slate-500 font-bold ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-600 font-medium">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                          <Star className="w-3 h-3 text-emerald-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/subscriptions"
                  className={`w-full text-center py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]"></div>
        <div className="container-max relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 display-font">
            Ready to Transform <br /> Your Body?
          </h2>
          <p className="text-xl mb-12 text-emerald-100 font-medium max-w-2xl mx-auto">
            Join thousands of satisfied members and start your fitness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/products"
              className="bg-white text-emerald-600 px-10 py-5 rounded-3xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl active:scale-95"
            >
              Explore Products
            </Link>
            <Link
              to="/signup"
              className="bg-transparent text-white border-2 border-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-white/10 transition-all active:scale-95"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumHomePage;