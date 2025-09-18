import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactService, Testimonial, Service, ContactSubmission } from './contact.service';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ContactSubmissionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;
}

@ApiTags('api')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

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
        submittedAt: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid form data' })
  async submitContact(
    @Body(new ValidationPipe()) contactData: ContactSubmissionDto
  ): Promise<{ message: string; submissionId: string; submittedAt: string }> {
    try {
      const submission = await this.contactService.submitContact(contactData);
      
      return {
        message: 'Contact form submitted successfully. We will get back to you soon!',
        submissionId: `submission_${Date.now()}`,
        submittedAt: submission.submittedAt.toISOString()
      };
    } catch (error) {
      throw new HttpException(
        'Failed to submit contact form',
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
