import React, { useEffect } from 'react';

/**
 * Performance optimization component that applies various optimizations
 * to improve the overall performance of the application
 */
const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);

      // Preload critical images
      const criticalImages = [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'
      ];

      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Optimize scroll performance
    const optimizeScrollPerformance = () => {
      // Add passive event listeners for better scroll performance
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'scroll' || type === 'touchmove' || type === 'wheel') {
          options = options || {};
          options.passive = true;
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    };

    // Optimize animations for better performance
    const optimizeAnimations = () => {
      // Add will-change property to animated elements
      const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="motion-"]');
      animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
      });

      // Remove will-change after animation completes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (!target.classList.toString().includes('animate-') && 
                !target.classList.toString().includes('motion-')) {
              target.style.willChange = 'auto';
            }
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeScrollPerformance();
    optimizeAnimations();

    // Cleanup function
    return () => {
      // Remove any added event listeners or observers
      const links = document.querySelectorAll('link[rel="preload"]');
      links.forEach(link => link.remove());
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
