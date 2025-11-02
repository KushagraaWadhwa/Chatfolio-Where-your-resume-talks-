import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, GitBranch, Star, GitCommit, Code, TrendingUp, Activity } from 'lucide-react';

const GitHubLiveFeed = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data (replace with actual GitHub API call)
  const mockGitHubData = {
    username: 'KushagraaWadhwa',
    totalRepos: 28,
    totalStars: 156,
    totalCommits: 847,
    currentStreak: 23,
    languageStats: [
      { name: 'Python', percentage: 45, color: '#3776ab' },
      { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
      { name: 'TypeScript', percentage: 15, color: '#3178c6' },
      { name: 'HTML/CSS', percentage: 10, color: '#e34c26' },
      { name: 'Other', percentage: 5, color: '#858585' }
    ],
    recentRepos: [
      {
        name: 'Chatfolio-AI-Portfolio',
        description: 'Interactive AI-powered portfolio with RAG chatbot',
        stars: 31,
        language: 'Python',
        updated: '2 hours ago'
      },
      {
        name: 'SalesAssist-AI',
        description: 'Voice-enabled RAG system for sales teams',
        stars: 28,
        language: 'Python',
        updated: '1 day ago'
      },
      {
        name: 'Smart-Learning-Engine',
        description: 'Vector search for educational content discovery',
        stars: 24,
        language: 'Python',
        updated: '3 days ago'
      }
    ],
    contributionData: generateContributionData()
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockGitHubData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700">
        <div className="text-center">
          <Github className="w-12 h-12 text-violet-500 animate-pulse mx-auto mb-3" />
          <div className="text-slate-400">Loading GitHub stats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github className="w-6 h-6 text-violet-400" />
            <div>
              <h3 className="text-white font-bold">GitHub Activity</h3>
              <p className="text-slate-400 text-sm">@{stats.username}</p>
            </div>
          </div>
          <a
            href={`https://github.com/${stats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            Visit Profile
          </a>
        </div>
      </div>

      <div className="p-6 h-[400px] overflow-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Repositories', value: stats.totalRepos, icon: Code, color: 'violet' },
            { label: 'Total Stars', value: stats.totalStars, icon: Star, color: 'amber' },
            { label: 'Commits', value: stats.totalCommits, icon: GitCommit, color: 'emerald' },
            { label: 'Day Streak', value: stats.currentStreak, icon: TrendingUp, color: 'cyan' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-${stat.color}-500/50 transition-all`}
              >
                <Icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Language Stats */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-violet-400" />
            Languages Used
          </h4>
          <div className="space-y-2">
            {stats.languageStats.map((lang, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{lang.name}</span>
                  <span className="text-slate-400">{lang.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Repos */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            Recent Projects
          </h4>
          <div className="space-y-3">
            {stats.recentRepos.map((repo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 bg-slate-900/50 rounded-lg border border-slate-600 hover:border-violet-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-sm text-violet-400 group-hover:text-violet-300">
                    {repo.name}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">{repo.stars}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-2">{repo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{repo.language}</span>
                  <span className="text-xs text-slate-600">Updated {repo.updated}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contribution Graph Preview */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Contribution Activity (Last 12 Weeks)
          </h4>
          <div className="overflow-x-auto">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-full">
              {stats.contributionData.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)} hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer`}
                  title={`${day.count} contributions on ${day.date.toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-slate-700 rounded-sm" />
              <div className="w-3 h-3 bg-emerald-900/50 rounded-sm" />
              <div className="w-3 h-3 bg-emerald-700/70 rounded-sm" />
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock contribution data
function generateContributionData() {
  const data = [];
  for (let i = 0; i < 84; i++) { // 12 weeks
    data.push({
      date: new Date(Date.now() - (83 - i) * 24 * 60 * 60 * 1000),
      count: Math.floor(Math.random() * 10)
    });
  }
  return data;
}

// Helper function for contribution colors
function getContributionColor(count) {
  if (count === 0) return 'bg-slate-700';
  if (count <= 2) return 'bg-emerald-900';
  if (count <= 4) return 'bg-emerald-700';
  if (count <= 6) return 'bg-emerald-500';
  return 'bg-emerald-400';
}

export default GitHubLiveFeed;

