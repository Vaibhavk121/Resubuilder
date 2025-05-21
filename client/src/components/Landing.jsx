import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Add these imports at the top
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './layout/Navbar';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorksSection from './sections/HowItWorksSection';
import TemplatesSection from './sections/TemplatesSection';
import ContactSection from './sections/ContactSection';
import Footer from './layout/Footer';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} user={user} navigate={navigate} />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Landing;