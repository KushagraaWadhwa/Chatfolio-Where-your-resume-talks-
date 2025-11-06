import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, FileText, Layout, Github, Linkedin, Moon, Sun, 
  Code, Activity, User, Mail, Sparkles, ArrowRight, Terminal,
  Zap, Brain, Rocket, ChevronDown, Menu, X
} from 'lucide-react';
import Chat from './components/Chat';
import DocumentViewer from './components/DocumentViewer';
import ProjectShowcase from './components/ProjectShowcase';
import WorkTimeline from './components/WorkTimeline';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import InteractiveShowcase from './components/InteractiveShowcase';
import TechStackShowcase from './components/TechStackShowcase';
import FloatingChatBubble from './components/FloatingChatBubble';
import SmartScrollButton from './components/SmartScrollButton';
import EasterEggs from './components/EasterEggs';
import CursorTrail from './components/CursorTrail';
import MatrixRain from './components/MatrixRain';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ensure page ALWAYS loads at the top on mount and refresh
  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also scroll after a brief delay to ensure DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tab configuration
  const tabs = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      gradient: 'from-violet-500 to-purple-500',
      description: 'Ask me anything'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Layout,
      gradient: 'from-cyan-500 to-blue-500',
      description: 'See what I\'ve built'
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-500',
      description: 'My journey so far'
    },
    {
      id: 'docs',
      label: 'Documents',
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Certificates & Resume'
    }
  ];

  // Memoized tab contents with consistent sizing
  const tabContents = useMemo(() => ({
    chat: <Chat theme={darkMode ? 'dark' : 'light'} />,
    projects: (
      <div className="h-full overflow-auto">
        <ProjectShowcase />
      </div>
    ),
    experience: (
      <div className="h-full overflow-auto">
        <WorkTimeline />
      </div>
    ),
    docs: (
      <div className="h-full overflow-auto">
        <DocumentViewer />
      </div>
    )
  }), [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <PerformanceOptimizer />
      
      {/* Fun Interactive Elements */}
      <EasterEggs />
      <CursorTrail />
      <MatrixRain />
      
      {/* Floating Chat Bubble */}
      <FloatingChatBubble 
        onClick={() => {
          // Set chat tab immediately and scroll
          setActiveTab('chat');
          document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        darkMode={darkMode}
      />
      
      {/* Smart Scroll Button - Follows user through sections */}
      <SmartScrollButton />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Modern Hero Section */}
        <div id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <motion.div
              className="absolute top-20 left-20 w-96 h-96 bg-violet-500/20 dark:bg-violet-500/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
                x: [0, -30, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full filter blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-violet-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            
            {/* Floating Code Symbols */}
            {['</>', '{}', '[]', '()', '=>', '!='].map((symbol, i) => (
              <motion.div
                key={symbol}
                className="absolute text-2xl font-mono text-violet-500/20 dark:text-violet-400/10"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 mb-8 hover:border-violet-500/40 transition-colors group"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-violet-500 group-hover:text-violet-600" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AI Engineer & Full-Stack Developer
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl md:text-8xl font-bold mb-6"
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent"
                >
                  Hi, I'm{' '}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 150 }}
                  className="relative inline-block"
                >
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient">
                    Kushagra
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full"
                  />
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Building intelligent systems that bridge the gap between{' '}
                <span className="text-violet-600 dark:text-violet-400 font-semibold">data</span> and{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">real-world impact</span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-16"
              >
                <button
                  onClick={() => {
                    document.getElementById('code-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Explore My Work
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('chat');
                    document.getElementById('content-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat with my AI Assistant
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
              >
                {[
                  { label: 'Projects Shipped', value: '10+', icon: Rocket, gradient: 'from-violet-500 to-purple-500' },
                  { label: 'Technologies', value: '15+', icon: Code, gradient: 'from-cyan-500 to-blue-500' },
                  { label: 'Experience', value: '1+ Year', icon: Zap, gradient: 'from-amber-500 to-orange-500' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="group relative p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <Icon className="w-8 h-8 mb-3 text-violet-500 group-hover:scale-110 transition-transform relative z-10" />
                      <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-1 relative z-10">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 relative z-10">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Code Showcase Section - Full Screen */}
        <div id="code-section" className="relative min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-20 px-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Code Animation Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4"
                >
                  <Terminal className="w-4 h-4 text-violet-500" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Building AI-Powered Systems
                  </span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  From RAG pipelines to agentic systems - watch real code from production AI applications
                </p>
              </div>

              {/* Interactive Showcase with Multiple Views */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <InteractiveShowcase />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Tech Stack Section - Full Screen */}
        <div id="tech-section" className="relative min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center py-20 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4"
                >
                  <Code className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    Tech Arsenal
                  </span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Full-Stack AI Development
                  </span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Production-ready stack for building scalable AI applications
                </p>
              </div>

              <TechStackShowcase />
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div id="content-section" className="relative z-20 bg-slate-50 dark:bg-slate-900">
          {/* Floating Navigation */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-violet-600" />
                  <span className="font-bold text-lg">Kushagra</span>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex items-center gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-lg`}
                            transition={{ type: 'spring', duration: 0.6 }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  
                  <a
                    href="https://github.com/KushagraaWadhwa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  
                  <a
                    href="https://www.linkedin.com/in/kushagra-wadhwa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>

                  {/* Mobile Menu */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden overflow-hidden"
                  >
                    <div className="py-4 space-y-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                              activeTab === tab.id
                                ? `bg-gradient-to-r ${tab.gradient} text-white`
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <div className="text-left">
                              <div className="font-medium">{tab.label}</div>
                              <div className="text-xs opacity-70">{tab.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-[calc(100vh-180px)]"
              >
                {tabContents[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  © 2025 Kushagra Wadhwa • AI Engineer & Full-Stack Developer
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:contact@kushagra.dev"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Get in touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

