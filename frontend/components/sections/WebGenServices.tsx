'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { 
  Brain,
  MessageSquare,
  TrendingUp,
  ShoppingCart,
  Eye,
  GitBranch,
  Bot,
  Cpu,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function WebGenServices() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const services = [
    {
      icon: MessageSquare,
      title: "Natural Language Processing",
      description: "Build intelligent chatbots, sentiment analysis, and language understanding systems that can process and understand human language naturally.",
      features: ["Text Analysis", "Chatbot Development", "Language Translation", "Sentiment Analysis"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analysis",
      description: "Leverage machine learning algorithms to forecast trends, predict outcomes, and make data-driven decisions for your business.",
      features: ["Trend Forecasting", "Risk Assessment", "Demand Planning", "Customer Behavior"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: ShoppingCart,
      title: "Sales Forecasting",
      description: "Optimize your sales strategy with AI-powered forecasting models that predict customer demand and market trends.",
      features: ["Revenue Prediction", "Market Analysis", "Customer Insights", "Inventory Optimization"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Bot,
      title: "AI-powered Ecommerce",
      description: "Transform your online store with personalized recommendations, dynamic pricing, and intelligent customer service.",
      features: ["Recommendation Engine", "Dynamic Pricing", "Customer Support", "Inventory Management"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: GitBranch,
      title: "Supervised Learning",
      description: "Develop models that learn from labeled data to make accurate predictions and classifications for your business needs.",
      features: ["Classification Models", "Regression Analysis", "Pattern Recognition", "Quality Control"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Cpu,
      title: "Unsupervised Learning",
      description: "Discover hidden patterns and insights in your data through clustering, anomaly detection, and dimensionality reduction.",
      features: ["Data Clustering", "Anomaly Detection", "Pattern Discovery", "Data Compression"],
      color: "from-teal-500 to-green-500"
    },
    {
      icon: Brain,
      title: "ChatGPT Development",
      description: "Create custom conversational AI solutions powered by large language models for customer support and automation.",
      features: ["Custom Training", "API Integration", "Multi-language Support", "Context Understanding"],
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Build intelligent systems that can see, understand, and interpret visual information from images and videos.",
      features: ["Image Recognition", "Object Detection", "Facial Recognition", "Quality Inspection"],
      color: "from-pink-500 to-rose-500"
    }
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
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Our AI Solutions</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive AI Services{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              For Every Business Need
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From natural language processing to computer vision, we offer a full spectrum of AI solutions 
            designed to transform your business operations and drive innovation.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Business with AI?
              </h3>
              <p className="text-blue-100 text-lg mb-8">
                Let's discuss your specific requirements and create a custom AI solution that drives results. 
                Our experts are ready to help you leverage the power of artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                >
                  Start Your AI Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8"
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
