import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Brain, Zap, Users, Award, Sparkles, Target, Shield, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Cutting-edge artificial intelligence and machine learning technologies that transform your data into actionable insights',
    gradient: 'from-primary-500 to-accent-400',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Delivery',
    description: 'Rapid development cycles with agile methodologies and proven frameworks, getting you to market faster',
    gradient: 'from-accent-400 to-electric-400',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Dedicated professionals with years of experience in AI, data science, and enterprise software development',
    gradient: 'from-electric-400 to-neon-500',
  },
  {
    icon: Award,
    title: 'Proven Excellence',
    description: 'Track record of successful projects and satisfied clients across industries, with measurable ROI',
    gradient: 'from-neon-500 to-cta-400',
  },
];

const stats = [
  { label: 'Projects Delivered', value: '500+', icon: Target },
  { label: 'Client Satisfaction', value: '99%', icon: Shield },
  { label: 'Years Experience', value: '10+', icon: TrendingUp },
  { label: 'AI Models Deployed', value: '150+', icon: Brain },
];

const benefits = [
  'Reduce operational costs by up to 40%',
  'Increase productivity by 3x with automation',
  'Make data-driven decisions in real-time',
  'Scale your operations without linear cost growth',
  'Stay ahead of competitors with AI advantage',
  'Future-proof your business operations',
];

export function HomePage() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-mesh">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-accent-400/30 to-electric-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-cta-400/30 to-neon-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sunset-400/20 to-primary-500/20 rounded-full blur-2xl animate-float"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="glass-effect inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-accent-400/30">
                <Sparkles className="w-4 h-4 mr-2 text-accent-300" />
                Revolutionary AI Solutions for Modern Business
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-text text-gradient-hero mb-8"
            >
              Transform Your Business with{' '}
              <span className="relative inline-block">
                AI Innovation
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-300/30 to-cta-300/30 rounded-lg blur-lg"></div>
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl leading-relaxed text-accent-100 max-w-3xl mx-auto mb-12"
            >
              We specialize in developing cutting-edge AI solutions, custom software, and data analytics 
              platforms that drive growth, efficiency, and competitive advantage for forward-thinking businesses.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/contact" className="btn-cta text-lg px-8 py-4 group">
                Start Your Transformation
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/services"
                className="btn-ghost text-lg px-8 py-4 group"
              >
                Explore Solutions
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
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

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-white to-primary-50/50">
        <div className="container-custom">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="display-text text-muted-900 mb-6"
            >
              Why Choose Our <span className="text-gradient">AI Solutions?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-muted-600 max-w-3xl mx-auto"
            >
              We combine cutting-edge technology with deep industry expertise to deliver solutions that drive real, measurable results for your business.
            </motion.p>
          </div>
          
          <div className="grid max-w-6xl mx-auto grid-cols-1 gap-12 lg:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-premium p-8 group hover:scale-105 transition-all duration-500"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-muted-900 mb-3">{feature.title}</h3>
                      <p className="text-muted-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="display-text text-muted-900 mb-8">
                Measurable Impact on Your <span className="text-gradient">Bottom Line</span>
              </h2>
              <p className="text-xl text-muted-600 mb-8 leading-relaxed">
                Our AI solutions don't just innovate—they deliver concrete business value that you can measure and scale.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-success-400 flex-shrink-0" />
                    <span className="text-muted-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card-premium p-8 bg-gradient-to-br from-white to-primary-50/70">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-cta-400 to-sunset-500 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-effect">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-muted-900 mb-4">Average ROI</h3>
                  <div className="text-5xl font-bold text-gradient mb-4">300%</div>
                  <p className="text-muted-600">Within the first 12 months of implementation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-accent-100 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Join hundreds of forward-thinking companies that have already transformed their operations with our AI solutions. Your competitive advantage starts here.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link to="/contact" className="btn-cta text-lg px-10 py-4 group">
                Start Your AI Journey
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/services"
                className="btn-ghost text-lg px-10 py-4 group"
              >
                View Case Studies
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
