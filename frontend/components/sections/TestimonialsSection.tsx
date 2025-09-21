'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      quote: "The AI solution transformed our supply chain operations, reducing costs by 35% and improving delivery times by 50%. Their team's expertise and strategic approach exceeded all expectations.",
      author: "Sarah Chen",
      role: "Chief Operations Officer",
      company: "GlobalTech Manufacturing",
      industry: "Manufacturing",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      rating: 5,
      metrics: [
        { label: "Cost Reduction", value: "35%" },
        { label: "Delivery Improvement", value: "50%" },
        { label: "ROI Timeline", value: "6 months" }
      ]
    },
    {
      id: 2,
      quote: "Their machine learning models revolutionized our customer experience. We now predict customer needs with 94% accuracy, leading to unprecedented customer satisfaction and retention rates.",
      author: "Michael Rodriguez",
      role: "Head of Customer Experience",
      company: "RetailNext Solutions",
      industry: "E-commerce",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      rating: 5,
      metrics: [
        { label: "Prediction Accuracy", value: "94%" },
        { label: "Customer Satisfaction", value: "+40%" },
        { label: "Revenue Increase", value: "28%" }
      ]
    },
    {
      id: 3,
      quote: "The AI-powered fraud detection system saved us millions. Their solution identifies threats in real-time with minimal false positives, providing security we never thought possible.",
      author: "Dr. Emily Watson",
      role: "Chief Technology Officer",
      company: "SecureBank International",
      industry: "Financial Services",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=361&q=80",
      rating: 5,
      metrics: [
        { label: "Fraud Reduction", value: "89%" },
        { label: "False Positives", value: "-92%" },
        { label: "Cost Savings", value: "$12M" }
      ]
    },
    {
      id: 4,
      quote: "Their computer vision solution automated our quality control process with 99.7% accuracy. Production efficiency increased dramatically while maintaining the highest quality standards.",
      author: "James Thompson",
      role: "VP of Manufacturing",
      company: "Precision Automotive",
      industry: "Automotive",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      rating: 5,
      metrics: [
        { label: "Quality Accuracy", value: "99.7%" },
        { label: "Production Efficiency", value: "+45%" },
        { label: "Defect Reduction", value: "88%" }
      ]
    },
    {
      id: 5,
      quote: "The natural language processing solution transformed our customer support. Response times decreased by 70% while customer satisfaction scores reached all-time highs.",
      author: "Lisa Park",
      role: "Director of Customer Success",
      company: "CloudFirst Technologies",
      industry: "SaaS",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
      rating: 5,
      metrics: [
        { label: "Response Time", value: "-70%" },
        { label: "Customer Satisfaction", value: "96%" },
        { label: "Support Efficiency", value: "+180%" }
      ]
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Industry
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading enterprises achieved transformational results with our AI solutions
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Testimonial Content */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100">
                  {/* Quote Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-8">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl lg:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mb-8">
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].author}
                      className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].author}</div>
                      <div className="text-gray-600">{testimonials[currentIndex].role}</div>
                      <div className="text-blue-600 font-semibold">{testimonials[currentIndex].company}</div>
                    </div>
                  </div>

                  {/* Industry Badge */}
                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {testimonials[currentIndex].industry}
                  </div>
                </div>
              </div>

              {/* Metrics Display */}
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-8">Key Results Achieved</h3>
                  
                  <div className="space-y-6">
                    {testimonials[currentIndex].metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                      >
                        <div className="text-3xl lg:text-4xl font-bold mb-2">{metric.value}</div>
                        <div className="text-blue-100">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <p className="text-center text-gray-500 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for company logos */}
            {['Microsoft', 'Amazon', 'Google', 'IBM', 'Oracle', 'SAP'].map((company) => (
              <div key={company} className="bg-gray-200 px-6 py-3 rounded-lg text-gray-600 font-semibold">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
