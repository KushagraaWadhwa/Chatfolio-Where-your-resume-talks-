import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Brain, Loader, Zap } from 'lucide-react';
import config from '../config';

const LiveAIPlayground = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const suggestedQuestions = [
    "What technologies did Kushagra use in SalesAssist AI?",
    "Tell me about his work at ShorthillsAI",
    "What are his AI/ML skills?",
    "Describe his RAG implementation experience"
  ];

  const handleSubmit = async (questionText = null) => {
    const queryText = questionText || query;
    if (!queryText.trim()) return;

    setIsLoading(true);
    setShowSteps(true);
    setResponse(null);

    try {
      // Simulate RAG steps for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const res = await fetch(`${config.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Sorry, I couldn't process your request. Make sure the backend is running!");
    } finally {
      setIsLoading(false);
      if (!questionText) setQuery('');
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-violet-500/20 shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 border-b border-violet-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Live AI Playground</h3>
            <p className="text-violet-100 text-sm">Powered by Advanced RAG + Gemini 2.0</p>
          </div>
        </div>
      </div>

      <div className="p-6 h-[400px] flex flex-col">
        {/* Suggested Questions */}
        <div className="mb-4">
          <div className="text-slate-400 text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Try asking:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(q);
                  handleSubmit(q);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-violet-500 rounded-lg text-xs text-slate-300 hover:text-white transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Response Area */}
        <div className="flex-1 bg-slate-800/50 rounded-xl p-4 overflow-auto border border-slate-700 mb-4">
          <AnimatePresence mode="wait">
            {isLoading && showSteps && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-cyan-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Query rewriting...</span>
                </div>
                <div className="flex items-center gap-2 text-violet-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Searching vector database...</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Re-ranking results...</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating response...</span>
                </div>
              </motion.div>
            )}

            {response && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400 mb-3">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Response:</span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </motion.div>
            )}

            {!response && !isLoading && (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Ask a question to see the AI in action...
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Kushagra's experience, skills, projects..."
            className="flex-1 bg-slate-800 border border-slate-600 focus:border-violet-500 rounded-lg px-4 py-2 text-slate-300 placeholder-slate-500 outline-none transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveAIPlayground;

