import React from 'react';
import Navigation from './navigation/Navigation';
import { Mail, Instagram, Twitter, Facebook, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Athletic Footer */}
      <footer className="bg-black border-t border-white/5 py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#a3e635]/5 blur-[120px] rounded-full -z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-[#a3e635] fill-current" />
                <span className="text-2xl font-black text-white tracking-tighter italic">PROTEIN-PRO</span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                Precision engineering for the modern athlete. We provide the fuel that drives breakthrough performance and physiological peak.
              </p>
              <div className="flex items-center space-x-5">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#a3e635] hover:bg-[#a3e635]/10 transition-all">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Collections</h4>
              <ul className="space-y-4">
                {['Men\'s Performance', 'Women\'s Elite', 'Kid\'s Foundation', 'Specialty Series'].map((item) => (
                  <li key={item}>
                    <Link to="/products" className="text-sm font-bold text-slate-500 hover:text-[#a3e635] transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Performance Hub</h4>
              <ul className="space-y-4">
                {['Training Programs', 'BMI Calculator', 'Metabolic Tracker', 'Nutrition Library'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-slate-500 hover:text-[#a3e635] transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">Join the Elite</h4>
              <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                Subscribe for deployment alerts and exclusive performance protocols.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-[#a3e635]/50 transition-all"
                />
                <button className="absolute right-2 top-2 bg-[#a3e635] text-black w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#b4f04a] transition-all">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
              &copy; 2026 PROTEIN-PRO SYSTEMS. Engineered for Greatness.
            </p>
            <div className="flex space-x-8">
              {['Privacy Protocol', 'Service Terms', 'Security'].map((item) => (
                <a key={item} href="#" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;