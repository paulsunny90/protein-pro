import { Link } from 'react-router-dom';
import { Package, Shield, Truck, Activity, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const heroFeatures = [
    {
      icon: Package,
      title: 'Premium Products',
      description: 'High-quality protein and nutrition products tailored to your needs'
    },
    {
      icon: Activity,
      title: 'Performance Growth',
      description: 'Expert nutrition advice for optimal wellness and peak performance'
    },
    {
      icon: Shield,
      title: 'Authentic Labs',
      description: '100% Authentic Products tested in certified laboratories'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Get your premium products delivered to your doorstep in record time'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Dark Overlay Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920"
            alt="Gym Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        <div className="relative container-max z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-3 text-[#a3e635] mb-6 animate-slide-up">
              <span className="text-xs font-black uppercase tracking-[0.3em]">Premium Sports Nutrition</span>
            </div>

            <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-8 animate-slide-up">
              <span className="text-white block">FUEL YOUR</span>
              <span className="text-[#a3e635] block">GREATNESS</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-12 animate-slide-up [animation-delay:100ms] font-medium">
              Science-backed supplements engineered for athletes who
              demand the best. Pure ingredients, proven results.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 animate-slide-up [animation-delay:200ms]">
              <Link
                to="/products"
                className="bg-[#a3e635] text-black px-10 py-5 rounded-xl font-black text-lg hover:bg-[#b4f04a] transition-all active:scale-95 flex items-center justify-center shadow-2xl shadow-[#a3e635]/20"
              >
                Shop Now
                <Package className="ml-3 h-5 w-5" />
              </Link>
              <Link
                to="/bmi"
                className="bg-transparent text-white border border-white/20 backdrop-blur-md px-10 py-5 rounded-xl font-black text-lg hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center"
              >
                BMI Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Accent Glow */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#a3e635]/20 rounded-full blur-[120px] animate-pulse"></div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-[#0d0d0d] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
        <div className="container-max relative z-10 px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">PROTEIN PERFORMANCE</h2>
            <div className="w-20 h-1.5 bg-[#a3e635] mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
              Every Protein Pro formula is engineered with clinical precision
              and tested by professional athletes for maximum output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heroFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-[#111] border border-white/5 p-10 rounded-[2rem] hover:bg-[#161616] transition-all group">
                  <div className="bg-[#a3e635] w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-[#a3e635]/10">
                    <IconComponent className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop by Collection */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="container-max px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tight">SHOP BY COLLECTION</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Men's Collection */}
            <Link to="/products" className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all hover:border-[#a3e635]/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1a237e33,_transparent_70%)]"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[#a3e635] text-[10px] font-black uppercase tracking-[0.3em] mb-3">PEAK PERFORMANCE</span>
                <h3 className="text-4xl font-black text-white mb-6">Men's Collection</h3>
                <span className="text-[#a3e635] text-sm font-black flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Women's Collection */}
            <Link to="/products" className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all hover:border-[#a3e635]/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#4a148c33,_transparent_70%)]"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[#a3e635] text-[10px] font-black uppercase tracking-[0.3em] mb-3">LEAN & STRONG</span>
                <h3 className="text-4xl font-black text-white mb-6">Women's Collection</h3>
                <span className="text-[#a3e635] text-sm font-black flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            {/* Kids & Baby */}
            <Link to="/products" className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all hover:border-[#a3e635]/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#5d403733,_transparent_70%)]"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[#a3e635] text-[10px] font-black uppercase tracking-[0.3em] mb-3">GROWING STRONG</span>
                <h3 className="text-4xl font-black text-white mb-6">Kids & Baby</h3>
                <span className="text-[#a3e635] text-sm font-black flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a3e635]/10 rounded-full blur-[120px]"></div>
        <div className="container-max relative z-10 text-center px-4">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
            READY TO LEVEL UP?
          </h2>
          <p className="text-xl mb-12 text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Join the elite circle of athletes who have already transformed
            their performance with Protein Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="bg-[#a3e635] text-black px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#b4f04a] transition-all hover:-translate-y-1 shadow-xl shadow-[#a3e635]/20"
            >
              Join The Elite
            </Link>
            <Link
              to="/products"
              className="bg-transparent text-white border-2 border-white/10 px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/5 transition-all"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
