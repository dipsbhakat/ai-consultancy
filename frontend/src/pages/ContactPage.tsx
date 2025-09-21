import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { ContactFormData } from '../data';
import { projectTypes, budgetRanges } from '../data';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Make real API call to backend
      const response = await fetch('/api/v1/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          message: data.message,
          consent: data.consent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
      
      setIsSubmitted(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      // You could add error state handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email us',
      content: 'bengalmindaiconsultancy@gmail.com',
      subContent: 'We\'ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Call us',
      content: '+91 (000) 123-4567',
      subContent: 'Mon-Fri 9AM-6PM IST',
    },
    {
      icon: MapPin,
      title: 'Visit us',
      content: 'Kolkata, WB',
      subContent: 'Schedule an appointment',
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-muted-900 sm:text-6xl">
            Get in <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-600">
            Ready to transform your business with AI? Let's discuss your project requirements and how we can help.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-muted-900 mb-6">Send us a message</h2>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <p className="ml-3 text-sm font-medium text-green-800">
                      Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className={`block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset placeholder:text-muted-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200 ${
                        errors.name ? 'ring-red-300' : 'ring-muted-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className={`block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset placeholder:text-muted-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200 ${
                        errors.email ? 'ring-red-300' : 'ring-muted-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-muted-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset ring-muted-300 placeholder:text-muted-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200"
                      placeholder="+91 (000) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-muted-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      {...register('company')}
                      className="block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset ring-muted-300 placeholder:text-muted-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-muted-700 mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      {...register('projectType')}
                      className="block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset ring-muted-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200 bg-white"
                    >
                      <option value="">Select a project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-muted-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      {...register('budget')}
                      className="block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset ring-muted-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[44px] transition-colors duration-200 bg-white"
                    >
                      <option value="">Select a budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className={`block w-full rounded-md border-0 px-3.5 py-3 lg:py-2 text-muted-900 shadow-sm ring-1 ring-inset placeholder:text-muted-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-h-[100px] transition-colors duration-200 resize-y ${
                      errors.message ? 'ring-red-300' : 'ring-muted-300'
                    }`}
                    placeholder="Tell us about your project requirements..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      type="checkbox"
                      {...register('consent')}
                      className="h-4 w-4 rounded border-muted-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="consent" className="text-muted-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        privacy policy
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        terms of service
                      </a>
                      . *
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.consent.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-base lg:text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-muted-900 mb-6">Contact Information</h2>
              <p className="text-muted-600 mb-8">
                Get in touch with our team of experts. We're here to help you transform your business with AI.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-muted-900">{item.title}</h3>
                      <p className="text-muted-700">{item.content}</p>
                      <p className="text-sm text-muted-500">{item.subContent}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-muted-900">Office Hours</h3>
              </div>
              <div className="space-y-2 text-muted-700">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
