import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Brain, Target, Shield, TrendingUp } from 'lucide-react';
import { ConversionHero } from '../components/ConversionHero';
import { ROICalculator } from '../components/ROICalculator';
import { InteractiveFeatures } from '../components/InteractiveFeatures';
import { EnhancedTestimonials } from '../components/EnhancedTestimonials';
import { LeadMagnetPopup, useLeadMagnet } from '../components/LeadMagnetPopup';

const stats = [
  { label: 'Projects Delivered', value: '500+', icon: Target },
  { label: 'Client Satisfaction', value: '99%', icon: Shield },
  { label: 'Years Experience', value: '10+', icon: TrendingUp },
  { label: 'AI Models Deployed', value: '150+', icon: Brain },
];

export function HomePage() {
  const { showLeadMagnet, closeLeadMagnet } = useLeadMagnet();

  return (
    <div className="bg-white overflow-hidden">
      {/* New Conversion-Focused Hero */}
      <ConversionHero />
      
      {/* ROI Calculator Section */}
      <ROICalculator />
      
      {/* Interactive Features Section */}
      <InteractiveFeatures />
      
      {/* Enhanced Testimonials */}
      <EnhancedTestimonials />

      {/* Stats Section - Keep for credibility */}
      <section className="section-padding bg-gradient-to-br from-primary-950 to-muted-900 relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="display-text text-white mb-6"
            >
              Trusted by Industry Leaders
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-accent-200 max-w-2xl mx-auto"
            >
              Our track record speaks for itself - delivering exceptional results across industries
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-premium text-center p-8 group hover:scale-105 transition-transform duration-500"
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary-900 mb-2">{stat.value}</div>
                  <div className="text-muted-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding gradient-mesh relative">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="display-text text-white mb-8"
            >
              Ready to Join the AI Revolution?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-accent-100 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Don't let your competitors gain the AI advantage. Schedule your free strategy session today and discover how to transform your business in 30 days.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/contact" className="btn-cta text-lg px-10 py-4 group">
                Book Your Free Strategy Session
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/services"
                className="btn-ghost text-lg px-10 py-4 group"
              >
                View Success Stories
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-accent-200 text-sm"
            >
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No long-term contracts
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Results guaranteed
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                30-day money back
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Popup */}
      <LeadMagnetPopup isVisible={showLeadMagnet} onClose={closeLeadMagnet} />
    </div>
  );
}
