'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function WebGenFAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What types of AI solutions do you develop?",
      answer: "We develop a comprehensive range of AI solutions including machine learning models, natural language processing systems, computer vision applications, predictive analytics, chatbots, recommendation engines, and custom AI-powered automation tools. Our expertise spans across supervised and unsupervised learning, deep learning, and large language model implementations."
    },
    {
      question: "How long does it typically take to develop an AI solution?",
      answer: "The development timeline varies based on project complexity, data availability, and specific requirements. Simple AI models can be developed in 4-8 weeks, while complex enterprise solutions may take 3-6 months. We follow agile methodologies to ensure faster delivery and regular progress updates throughout the development process."
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes, we offer comprehensive post-deployment support including 24/7 monitoring, regular model updates, performance optimization, bug fixes, and feature enhancements. Our support packages are tailored to your specific needs and can include dedicated support teams for enterprise clients."
    },
    {
      question: "Can you integrate AI solutions with our existing systems?",
      answer: "Absolutely. We specialize in seamless integration with existing enterprise systems including CRM, ERP, databases, and third-party APIs. Our team ensures minimal disruption to your current operations while maximizing the benefits of AI integration through proper API development and system architecture planning."
    },
    {
      question: "What industries do you serve?",
      answer: "We serve diverse industries including healthcare, finance, e-commerce, manufacturing, logistics, education, retail, automotive, and technology. Our AI solutions are customized to meet specific industry requirements, compliance standards, and business objectives across various sectors."
    },
    {
      question: "How do you ensure data security and privacy?",
      answer: "Data security is our top priority. We implement enterprise-grade security measures including encryption at rest and in transit, secure cloud infrastructure, access controls, regular security audits, and compliance with GDPR, HIPAA, and other relevant regulations. We also offer on-premise deployment options for sensitive data."
    },
    {
      question: "What is the cost of developing an AI solution?",
      answer: "Costs vary based on project scope, complexity, data requirements, and timeline. We offer flexible pricing models including fixed-price projects, hourly rates, and retainer-based engagements. We provide detailed cost estimates after understanding your specific requirements during our free consultation."
    },
    {
      question: "Do you provide training for our team?",
      answer: "Yes, we offer comprehensive training programs including technical workshops, user training sessions, documentation, and knowledge transfer sessions. Our training covers AI system usage, maintenance procedures, and best practices to ensure your team can effectively utilize and manage the AI solutions."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Frequently Asked Questions</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Got Questions?{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              We Have Answers
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 leading-relaxed">
            Find answers to common questions about our AI development services, processes, and solutions.
          </motion.p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mt-12"
        >
          <motion.div variants={itemVariants}>
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Contact Our Experts
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Schedule a Call
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
