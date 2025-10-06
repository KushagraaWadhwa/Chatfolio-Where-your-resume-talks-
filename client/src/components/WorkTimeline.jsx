import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Building2, ChevronLeft, ChevronRight, Award, Code, Database, Brain } from 'lucide-react';

const WorkTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const workExperience = [
    {
      id: 1,
      title: "AI Project Intern",
      company: "Prodigal AI",
      location: "Remote",
      startDate: "September 2024",
      endDate: "November 2024",
      duration: "3 months",
      type: "Internship",
      icon: <Brain className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      highlights: [
        "Designed intelligent chatbot 'Knowledge-AI' with 95% accuracy",
        "Implemented scalable RAG pipeline for document queries",
        "Optimized response time through improved indexing mechanisms"
      ],
      technologies: ["LlamaIndex", "Gemini Embeddings", "Python", "RAG", "NLP"],
      achievements: "95% accuracy in document-based queries"
    },
    {
      id: 2,
      title: "Data Scientist Intern",
      company: "Deutsche Telekom Digital Labs",
      location: "Gurugram, Haryana",
      startDate: "June 2024",
      endDate: "August 2024",
      duration: "3 months",
      type: "Internship",
      icon: <Database className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      highlights: [
        "Developed document parser with 93% accuracy for HR policies",
        "Created real-time PDF analysis dashboard",
        "Implemented NLP-based classification algorithms"
      ],
      technologies: ["Python", "NLP", "PDF Processing", "Dashboard Development"],
      achievements: "30% efficiency improvement in document review"
    },
    {
      id: 3,
      title: "Python Developer Trainee",
      company: "BDO in India",
      location: "Noida, Uttar Pradesh",
      startDate: "August 2023",
      endDate: "September 2023",
      duration: "2 months",
      type: "Training",
      icon: <Code className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-700",
      highlights: [
        "Built ML algorithm for CAPTCHA solving with 96% success rate",
        "Developed PDF extraction tool with 95% accuracy",
        "Enhanced OCR systems for noisy character recognition"
      ],
      technologies: ["Python", "OpenCV", "OCR", "Machine Learning", "Automation"],
      achievements: "96% success rate in CAPTCHA solving"
    }
  ];

  const education = [
    {
      id: 4,
      title: "Bachelor's in AI & ML",
      company: "Guru Gobind Singh Indraprastha University",
      location: "New Delhi",
      startDate: "2022",
      endDate: "2025",
      duration: "3 years",
      type: "Education",
      icon: <Award className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-700",
      highlights: [
        "Pursuing Bachelor's in Artificial Intelligence and Machine Learning",
        "Comprehensive coursework in ML, Deep Learning, NLP, Computer Vision",
        "Expected completion: September 2025"
      ],
      technologies: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Structures"],
      achievements: "Currently pursuing with focus on AI/ML"
    },
    {
      id: 5,
      title: "Diploma in Programming & Data Science",
      company: "Indian Institute of Technology, Madras",
      location: "Chennai",
      startDate: "2022",
      endDate: "2024",
      duration: "2 years",
      type: "Education",
      icon: <Award className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-700",
      highlights: [
        "Completed comprehensive diploma in Programming & Data Science",
        "Specialized in ML practices, app development, and data management",
        "Strong foundation in Python, Java, and database systems"
      ],
      technologies: ["Python", "Java", "SQL", "Statistics", "App Development"],
      achievements: "Completed with focus on practical applications"
    }
  ];

  const allExperiences = [...workExperience, ...education];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextExperience = () => {
    setActiveIndex((prev) => (prev + 1) % allExperiences.length);
  };

  const prevExperience = () => {
    setActiveIndex((prev) => (prev - 1 + allExperiences.length) % allExperiences.length);
  };

  const goToExperience = (index) => {
    setActiveIndex(index);
  };

  const currentExperience = allExperiences[activeIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Professional Journey
        </h2>
      </motion.div>

      {/* Enhanced Horizontal Timeline Navigation */}
      <div className="mb-8">
        <div className="relative max-w-6xl mx-auto flex items-center">
          {/* Left Arrow */}
          <button
            onClick={prevExperience}
            className="flex-shrink-0 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl mr-6 z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Timeline Container */}
          <div className="relative flex-1">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transform -translate-y-1/2"></div>
            
            {/* Timeline Points */}
            <div className="flex justify-between items-center relative">
              {allExperiences.map((exp, index) => (
                <div key={exp.id} className="flex flex-col items-center">
                  <button
                    onClick={() => goToExperience(index)}
                    className={`relative z-10 w-6 h-6 rounded-full border-4 border-white transition-all duration-300 ${
                      activeIndex === index
                        ? `bg-gradient-to-r ${exp.color} scale-150 shadow-lg`
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-125'
                    }`}
                  >
                    <div className={`w-full h-full rounded-full ${activeIndex === index ? 'animate-pulse' : ''}`}></div>
                  </button>
                  
                  {/* Company Name */}
                  <div className={`mt-3 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    activeIndex === index
                      ? `bg-gradient-to-r ${exp.color} text-white shadow-md`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {exp.company}
                  </div>
                  
                  {/* Year */}
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {exp.startDate.split(' ')[1] || exp.startDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextExperience}
            className="flex-shrink-0 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 shadow-lg hover:shadow-xl ml-6 z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Timeline Content */}
      <div className="relative">
        {/* Experience Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >

            {/* Experience Card - Full Width */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`max-w-4xl w-full p-8 rounded-3xl ${currentExperience.bgColor} border ${currentExperience.borderColor} shadow-xl`}
              >
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentExperience.color} text-white shadow-lg`}>
                      {currentExperience.icon}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentExperience.title}
                      </h3>
                      <div className="flex items-center text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Building2 className="w-5 h-5 mr-2" />
                        {currentExperience.company}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        {currentExperience.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {currentExperience.startDate} - {currentExperience.endDate} ({currentExperience.duration})
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentExperience.color} text-white shadow-lg`}>
                    {currentExperience.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Highlights */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentExperience.color} mr-3`}></div>
                      Key Achievements
                    </h4>
                    <ul className="space-y-3">
                      {currentExperience.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentExperience.color} mt-2 mr-3 flex-shrink-0`}></div>
                          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentExperience.color} mr-3`}></div>
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentExperience.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentExperience.color} text-white shadow-md hover:scale-105 transition-transform`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Achievement Banner */}
                {currentExperience.achievements && (
                  <div className={`mt-6 p-5 rounded-2xl bg-gradient-to-r ${currentExperience.color} text-white shadow-lg`}>
                    <h4 className="font-bold mb-2 text-lg">🏆 Notable Achievement</h4>
                    <p className="text-white/90 leading-relaxed">{currentExperience.achievements}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>


        {/* Progress Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {allExperiences.map((_, index) => (
              <button
                key={index}
                onClick={() => goToExperience(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTimeline;
