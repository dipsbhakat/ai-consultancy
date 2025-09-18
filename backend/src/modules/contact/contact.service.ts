import { Injectable } from '@nestjs/common';

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  avatar?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  category: string;
}

@Injectable()
export class ContactService {
  private readonly mockTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp',
      rating: 5,
      message: 'Outstanding AI consultation services. They transformed our business processes with cutting-edge machine learning solutions.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c3e434e4?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateLabs',
      rating: 5,
      message: 'Their expertise in AI implementation is unparalleled. We saw 300% improvement in our analytics capabilities.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'CEO',
      company: 'DataDriven Inc',
      rating: 5,
      message: 'Professional, knowledgeable, and results-driven. They delivered an AI solution that exceeded our expectations.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    }
  ];

  private readonly mockServices: Service[] = [
    {
      id: '1',
      title: 'AI Strategy Consulting',
      description: 'Comprehensive AI strategy development and implementation roadmap for your business transformation.',
      features: [
        'AI Readiness Assessment',
        'Custom AI Strategy Development',
        'Implementation Roadmap',
        'ROI Analysis and Projections',
        'Technology Stack Recommendations'
      ],
      pricing: {
        basic: 5000,
        premium: 15000,
        enterprise: 50000
      },
      category: 'Strategy'
    },
    {
      id: '2',
      title: 'Machine Learning Development',
      description: 'End-to-end machine learning model development, training, and deployment services.',
      features: [
        'Custom ML Model Development',
        'Data Pipeline Architecture',
        'Model Training & Optimization',
        'Production Deployment',
        'Performance Monitoring'
      ],
      pricing: {
        basic: 10000,
        premium: 30000,
        enterprise: 100000
      },
      category: 'Development'
    },
    {
      id: '3',
      title: 'Natural Language Processing',
      description: 'Advanced NLP solutions for text analysis, chatbots, and language understanding applications.',
      features: [
        'Text Analytics & Sentiment Analysis',
        'Chatbot Development',
        'Language Translation Services',
        'Content Generation',
        'Speech Recognition Integration'
      ],
      pricing: {
        basic: 8000,
        premium: 25000,
        enterprise: 80000
      },
      category: 'NLP'
    }
  ];

  private readonly contactSubmissions: ContactSubmission[] = [];

  async getTestimonials(): Promise<Testimonial[]> {
    return this.mockTestimonials;
  }

  async getServices(): Promise<Service[]> {
    return this.mockServices;
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.mockServices.find(service => service.id === id) || null;
  }

  async submitContact(contactData: Omit<ContactSubmission, 'submittedAt'>): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      ...contactData,
      submittedAt: new Date()
    };
    
    this.contactSubmissions.push(submission);
    
    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification emails
    // 3. Integrate with CRM systems
    
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return this.contactSubmissions;
  }
}
