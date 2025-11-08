import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Zap, Code2, Cpu, Network } from 'lucide-react';

const TechStackShowcase = () => {
  const techCategories = [
    {
      title: 'AI & LLMs',
      icon: Brain,
      gradient: 'from-violet-500 to-purple-500',
      techs: [
        { name: 'OpenAI GPT', color: 'text-emerald-400' },
        { name: 'Gemini', color: 'text-violet-400' },
        { name: 'LangChain', color: 'text-teal-400' },
        { name: 'LlamaIndex', color: 'text-blue-400' },
        { name: 'RAG Systems', color: 'text-purple-400' },
        { name: 'Whisper AI', color: 'text-rose-400' }
      ]
    },
    {
      title: 'Vector DBs',
      icon: Database,
      gradient: 'from-cyan-500 to-blue-500',
      techs: [
        { name: 'Pinecone', color: 'text-cyan-400' },
        { name: 'ChromaDB', color: 'text-orange-400' },
        { name: 'FAISS', color: 'text-blue-400' },
        { name: 'Weaviate', color: 'text-green-400' },
        { name: 'Semantic Search', color: 'text-indigo-400' }
      ]
    },
    {
      title: 'Backend',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
      techs: [
        { name: 'FastAPI', color: 'text-teal-400' },
        { name: 'Python', color: 'text-blue-400' },
        { name: 'Flask', color: 'text-slate-300' },
        { name: 'SQLAlchemy', color: 'text-red-400' },
        { name: 'WebSockets', color: 'text-cyan-400' },
        { name: 'REST APIs', color: 'text-green-400' }
      ]
    },
    {
      title: 'Frontend',
      icon: Code2,
      gradient: 'from-pink-500 to-rose-500',
      techs: [
        { name: 'React', color: 'text-cyan-400' },
        { name: 'Vue.js', color: 'text-emerald-400' },
        { name: 'Tailwind CSS', color: 'text-sky-400' },
        { name: 'Framer Motion', color: 'text-purple-400' },
        { name: 'Streamlit', color: 'text-red-400' }
      ]
    },
    {
      title: 'ML & Data',
      icon: Cpu,
      gradient: 'from-emerald-500 to-teal-500',
      techs: [
        { name: 'Scikit-learn', color: 'text-orange-400' },
        { name: 'Pandas', color: 'text-blue-400' },
        { name: 'NumPy', color: 'text-sky-400' },
        { name: 'OpenCV', color: 'text-green-400' },
        { name: 'NLP', color: 'text-purple-400' },
        { name: 'PDF Processing', color: 'text-amber-400' }
      ]
    },
    {
      title: 'DevOps & Tools',
      icon: Network,
      gradient: 'from-indigo-500 to-purple-500',
      techs: [
        { name: 'Docker', color: 'text-blue-400' },
        { name: 'Apache NiFi', color: 'text-orange-400' },
        { name: 'n8n', color: 'text-pink-400' },
        { name: 'Git', color: 'text-red-400' },
        { name: 'Render', color: 'text-purple-400' },
        { name: 'Vercel', color: 'text-slate-300' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {techCategories.map((category, index) => {
        const Icon = category.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {category.title}
              </h3>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 relative z-10">
              {category.techs.map((tech, techIndex) => (
                <motion.span
                  key={techIndex}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + techIndex * 0.05, type: 'spring' }}
                  className={`px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-sm font-mono ${tech.color} border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-default`}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>

            {/* Floating particles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TechStackShowcase;

