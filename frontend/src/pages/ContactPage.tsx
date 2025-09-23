import { motion } from 'framer-motion';
import { ConversionContactForm } from '../components/ConversionContactForm';

export function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative section-padding gradient-mesh">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Let's Build the Future Together
            </h1>
            <p className="text-xl text-accent-100 leading-relaxed max-w-2xl mx-auto">
              Ready to transform your business with AI? Our experts are here to guide you through 
              every step of your digital transformation journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ConversionContactForm />
    </div>
  );
}
