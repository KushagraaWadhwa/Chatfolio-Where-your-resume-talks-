import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Sparkles, Zap, Trophy } from 'lucide-react';

const EasterEggs = () => {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);

  // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      
      // Check Konami code
      if (key === konamiCode[konamiProgress].toLowerCase()) {
        const newProgress = konamiProgress + 1;
        setKonamiProgress(newProgress);
        
        if (newProgress === konamiCode.length) {
          unlockAchievement('konami', '🎮 Konami Master!', 'You found the legendary code!');
          setShowSecretMessage(true);
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }

      // Secret commands
      if (e.ctrlKey && e.shiftKey) {
        if (key === 'm') {
          // Toggle Matrix mode
          unlockAchievement('matrix', '💚 Matrix Mode!', 'Welcome to the Matrix...');
          document.body.classList.toggle('matrix-mode');
        }
        if (key === 'd') {
          // Developer mode
          unlockAchievement('dev', '👨‍💻 Dev Mode!', 'Developer console activated!');
          console.log('%c🚀 Developer Mode Activated!', 'font-size: 20px; color: #8b5cf6; font-weight: bold;');
          console.log('%cHere are some fun commands:', 'color: #06b6d4;');
          console.log('- Type: portfolio.stats() for stats');
          console.log('- Type: portfolio.skills() for skills');
          console.log('- Type: portfolio.hack() for a surprise 😉');
        }
      }

      // Triple click Easter egg
      if (e.detail === 3) {
        unlockAchievement('clicker', '🖱️ Speed Clicker!', 'Triple click master!');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konamiProgress]);

  const unlockAchievement = (id, title, description) => {
    if (!achievements.includes(id)) {
      setAchievements([...achievements, id]);
      setShowAchievement({ title, description });
      setTimeout(() => setShowAchievement(null), 4000);
    }
  };

  // Add fun console methods
  useEffect(() => {
    window.portfolio = {
      stats: () => {
        console.table({
          'Projects': '10+',
          'Technologies': '15+',
          'Coffee Consumed': '∞',
          'Bugs Fixed': 'Too many to count',
          'Lines of Code': '> 10,000'
        });
      },
      skills: () => {
        console.log('%c🧠 Skills:', 'font-size: 16px; color: #8b5cf6; font-weight: bold;');
        console.log('⚡ AI & LLMs: LangChain, LlamaIndex, RAG');
        console.log('🚀 Backend: FastAPI, Flask, Python');
        console.log('💻 Frontend: React, Vue, Tailwind');
        console.log('🗄️ Databases: ChromaDB, Pinecone, SQL');
      },
      hack: () => {
        const messages = [
          'Hacking the mainframe...',
          'Bypassing firewall...',
          'Accessing database...',
          '😄 Just kidding! But nice try!'
        ];
        messages.forEach((msg, i) => {
          setTimeout(() => {
            console.log(`%c${msg}`, `color: ${i === 3 ? '#10b981' : '#ef4444'}; font-weight: bold;`);
          }, i * 1000);
        });
      },
      surprise: () => {
        unlockAchievement('explorer', '🔍 Explorer!', 'You found the secret commands!');
      }
    };

    console.log('%c🎮 Welcome to My Interactive Portfolio!', 'font-size: 24px; color: #8b5cf6; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8b5cf6;');
    console.log('%c\n🎯 Easter Eggs & Secret Features:', 'font-size: 16px; color: #06b6d4; font-weight: bold;');
    console.log('%c\n🕹️  Konami Code', 'color: #f59e0b; font-weight: bold;');
    console.log('   Press: ↑ ↑ ↓ ↓ ← → ← → B A');
    console.log('%c\n💚 Matrix Mode', 'color: #10b981; font-weight: bold;');
    console.log('   Press: Ctrl + Shift + M');
    console.log('%c\n✨ Cursor Trail', 'color: #8b5cf6; font-weight: bold;');
    console.log('   Press: Ctrl + Shift + C');
    console.log('%c\n👨‍💻 Developer Console', 'color: #06b6d4; font-weight: bold;');
    console.log('   Press: Ctrl + Shift + D');
    console.log('%c\n📊 Available Commands:', 'font-size: 14px; color: #f59e0b; font-weight: bold;');
    console.log('   • portfolio.stats()    - View my statistics');
    console.log('   • portfolio.skills()   - List my technical skills');
    console.log('   • portfolio.hack()     - Try to hack (just for fun!)');
    console.log('%c\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #8b5cf6;');
    console.log('%c💡 Tip: Look for hidden interactions throughout the site!', 'color: #10b981; font-style: italic;');
  }, []);

  return (
    <>
      {/* Konami Code Secret Message */}
      <AnimatePresence>
        {showSecretMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSecretMessage(false)}
          >
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-br from-violet-600 to-purple-600 p-8 rounded-2xl max-w-md mx-4 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
              >
                <Trophy className="w-16 h-16 text-yellow-300" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                🎮 Achievement Unlocked!
              </h2>
              <p className="text-xl text-violet-100 mb-2">Konami Code Master</p>
              <p className="text-violet-200 mb-6">
                You've discovered the legendary code! 
                You're a true gamer and developer! 🚀
              </p>
              <div className="text-sm text-violet-200">
                Press Ctrl+Shift+M for Matrix Mode 💚
              </div>
              <div className="text-xs text-violet-300 mt-2">
                Click anywhere to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Toast */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl max-w-sm"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-bold text-lg">{showAchievement.title}</div>
                <div className="text-violet-100">{showAchievement.description}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Progress Indicator (Debug) */}
      {konamiProgress > 0 && konamiProgress < konamiCode.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-20 right-6 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-mono"
        >
          Konami: {konamiProgress}/{konamiCode.length}
        </motion.div>
      )}
    </>
  );
};

export default EasterEggs;

