import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp, Users, Clock } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  results: {
    savings?: string;
    efficiency?: string;
    timeReduction?: string;
  };
  industry: string;
  companySize: string;
  implementationTime: string;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Chief Technology Officer",
    company: "FinTech Innovations",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "Bengal Mind AI transformed our customer service operations completely. The AI chatbot handles 85% of inquiries automatically, and our customer satisfaction scores increased by 40%. The ROI was evident within 3 months.",
    results: {
      savings: "$280K annually",
      efficiency: "85% automation",
      timeReduction: "60% faster response"
    },
    industry: "Financial Services",
    companySize: "500+ employees",
    implementationTime: "6 weeks",
    featured: true
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Operations Director",
    company: "MedHealth Solutions",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "The predictive analytics system they built for us revolutionized our inventory management. We reduced waste by 35% and improved patient care delivery. Their team understood our healthcare complexities perfectly.",
    results: {
      savings: "$450K in waste reduction",
      efficiency: "35% waste reduction",
      timeReduction: "50% faster inventory cycles"
    },
    industry: "Healthcare",
    companySize: "1000+ employees",
    implementationTime: "8 weeks"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "CEO",
    company: "GreenTech Manufacturing",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "Bengal Mind AI's computer vision solution for quality control exceeded all expectations. We achieved 99.8% accuracy in defect detection and reduced manual inspection costs by 70%. Game-changing technology!",
    results: {
      savings: "$320K annual cost reduction",
      efficiency: "99.8% accuracy",
      timeReduction: "70% less manual inspection"
    },
    industry: "Manufacturing",
    companySize: "250+ employees",
    implementationTime: "10 weeks",
    featured: true
  },
  {
    id: 4,
    name: "David Park",
    role: "Head of Digital Strategy",
    company: "RetailMax Corporation",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "The personalization engine they developed increased our conversion rates by 45% and average order value by 30%. Their deep learning models understand our customers better than we thought possible.",
    results: {
      savings: "$1.2M revenue increase",
      efficiency: "45% conversion improvement",
      timeReduction: "Real-time personalization"
    },
    industry: "Retail & E-commerce",
    companySize: "750+ employees",
    implementationTime: "12 weeks"
  },
  {
    id: 5,
    name: "Jennifer Kim",
    role: "Supply Chain Director",
    company: "LogiFlow Global",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "Their route optimization AI reduced our delivery costs by 25% and improved on-time delivery to 98%. The system adapts to real-time conditions seamlessly. Exceptional technical expertise and support.",
    results: {
      savings: "$180K in delivery costs",
      efficiency: "25% cost reduction",
      timeReduction: "98% on-time delivery"
    },
    industry: "Logistics",
    companySize: "400+ employees",
    implementationTime: "7 weeks"
  },
  {
    id: 6,
    name: "Robert Thompson",
    role: "VP of Operations",
    company: "EnergyTech Solutions",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    content: "The predictive maintenance system prevented 15 potential equipment failures in the first year alone, saving us millions in downtime. Their proactive approach to AI implementation is outstanding.",
    results: {
      savings: "$2.3M in prevented downtime",
      efficiency: "92% failure prediction",
      timeReduction: "80% faster maintenance scheduling"
    },
    industry: "Energy",
    companySize: "600+ employees",
    implementationTime: "14 weeks",
    featured: true
  }
];

const stats = [
  { icon: Award, value: "98%", label: "Client Satisfaction", color: "text-green-600" },
  { icon: TrendingUp, value: "$15M+", label: "Total Client Savings", color: "text-blue-600" },
  { icon: Users, value: "150+", label: "Projects Delivered", color: "text-purple-600" },
  { icon: Clock, value: "6.2x", label: "Average ROI", color: "text-orange-600" },
];

export const EnhancedTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const currentTestimonial = testimonials[currentIndex];

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
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-6 py-3 mb-6">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">Proven Results</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Real Success Stories from Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join 150+ companies that have transformed their operations with our AI solutions. 
            See measurable results from day one.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Testimonial */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              {/* Testimonial Content */}
              <div className="p-8 lg:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-start mb-6">
                      <Quote className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < currentTestimonial.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <blockquote className="text-lg text-gray-700 leading-relaxed mb-6">
                          "{currentTestimonial.content}"
                        </blockquote>
                      </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
                      {Object.entries(currentTestimonial.results).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-primary-600 mb-1">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mr-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{currentTestimonial.name}</div>
                        <div className="text-primary-600 text-sm font-medium">{currentTestimonial.role}</div>
                        <div className="text-gray-600 text-sm">{currentTestimonial.company}</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Company Details */}
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-8 lg:p-12 text-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold mb-8">Project Overview</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="text-primary-100 text-sm mb-2">Industry</div>
                        <div className="text-lg font-semibold">{currentTestimonial.industry}</div>
                      </div>
                      
                      <div>
                        <div className="text-primary-100 text-sm mb-2">Company Size</div>
                        <div className="text-lg font-semibold">{currentTestimonial.companySize}</div>
                      </div>
                      
                      <div>
                        <div className="text-primary-100 text-sm mb-2">Implementation Time</div>
                        <div className="text-lg font-semibold">{currentTestimonial.implementationTime}</div>
                      </div>

                      {currentTestimonial.featured && (
                        <div className="bg-white/10 rounded-lg p-4 mt-8">
                          <div className="flex items-center mb-2">
                            <Award className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Featured Success Story</span>
                          </div>
                          <p className="text-primary-100 text-sm">
                            This project showcases exceptional results and innovative AI implementation.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">
              Ready to achieve similar results for your business?
            </p>
            <Link to="/contact" className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block">
              Schedule Your Success Strategy Call
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
