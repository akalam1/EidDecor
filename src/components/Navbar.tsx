import React, { useState, useContext, useRef, useEffect } from 'react';
import { ShoppingBag, Moon, Sun, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartContext } from '../App';
import { useTheme } from '../context/ThemeContext';
import UserMenu from './UserMenu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { openCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b 
      border-neutral-200 dark:border-yellow-500/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 font-bold text-lg md:text-xl text-yellow-600 dark:text-yellow-500 
              hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
          >
            Ramadan & Eid Decor
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">Home</Link> */}
            <Link
              to="/category/ramadan"
              className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
            >
              Ramadan
            </Link>
            <Link
              to="/category/eid"
              className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
            >
              Eid
            </Link>
            <Link
              to="/category/new"
              className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
            >
              New Arrivals
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-2 hover:bg-neutral-800 rounded-full ${
                  isAuthenticated
                    ? 'text-yellow-600 dark:text-yellow-500'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <UserMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
              />
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-yellow-600 dark:text-yellow-500 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full relative group text-yellow-600 dark:text-yellow-500 transition-colors"
              onClick={openCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full 
                  flex items-center justify-center transform scale-100 transition-all duration-200
                  group-hover:scale-110 group-hover:bg-yellow-400"
                >
                  {totalItems}
                </span>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-16 left-0 right-0 bg-white dark:bg-dark-lighter border-b 
            border-neutral-200 dark:border-yellow-500/10 shadow-lg md:hidden"
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Link
                to="/category/ramadan"
                className="px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 
                  hover:bg-neutral-100 dark:hover:bg-dark-light transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Moon className="w-5 h-5" />
                Ramadan
              </Link>
              <Link
                to="/category/eid"
                className="px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 
                  hover:bg-neutral-100 dark:hover:bg-dark-light transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="w-5 h-5" />
                Eid
              </Link>
              <Link
                to="/category/new"
                className="px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 
                  hover:bg-neutral-100 dark:hover:bg-dark-light transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="w-5 h-5" />
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
