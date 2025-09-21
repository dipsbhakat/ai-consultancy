'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { 
  Shield,
  Clock,
  Users,
  Lightbulb,
  Award,
  Zap,
  Target,
  Globe,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function WebGenWhyChoose() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const reasons = [
    {
      icon: Shield,
      title: "Proven Expertise",
      description: "Over 10 years of experience in AI development with a track record of successful implementations across various industries.",
      stats: "500+ Projects Delivered"
    },
    {
      icon: Clock,
      title: "Rapid Development",
      description: "Accelerated development cycles with agile methodologies ensuring faster time-to-market for your AI solutions.",
      stats: "3x Faster Delivery"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Dedicated team of ML engineers, data scientists, and AI specialists with advanced degrees and industry certifications.",
      stats: "50+ AI Specialists"
    },
    {
      icon: Lightbulb,
      title: "Innovation Focus",
      description: "Cutting-edge research and development approach, staying ahead of AI trends and implementing latest technologies.",
      stats: "Latest AI Technology"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "ISO certified processes with rigorous testing and validation ensuring reliable and robust AI solutions.",
      stats: "98% Success Rate"
    },
    {
      icon: Zap,
      title: "Scalable Solutions",
      description: "Enterprise-grade AI systems designed to scale with your business growth and evolving requirements.",
      stats: "Infinitely Scalable"
    }
  ];

  const benefits = [
    "End-to-end AI development lifecycle",
    "Custom model development and training",
    "24/7 technical support and maintenance",
    "Seamless integration with existing systems",
    "Data security and privacy compliance",
    "Ongoing optimization and improvements",
    "Transparent pricing with no hidden costs",
    "Regular progress updates and reporting"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Why Choose Us</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Trusted{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Development Partner
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine deep technical expertise with business acumen to deliver AI solutions that drive 
            real results. Here's why leading companies choose us as their AI development partner.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {reason.description}
                    </p>
                    
                    <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800 text-sm font-medium">{reason.stats}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left - Benefits List */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              What You Get When You Work With Us
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our comprehensive approach ensures you receive not just a solution, but a complete 
              partnership focused on your success and long-term growth.
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual Element */}
          <motion.div variants={itemVariants} className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <Globe className="w-12 h-12 mb-4" />
                <h4 className="text-2xl font-bold mb-4">Global Reach</h4>
                <p className="text-blue-100 mb-6">
                  We've successfully delivered AI solutions to clients across 25+ countries, 
                  helping businesses worldwide harness the power of artificial intelligence.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-blue-200 text-sm">Countries</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-blue-200 text-sm">Clients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10+</div>
                    <div className="text-blue-200 text-sm">Industries</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
