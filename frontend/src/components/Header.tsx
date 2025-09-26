import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change and handle body scroll
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        handleMobileMenuToggle(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen]);

  // Simple focus management without aggressive trapping
  const handleMobileMenuToggle = (open: boolean) => {
    setMobileMenuOpen(open);
    
    if (open) {
      // When opening mobile menu, scroll to top and prevent body scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when closing
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <header className="bg-white/97 backdrop-blur-md sticky top-0 z-50 border-b border-muted-200/60 shadow-elegant">
      <nav className="container-custom flex items-center justify-between py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-effect">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent">
              BengalMindAI Consultancy
            </span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-xl p-3 text-muted-700 hover:bg-muted-100 transition-colors duration-200 lg:!hidden min-h-[44px] min-w-[44px]"
            onClick={() => handleMobileMenuToggle(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 group ${
                location.pathname === item.href
                  ? 'text-primary-600'
                  : 'text-muted-700 hover:text-primary-600'
              }`}
            >
              {item.name}
              {location.pathname === item.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            to="/contact"
            className="btn-cta text-sm font-semibold px-6 py-3 group"
          >
            Get Started
            <span className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300">→</span>
          </Link>
        </div>
      </nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            id="mobile-menu"
          >
            <div 
              className="fixed inset-0 bg-muted-900/80 backdrop-blur-sm" 
              onClick={() => handleMobileMenuToggle(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-muted-900/10 shadow-elegant-lg"
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-3" onClick={() => handleMobileMenuToggle(false)}>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-900 to-muted-800 bg-clip-text text-transparent">
                    BengalMindAI Consultancy
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-xl p-3 text-muted-700 hover:bg-muted-100 transition-colors duration-200 min-h-[44px] min-w-[44px]"
                  onClick={() => handleMobileMenuToggle(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-muted-200/50">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`-mx-3 block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
                          location.pathname === item.href
                            ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border-l-4 border-primary-500'
                            : 'text-muted-700 hover:bg-muted-50 hover:text-primary-600'
                        }`}
                        onClick={() => handleMobileMenuToggle(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link
                      to="/contact"
                      className="btn-cta w-full text-center py-4"
                      onClick={() => handleMobileMenuToggle(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
