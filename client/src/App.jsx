import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Layout, Github, Linkedin, Moon, Sun, Code, Activity, User,Award, Brain, Briefcase, Mail, Calendar, Coffee} from 'lucide-react';
import Chat from './components/Chat';
import DocumentViewer from './components/DocumentViewer';
import ProjectShowcase from './components/ProjectShowcase';
import AnimatedHeader from './components/AnimatedHeader';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import WorkTimeline from './components/WorkTimeline';

import useScrollPosition from './hooks/useScrollPosition';

  const StatsDisplay = () => {
    const [activeSkill, setActiveSkill] = useState(null);
    const STATS = [
      { 
        label: 'Projects Delivered', 
        value: '10+', 
        icon: <Code className="w-6 h-6 text-fuchsia-500" />,
        details: "Designed and developed end-to-end solutions in web, AI, and data-driven applications"
      },
      { 
        label: 'Technologies Mastered', 
        value: '500+', 
        icon: <Activity className="w-6 h-6 text-teal-500" />,
        details: "Hands-on with 15+ technologies spanning backend, frontend, and AI"
      },
      { 
        label: 'Companies Collaborated With', 
        value: '5', 
        icon: <Briefcase className="w-6 h-6 text-amber-500" />,
        details: "Partnered with startups and enterprises to deliver innovative and scalable solutions"
      },
      { 
        label: 'Professional Experience', 
        value: '1 Year+', 
        icon: <Calendar className="w-6 h-6 text-rose-500" />,
        details: "Hands-on industry experience in software engineering and data science across diverse projects"
      }
    ];
    
  
  // Skills with categories for the interactive skills section
  const SKILLS = [
    {
      category: "Languages & Data",
      skills: [
        { name: "Python", level: 90 },
        { name: "SQL", level: 85 },
        { name: "JavaScript", level: 75 },
        { name: "HTML/CSS", level: 80 }
      ],
      color: "from-blue-500 to-cyan-500",
      icon: <Code className="w-5 h-5" />
    },
    {
      category: "AI & ML",
      skills: [
        { name: "LLMs", level: 85 },
        { name: "RAG Systems", level: 90 },
        { name: "LangChain", level: 80 },
        { name: "LlamaIndex", level: 85 }
      ],
      color: "from-purple-500 to-pink-500",
      icon: <Brain className="w-5 h-5" />
    },
    {
      category: "Web & APIs",
      skills: [
        { name: "React", level: 75 },
        { name: "FastAPI", level: 85 },
        { name: "Flask", level: 80 },
        { name: "REST APIs", level: 85 }
      ],
      color: "from-amber-500 to-orange-500",
      icon: <FileText className="w-5 h-5" />
    }
  ];
  
  // Fun facts for the animated section
  const FUN_FACTS = [
    { fact: "Prefers tea over coffee ☕", icon: <Coffee className="w-5 h-5" /> },
    { fact: "Loves solving algorithmic puzzles", icon: <Brain className="w-5 h-5" /> },
    { fact: "Enjoys exploring new technologies", icon: <Code className="w-5 h-5" /> }
  ];
  
  // Contact methods with interactive elements
  const CONTACT_METHODS = [
    { 
      name: "GitHub", 
      icon: <Github className="w-5 h-5" />, 
      link: "https://github.com/KushagraaWadhwa",
      color: "hover:text-violet-500 dark:hover:text-violet-400"
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="w-5 h-5" />, 
      link: "https://www.linkedin.com/in/kushagra-wadhwa/",
      color: "hover:text-blue-600 dark:hover:text-blue-400"
    },
    { 
      name: "Email", 
      icon: <Mail className="w-5 h-5" />, 
      link: "mailto:contact@example.com",
      color: "hover:text-emerald-500 dark:hover:text-emerald-400"
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full gap-8 overflow-y-auto pb-8">

      {/* Work Experience Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <WorkTimeline />
      </motion.div>

      {/* Enhanced Stats Cards with modern design */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {STATS.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.03, 
              y: -3,
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
            }}
            className="group relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 h-48 cursor-pointer"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full transform -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-indigo-600 dark:text-indigo-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <motion.h3 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-2"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{stat.label}</p>
                </div>
              </div>
              
              {/* Enhanced detail section - Always visible on group hover */}
              <div className="mt-4 relative">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{stat.details}</p>
                </div>
              </div>
            </div>

            {/* Subtle indicator */}
            <div className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Beyond Work - Personal Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
      >
        <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Beyond Work
        </h3>
        <div className="max-w-3xl mx-auto">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center justify-center">
            <Coffee className="w-6 h-6 mr-3 text-amber-500" />
            Interests & Hobbies
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "🏸", text: "Badminton & Cricket", desc: "Active sports enthusiast who enjoys competitive games" },
              { icon: "🎵", text: "Music & Dancing", desc: "President of college Dance Club, led team of 15 people" },
              { icon: "✈️", text: "Traveling", desc: "Exploring new cultures, places, and meeting new people" },
              { icon: "🎯", text: "Leadership", desc: "Participated in 40+ competitions as team leader" }
            ].map((interest, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {interest.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {interest.text}
                    </h5>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {interest.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Fun Facts & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Fun Facts</h3>
          <ul className="space-y-3">
            {FUN_FACTS.map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300">
                  {item.icon}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{item.fact}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* Get In Touch Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Get In Touch</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Interested in collaborating or have questions? Feel free to reach out through:
          </p>
          
          <div className="flex flex-wrap gap-3">
            {CONTACT_METHODS.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all ${method.color}`}
              >
                {method.icon}
                <span>{method.name}</span>
              </motion.a>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              onClick={() => document.querySelector('[data-tab="chat"]')?.click()}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat with me</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        <p>© 2025 Kushagra Wadhwa • AI Engineer & Full-Stack Developer</p>
      </motion.div>
    </div>
  );
};
// Documents are now fetched from the API in DocumentViewer component

// Stats data
const STATS = [
  { label: 'Projects Developed', value: '10+', icon: <Code className="w-6 h-6 text-fuchsia-500" /> },
  { label: 'GitHub Contributions', value: 'Why not ask that in the chat!!', icon: <Activity className="w-6 h-6 text-teal-500" /> },
  { label: 'Companies Worked With', value: 4, icon: <User className="w-6 h-6 text-amber-500" /> },
  { label: 'Years of Work Experience', value: 1, icon: <FileText className="w-6 h-6 text-rose-500" /> }
];



function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const { scrollPosition, isAtTop } = useScrollPosition();

  const showSideBot = !isAtTop && scrollPosition > window.innerHeight * 0.7;

  // Ensure the page always loads at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add scroll listener to show the side bot after scrolling past header
  useEffect(() => {
    const handleScroll = () => {
      // Show side bot when user scrolls past the header section
      const scrollPosition = window.scrollY;
      const headerHeight = window.innerHeight * 0.8; // Approx header height
      
      setShowSideBot(scrollPosition > headerHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized tabs content to prevent unnecessary re-renders
  const tabContents = useMemo(() => ({
    chat: <Chat theme={darkMode ? 'dark' : 'light'} />,
    docs: <DocumentViewer />,
    projects: <ProjectShowcase />, 
    about: <StatsDisplay />
  }), [darkMode]);

  // Tab configuration
  const tabs = [
    {
      title: "Chat",
      value: "chat",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: "Documents",
      value: "docs",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Projects",
      value: "projects",
      icon: <Layout className="w-6 h-6" />
    },
    {
      title: "About",
      value: "about",
      icon: <User className="w-6 h-6" />
    }
  ];

  // Card stack animation and rendering
  const renderTabContent = () => {
    return tabs.map((tab, i) => {
      // Calculate the position for the stack effect
      const isActive = activeTab === tab.value;
      
      // Get the index relative to active tab for stacking
      const activeIndex = tabs.findIndex(t => t.value === activeTab);
      const distance = (i - activeIndex + tabs.length) % tabs.length;
      
      // Stack tabs behind the active one
      const getZIndex = () => {
        if (isActive) return 50;
        return 40 - distance;
      };

      // Position cards in 3D space
      const getTransform = () => {
        if (isActive) return "rotateY(0deg) translateZ(0px)";
        
        const rotate = distance * 5; // Small rotation for each card
        const translateZ = -distance * 10; // Push back in Z space
        const translateX = distance * 10; // Shift right for cascading effect
        
        return `rotateY(${rotate}deg) translateZ(${translateZ}px) translateX(${translateX}px)`;
      };

      return (
        <motion.div
          key={tab.value}
          className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black border border-gray-200 dark:border-indigo-900/30 overflow-hidden"
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0.7 - (distance * 0.15),
            scale: isActive ? 1 : 1 - (distance * 0.05),
            zIndex: getZIndex(),
            transform: getTransform(),
            filter: isActive ? "blur(0px)" : `blur(${distance * 1}px)`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          style={{
            transformOrigin: "center left",
            pointerEvents: isActive ? "auto" : "none"
          }}
        >
          <div className="w-full h-full p-4 overflow-auto">
            {tabContents[tab.value]}
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <PerformanceOptimizer />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors">

        {/* Full-screen Animated Header */}
        <AnimatedHeader />

        {/* Rest of App Main Content */}
        <div id="main-section" className="max-w-10xl min-h-screen mx-auto p-2">
          {/* Header with Tabs and Buttons */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-lg p-4 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              {/* Tabs in header */}
              <div className="flex gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === tab.value
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.title}</span>
                  </button>
                ))}
              </div>

              {/* Social & Dark Mode Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: darkMode ? 180 : 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://github.com/KushagraaWadhwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  <Github className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://www.linkedin.com/in/kushagra-wadhwa-864319229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  <Linkedin className="w-5 h-5 text-blue-500" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Card Stack Content Area */}
          <div className="w-full md:w-[105rem] h-full md:h-[50rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start mx-auto">
            <div className="relative w-full h-full overflow-hidden">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;