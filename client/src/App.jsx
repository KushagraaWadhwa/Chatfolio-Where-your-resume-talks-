import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Layout, Github, Linkedin, Moon, Sun, Code, Activity, User,Award, Brain, Briefcase, Mail, Calendar, Coffee} from 'lucide-react';
import Chat from './components/Chat';
import DocumentViewer from './components/DocumentViewer';
import ProjectShowcase from './components/ProjectShowcase';
import AnimatedHeader from './components/AnimatedHeader';

import useScrollPosition from './hooks/useScrollPosition';

const StatsDisplay = () => {
  const [activeSkill, setActiveSkill] = useState(null);
  const STATS = [
    { 
      label: 'Projects Developed', 
      value: '10+', 
      icon: <Code className="w-6 h-6 text-fuchsia-500" />,
      details: "Built applications across web development, data science, and AI domains"
    },
    { 
      label: 'GitHub Contributions', 
      value: 'Ask in chat!', 
      icon: <Activity className="w-6 h-6 text-teal-500" />,
      details: "Active open-source contributor with regular commits"
    },
    { 
      label: 'Companies worked with', 
      value: '4', 
      icon: <Briefcase className="w-6 h-6 text-amber-500" />,
      details: "Worked with startups and established companies on innovative projects"
    },
    { 
      label: 'Work Experience', 
      value: '1 yr', 
      icon: <Calendar className="w-6 h-6 text-rose-500" />,
      details: "Professional experience in data science and software development"
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
      name: "Email", 
      icon: <Mail className="w-5 h-5" />, 
      link: "mailto:contact@example.com",
      color: "hover:text-blue-500 dark:hover:text-blue-400"
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
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 gradient-text">Professional Overview</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          AI engineer and full-stack developer passionate about building intelligent systems
        </p>
      </motion.div>

      {/* Stats Cards with hover effects */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              background: "linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0))"
            }}
            className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900 pulse">
                {stat.icon}
              </div>
              <div>
                <motion.h3 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-700 dark:text-gray-300">{stat.label}</p>
              </div>
            </div>
            
            {/* Animated detail that appears on hover */}
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              whileHover={{ opacity: 1, height: "auto" }}
              className="mt-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden"
            >
              {stat.details}
            </motion.div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20" />
          </motion.div>
        ))}
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
const SAMPLE_DOCUMENTS = [
  {
    id: '1',
    title: 'Resume',
    description: 'My professional experience and skills',
    type: 'pdf',
    url: '/documents/KushagraWadhwa_Resume.pdf'
  },
  {
    id: '2',
    title: 'GATE DA 2025 Scorecard',
    description: 'GATE 2025 Data Science and Artificial Intelligence Scorecard',
    type: 'pdf',
    url: '/documents/Gate Scorecard.pdf'
  },
  {
    id: '3',
    title: 'Certificate-Diploma in Data Science @IIT Madras',
    description: 'Certificate for completing Diploma in Data Science course',
    type: 'pdf',
    url: '/documents/Diploma DS.pdf'
  },
  {
    id: '4',
    title: 'Certificate-Diploma in Programming @IIT Madras',
    description: 'Certificate for completing Diploma in Programming course',
    type: 'pdf',
    url: '/documents/Diploma Prog.pdf'
  },
  {
    id: '5',
    title: 'Foundational Certificate-Data Science and Programming @IIT Madras',
    description: 'Certificate for completing Foundational Level',
    type: 'pdf',
    url: '/documents/Foundation Cert.pdf'
  }
];

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

  // Define tabs content
  const tabContents = {
    chat: <Chat theme={darkMode ? 'dark' : 'light'} />,
    docs: <DocumentViewer documents={SAMPLE_DOCUMENTS} />,
    projects: <ProjectShowcase />, 
    about: <StatsDisplay />
  };

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