import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, Package, BarChart3, Heart, Menu, TrendingUp, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Fitness Plans', path: '/fitness', icon: BarChart3 },
    { name: 'BMI Calculator', path: '/bmi', icon: Heart },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-emerald-500 p-2 rounded-2xl group-hover:scale-110 transition-transform">
                <Package className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-slate-900 text-2xl font-black tracking-tight">NutriFit<span className="text-emerald-500">Pro</span></span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="bg-emerald-100 p-1.5 rounded-xl">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-sm">{user?.name || 'User'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 border border-slate-100 py-2 z-50 animate-slide-up">
                    <Link
                      to="/dashboard"
                      className="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Personal Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center transition-colors border-t border-slate-50 mt-1 pt-3"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-emerald-600 font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 p-2 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-50 animate-slide-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-2xl text-base font-bold flex items-center ${location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {link.name}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-slate-50">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 rounded-2xl text-base font-bold text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center px-4 py-3 rounded-2xl text-base font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;