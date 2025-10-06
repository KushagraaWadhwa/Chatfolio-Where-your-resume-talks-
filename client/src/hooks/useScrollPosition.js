import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to track scroll position and provide scroll-related values
 * Optimized with throttling and memoization for better performance
 * @returns {Object} Scroll information including position, direction, and progress
 */
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const ticking = useRef(false);

  const updateScrollPosition = useCallback(() => {
    const position = window.scrollY;
    const direction = position > lastScrollTop ? 'down' : 'up';
    
    // Calculate scroll progress (0 to 1)
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? Math.min(position / totalHeight, 1) : 0;
    
    setScrollPosition(position);
    setScrollDirection(direction);
    setScrollProgress(progress);
    setLastScrollTop(position <= 0 ? 0 : position);
    ticking.current = false;
  }, [lastScrollTop]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(updateScrollPosition);
      ticking.current = true;
    }
  }, [updateScrollPosition]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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