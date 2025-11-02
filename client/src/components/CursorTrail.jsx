import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CursorTrail = () => {
  const [trails, setTrails] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const codeSymbols = ['</>', '{}', '[]', '()', '=>', '!=', '&&', '||', '++', '--', '::'];

  useEffect(() => {
    // Toggle with Ctrl+Shift+C
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        setIsEnabled(!isEnabled);
      }
    };

    const handleMouseMove = (e) => {
      if (!isEnabled) return;

      const trail = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
      };

      setTrails((prev) => [...prev.slice(-15), trail]); // Keep last 15 trails
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEnabled]);

  // Auto-remove old trails
  useEffect(() => {
    if (trails.length > 0) {
      const timer = setTimeout(() => {
        setTrails((prev) => prev.slice(1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [trails]);

  return (
    <AnimatePresence>
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -20 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-50 text-violet-500 font-mono font-bold"
          style={{
            left: trail.x,
            top: trail.y,
            fontSize: `${12 + index}px`,
          }}
        >
          {trail.symbol}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default CursorTrail;

