import React, { useState } from 'react';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const PROJECTS = {
  "AI/ML Projects": [
    {
      id: '1',
      title: 'SalesAssist AI',
      description: 'A conversational AI framework designed to assist sales teams by providing instant responses to customer queries using RAG and LLMs.',
      technologies: ['LLM', 'RAG', 'Python', 'LlamaIndex',],
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80',
      githubUrl:'https://github.com/KushagraaWadhwa/SalesAssist-AI'
    },
    {
      id: '2',
      title: 'Recipe to Rating: ML Food Rating Predictor',
      description: 'Predictive model for estimating food ratings based on ingredients and cooking methods using machine learning.',
      technologies: ['Machine Learning', 'Scikit-learn', 'Pandas', 'EDA'],
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      title: 'OpenCV Captcha Project',
      description: 'Automated CAPTCHA solver using OpenCV and deep learning for processing noisy, colored alphanumeric CAPTCHAs.',
      technologies: ['OpenCV', 'Python', 'OCR', 'Deep Learning'],
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/Open-CV-Captcha-Solver'
    }
  ],
  "Software Development": [
    {
      id: '4',
      title: 'GrocExpress: Grocery Store App',
      description: 'Full-stack web application for managing grocery store inventory and sales with admin dashboard.',
      technologies: ['Flask', 'SQLite', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80',
      githubUrl:''
    },
    {
      id: '5',
      title: 'Homeyfy: Household Services App',
      description: 'Multi-user platform connecting customers with household service professionals using role-based access control.Comes with Individual user Dashboard and scheduled jobs.',
      technologies: ['Flask', 'Vue.js', 'SQLite', 'Redis', 'Celery'],
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
      githubUrl:'https://github.com/KushagraaWadhwa/Homeyfy-The-Household-Services-App-'
    },
    {
      id: '6',
      title: 'Ask Your PDF',
      description: 'Chatbot-style web application for querying PDF documents using document embedding techniques.',
      technologies: ['Streamlit', 'Python', 'PDF Parsing', 'Vector Databases'],
      imageUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80',
      githubUrl: 'https://github.com/KushagraaWadhwa/AskYourPDF'
    }
  ]
};

export default function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState("AI/ML Projects");
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = PROJECTS[activeCategory];

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
  <div className="space-y-6">
    <div className="flex gap-4 mb-6">
      {Object.keys(PROJECTS).map((category) => (
        <button
          key={category}
          onClick={() => {
            setActiveCategory(category);
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-lg transition-colors border ${
            activeCategory === category
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="relative h-[350px] w-full mb-6 rounded-lg overflow-hidden group">
        <img
          src={currentProject.imageUrl}
          alt={currentProject.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          {currentProject.githubUrl && (
            <a
              href={currentProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Github className="w-6 h-6 text-black dark:text-white" />
            </a>
          )}
        </div>
        <button
          onClick={prevProject}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-black dark:text-white" />
        </button>
        <button
          onClick={nextProject}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{currentProject.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{currentProject.description}</p>

      <div className="flex flex-wrap gap-2">
        {currentProject.technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>

  );
}