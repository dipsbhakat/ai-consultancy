import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle, 
  Phone, 
  Mail, 
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

const projectTypes = [
  'AI/ML Implementation',
  'Process Automation',
  'Data Analytics Platform',
  'Custom Software Development',
  'AI Consulting & Strategy',
  'System Integration',
  'Other'
];

const budgetRanges = [
  '$10K - $50K',
  '$50K - $100K',
  '$100K - $250K',
  '$250K - $500K',
  '$500K+',
  'Not sure yet'
];

const timelines = [
  'ASAP (Rush project)',
  '1-2 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
  'Just exploring'
];

const benefits = [
  { icon: TrendingUp, text: "Average 300% ROI within 12 months", color: "text-green-600" },
  { icon: Zap, text: "Implementation starts within 2 weeks", color: "text-blue-600" },
  { icon: Shield, text: "Risk-free 30-day trial available", color: "text-purple-600" },
  { icon: Users, text: "Dedicated project manager assigned", color: "text-orange-600" }
];

export const ConversionContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      console.log('Form submitted:', formData);
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.company;
      case 2:
        return formData.projectType && formData.budget && formData.timeline;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <section className="section-padding bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You! We'll Be In Touch Soon 🚀
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your project inquiry has been received. Our AI specialists will review your requirements 
              and contact you within 24 hours with a customized proposal.
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">1</div>
                  <div className="font-medium">Review & Analysis</div>
                  <div className="text-gray-600">Within 24 hours</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">2</div>
                  <div className="font-medium">Strategy Call</div>
                  <div className="text-gray-600">Schedule within 48 hours</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">3</div>
                  <div className="font-medium">Custom Proposal</div>
                  <div className="text-gray-600">Within 1 week</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="sticky top-8">
                <div className="mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-accent-100 rounded-full px-6 py-3 mb-6">
                    <Star className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-primary-800 font-semibold">Free Consultation</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Get a customized AI strategy and implementation roadmap tailored to your specific needs. 
                    No generic solutions - every project is unique.
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r from-primary-100 to-accent-100`}>
                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">{benefit.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">Why Work With Us?</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold mb-1">150+</div>
                      <div className="text-primary-100 text-sm">Projects Delivered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">98%</div>
                      <div className="text-primary-100 text-sm">Client Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">$15M+</div>
                      <div className="text-primary-100 text-sm">Client Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">24/7</div>
                      <div className="text-primary-100 text-sm">Support</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>bengalmindaiconsultancy@gmail.com</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Multi-Step Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Get Your Free Consultation</h3>
                  <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tell us about yourself</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="john@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Your Company Inc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Project details</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range *
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(budget => (
                          <option key={budget} value={budget}>{budget}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline *
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
                      >
                        <option value="">Select timeline</option>
                        {timelines.map(timeline => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Message */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tell us about your project</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Tell us about your current challenges, goals, and what you're hoping to achieve with AI..."
                      />
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-green-900 mb-1">What happens after you submit?</h5>
                          <p className="text-sm text-green-700">
                            We'll review your requirements and schedule a free 30-minute strategy call within 24 hours. 
                            No commitment required - just valuable insights for your project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
                      >
                        Next Step
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                          <Send className="mr-2 w-5 h-5" />
                        )}
                        {isSubmitting ? 'Sending...' : 'Get My Free Consultation'}
                      </button>
                    )}
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Free consultation
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    No spam
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    Quick response
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
