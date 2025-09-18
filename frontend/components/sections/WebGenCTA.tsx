'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function WebGenCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    project: '',
    budget: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      subInfo: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: Mail,
      title: "Email Us",
      info: "sales@aicompany.com",
      subInfo: "Response within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "123 Innovation Drive",
      subInfo: "San Francisco, CA 94105"
    }
  ];

  const projectTypes = [
    "Machine Learning Model",
    "Natural Language Processing",
    "Computer Vision",
    "Predictive Analytics",
    "Chatbot Development",
    "AI Automation",
    "Data Analytics",
    "Custom AI Solution"
  ];

  const budgetRanges = [
    "Under $10K",
    "$10K - $25K",
    "$25K - $50K",
    "$50K - $100K",
    "$100K - $250K",
    "$250K+"
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

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Rocket className="w-4 h-4 text-blue-300" />
            <span className="text-blue-100 font-medium">Ready to Get Started?</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Let's Build Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Solution Together
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Transform your business with cutting-edge AI technology. Get a free consultation and 
            discover how artificial intelligence can drive your success.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact Form */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Start Your AI Project</h3>
                <p className="text-blue-100">Fill out the form and we'll get back to you within 24 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="" className="bg-gray-800">Select Project Type</option>
                      {projectTypes.map((type, index) => (
                        <option key={index} value={type} className="bg-gray-800">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="" className="bg-gray-800">Select Budget Range</option>
                      {budgetRanges.map((range, index) => (
                        <option key={index} value={range} className="bg-gray-800">{range}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project requirements, goals, and timeline..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-white/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-blue-100 text-sm">Free consultation • No commitment required</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Contact Information */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our AI experts are here to help you explore possibilities and find the perfect 
                solution for your business needs. Contact us through any of the channels below.
              </p>
            </motion.div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{contact.title}</h4>
                        <p className="text-blue-100 font-medium">{contact.info}</p>
                        <p className="text-blue-200 text-sm">{contact.subInfo}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Office Hours */}
            <motion.div variants={itemVariants} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="w-6 h-6 text-blue-300" />
                <h4 className="text-white font-semibold">Office Hours</h4>
              </div>
              <div className="space-y-2 text-blue-100">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Response Promise */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 rounded-full px-4 py-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-100 font-medium">We respond within 24 hours</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
