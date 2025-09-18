'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  X,
  Send,
  Calendar,
  FileText,
  Shield,
  Clock
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  consent: boolean;
}

const ContactSection = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>();

  const projectTypes = [
    'AI Strategy & Consulting',
    'Machine Learning Development',
    'Process Automation',
    'Computer Vision',
    'Natural Language Processing',
    'Data Analytics & BI',
    'MLOps & Infrastructure',
    'Custom AI Solution'
  ];

  const budgetRanges = [
    'Under $50K',
    '$50K - $100K',
    '$100K - $250K',
    '$250K - $500K',
    '$500K - $1M',
    'Over $1M',
    'Not sure / Need consultation'
  ];

  const timelines = [
    'ASAP (0-3 months)',
    'Short term (3-6 months)',
    'Medium term (6-12 months)',
    'Long term (12+ months)',
    'Flexible / Planning phase'
  ];

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data:', data);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@aiconsultancy.com',
      link: 'mailto:hello@aiconsultancy.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Innovation Drive, San Francisco, CA 94105',
      link: 'https://maps.google.com'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-6">
            <MessageCircle className="w-4 h-4 mr-2" />
            Let's Talk
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Business?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Schedule a strategic consultation to explore how AI can drive growth, efficiency, and innovation in your organization
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl lg:text-3xl">
                  Tell Us About Your Project
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Thank you! We'll be in touch within 24 hours.
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      Something went wrong. Please try again or contact us directly.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        {...register('firstName', { required: 'First name is required' })}
                        placeholder="John"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        {...register('lastName', { required: 'Last name is required' })}
                        placeholder="Doe"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email *
                      </label>
                      <Input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        placeholder="john@company.com"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        {...register('phone')}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company *
                      </label>
                      <Input
                        {...register('company', { required: 'Company is required' })}
                        placeholder="Your Company"
                        className={errors.company ? 'border-red-500' : ''}
                      />
                      {errors.company && (
                        <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <Input
                        {...register('jobTitle')}
                        placeholder="Chief Technology Officer"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      {...register('projectType', { required: 'Project type is required' })}
                      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.projectType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.projectType && (
                      <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        {...register('budget')}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline
                      </label>
                      <select
                        {...register('timeline')}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((timeline) => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Description *
                    </label>
                    <textarea
                      {...register('description', { required: 'Project description is required' })}
                      rows={5}
                      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your AI project goals, current challenges, and what you're hoping to achieve..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      {...register('consent', { required: 'You must agree to the terms' })}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <label className="text-sm text-gray-600">
                        I agree to receive communications from AI Consultancy and understand that I can unsubscribe at any time. 
                        By submitting this form, I acknowledge that I have read and accept the 
                        <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>.
                      </label>
                      {errors.consent && (
                        <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        Sending Request...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Additional Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-center gap-4 text-white hover:text-blue-300 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{info.title}</div>
                      <div className="text-gray-300">{info.content}</div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: 1, text: 'Response within 24 hours', icon: Clock },
                  { step: 2, text: 'Initial 30-minute consultation call', icon: Phone },
                  { step: 3, text: 'Custom proposal and roadmap', icon: FileText },
                  { step: 4, text: 'Project kickoff and execution', icon: Calendar }
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Why Choose Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Fortune 500 trusted expertise',
                  'Enterprise-grade security & compliance',
                  '24/7 support and monitoring',
                  'Proven ROI track record'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
