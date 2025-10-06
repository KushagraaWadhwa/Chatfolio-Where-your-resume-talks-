import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code, Command, Terminal, Zap, Database, Cloud } from 'lucide-react';
// import Bot3D from './Bot3D';

const AnimatedHeader = () => {
  // State for animated typing effect
  const [text, setText] = useState('');
  const fullText = "Hello, I'm Kushagra!";
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Interactive hover state
  const [hovered, setHovered] = useState(false);
  
  // Typing effect
  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [text]);
  
  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);
  
  // Animated background gradient
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate gradient position based on mouse position
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPos({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const subtitleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 1.5 }
    }
  };

  const floatingIcons = [
    { Icon: Code, delay: 0, x: -120, y: -80, color: "#e879f9" },  // Fuchsia
    { Icon: Terminal, delay: 0.3, x: 120, y: -60, color: "#2dd4bf" }, // Teal
    { Icon: Command, delay: 0.6, x: -100, y: 80, color: "#f472b6" },  // Pink
    { Icon: Zap, delay: 0.4, x: 140, y: 70, color: "#f59e0b" },  // Amber
    { Icon: Database, delay: 0.7, x: -80, y: -120, color: "#3b82f6" },  // Blue
    { Icon: Cloud, delay: 0.2, x: 80, y: -120, color: "#8b5cf6" }  // Violet
  ];
  
  // Optimized particle effect - reduced from 40 to 15 particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 3
  }));

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
      style={{
        backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgba(130, 58, 180, 0.3), rgba(29, 78, 216, 0.2), rgba(12, 74, 110, 0.3))`,
      }}
    >
      {/* Hexagon Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-indigo-500 m-4 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      {/* Animated Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-60 pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.8)`
          }}
          animate={{
            y: [0, -(Math.random() * 100 + 50)],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Floating Tech Icons */}
      {floatingIcons.map(({ Icon, delay, x, y, color }, index) => (
        <motion.div
          key={index}
          className="absolute opacity-70"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.7,
            y: [y, y + 10, y],
            x: [x, x + 5, x],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            delay,
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
      
      {/* Terminal Heading Container */}
      <motion.div
        className="relative border-2 border-indigo-500 p-8 rounded-lg bg-gradient-to-br from-gray-900 to-black bg-opacity-90 shadow-lg shadow-indigo-500/30 backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)",
          borderColor: "rgba(192, 132, 252, 1)"
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Terminal Header */}
        <div className="flex items-center mb-4 border-b border-indigo-900 pb-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <div className="text-xs text-indigo-400 ml-2 font-mono">chatfolio.sh</div>
        </div>
        
        {/* Main Heading with Typewriter Effect */}
        <div className="font-mono text-left mb-2 text-indigo-400">$ run kushagra_portfolio.js</div>
        <motion.h1
          className="text-5xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          {text}
          <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 mt-4 max-w-3xl font-mono"
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
          |AI Engineer & Full-Stack Developer<br/>| Building intelligent systems
          that bridge the gap between data and real-world impact 🚀
        </motion.p>
        {/* Interactive Code Section */}
        {hovered && (
          <motion.div 
            className="absolute -bottom-3 left-0 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-fit mx-auto text-xs text-left text-pink-400 font-mono bg-black bg-opacity-70 p-2 rounded-lg border border-pink-900/50">
              const portfolio = new Developer("Fullstack AI Engineer");<br />
              portfolio.init();
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Pulsing Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 text-pink-400 cursor-pointer"
        onClick={() => {
          const mainSection = document.getElementById('main-section');
          mainSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        animate={{ 
          y: [0, 8, 0],
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <div className="flex flex-col items-center">
          <div className="text-xs font-mono mb-1">Explore</div>
          <ChevronDown className="w-8 h-8" />
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedHeader;