import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle, Clock, Zap, TrendingUp, ArrowRight } from 'lucide-react';

interface LeadMagnetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const LeadMagnetPopup = ({ isVisible, onClose }: LeadMagnetProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Track conversion
      console.log('Lead captured:', { email, name, company });
      
      // Close popup after success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
        setName('');
        setCompany('');
      }, 3000);
    }, 1000);
  };

  const benefits = [
    { icon: TrendingUp, text: "15+ real case studies with ROI data" },
    { icon: Clock, text: "Implementation timeline templates" },
    { icon: Zap, text: "Cost calculator spreadsheet" },
    { icon: CheckCircle, text: "AI readiness assessment checklist" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="w-full bg-gradient-to-br from-primary-50 to-accent-50 border-t-4 border-primary-500 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {!isSuccess ? (
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Column - Value Proposition */}
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center bg-primary-100 rounded-full px-4 py-2 mb-4">
                      <Download className="w-4 h-4 mr-2 text-primary-600" />
                      <span className="text-sm font-semibold text-primary-800">Free Download</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                      The Complete AI Implementation Guide
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Everything you need to successfully implement AI in your business. 
                      Based on 150+ successful projects and $15M+ in proven savings.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                    <div className="text-sm font-semibold text-gray-900 mb-2">⚡ Instant Download</div>
                    <div className="text-xs text-gray-600">
                      PDF will be sent to your email immediately. No spam, unsubscribe anytime.
                    </div>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Get Your Free Copy Now
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Join 2,500+ business leaders who have downloaded this guide.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="john@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your Company Inc."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !email || !name}
                      className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Download Free Guide
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        No spam
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        Unsubscribe anytime
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        100% secure
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Success! Check Your Email 📧
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your AI Implementation Guide is on its way to <strong>{email}</strong>. 
                  Check your inbox (and spam folder) for the download link.
                </p>

                <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
                  <p className="text-sm text-primary-700">
                    <strong>What's next?</strong> Our team will also send you exclusive case studies and 
                    implementation tips over the next few days to help you get started.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to trigger lead magnet based on user behavior
export const useLeadMagnet = () => {
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    // Time-based trigger (30 seconds)
    const timeoutId = setTimeout(() => {
      if (!hasShown) {
        setShowLeadMagnet(true);
        setHasShown(true);
      }
    }, 30000);

    // Scroll trigger (70% down page)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !hasShown) {
        setShowLeadMagnet(true);
        setHasShown(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  return {
    showLeadMagnet,
    setShowLeadMagnet,
    closeLeadMagnet: () => setShowLeadMagnet(false)
  };
};
