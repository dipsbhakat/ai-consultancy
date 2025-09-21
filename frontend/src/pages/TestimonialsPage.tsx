import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { apiClient, ENDPOINTS } from '../lib/api';

// Backend testimonial interface
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
  avatar?: string;
}

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Fetching testimonials from API');
        const data = await apiClient.get<Testimonial[]>(ENDPOINTS.TESTIMONIALS);
        console.log('Testimonials fetched successfully:', data);
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-muted-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-900 mb-4">No testimonials available</h2>
          <p className="text-muted-600">Check back later for client testimonials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-muted-900 sm:text-6xl">
            Client <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Testimonials</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-600">
            Hear from our satisfied clients who have transformed their businesses with our AI solutions.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="card p-8 md:p-12 text-center"
              >
                <Quote className="mx-auto h-12 w-12 text-primary-600 mb-6" />
                
                <blockquote className="text-xl md:text-2xl font-medium text-muted-900 mb-8 leading-relaxed">
                  "{testimonials[currentIndex].message}"
                </blockquote>
                
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-muted-900">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-muted-600">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-primary-600 font-medium">
                      {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-2 lg:left-0 top-1/2 -translate-y-1/2 lg:-translate-x-4 p-3 lg:p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] min-w-[44px] z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-muted-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-2 lg:right-0 top-1/2 -translate-y-1/2 lg:translate-x-4 p-3 lg:p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] min-w-[44px] z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-muted-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-4 h-4 lg:w-3 lg:h-3 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] lg:min-h-0 lg:min-w-0 flex items-center justify-center ${
                  index === currentIndex
                    ? 'bg-primary-600 scale-110'
                    : 'bg-muted-300 hover:bg-muted-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-white lg:bg-primary-600' : 'bg-muted-600 lg:bg-muted-300'
                } lg:w-3 lg:h-3`} />
              </button>
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center text-muted-900 mb-16">
            All Client Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-300'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-muted-700 mb-4 leading-relaxed">
                  "{testimonial.message.length > 150 
                    ? testimonial.message.substring(0, 150) + '...' 
                    : testimonial.message}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-muted-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-muted-600 text-xs">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
