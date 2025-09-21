import { Link } from 'react-router-dom';
import { Brain, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const navigation = {
  main: [
    { name: 'Services', href: '/services' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Contact', href: '/contact' },
  ],
  services: [
    { name: 'AI Development', href: '/services' },
    { name: 'Web Applications', href: '/services' },
    { name: 'Data Analytics', href: '/services' },
    { name: 'Cloud Solutions', href: '/services' },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Github,
    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-muted-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BengalMindAI Consultancy</span>
            </div>
            <p className="text-sm leading-6 text-muted-300">
              Transforming businesses with cutting-edge AI solutions. We specialize in machine learning,
              data analytics, and intelligent automation to drive innovation and growth.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-400 hover:text-muted-300 transition-colors duration-200"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-muted-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Services</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-muted-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex items-center space-x-3 text-sm text-muted-300">
                    <Mail className="h-4 w-4" />
                    <span>bengalmindaiconsultancy@gmail.com</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-muted-300">
                    <Phone className="h-4 w-4" />
                    <span>+91 (000) 123-4567</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-muted-300">
                    <MapPin className="h-4 w-4" />
                    <span>Kolkata, WB</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-muted-700 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-muted-400">
            &copy; 2025 BengalMindAI Consultancy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
