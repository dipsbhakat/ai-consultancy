export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDesc: string;
  features: string[];
  detailedDesc?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  photoUrl: string;
  quote: string;
  rating: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
  consent: boolean;
}

export const services: Service[] = [
  {
    id: '1',
    title: 'AI-Powered Web Applications',
    slug: 'ai-web-apps',
    icon: 'Bot',
    shortDesc: 'Intelligent web applications with machine learning capabilities and AI-driven user experiences.',
    features: ['Machine Learning Integration', 'Natural Language Processing', 'Predictive Analytics', 'Real-time AI Processing'],
    detailedDesc: 'Transform your web presence with cutting-edge AI integration. Our AI-powered web applications leverage machine learning algorithms to provide personalized user experiences, intelligent automation, and data-driven insights.'
  },
  {
    id: '2',
    title: 'Custom Software Development',
    slug: 'custom-software',
    icon: 'Code',
    shortDesc: 'Tailored software solutions built with modern technologies and scalable architectures.',
    features: ['Full-Stack Development', 'API Development', 'Database Design', 'Cloud Integration'],
    detailedDesc: 'End-to-end custom software development using the latest technologies. We build scalable, maintainable solutions that grow with your business needs.'
  },
  {
    id: '3',
    title: 'Data Analytics & Visualization',
    slug: 'data-analytics',
    icon: 'BarChart3',
    shortDesc: 'Transform raw data into actionable insights with advanced analytics and interactive dashboards.',
    features: ['Business Intelligence', 'Real-time Dashboards', 'Predictive Modeling', 'Data Mining'],
    detailedDesc: 'Unlock the power of your data with our comprehensive analytics solutions. From data collection to visualization, we help you make informed decisions.'
  },
  {
    id: '4',
    title: 'Cloud Architecture & DevOps',
    slug: 'cloud-devops',
    icon: 'Cloud',
    shortDesc: 'Scalable cloud infrastructure and automated deployment pipelines for optimal performance.',
    features: ['AWS/Azure/GCP', 'CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring & Logging'],
    detailedDesc: 'Build robust, scalable cloud infrastructure with automated deployment processes. We ensure your applications are reliable, secure, and performant.'
  },
  {
    id: '5',
    title: 'Mobile App Development',
    slug: 'mobile-apps',
    icon: 'Smartphone',
    shortDesc: 'Native and cross-platform mobile applications with seamless user experiences.',
    features: ['iOS & Android', 'React Native', 'API Integration', 'Push Notifications'],
    detailedDesc: 'Create engaging mobile experiences that connect with your users. Our mobile apps are built for performance, usability, and scalability.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Solutions',
    photoUrl: '/images/testimonials/sarah-chen.jpg',
    quote: 'The BengalMindAI Consultancy team delivered an exceptional machine learning platform that revolutionized our data processing. Their expertise and attention to detail exceeded our expectations.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'InnovateCorp',
    photoUrl: '/images/testimonials/michael-rodriguez.jpg',
    quote: 'Working with this team was a game-changer for our startup. They built a scalable web application that perfectly aligned with our vision and business goals.',
    rating: 5
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    role: 'Research Director',
    company: 'BioMed Analytics',
    photoUrl: '/images/testimonials/emily-watson.jpg',
    quote: 'Their data analytics solution helped us uncover insights we never knew existed in our research data. The visualizations are both beautiful and highly functional.',
    rating: 5
  },
  {
    id: '4',
    name: 'James Thompson',
    role: 'Founder & CEO',
    company: 'EcoTech Industries',
    photoUrl: '/images/testimonials/james-thompson.jpg',
    quote: 'The cloud infrastructure they designed for us has been rock-solid. Zero downtime in 18 months and seamless scaling during our rapid growth phase.',
    rating: 5
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'Head of Digital',
    company: 'RetailMax',
    photoUrl: '/images/testimonials/lisa-park.jpg',
    quote: 'Our mobile app has received outstanding user feedback thanks to their intuitive design and flawless execution. Downloads increased by 300% in the first quarter.',
    rating: 5
  },
  {
    id: '6',
    name: 'David Kumar',
    role: 'VP of Engineering',
    company: 'FinanceForward',
    photoUrl: '/images/testimonials/david-kumar.jpg',
    quote: 'They integrated AI capabilities into our existing platform seamlessly. The predictive analytics feature has become our most valuable tool for client insights.',
    rating: 5
  }
];

export const projectTypes = [
  'AI/ML Development',
  'Web Application',
  'Mobile App',
  'Data Analytics',
  'Cloud Migration',
  'API Development',
  'Custom Software',
  'Consulting'
];

export const budgetRanges = [
  'Under $25k',
  '$25k - $50k',
  '$50k - $100k',
  '$100k - $250k',
  '$250k - $500k',
  'Above $500k'
];
