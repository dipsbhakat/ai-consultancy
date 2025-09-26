import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  ValidationPipe,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactService, Testimonial, Service, ContactSubmission } from './contact.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class ContactSubmissionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;

  @IsBoolean()
  consent: boolean;
}

@ApiTags('api')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('testimonials')
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of customer testimonials',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string' },
          company: { type: 'string' },
          rating: { type: 'number' },
          message: { type: 'string' },
          avatar: { type: 'string' }
        }
      }
    }
  })
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      return await this.contactService.getTestimonials();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch testimonials',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available services',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          features: { 
            type: 'array',
            items: { type: 'string' }
          },
          pricing: {
            type: 'object',
            properties: {
              basic: { type: 'number' },
              premium: { type: 'number' },
              enterprise: { type: 'number' }
            }
          },
          category: { type: 'string' }
        }
      }
    }
  })
  async getServices(): Promise<Service[]> {
    try {
      return await this.contactService.getServices();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch services',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        features: { 
          type: 'array',
          items: { type: 'string' }
        },
        pricing: {
          type: 'object',
          properties: {
            basic: { type: 'number' },
            premium: { type: 'number' },
            enterprise: { type: 'number' }
          }
        },
        category: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getServiceById(@Param('id') id: string): Promise<Service> {
    try {
      const service = await this.contactService.getServiceById(id);
      if (!service) {
        throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
      }
      return service;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch service',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiBody({
    type: ContactSubmissionDto,
    description: 'Contact form submission data'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Contact form submitted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        submissionId: { type: 'string' },
        submittedAt: { type: 'string' },
        leadScore: {
          type: 'object',
          properties: {
            totalScore: { type: 'number' },
            grade: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid form data' })
  async submitContact(
    @Body(new ValidationPipe()) contactData: ContactSubmissionDto,
    @Request() request: any,
  ): Promise<{ 
    message: string; 
    submissionId: string; 
    submittedAt: string;
    leadScore?: { totalScore: number; grade: string };
  }> {
    try {
      const submission = await this.contactService.submitContact(contactData);
      
      // Track the contact submission event
      const sessionId = request.headers['x-session-id'] || `session_${Date.now()}`;
      try {
        await this.analyticsService.trackEvent(
          'CONTACT_SUBMIT',
          {
            projectType: contactData.projectType,
            budget: contactData.budget,
            hasPhone: !!contactData.phone,
            hasCompany: !!contactData.company,
            messageLength: contactData.message.length,
            pageUrl: request.headers.referer || request.originalUrl,
          },
          sessionId,
          undefined,
          request,
        );
      } catch (analyticsError) {
        console.warn('Failed to track analytics event:', analyticsError.message);
        // Don't fail the contact submission if analytics tracking fails
      }

      // Calculate lead score automatically
      let leadScoreResult;
      try {
        const leadScoreFactors = await this.analyticsService.calculateLeadScore(submission.id);
        
        // Get the stored lead score for the response
        const leadScore = await this.contactService.getLeadScoreForContact(submission.id);
        if (leadScore) {
          leadScoreResult = {
            totalScore: leadScore.totalScore,
            grade: leadScore.grade,
          };
        }
      } catch (error) {
        console.warn('Failed to calculate lead score:', error.message);
        // Don't fail the contact submission if lead scoring fails
      }
      
      return {
        message: 'Contact form submitted successfully. We will get back to you soon!',
        submissionId: submission.id,
        submittedAt: submission.submittedAt.toISOString(),
        leadScore: leadScoreResult,
      };
    } catch (error) {
      console.error('Contact submission failed:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        cause: error.cause
      });
      
      // Return a more detailed error message in development
      const isDevelopment = process.env.NODE_ENV === 'development';
      const errorMessage = isDevelopment 
        ? `Failed to submit contact form: ${error.message}` 
        : 'Failed to submit contact form';
      
      throw new HttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('submissions')
  @ApiOperation({ summary: 'Get all contact submissions (admin endpoint)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of contact submissions',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          message: { type: 'string' },
          submittedAt: { type: 'string' }
        }
      }
    }
  })
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
      return await this.contactService.getContactSubmissions();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch contact submissions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
