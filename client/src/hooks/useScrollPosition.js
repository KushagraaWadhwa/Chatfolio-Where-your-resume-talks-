import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll position and provide scroll-related values
 * @returns {Object} Scroll information including position, direction, and progress
 */
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down'); // 'up' or 'down'
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1 for overall page scroll progress
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const direction = position > lastScrollTop ? 'down' : 'up';
      
      // Calculate scroll progress (0 to 1)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(position / totalHeight, 1) : 0;
      
      setScrollPosition(position);
      setScrollDirection(direction);
      setScrollProgress(progress);
      setLastScrollTop(position <= 0 ? 0 : position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return {
    scrollPosition,
    scrollDirection,
    scrollProgress,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up',
    isAtTop: scrollPosition <= 10,
    isAtBottom: scrollProgress >= 0.95
  };
};

export default useScrollPosition;