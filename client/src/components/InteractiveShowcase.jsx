import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Github } from 'lucide-react';
import InteractiveTerminal from './InteractiveTerminal';
import GitHubLiveFeed from './GitHubLiveFeed';

const InteractiveShowcase = () => {
  const [activeView, setActiveView] = useState('terminal');

  const views = [
    {
      id: 'terminal',
      name: 'Interactive Terminal',
      icon: Terminal,
      component: InteractiveTerminal,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'github',
      name: 'GitHub Live Stats',
      icon: Github,
      component: GitHubLiveFeed,
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  const ActiveComponent = views.find(v => v.id === activeView)?.component;

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex flex-wrap justify-center gap-3">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeView === view.id
                  ? 'text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {activeView === view.id && (
                <motion.div
                  layoutId="activeView"
                  className={`absolute inset-0 bg-gradient-to-r ${view.gradient} rounded-xl`}
                  transition={{ type: 'spring', duration: 0.6 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{view.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Component */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {ActiveComponent && <ActiveComponent />}
      </motion.div>
    </div>
  );
};

export default InteractiveShowcase;

