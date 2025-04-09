import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Code, Command, Terminal } from 'lucide-react';

const AnimatedHeader = () => {
  // State for animated typing effect
  const [text, setText] = useState('');
  const fullText = "Welcome to Chatfolio";
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Matrix-like code rain effect state
  const [codeRain, setCodeRain] = useState([]);
  
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
  
  // Generate code rain elements
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ><[]{}';
    const rain = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      speed: 0.5 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.5
    }));
    setCodeRain(rain);
  }, []);

  // Animate code rain
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeRain(prev => prev.map(drop => {
        const newY = drop.y + drop.speed;
        return newY > 100 
          ? { ...drop, y: -20, char: '01アイウエオカキクケコサシスセソタチツテトナニヌネノ><[]{}' [Math.floor(Math.random() * 28)] }
          : { ...drop, y: newY };
      }));
    }, 100);
    return () => clearInterval(interval);
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
    { Icon: Code, delay: 0, x: -120, y: -80 },
    { Icon: Terminal, delay: 0.3, x: 120, y: -60 },
    { Icon: Command, delay: 0.6, x: -100, y: 80 }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center relative overflow-hidden bg-gray-900">
      
      
      {/* Hexagon Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-blue-500 m-4 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      {/* Floating Tech Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.7,
            y: [y, y + 10, y],
            x: [x, x + 5, x]
          }}
          transition={{ 
            delay: delay,
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
      
      {/* Glowing Bot */}
      <motion.div
        className="absolute top-10 right-10 text-5xl"
        animate={{ 
          y: [0, -10, 0],
          filter: ["drop-shadow(0 0 8px rgba(0, 255, 255, 0.7))", "drop-shadow(0 0 12px rgba(0, 255, 255, 0.9))", "drop-shadow(0 0 8px rgba(0, 255, 255, 0.7))"]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        🤖
      </motion.div>
      
      {/* Terminal Heading Container */}
      <motion.div
        className="relative border-2 border-green-500 p-8 rounded-lg bg-black bg-opacity-80 shadow-lg shadow-green-500/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(0, 255, 0, 0.3)" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Terminal Header */}
        <div className="flex items-center mb-4 border-b border-green-900 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <div className="text-xs text-green-500 ml-2 font-mono">chatfolio.sh</div>
        </div>
        
        {/* Main Heading with Typewriter Effect */}
        <div className="font-mono text-left mb-2 text-green-500">$ run welcome.js</div>
        <motion.h1
          className="text-5xl md:text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          {text}
          <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-blue-400 mt-4 max-w-3xl font-mono"
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
          <span className="text-green-500"></span> An interactive gateway to know about my work, education, skills, projects......and more!!<br />

        </motion.p>
        
        {/* Interactive Code Section */}
        {hovered && (
          <motion.div 
            className="absolute -bottom-3 left-0 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x:600,y: -255 }}
            transition={{ duration: 1 }}
          >
            <div className="w-fit text-xs text-left text-green-400 font-mono bg-black bg-opacity-70 p-2 rounded-b-lg">
              const portfolio = new Developer("Fullstack AI Engineer");<br />
              portfolio.init();
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Pulsing Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 text-green-500 cursor-pointer"
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