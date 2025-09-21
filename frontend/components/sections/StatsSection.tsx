'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useIntersectionObserver, useCountUp } from '@/hooks';
import { 
  Building2, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Monitor, 
  Headphones,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.3 });

  const stats = [
    {
      value: 250,
      suffix: '+',
      label: 'Enterprise Clients',
      description: 'Fortune 500 companies worldwide',
      icon: Building2
    },
    {
      value: 98.5,
      suffix: '%',
      label: 'Success Rate',
      description: 'Projects delivered on time',
      icon: CheckCircle
    },
    {
      value: 500,
      suffix: 'M+',
      label: 'ROI Generated',
      description: 'In cost savings and revenue',
      icon: TrendingUp
    },
    {
      value: 40,
      suffix: '%',
      label: 'Efficiency Boost',
      description: 'Average productivity increase',
      icon: Zap
    },
    {
      value: 150,
      suffix: '+',
      label: 'AI Models',
      description: 'Successfully deployed',
      icon: Monitor
    },
    {
      value: 24,
      suffix: '/7',
      label: 'Support',
      description: 'Enterprise-grade assistance',
      icon: Headphones
    }
  ];

  const CountUpAnimation = ({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) => {
    const count = useCountUp(value, 0, 2000, isVisible);
    return <span>{count}{suffix}</span>;
  };

  return (
    <section id="stats" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="success" className="mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            Proven Results
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Numbers That Speak for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Excellence</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our track record of transforming enterprises with AI solutions that deliver measurable business impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 h-full">
                <CardContent className="p-8">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8" />
                    </div>

                    {/* Value */}
                    <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      <CountUpAnimation value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                    </div>

                    {/* Label */}
                    <div className="text-xl font-semibold text-gray-800 mb-2">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-gray-600">
                      {stat.description}
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Join These Success Stories?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Let us create a custom AI strategy that drives similar results for your enterprise
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 group"
              >
                Schedule Your AI Assessment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
