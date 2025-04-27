import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight, Star, Code, Eye, GitBranch, Award, Database, Heart, Award as AwardIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PROJECTS = {
  "AI/ML Projects": [
    {
      id: '1',
      title: 'SalesAssist AI',
      description: 'A conversational AI framework designed to assist sales teams by providing instant responses to customer queries using RAG and LLMs.',
      longDescription: 'SalesAssist AI transforms customer interactions by leveraging Retrieval Augmented Generation (RAG) to provide accurate, context-aware responses in real-time. The system integrates with existing CRM platforms, allowing sales teams to focus on relationship building while the AI handles routine queries and information retrieval. Built with scalability in mind, it can process thousands of customer interactions simultaneously.',
      technologies: ['LLM', 'RAG', 'Python', 'LlamaIndex'],
      complexity: 85,
      timeline: '3 months',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/SalesAssist-AI',
      stats: {
        stars: 24,
        forks: 7,
        views: 1250,
        contributions: 142
      },
      techBreakdown: [
        { name: 'Python', value: 60, color: '#306998' },
        { name: 'LlamaIndex', value: 20, color: '#4B8BBE' },
        { name: 'FastAPI', value: 12, color: '#2D2D2D' },
        { name: 'Other', value: 8, color: '#646464' }
      ],
      highlights: [
        'Reduced customer response time by 73%',
        'Increased sales conversion by 23%',
        'Handles 5000+ queries daily'
      ]
    },
    {
      id: '2',
      title: 'Recipe to Rating: ML Food Rating Predictor',
      description: 'Predictive model for estimating food ratings based on ingredients and cooking methods using machine learning.',
      longDescription: 'This project applies machine learning to predict how well a recipe will be received based on its ingredients, preparation methods, and nutritional profile. By analyzing thousands of online recipes and their ratings, the model identifies patterns that contribute to popular dishes. Features include ingredient compatibility scoring, healthiness metrics, and complexity analysis.',
      technologies: ['Machine Learning', 'Scikit-learn', 'Pandas', 'EDA'],
      complexity: 70,
      timeline: '2 months',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
      kaggleUrl: 'https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions',
      stats: {
        stars: 18,
        forks: 5,
        views: 970,
        contributions: 89
      },
      techBreakdown: [
        { name: 'Python', value: 45, color: '#306998' },
        { name: 'Scikit-learn', value: 30, color: '#F7931E' },
        { name: 'Pandas', value: 20, color: '#150458' },
        { name: 'Other', value: 5, color: '#646464' }
      ],
      highlights: [
        'Achieved 86% prediction accuracy',
        'Analyzed 10,000+ recipes',
        'Featured in ML Monthly newsletter'
      ]
    },
    {
      id: '3',
      title: 'Ask Your PDF',
      description: 'Chatbot-style web application for querying PDF documents using document embedding techniques.',
      longDescription: 'Ask Your PDF transforms the way users interact with document content by enabling natural language queries. The application processes uploaded PDFs by extracting text, creating semantic embeddings, and indexing content for rapid retrieval. Users can ask questions in plain language and receive precise answers with source citations. The system handles complex documents including technical manuals, research papers, and legal documents.',
      technologies: ['Streamlit', 'Python', 'PDF Parsing', 'Vector Databases'],
      complexity: 65,
      timeline: '2 months',
      imageUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/AskYourPDF',
      stats: {
        stars: 21,
        forks: 9,
        views: 1450,
        contributions: 113
      },
      techBreakdown: [
        { name: 'Python', value: 50, color: '#306998' },
        { name: 'Streamlit', value: 25, color: '#FF4B4B' },
        { name: 'Vector DB', value: 15, color: '#0080FF' },
        { name: 'PDF Tools', value: 10, color: '#FF0000' }
      ],
      highlights: [
        'Processes documents up to 1000 pages',
        'Multilingual support for 8 languages',
        'Context-aware response generation'
      ]
    },
    
  ],
  "Software Development": [
    {
      id: '4',
      title: 'GrocExpress: Grocery Store App',
      description: 'Full-stack web application for managing grocery store inventory and sales with admin dashboard.',
      longDescription: 'GrocExpress streamlines grocery store operations with a comprehensive digital solution. The application includes inventory management with automated reordering, point-of-sale functionality, customer loyalty programs, and detailed analytics. The admin dashboard provides real-time insights into sales trends, product performance, and employee productivity.',
      technologies: ['Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
      complexity: 75,
      timeline: '3 months',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
      stats: {
        stars: 15,
        forks: 3,
        views: 850,
        contributions: 102
      },
      techBreakdown: [
        { name: 'Flask', value: 30, color: '#000000' },
        { name: 'JavaScript', value: 30, color: '#F7DF1E' },
        { name: 'HTML/CSS', value: 25, color: '#E34F26' },
        { name: 'SQLite', value: 15, color: '#003B57' }
      ],
      highlights: [
        'Reduced inventory management time by 45%',
        'Intuitive UI with 97% user satisfaction',
        'Modular architecture for easy extension'
      ]
    },
    {
      id: '5',
      title: 'Homeyfy: Household Services App',
      description: 'Multi-user platform connecting customers with household service professionals using role-based access control. Comes with Individual user Dashboard and scheduled jobs.',
      longDescription: 'Homeyfy bridges the gap between homeowners and service providers through a user-friendly platform. The application features service provider profiles with ratings and reviews, scheduling functionality with calendar integration, secure payment processing, and a messaging system. The role-based access control ensures appropriate permissions for customers, service providers, and administrators.',
      technologies: ['Flask', 'Vue.js', 'SQLite', 'Redis', 'Celery'],
      complexity: 80,
      timeline: '5 months',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/Homeyfy-The-Household-Services-App-',
      stats: {
        stars: 27,
        forks: 8,
        views: 1870,
        contributions: 198
      },
      techBreakdown: [
        { name: 'Vue.js', value: 40, color: '#4FC08D' },
        { name: 'Flask', value: 30, color: '#000000' },
        { name: 'Redis/Celery', value: 15, color: '#DC382D' },
        { name: 'SQLite', value: 15, color: '#003B57' }
      ],
      highlights: [
        'Connects 500+ service providers with customers',
        'Implemented real-time service tracking',
        'Automated service matching algorithm'
      ]
    },
    
    {
      id: '6',
      title: 'OpenCV Captcha Project',
      description: 'Automated CAPTCHA solver using OpenCV and deep learning for processing noisy, colored alphanumeric CAPTCHAs.',
      longDescription: 'This advanced CAPTCHA solver combines computer vision techniques with neural networks to decode complex image-based challenges. Unlike traditional OCR approaches, this solution excels with distorted text, overlapping characters, and noisy backgrounds. The preprocessing pipeline includes adaptive thresholding, contour detection, and character segmentation before passing to a convolutional neural network for recognition.',
      technologies: ['OpenCV', 'Python', 'OCR', 'Deep Learning'],
      complexity: 90,
      timeline: '4 months',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/Open-CV-Captcha-Solver',
      stats: {
        stars: 32,
        forks: 12,
        views: 2100,
        contributions: 175
      },
      techBreakdown: [
        { name: 'Python', value: 40, color: '#306998' },
        { name: 'OpenCV', value: 35, color: '#5C3EE8' },
        { name: 'TensorFlow', value: 20, color: '#FF6F00' },
        { name: 'Other', value: 5, color: '#646464' }
      ],
      highlights: [
        'Solves CAPTCHAs with 94% accuracy',
        'Handles 6 different CAPTCHA types',
        'Processing time under 200ms per image'
      ]
    }  
  ],
  "Data Science": [
    {
      id: '7',
      title: 'COVID-19 Data Analysis',
      description: 'Comprehensive analysis of COVID-19 data using Python, Pandas, and Matplotlib for visualizations.',
      longDescription: 'This project provides an in-depth analysis of COVID-19 data from various sources. It includes data cleaning, exploratory data analysis (EDA), and visualization of trends over time. The analysis covers infection rates, vaccination progress, and demographic impacts. Interactive visualizations allow users to explore the data dynamically.',
      technologies: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
      complexity: 60,
      timeline: '1 month',
      imageUrl: 'https://images.unsplash.com/photo-1581091012180-4f3b8c2d5a6e?auto=format&fit=crop&q=80',
      stats: {
        stars: 10,
        forks: 2,
        views: 500,
        contributions: 50
      },
      techBreakdown: [
        { name: 'Python', value: 50, color: '#306998' },
        { name: 'Pandas', value: 30, color: '#F7931E' },
        { name: 'Matplotlib', value: 20, color: '#150458' }
      ],
      highlights: [
        'Analyzed data from 200+ countries',
        'Created interactive dashboards',
        'Identified key trends and insights'
      ]
    },
    {
      id: '8',
      title: 'Stock Price Prediction',
      description: 'Predictive model for stock prices using historical data and machine learning techniques.',
      longDescription: 'This project utilizes historical stock price data to build predictive models using various machine learning algorithms. The analysis includes feature engineering, model selection, and evaluation. The final model provides real-time predictions and visualizations of stock trends.',
      technologies: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
      complexity: 70,
      timeline: '2 months',
      imageUrl: 'https://images.unsplash.com/photo-1517436072-4b0a1e3c7f3d?auto=format&fit=crop&q=80',
      stats: {
        stars: 15,
        forks: 4,
        views: 800,
        contributions: 60
      },
      techBreakdown: [
        { name: 'Python', value: 40, color: '#306998' },
        { name: 'Scikit-learn', value: 30, color: '#F7931E' },
        { name: 'Pandas', value: 20, color: '#150458' },
        { name: 'Matplotlib', value: 10, color: '#E34F26' }
      ],
      highlights: [
        'Achieved 85% prediction accuracy',
        'Analyzed data from multiple sources',
        'Interactive visualizations for insights'
      ]
    }
  ]
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState("AI/ML Projects");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [liked, setLiked] = useState({});
  const [activeTech, setActiveTech] = useState(null);
  const [isStatsHovered, setIsStatsHovered] = useState(false);

  const projects = PROJECTS[activeCategory];
  const currentProject = projects[currentIndex];

  // Animation handling for smooth transitions
  const handleProjectChange = (index) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeIn(true);
    }, 300);
  };

  const nextProject = () => {
    handleProjectChange((currentIndex + 1) % projects.length);
  };

  const prevProject = () => {
    handleProjectChange((currentIndex - 1 + projects.length) % projects.length);
  };

  // Toggle detailed view with animation
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleLike = (projectId) => {
    setLiked(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Auto carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isStatsHovered) {
        nextProject();
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, isStatsHovered]);

  // Generate tech color based on tech name
  const getTechColor = (techName) => {
    const colors = {
      'Python': 'bg-blue-600',
      'JavaScript': 'bg-yellow-500',
      'Flask': 'bg-gray-800',
      'React': 'bg-blue-400',
      'Vue.js': 'bg-green-500',
      'Machine Learning': 'bg-purple-600',
      'LLM': 'bg-indigo-600',
      'RAG': 'bg-pink-500',
      'OpenCV': 'bg-green-600',
      'Deep Learning': 'bg-red-600',
      'Streamlit': 'bg-red-500',
      'Vector Databases': 'bg-blue-800',
      'PDF Parsing': 'bg-orange-600',
      'HTML': 'bg-orange-500',
      'CSS': 'bg-blue-500',
      'SQLite': 'bg-blue-900',
      'Redis': 'bg-red-700',
      'Celery': 'bg-green-800',
      'OCR': 'bg-purple-800',
      'Scikit-learn': 'bg-orange-700',
      'Pandas': 'bg-blue-700',
      'EDA': 'bg-teal-600',
      'TensorFlow': 'bg-orange-600',
      'LlamaIndex': 'bg-purple-500'
    };

    return colors[techName] || 'bg-gray-600';
  };

  // Calculate progress for complexity bar animation
  const [complexityProgress, setComplexityProgress] = useState(0);
  
  useEffect(() => {
    setComplexityProgress(0);
    const timer = setTimeout(() => {
      setComplexityProgress(currentProject.complexity);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentProject]);

  // Calculate stats data for radar chart
  const statsData = [
    { subject: 'Stars', A: currentProject.stats.stars, fullMark: 50 },
    { subject: 'Forks', A: currentProject.stats.forks, fullMark: 20 },
    { subject: 'Views', A: currentProject.stats.views / 100, fullMark: 30 },
    { subject: 'Contrib', A: currentProject.stats.contributions / 10, fullMark: 40 }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Main container with left-right layout */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* Left side - Title and Navigation */}
        <div className="lg:w-1/4 space-y-8 sticky top-8 self-start">
          {/* Header with subtle animation */}
          <div className="opacity-0 animate-fadeInUp" style={{ animation: "fadeInUp 0.8s forwards" }}>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
              Project Portfolio
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore my latest work across different domains of technology and innovation
            </p>
          </div>

          {/* Category selector with enhanced design */}
          <div className="space-y-4 opacity-0 animate-fadeInUp" style={{ animation: "fadeInUp 1s forwards 0.2s" }}>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Categories</h2>
            <div className="flex flex-col gap-3">
              {Object.keys(PROJECTS).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentIndex(0);
                    setShowDetails(false);
                  }}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 text-left border shadow-sm hover:shadow-md ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent'
                      : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Project pagination indicators vertically displayed */}
          <div className="space-y-4 opacity-0 animate-fadeInUp" style={{ animation: "fadeInUp 1s forwards 0.4s" }}>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((project, idx) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(idx)}
                  className={`transition-all duration-300 flex items-center gap-3 px-4 py-2 rounded-lg ${
                    currentIndex === idx 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <span className="truncate">{project.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Project Content */}
        <div className="lg:w-3/4">
          {/* Progress indicator */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 mb-6 rounded-full overflow-hidden opacity-0 animate-fadeInUp" style={{ animation: "fadeInUp 1s forwards 0.4s" }}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-8000 ease-linear"
              style={{ width: `${(currentIndex+1)/projects.length*100}%` }}
            ></div>
          </div>

          {/* Enhanced project showcase with animations and interactions */}
          <div 
            className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-500 ${
              fadeIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            } hover:shadow-2xl`}
            onMouseEnter={() => setIsStatsHovered(true)}
            onMouseLeave={() => setIsStatsHovered(false)}
          >
            {/* Image and stats grid layout with enhanced interactions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Project image with enhanced overlay and interactions */}
              <div className="relative h-[350px] lg:col-span-3 overflow-hidden rounded-xl shadow-lg group">
                <img
                  src={currentProject.imageUrl}
                  alt={currentProject.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-90"
                />
                
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {currentProject.title}
                    </h2>
                    <p className="text-gray-200 text-sm md:text-base max-w-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {currentProject.description}
                    </p>
                  </div>
                </div>
                
                {/* Enhanced social links overlay with staggered animation */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-105 shadow-lg mx-2"
                      >
                        <Github className="w-6 h-6 text-black dark:text-white" />
                        <span className="font-medium">GitHub</span>
                      </a>
                    )}
                    {currentProject.kaggleUrl && (
                      <a
                        href={currentProject.kaggleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:scale-105 shadow-lg mx-2"
                      >
                        <Database className="w-6 h-6 text-blue-500" />
                        <span className="font-medium">Kaggle</span>
                      </a>
                    )}
                    <button
                      onClick={toggleDetails}
                      className="flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors hover:scale-105 shadow-lg mx-2"
                    >
                      <Eye className="w-6 h-6" />
                      <span className="font-medium">{showDetails ? 'Hide Details' : 'View Details'}</span>
                    </button>
                    
                    {/* Like button with heart animation */}
                    <button
                      onClick={() => toggleLike(currentProject.id)}
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:scale-105 shadow-lg mx-2"
                      style={{
                        backgroundColor: liked[currentProject.id] ? '#ffe4e6' : 'white',
                        color: liked[currentProject.id] ? '#e11d48' : '#6b7280'
                      }}
                    >
                      <Heart 
                        className={`w-6 h-6 ${liked[currentProject.id] ? 'fill-current text-rose-600' : ''}`} 
                        style={{
                          animation: liked[currentProject.id] ? 'heartBeat 0.6s' : 'none'
                        }}
                      />
                      <span className="font-medium">{liked[currentProject.id] ? 'Liked' : 'Like'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced navigation buttons */}
                <button
                  onClick={prevProject}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors hover:scale-110 opacity-70 hover:opacity-100"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={nextProject}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors hover:scale-110 opacity-70 hover:opacity-100"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </button>
              </div>

              {/* Enhanced project stats with visualizations */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 lg:h-[350px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <AwardIcon className="w-5 h-5 text-blue-600" />
                  Project Stats
                </h3>
                
                {/* Animated complexity meter */}
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Complexity</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{complexityProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${complexityProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Timeline with icon */}
                <div className="mb-5 flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{currentProject.timeline}</p>
                  </div>
                </div>
                
                {/* Interactive tech breakdown */}
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Tech Breakdown</h4>
                  
                  {/* Visualize tech breakdown with animations */}
                  <div className="space-y-2.5">
                    {currentProject.techBreakdown.map((tech) => (
                      <div 
                        key={tech.name} 
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setActiveTech(tech.name)}
                        onMouseLeave={() => setActiveTech(null)}
                      >
                        <div className="flex justify-between text-xs mb-1">
                          <span className={activeTech === tech.name ? "font-bold text-blue-600 dark:text-blue-400" : ""}>
                            {tech.name}
                          </span>
                          <span>{tech.value}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-2.5 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${tech.value}%`, 
                              backgroundColor: tech.color,
                              transform: activeTech === tech.name ? 'scaleY(1.4)' : 'scaleY(1)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project details section with enhanced layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{currentProject.title}</span>
                  {liked[currentProject.id] && (
                    <Heart className="w-5 h-5 fill-current text-rose-500" />
                  )}
                </h2>
                
                {/* Animated description with better readability */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-5 border-l-4 border-blue-500 shadow-md">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {showDetails ? currentProject.longDescription : currentProject.description}
                  </p>
                </div>
                
                {/* Project highlights with improved visual design */}
                {showDetails && (
                  <div className="mt-5 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Key Highlights
                    </h3>
                    <ul className="space-y-2">
                      {currentProject.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Enhanced technology badges with animation and interaction */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {currentProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1.5 ${getTechColor(tech)} text-white rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-md flex items-center gap-1`}
                      style={{
                        animation: `pulse 2s infinite ${Math.random() * 2}s`,
                        opacity: activeTech === tech ? 1 : 0.9,
                        transform: activeTech === tech ? 'scale(1.1)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setActiveTech(tech)}
                      onMouseLeave={() => setActiveTech(null)}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action buttons with enhanced design */}
                <div className="mt-6 flex flex-wrap gap-4">
                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Github className="w-5 h-5" />
                      View on GitHub
                    </a>
                  )}
                  {currentProject.kaggleUrl && (
                    <a
                      href={currentProject.kaggleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      <Database className="w-5 h-5" />
                      View on Kaggle
                    </a>
                  )}
                  <button
                    onClick={toggleDetails}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <Eye className="w-5 h-5" />
                    {showDetails ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              </div>
              
              {/* Add a new visualization section for the project statistics */}
              <div className="md:col-span-1">
                {showDetails && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-600" />
                      GitHub Stats
                    </h3>
                    
                    {/* Radar chart for project statistics */}
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={80} data={statsData}>
                          <PolarGrid stroke="#cbd5e1" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                          <Radar
                            name="Stats"
                            dataKey="A"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                          <Tooltip content={CustomTooltip} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Stats badges in attractive layout */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Stars</div>
                          <div className="font-bold text-gray-900 dark:text-white">{currentProject.stats.stars}</div>
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Forks</div>
                          <div className="font-bold text-gray-900 dark:text-white">{currentProject.stats.forks}</div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center gap-2">
                        <Eye className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                          <div className="font-bold text-gray-900 dark:text-white">{currentProject.stats.views}</div>
                        </div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg flex items-center gap-2">
                        <Code className="w-5 h-5 text-orange-500" />
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Commits</div>
                          <div className="font-bold text-gray-900 dark:text-white">{currentProject.stats.contributions}</div>
                        </div>
                      </div>
                    </div>
                  </div>  
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        @keyframes heartBeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.3);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}