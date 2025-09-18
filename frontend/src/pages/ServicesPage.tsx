import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { services } from '../data';

export function ServicesPage() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding gradient-mesh relative">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="hero-text text-gradient-hero mb-8">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl leading-relaxed text-accent-100 max-w-3xl mx-auto">
              We offer comprehensive AI and software development solutions tailored to your business needs.
              From concept to deployment, we're your trusted technology partner driving digital transformation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gradient-to-br from-white to-primary-50/30">
        <div className="container-custom">
          <div className="grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              // Dynamically get the icon component
              const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="card-premium group hover:scale-[1.02] lg:hover:scale-105 transition-all duration-500 p-6 lg:p-8"
                >
                  <div className="flex items-center justify-between mb-6 lg:mb-8">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-effect">
                      {IconComponent && <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
                    </div>
                    <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-muted-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold text-muted-900 mb-3 lg:mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-600 mb-6 lg:mb-8 leading-relaxed text-base lg:text-lg">
                    {service.shortDesc}
                  </p>
                  
                  <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: (index * 0.1) + (featureIndex * 0.05) }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-success-500 flex-shrink-0" />
                        <span className="text-muted-700 font-medium text-sm lg:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Link
                    to="/contact"
                    className="btn-primary w-full text-center group min-h-[44px] flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="display-text text-muted-900 mb-6">
              Our <span className="text-gradient">Process</span>
            </h2>
            <p className="text-xl text-muted-600 max-w-3xl mx-auto">
              A streamlined approach that ensures your project succeeds from conception to deployment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We analyze your business needs and technical requirements',
                icon: Icons.Search,
              },
              {
                step: '02',
                title: 'Strategy',
                description: 'We design a comprehensive solution architecture',
                icon: Icons.Target,
              },
              {
                step: '03',
                title: 'Development',
                description: 'We build and test your solution with regular updates',
                icon: Icons.Code,
              },
              {
                step: '04',
                title: 'Deployment',
                description: 'We launch your solution and provide ongoing support',
                icon: Icons.Rocket,
              },
            ].map((process, index) => {
              const Icon = process.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 glow-effect">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-cta-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {process.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-muted-900 mb-3">{process.title}</h3>
                  <p className="text-muted-600">{process.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-mesh relative">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="display-text text-white mb-8">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-accent-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Let's discuss your project requirements and how we can help accelerate your digital transformation with cutting-edge AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/contact"
                className="btn-cta text-lg px-10 py-4 group"
              >
                Start Your Project
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/testimonials"
                className="btn-ghost text-lg px-10 py-4 group"
              >
                See Success Stories
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
