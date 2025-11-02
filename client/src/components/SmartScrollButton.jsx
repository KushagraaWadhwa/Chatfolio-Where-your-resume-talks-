import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const SmartScrollButton = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showButton, setShowButton] = useState(true);

  // Define all sections in order
  const sections = [
    { id: 'hero-section', name: 'Hero' },
    { id: 'code-section', name: 'Code Showcase' },
    { id: 'tech-section', name: 'Tech Arsenal' },
    { id: 'content-section', name: 'Content Tabs' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Determine current section based on scroll position
      const heroSection = document.getElementById('hero-section');
      const codeSection = document.getElementById('code-section');
      const techSection = document.getElementById('tech-section');
      const contentSection = document.getElementById('content-section');
      
      if (heroSection && codeSection && techSection && contentSection) {
        const heroBottom = heroSection.offsetHeight;
        const codeBottom = heroBottom + codeSection.offsetHeight;
        const techBottom = codeBottom + techSection.offsetHeight;
        
        if (scrollPosition < heroBottom - 100) {
          setCurrentSection(0);
          setShowButton(true);
        } else if (scrollPosition < codeBottom - 100) {
          setCurrentSection(1);
          setShowButton(true);
        } else if (scrollPosition < techBottom - 100) {
          setCurrentSection(2);
          setShowButton(true);
        } else {
          setCurrentSection(3);
          // Hide button at the last section
          setShowButton(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextSection = currentSection + 1;
    if (nextSection < sections.length) {
      const element = document.getElementById(sections[nextSection].id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-pointer flex flex-col items-center gap-2 group"
            onClick={scrollToNext}
          >
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {currentSection === 0 && 'See My Work'}
              {currentSection === 1 && 'Tech Arsenal'}
              {currentSection === 2 && 'Explore More'}
            </span>
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 group-hover:border-violet-500 group-hover:shadow-violet-500/20 transition-all">
                <ChevronDown className="w-6 h-6 text-violet-500 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartScrollButton;

