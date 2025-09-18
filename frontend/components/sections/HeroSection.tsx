'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useIntersectionObserver } from '@/hooks';
import { Play, TrendingUp, Users, Award } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);
  
  const heroContent = [
    {
      headline: "Transform Your Enterprise with",
      highlight: "Next-Generation AI",
      subtext: "Fortune 500 companies trust us to deliver AI solutions that drive measurable ROI and competitive advantage",
      cta: "Schedule Strategic Consultation",
      stats: [
        { value: "500M+", label: "Cost Savings Generated" },
        { value: "98%", label: "Client Retention Rate" },
        { value: "150+", label: "Enterprise Deployments" }
      ]
    },
    {
      headline: "Scale Innovation with",
      highlight: "AI-First Architecture",
      subtext: "From proof-of-concept to enterprise deployment, we architect solutions that grow with your business",
      cta: "Explore AI Capabilities",
      stats: [
        { value: "40%", label: "Average Efficiency Gain" },
        { value: "6 Months", label: "Average Time to Value" },
        { value: "24/7", label: "Enterprise Support" }
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroContent.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <Badge variant="gradient" className="mb-6 text-lg px-6 py-3">
                <Award className="w-5 h-5 mr-2" />
                World-Class AI Solutions
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {heroContent[currentSlide].headline}
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {heroContent[currentSlide].highlight}
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {heroContent[currentSlide].subtext}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="xl" className="group">
                <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {heroContent[currentSlide].cta}
              </Button>
              
              <Button variant="outline" size="xl" className="group bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-gray-900">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {heroContent[currentSlide].stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {heroContent.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full p-0 transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div 
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer hover:border-white/50 transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            const nextSection = document.querySelector('#stats');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
