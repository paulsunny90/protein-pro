import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut, ShoppingBag, Gift, MapPin, LayoutGrid, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'BMI Calculator', path: '/bmi' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-[#a3e635] w-9 h-9 flex items-center justify-center rounded-lg font-black text-black text-base transition-transform group-hover:scale-105">
                PP
              </div>
              <span className="ml-3 text-white text-xl font-black tracking-tight uppercase">
                PROTEIN <span className="text-[#a3e635]">PRO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all ${location.pathname === link.path
                  ? 'text-[#a3e635]'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-white transition-colors p-2">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/cart" className="text-slate-400 hover:text-white transition-colors p-2">
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                >
                  <User className="h-5 w-5" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-[#111] rounded-2xl shadow-2xl border border-white/10 p-4 z-50 animate-slide-up">
                    <div className="space-y-1">
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-4 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-bold">My Orders</span>
                      </Link>

                      <Link
                        to="/saved-addresses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-4 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-bold">Saved Address</span>
                      </Link>

                      <Link
                        to="/gift-cards"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-4 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                      >
                        <Gift className="h-4 w-4" />
                        <span className="text-sm font-bold">Gift Card</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-4 px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                      >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="text-sm font-bold">Personal Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-4 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border-t border-white/5 mt-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-bold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#a3e635] text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black hover:bg-[#b4f04a] transition-all active:scale-95 shadow-lg shadow-[#a3e635]/10"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-slate-400 p-2 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-white/5 animate-slide-up">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-4 rounded-xl text-base font-bold transition-all ${location.pathname === link.path
                  ? 'bg-[#a3e635]/10 text-[#a3e635]'
                  : 'text-slate-400 hover:bg-white/5'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-4 py-4 rounded-xl text-base font-black text-[#a3e635] border border-[#a3e635]/20 bg-[#a3e635]/5 mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
