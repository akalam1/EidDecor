import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Star,
  Moon,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#fdfbf6] dark:bg-dark transition-colors duration-300">
      {/* Newsletter Section */}
      {/* <div className="border-t border-neutral-200 dark:border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-2xl font-light mb-4 text-neutral-900 dark:text-white">
              Join Our Newsletter
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-dark-lighter 
                  border border-neutral-200 dark:border-yellow-500/20
                  focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-500
                  text-neutral-900 dark:text-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-400 
                  transition-colors transform hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="border-t border-neutral-200 dark:border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <Link
                to="/"
                className="block text-2xl font-bold text-yellow-600 dark:text-yellow-500"
              >
                Ramadan & Eid Decor
              </Link>
              <p className="text-neutral-600 dark:text-neutral-400">
                Transforming spaces with elegant Islamic-inspired decor for your
                special celebrations.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-neutral-900 dark:text-white">
                Shop
              </h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => handleNavigation('/category/eid')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Eid Collection
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/category/ramadan')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Ramadan Essentials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/category/new')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    New Arrivals
                  </button>
                </li>
              </ul>
            </div>

            {/* Help Links */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-neutral-900 dark:text-white">
                Help
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                  >
                    Shipping Information
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                  >
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-neutral-900 dark:text-white">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:holidaydecors@gmail.com"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    info@example.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    (123) 456-7890
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    123 Decor Street
                    <br />
                    New York, NY 10001
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200 dark:border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              © {currentYear} Ramadan & Eid Decor. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-neutral-600 dark:text-neutral-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors text-sm"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
