import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  consent: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  published: boolean;
}

// Mock data for demonstration
const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStartup Inc',
    quote: 'AI Consultancy transformed our business with cutting-edge AI solutions. Their expertise is unmatched.',
    rating: 5,
    published: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CTO',
    company: 'Innovation Labs',
    quote: 'Outstanding service and incredible results. They delivered exactly what we needed.',
    rating: 5,
    published: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'DataCorp',
    quote: 'Professional, efficient, and results-driven. Highly recommend their services.',
    rating: 5,
    published: true,
  },
];

const mockServices = [
  {
    id: '1',
    title: 'AI Strategy Consulting',
    slug: 'ai-strategy-consulting',
    shortDesc: 'Comprehensive AI strategy development for your business transformation',
    features: ['Strategic Planning', 'ROI Analysis', 'Implementation Roadmap', 'Risk Assessment'],
  },
  {
    id: '2',
    title: 'Machine Learning Solutions',
    slug: 'machine-learning-solutions',
    shortDesc: 'Custom ML models and algorithms tailored to your specific needs',
    features: ['Custom Models', 'Data Analysis', 'Predictive Analytics', 'Model Optimization'],
  },
  {
    id: '3',
    title: 'AI Implementation',
    slug: 'ai-implementation',
    shortDesc: 'End-to-end AI solution implementation and deployment',
    features: ['System Integration', 'Deployment', 'Training', 'Support'],
  },
];

@ApiTags('api')
@Controller()
export class ContactController {
  // Contact form submission
  @Post('contact')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiResponse({ status: 201, description: 'Contact form submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async submitContact(@Body() contactData: ContactSubmission) {
    // In production, this would save to database
    console.log('Contact submission received:', contactData);
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      throw new Error('Missing required fields');
    }

    if (!contactData.consent) {
      throw new Error('Consent is required');
    }

    return {
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
  }

  // Get published testimonials
  @Get('testimonials')
  @ApiOperation({ summary: 'Get published testimonials' })
  @ApiResponse({ status: 200, description: 'List of published testimonials' })
  async getTestimonials() {
    return {
      success: true,
      data: mockTestimonials.filter(t => t.published),
      total: mockTestimonials.filter(t => t.published).length,
      timestamp: new Date().toISOString(),
    };
  }

  // Get services
  @Get('services')
  @ApiOperation({ summary: 'Get available services' })
  @ApiResponse({ status: 200, description: 'List of available services' })
  async getServices() {
    return {
      success: true,
      data: mockServices,
      total: mockServices.length,
      timestamp: new Date().toISOString(),
    };
  }
}
