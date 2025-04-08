import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Layout, Github, Linkedin, Moon, Sun, Code, Activity, User } from 'lucide-react';
import Chat from './components/Chat';
import DocumentViewer from './components/DocumentViewer';
import ProjectShowcase from './components/ProjectShowcase';
import AnimatedHeader from './components/AnimatedHeader';

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
  { label: 'Projects Explored', value: '10+', icon: <Code className="w-6 h-6 text-blue-500" /> },
  { label: 'GitHub Contributions', value: 'Why not ask the bot for that!!', icon: <Activity className="w-6 h-6 text-green-500" /> },
  { label: 'Companies Worked With', value: 4, icon: <User className="w-6 h-6 text-purple-500" /> },
  { label: 'Years of Experience', value: 1, icon: <FileText className="w-6 h-6 text-orange-500" /> }
];

// Stats Component
const StatsDisplay = () => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Professional Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STATS.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-2"></h3>
        <p className="opacity-90">
          Passionate about combining cutting-edge AI with robust software engineering principles to build innovative solutions.
          Specialized in Python, RAG systems, and little bit of web development.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Python', '{LLMs, RAGs}', '{HTML,CSS,React}', '{LlamaIndex,LangChain}', '{FastAPI, Flask}', 'SQL'].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  // Ensure the page always loads at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define tabs content
  const tabContents = {
    chat: <Chat />,
    docs: <DocumentViewer documents={SAMPLE_DOCUMENTS} />,
    projects: <ProjectShowcase />,
    about: <StatsDisplay />
  };

  // Tab configuration
  const tabs = [
    {
      title: "Chat",
      value: "chat",
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      title: "Documents",
      value: "docs",
      icon: <FileText className="w-4 h-4" />
    },
    {
      title: "Projects",
      value: "projects",
      icon: <Layout className="w-4 h-4" />
    },
    {
      title: "About",
      value: "about",
      icon: <User className="w-4 h-4" />
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
          className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
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
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">

        {/* Full-screen Animated Header */}
        <AnimatedHeader />

        {/* Rest of App Main Content */}
        <div id="main-section" className="max-w-7xl mx-auto p-8">
          {/* Header with Tabs and Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              {/* Tabs in header */}
              <div className="flex gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.value
                        ? 'bg-blue-500 text-white'
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
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <a
                  href="https://github.com/KushagraaWadhwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kushagra-wadhwa-864319229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Card Stack Content Area */}
          <div className="h-[36rem] md:h-[40rem] [perspective:1000px] relative flex flex-col w-full items-start justify-start">
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