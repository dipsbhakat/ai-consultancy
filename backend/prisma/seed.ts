import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create initial superadmin user
  const adminEmail = 'admin@aiconsultancy.com';
  const adminPassword = 'Admin123!'; // Change this to a secure password
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Superadmin user already exists');
    return;
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  // Create superadmin user
  const admin = await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPERADMIN',
      isActive: true,
      loginAttempts: 0,
    },
  });

  console.log('✅ Created superadmin user:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('   ⚠️  Please change the default password after first login!');

  // Create some sample testimonials
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp',
      rating: 5,
      quote: 'Outstanding AI consultation services. They transformed our business processes with cutting-edge machine learning solutions.',
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616c3e434e4?w=150&h=150&fit=crop&crop=face',
      published: true
    },
    {
      name: 'Michael Chen', 
      role: 'Product Manager',
      company: 'InnovateLabs',
      rating: 5,
      quote: 'Their expertise in AI implementation is unparalleled. We saw 300% improvement in our analytics capabilities.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      published: true
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO', 
      company: 'DataDriven Inc',
      rating: 5,
      quote: 'Professional, knowledgeable, and results-driven. They delivered an AI solution that exceeded our expectations.',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      published: true
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { 
        id: `testimonial-${testimonial.name.toLowerCase().replace(' ', '-')}`
      },
      update: {},
      create: {
        id: `testimonial-${testimonial.name.toLowerCase().replace(' ', '-')}`,
        ...testimonial,
      },
    });
  }

  console.log('✅ Created sample testimonials');

  // Create some sample services
  const services = [
    {
      id: 'service-ai-strategy',
      title: 'AI Strategy Consulting',
      description: 'Comprehensive AI strategy development and implementation roadmap for your business transformation.',
      features: JSON.stringify([
        'AI Readiness Assessment',
        'Custom AI Strategy Development', 
        'Implementation Roadmap',
        'ROI Analysis and Projections',
        'Technology Stack Recommendations'
      ]),
      price: 15000,
      published: true
    },
    {
      id: 'service-ml-development',
      title: 'Machine Learning Development',
      description: 'End-to-end machine learning model development, training, and deployment services.',
      features: JSON.stringify([
        'Custom ML Model Development',
        'Data Pipeline Architecture',
        'Model Training & Optimization', 
        'Production Deployment',
        'Performance Monitoring'
      ]),
      price: 30000,
      published: true
    },
    {
      id: 'service-nlp',
      title: 'Natural Language Processing',
      description: 'Advanced NLP solutions for text analysis, chatbots, and language understanding applications.',
      features: JSON.stringify([
        'Text Analytics & Sentiment Analysis',
        'Chatbot Development',
        'Language Translation Services',
        'Content Generation',
        'Speech Recognition Integration'
      ]),
      price: 25000,
      published: true
    }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }

  console.log('✅ Created sample services');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
