import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Sparkles } from 'lucide-react';

const FloatingChatBubble = ({ onClick, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Tooltip - Always visible now */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="relative"
          >
            {/* Close button for tooltip */}
            {showTooltip && !isHovered && (
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 dark:bg-slate-600 rounded-full flex items-center justify-center hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">
                    Chat with My AI Assistant! 🤖
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Ask me anything about my experience, projects, or skills!
                  </p>
                </div>
              </div>
              {/* Triangle pointer */}
              <div className="absolute bottom-4 -right-2 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 10px 30px rgba(139, 92, 246, 0.3)',
            '0 10px 40px rgba(139, 92, 246, 0.5)',
            '0 10px 30px rgba(139, 92, 246, 0.3)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <MessageSquare className="w-7 h-7 text-white relative z-10" />
        </motion.div>

        {/* Notification dot */}
        <motion.div
          className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </div>
  );
};

export default FloatingChatBubble;

