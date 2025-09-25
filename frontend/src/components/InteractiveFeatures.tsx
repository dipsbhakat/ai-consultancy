import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  Rocket, 
  Users, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Cog
} from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  stats: {
    metric: string;
    label: string;
  };
  color: string;
  gradient: string;
  hoverColor: string;
}

const features: Feature[] = [
  {
    id: 'ai-intelligence',
    icon: Brain,
    title: 'AI-Powered Intelligence',
    subtitle: 'Smart Decision Making',
    description: 'Advanced machine learning algorithms that learn from your data to make intelligent predictions and automate complex decisions.',
    benefits: [
      '99.8% prediction accuracy',
      'Real-time data processing',
      'Continuous learning & improvement',
      'Custom model training'
    ],
    stats: { metric: '99.8%', label: 'Accuracy Rate' },
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
    hoverColor: 'hover:border-purple-300'
  },
  {
    id: 'automation',
    icon: Zap,
    title: 'Lightning-Fast Automation',
    subtitle: 'Instant Process Optimization',
    description: 'Automate repetitive tasks and workflows to free up your team for strategic work while ensuring 100% accuracy.',
    benefits: [
      '80% faster processing',
      'Zero human errors',
      '24/7 automated operations',
      'Seamless integration'
    ],
    stats: { metric: '80%', label: 'Speed Increase' },
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-orange-600',
    hoverColor: 'hover:border-yellow-300'
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Enterprise Security',
    subtitle: 'Bank-Grade Protection',
    description: 'Military-grade encryption and compliance with industry standards to keep your data secure and your business protected.',
    benefits: [
      'End-to-end encryption',
      'SOC 2 Type II compliant',
      'GDPR & HIPAA ready',
      'Advanced threat detection'
    ],
    stats: { metric: '100%', label: 'Uptime SLA' },
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600',
    hoverColor: 'hover:border-green-300'
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Advanced Analytics',
    subtitle: 'Data-Driven Insights',
    description: 'Comprehensive analytics dashboard with real-time metrics, predictive insights, and actionable recommendations.',
    benefits: [
      'Real-time dashboards',
      'Predictive analytics',
      'Custom reporting',
      'ROI tracking'
    ],
    stats: { metric: '300%', label: 'ROI Average' },
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
    hoverColor: 'hover:border-blue-300'
  },
  {
    id: 'scalability',
    icon: TrendingUp,
    title: 'Infinite Scalability',
    subtitle: 'Grow Without Limits',
    description: 'Cloud-native architecture that scales automatically with your business growth, handling millions of transactions seamlessly.',
    benefits: [
      'Auto-scaling infrastructure',
      'Global deployment',
      'Load balancing',
      'Performance optimization'
    ],
    stats: { metric: '1M+', label: 'Transactions/Day' },
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-purple-600',
    hoverColor: 'hover:border-indigo-300'
  },
  {
    id: 'support',
    icon: Users,
    title: 'Expert Support',
    subtitle: '24/7 Dedicated Team',
    description: 'Round-the-clock support from AI experts, dedicated account managers, and priority technical assistance.',
    benefits: [
      '24/7 expert support',
      'Dedicated account manager',
      'Priority response',
      'Success guarantee'
    ],
    stats: { metric: '<2min', label: 'Response Time' },
    color: 'text-red-600',
    gradient: 'from-red-500 to-pink-600',
    hoverColor: 'hover:border-red-300'
  }
];

const processSteps = [
  { icon: Target, title: 'Analyze', description: 'We assess your current processes and identify automation opportunities' },
  { icon: Lightbulb, title: 'Design', description: 'Custom AI solution tailored to your specific business needs' },
  { icon: Cog, title: 'Implement', description: 'Seamless deployment with minimal disruption to operations' },
  { icon: Rocket, title: 'Optimize', description: 'Continuous monitoring and improvement for maximum ROI' }
];

export const InteractiveFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-accent-100 rounded-full px-6 py-3 mb-6">
            <Lightbulb className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-primary-800 font-semibold">Why Choose Us</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Features That Drive Real Business Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful features that have helped 150+ companies achieve an average 300% ROI with our AI solutions.
          </p>
        </motion.div>

        {/* Interactive Features Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Features List */}
            <div className="lg:col-span-1 space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    activeFeature === feature.id
                      ? `border-current ${feature.color} bg-gradient-to-r ${feature.gradient} text-white shadow-xl scale-105`
                      : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg ${feature.hoverColor}`
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === feature.id 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-r ' + feature.gradient + ' text-white'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        activeFeature === feature.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm ${
                        activeFeature === feature.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {feature.subtitle}
                      </p>
                      {(activeFeature === feature.id || hoveredFeature === feature.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3"
                        >
                          <div className={`text-2xl font-bold mb-1 ${
                            activeFeature === feature.id ? 'text-white' : feature.color
                          }`}>
                            {feature.stats.metric}
                          </div>
                          <div className={`text-xs ${
                            activeFeature === feature.id ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {feature.stats.label}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
              >
                <div className="flex items-start space-x-6 mb-8">
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${currentFeature.gradient} text-white`}>
                    <currentFeature.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentFeature.title}</h3>
                    <p className="text-lg text-gray-600 mb-4">{currentFeature.description}</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${currentFeature.gradient} text-white text-sm font-semibold`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {currentFeature.stats.metric} {currentFeature.stats.label}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Key Benefits</h4>
                    <div className="space-y-3">
                      {currentFeature.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br ${currentFeature.gradient} rounded-xl p-6 text-white`}>
                    <h4 className="font-semibold mb-4">Implementation Impact</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Setup Time</span>
                        <span className="font-semibold">2-4 weeks</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">ROI Timeline</span>
                        <span className="font-semibold">30-90 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Integration</span>
                        <span className="font-semibold">Seamless</span>
                      </div>
                      <Link to="/services" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group mt-4">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white"
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Our Proven Implementation Process</h3>
              <p className="text-primary-100 max-w-2xl mx-auto">
                From initial analysis to full optimization, we ensure your AI transformation is smooth, fast, and delivers immediate results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-white/30 -translate-y-1/2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="h-full bg-white/60"
                />
              </div>
              
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative z-10"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-primary-100 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/contact" className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto group">
                Start Your AI Transformation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
