'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Lightbulb, 
  Monitor, 
  Settings, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Download,
  Filter
} from 'lucide-react';

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const serviceCategories = [
    {
      name: 'AI Strategy & Consulting',
      services: [
        {
          title: 'AI Readiness Assessment',
          description: 'Comprehensive evaluation of your organization\'s AI readiness, data maturity, and infrastructure capabilities.',
          features: ['Infrastructure Audit', 'Data Quality Analysis', 'ROI Projections', 'Risk Assessment'],
          pricing: 'Custom Quote',
          timeline: '2-4 weeks'
        },
        {
          title: 'AI Strategy Development',
          description: 'Custom AI roadmap aligned with your business objectives and competitive landscape.',
          features: ['Strategic Planning', 'Use Case Prioritization', 'Implementation Roadmap', 'Change Management'],
          pricing: 'From $25K',
          timeline: '4-6 weeks'
        },
        {
          title: 'Digital Transformation',
          description: 'End-to-end transformation strategy leveraging AI to reimagine business processes.',
          features: ['Process Optimization', 'Technology Integration', 'Cultural Transformation', 'Success Metrics'],
          pricing: 'From $50K',
          timeline: '8-12 weeks'
        }
      ]
    },
    {
      name: 'Machine Learning Solutions',
      services: [
        {
          title: 'Predictive Analytics',
          description: 'Advanced ML models for forecasting, demand planning, and predictive maintenance.',
          features: ['Time Series Forecasting', 'Anomaly Detection', 'Risk Modeling', 'Performance Optimization'],
          pricing: 'From $75K',
          timeline: '12-16 weeks'
        },
        {
          title: 'Computer Vision',
          description: 'Image and video analysis solutions for quality control, monitoring, and automation.',
          features: ['Object Detection', 'Image Classification', 'OCR/Document Processing', 'Real-time Analysis'],
          pricing: 'From $100K',
          timeline: '16-20 weeks'
        },
        {
          title: 'Natural Language Processing',
          description: 'Text analysis, sentiment analysis, and conversational AI solutions.',
          features: ['Text Analytics', 'Chatbots & Virtual Assistants', 'Document Intelligence', 'Language Translation'],
          pricing: 'From $60K',
          timeline: '10-14 weeks'
        }
      ]
    },
    {
      name: 'AI Infrastructure & MLOps',
      services: [
        {
          title: 'MLOps Platform Setup',
          description: 'Complete MLOps infrastructure for model development, deployment, and monitoring.',
          features: ['CI/CD Pipelines', 'Model Versioning', 'Automated Testing', 'Performance Monitoring'],
          pricing: 'From $40K',
          timeline: '6-8 weeks'
        },
        {
          title: 'Cloud AI Architecture',
          description: 'Scalable cloud infrastructure optimized for AI workloads and data processing.',
          features: ['Multi-cloud Strategy', 'Auto-scaling', 'Cost Optimization', 'Security Implementation'],
          pricing: 'From $30K',
          timeline: '4-6 weeks'
        },
        {
          title: 'Data Engineering',
          description: 'Robust data pipelines and infrastructure to power your AI initiatives.',
          features: ['Data Pipelines', 'Real-time Processing', 'Data Quality Management', 'Governance Framework'],
          pricing: 'From $50K',
          timeline: '8-10 weeks'
        }
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-6">
            <Filter className="w-4 h-4 mr-2" />
            Enterprise AI Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI Services That Drive
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Real Results</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From strategy to implementation, we deliver end-to-end AI solutions tailored to your enterprise needs
          </p>
        </motion.div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {serviceCategories.map((category, index) => (
            <Button
              key={index}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className="flex items-center gap-2"
            >
              {index === 0 && <Lightbulb className="w-4 h-4" />}
              {index === 1 && <Monitor className="w-4 h-4" />}
              {index === 2 && <Settings className="w-4 h-4" />}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Service Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {serviceCategories[activeTab].services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 p-2 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <CardDescription className="leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & Timeline */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Investment</div>
                    <div className="font-bold text-gray-900">{service.pricing}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Timeline</div>
                    <div className="font-bold text-gray-900">{service.timeline}</div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="relative z-10">
                <Button className="w-full group">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>

              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="bg-gray-900 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need a Custom AI Solution?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Every enterprise is unique. Let's discuss your specific challenges and create a tailored AI strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 group">
                  <Download className="w-5 h-5 mr-2" />
                  Download Service Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
