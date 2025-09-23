import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, TrendingUp, Clock, Shield, Star } from 'lucide-react';
import { useState } from 'react';
import { usePersonalization } from './PersonalizationEngine';
import { useABTest, ABTestComponent } from './ABTestingFramework';
import { useAdvancedAnalytics } from './AdvancedAnalytics';

const benefits = [
  "↗️ 300% average ROI within 12 months",
  "⚡ 80% faster processing times",
  "🎯 99.8% accuracy in predictions",
  "🛡️ Enterprise-grade security",
];

const trustSignals = [
  { metric: "98%", label: "Client Satisfaction" },
  { metric: "15M+", label: "Cost Savings Generated" },
  { metric: "150+", label: "Projects Delivered" },
  { metric: "24/7", label: "Support Available" },
];

const urgencyFeatures = [
  { icon: Clock, text: "Free consultation (Limited slots this month)" },
  { icon: TrendingUp, text: "Implementation starts within 2 weeks" },
  { icon: Shield, text: "Risk-free 30-day trial available" },
];

export const ConversionHero = () => {
  const [email, setEmail] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Advanced systems integration
  const { personalizedContent, trackInterest } = usePersonalization();
  const { trackConversion, trackClick } = useABTest();
  const { trackEvent, trackEmailCapture } = useAdvancedAnalytics();

  const handleQuickStart = () => {
    // Track multiple conversion events
    trackEvent('BUTTON_CLICK', { buttonText: 'Get 5-Minute ROI Analysis' });
    trackConversion('hero-headline-test');
    trackClick('cta-button-test');
    trackEmailCapture(email, 'hero-form');
    trackInterest('roi-analysis');
    
    console.log('Quick start clicked with email:', email);
  };

  // Get personalized content or use defaults
  const heroHeadline = personalizedContent.heroHeadline || 'Turn Your Business Into an AI Powerhouse';
  const primaryCTA = personalizedContent.primaryCTA || 'Get 5-Minute ROI Analysis';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-accent-500/20 to-primary-500/20 border border-accent-400/30 rounded-full px-6 py-3 mb-6 backdrop-blur-sm"
            >
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-accent-200 font-semibold">🔥 Limited Time: 50% Off Implementation</span>
            </motion.div>

            {/* Main Headline - Now using A/B testing */}
            <ABTestComponent testId="hero-headline-test">
              {(variant) => (
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
                >
                  {variant?.content.headline || (
                    <>
                      Turn Your Business Into an
                      <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent"> AI Powerhouse</span>
                    </>
                  )}
                </motion.h1>
              )}
            </ABTestComponent>

            {/* Value Proposition - Personalized */}
            <ABTestComponent testId="hero-headline-test">
              {(variant) => (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-300 mb-8 leading-relaxed"
                >
                  <strong className="text-white">
                    {variant?.content.subtext || "Stop losing money to manual processes."}
                  </strong> Our AI solutions deliver 
                  <span className="text-accent-400 font-semibold"> measurable results in 30 days</span> with
                  guaranteed ROI or your money back.
                </motion.p>
              )}
            </ABTestComponent>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* Quick Start Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">
                🚀 Get Your Free ROI Analysis (5-minute setup)
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 backdrop-blur-sm text-white placeholder-gray-300 focus:ring-2 focus:ring-accent-400 focus:outline-none"
                />
                {/* CTA Button with A/B Testing */}
                <ABTestComponent testId="cta-button-test">
                  {(variant) => (
                    <button
                      onClick={handleQuickStart}
                      className="bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300 flex items-center justify-center min-w-max group"
                    >
                      {variant?.content.buttonText || primaryCTA}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </ABTestComponent>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                ✓ No credit card required ✓ Results in 24 hours ✓ Guaranteed confidential
              </p>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-4 gap-4 mb-8"
            >
              {trustSignals.map((signal, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{signal.metric}</div>
                  <div className="text-xs text-gray-400">{signal.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Urgency Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-3"
            >
              {urgencyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center text-accent-300">
                  <feature.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Video Preview/Demo */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              {/* Mock Video Interface */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6">
                <div className="bg-gray-800 px-4 py-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-gray-400 text-sm ml-4">AI Dashboard Demo</div>
                </div>
                <div className="relative h-64 bg-gradient-to-br from-primary-900 to-accent-900 flex items-center justify-center">
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="group bg-white/20 backdrop-blur-md rounded-full p-6 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="absolute bottom-4 left-4 text-white text-sm">
                    ▶ See 300% ROI in Action (2 min demo)
                  </div>
                </div>
              </div>

              {/* Live Metrics Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <div className="text-green-400 text-sm mb-1">Cost Savings Today</div>
                  <div className="text-white text-xl font-bold">$47,892</div>
                  <div className="text-green-400 text-xs">↗ +12% from yesterday</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-blue-400 text-sm mb-1">Efficiency Gained</div>
                  <div className="text-white text-xl font-bold">83.7%</div>
                  <div className="text-blue-400 text-xs">↗ +5.2% this week</div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent-500 text-white text-sm font-semibold px-3 py-2 rounded-full">
                🎯 Live Results
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary-500 text-white text-sm font-semibold px-3 py-2 rounded-full">
                ⚡ Real-time AI
              </div>
            </div>

            {/* Social Proof Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-xl max-w-xs"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">TechCorp Inc.</div>
                  <div className="text-xs text-gray-600">just saved $125K with AI automation</div>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">AI Transformation Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Demo video would play here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Real client results and AI implementation showcase
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
