'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { 
  Trophy, 
  Users, 
  Target, 
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function WebGenAbout() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.2 });

  const achievements = [
    {
      icon: Trophy,
      number: "500+",
      label: "Successful Projects",
      description: "AI solutions delivered across industries"
    },
    {
      icon: Users,
      number: "50+",
      label: "AI Specialists",
      description: "Expert team of ML engineers and data scientists"
    },
    {
      icon: Target,
      number: "98%",
      label: "Success Rate",
      description: "Project completion with client satisfaction"
    },
    {
      icon: Award,
      number: "10+",
      label: "Years Experience",
      description: "Leading AI development and innovation"
    }
  ];

  const capabilities = [
    "Custom AI Model Development",
    "Machine Learning Solutions",
    "Natural Language Processing",
    "Computer Vision & Image Recognition",
    "Predictive Analytics & Forecasting",
    "AI-powered Automation",
    "Deep Learning & Neural Networks",
    "Recommendation Systems"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-blue-800 font-medium">About Our Company</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Leading AI Development Company{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transforming Businesses
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a team of passionate AI experts dedicated to helping businesses harness the power of 
            artificial intelligence. Our innovative solutions drive growth, efficiency, and competitive advantage.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left - Content */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h3 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Us as Your AI Partner?
            </motion.h3>

            <motion.p variants={itemVariants} className="text-gray-600 mb-8 leading-relaxed">
              With over a decade of experience in AI and machine learning, we've helped businesses across 
              various industries implement cutting-edge solutions that deliver measurable results. Our 
              approach combines technical expertise with deep business understanding.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{capability}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Download Company Profile
              </Button>
            </motion.div>
          </motion.div>

          {/* Right - Image/Visual */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="relative"
          >
            <motion.div 
              variants={itemVariants}
              className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
            >
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-4">Our Mission</h4>
                <p className="text-blue-100 mb-6">
                  To democratize AI technology and make it accessible to businesses of all sizes, 
                  enabling them to leverage intelligent solutions for sustainable growth and innovation.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-blue-200 text-sm">Support Available</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold">ISO</div>
                    <div className="text-blue-200 text-sm">Certified Quality</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Achievements Stats */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <div className="text-lg font-semibold text-gray-800 mb-2">{achievement.label}</div>
                <div className="text-gray-600 text-sm">{achievement.description}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
