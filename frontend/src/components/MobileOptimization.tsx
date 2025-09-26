import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Calendar, ArrowUp } from 'lucide-react';

export const MobileOptimization = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3">
        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Call Button */}
        <motion.a
          href="tel:+918297982233"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </motion.a>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/918297982233?text=Hi! I'm interested in AI solutions for my business."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.a>

        {/* Schedule Call Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowMobileMenu(true)}
          className="w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Mobile Quick Action Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Get Started</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+918297982233"
                  className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Call Now - Instant Support
                </a>

                <a
                  href="https://wa.me/918297982233?text=Hi! I'm interested in AI solutions for my business."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  WhatsApp Chat
                </a>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-300"
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Schedule Free Consultation
                </button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>✓ Free consultation ✓ 24h response ✓ No commitment</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile-optimized sticky CTA bar
export const MobileCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA bar after scrolling 50% of the page
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 shadow-2xl lg:hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-sm">Ready to transform your business?</div>
              <div className="text-xs text-primary-100">Free consultation • 300% average ROI</div>
            </div>
            <button
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-primary-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
