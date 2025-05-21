import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const HeroSection = ({ scrollToSection, user, navigate }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles = [];
      const colors = ['#4f46e5', '#7c3aed', '#2563eb', '#8b5cf6', '#3b82f6'];
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Regenerate particles on window resize
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
     
      
      {/* Particle animation */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              opacity: 0.6,
            }}
            animate={{
              y: [0, -20, 0, 20, 0],
              x: [0, 15, 0, -15, 0],
              scale: [1, 1.2, 1, 0.8, 1],
              opacity: [0.6, 0.8, 0.6, 0.4, 0.6]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto max-w-6xl z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              Build Your <span className="text-indigo-600">Professional Resume</span> in Minutes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
              Create professional resumes with our AI-powered builder. Stand out from the crowd and land your dream job.
            </p>
            
            {user ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </motion.button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 border border-indigo-600"
                  onClick={() => scrollToSection('features')}
                >
                  Learn More
                </motion.button>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 w-full px-4 md:px-0 mt-8 md:mt-0"
          >
            <div className="relative max-w-sm mx-auto md:max-w-none">
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-2 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-3 md:p-5">
                  <div className="flex flex-col space-y-3 md:space-y-4">
                    <div className="w-1/3 h-4 md:h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-2/3 h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full h-16 md:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex justify-between">
                      <div className="w-1/2 h-6 md:h-8 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                      <div className="w-1/2 h-6 md:h-8 bg-indigo-200 dark:bg-indigo-900 rounded ml-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => scrollToSection('features')}
          className="text-gray-500 dark:text-gray-400 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;