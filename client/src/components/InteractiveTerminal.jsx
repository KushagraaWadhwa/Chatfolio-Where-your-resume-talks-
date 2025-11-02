import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => (
        <div className="space-y-1">
          <div className="text-emerald-400">Available Commands:</div>
          <div className="ml-4 space-y-1">
            {Object.entries(commands).map(([cmd, info]) => (
              <div key={cmd}>
                <span className="text-cyan-400">{cmd}</span>
                <span className="text-slate-400"> - {info.description}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    about: {
      description: 'About Kushagra',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400 font-bold">Kushagra Wadhwa</div>
          <div className="text-slate-300">AI Engineer & Full-Stack Developer</div>
          <div className="text-slate-400">Building intelligent systems that bridge data and real-world impact</div>
          <div className="text-emerald-400 mt-2">Status: Available for opportunities 🚀</div>
        </div>
      )
    },
    skills: {
      description: 'List technical skills',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400">Technical Skills:</div>
          <div className="ml-4 space-y-1">
            <div><span className="text-emerald-400">⚡ AI/LLMs:</span> LangChain, LlamaIndex, RAG, OpenAI, Gemini</div>
            <div><span className="text-cyan-400">🗄️ Vector DBs:</span> ChromaDB, Pinecone, FAISS</div>
            <div><span className="text-amber-400">🚀 Backend:</span> FastAPI, Flask, Python, SQLAlchemy</div>
            <div><span className="text-blue-400">💻 Frontend:</span> React, Vue.js, Tailwind, Framer Motion</div>
            <div><span className="text-pink-400">📊 ML/Data:</span> Scikit-learn, Pandas, NumPy, OpenCV</div>
          </div>
        </div>
      )
    },
    projects: {
      description: 'View major projects',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400">Featured Projects:</div>
          <div className="ml-4 space-y-2">
            <div>
              <div className="text-emerald-400">→ SalesAssist AI</div>
              <div className="text-slate-400 ml-4">Voice-enabled RAG system for sales teams</div>
            </div>
            <div>
              <div className="text-cyan-400">→ Earnings Call Intelligence Platform</div>
              <div className="text-slate-400 ml-4">Real-time financial analysis with speaker ID</div>
            </div>
            <div>
              <div className="text-amber-400">→ Smart Learning Engine</div>
              <div className="text-slate-400 ml-4">Vector search for educational content</div>
            </div>
          </div>
        </div>
      )
    },
    experience: {
      description: 'Work experience',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400">Professional Experience:</div>
          <div className="ml-4 space-y-2">
            <div>
              <div className="text-emerald-400">Software Engineer @ ShorthillsAI</div>
              <div className="text-slate-400 ml-4">July 2025 - Present</div>
              <div className="text-slate-500 ml-4 text-sm">HR Resume Assistant, Earnings Call Platform</div>
            </div>
            <div>
              <div className="text-cyan-400">AI Project Intern @ ProdigalAI</div>
              <div className="text-slate-400 ml-4">Sep 2024 - Nov 2024</div>
              <div className="text-slate-500 ml-4 text-sm">RAG chatbot with 95% accuracy</div>
            </div>
          </div>
        </div>
      )
    },
    contact: {
      description: 'Get contact information',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400">Contact Information:</div>
          <div className="ml-4 space-y-1">
            <div className="text-emerald-400">📧 Email: <a href="mailto:wadhwakushagra263@gmail.com" className="text-cyan-400 hover:underline">wadhwakushagra263@gmail.com</a></div>
            <div className="text-cyan-400">💼 LinkedIn: <a href="https://www.linkedin.com/in/kushagra-wadhwa-864319229/" target="_blank" className="text-blue-400 hover:underline">linkedin.com/in/kushagra-wadhwa-864319229</a></div>
            <div className="text-amber-400">🐙 GitHub: <a href="https://github.com/KushagraaWadhwa" target="_blank" className="text-violet-400 hover:underline">github.com/KushagraaWadhwa</a></div>
          </div>
        </div>
      )
    },
    stats: {
      description: 'View portfolio statistics',
      execute: () => (
        <div className="space-y-2">
          <div className="text-violet-400">Portfolio Statistics:</div>
          <div className="ml-4 grid grid-cols-2 gap-2">
            <div className="text-emerald-400">Projects: <span className="text-white font-bold">10+</span></div>
            <div className="text-cyan-400">Technologies: <span className="text-white font-bold">15+</span></div>
            <div className="text-amber-400">Experience: <span className="text-white font-bold">1+ Year</span></div>
            <div className="text-pink-400">Coffee: <span className="text-white font-bold">∞</span></div>
          </div>
        </div>
      )
    },
    clear: {
      description: 'Clear terminal',
      execute: () => {
        setHistory([]);
        return null;
      }
    },
    whoami: {
      description: 'Current user info',
      execute: () => (
        <div className="text-cyan-400">visitor@kushagra-portfolio</div>
      )
    },
    date: {
      description: 'Show current date and time',
      execute: () => (
        <div className="text-emerald-400">{new Date().toString()}</div>
      )
    },
    echo: {
      description: 'Echo the input',
      execute: (args) => (
        <div className="text-slate-300">{args.join(' ')}</div>
      )
    },
    hire: {
      description: 'Why you should hire Kushagra',
      execute: () => (
        <div className="space-y-2">
          <div className="text-emerald-400 font-bold">Why Hire Kushagra?</div>
          <div className="ml-4 space-y-1">
            <div className="text-slate-300">✓ 1+ year building production AI systems</div>
            <div className="text-slate-300">✓ Expert in RAG, LLMs, and agentic AI</div>
            <div className="text-slate-300">✓ Full-stack developer with modern tech stack</div>
            <div className="text-slate-300">✓ Proven track record at top companies</div>
            <div className="text-slate-300">✓ Passionate about building impactful solutions</div>
          </div>
          <div className="text-violet-400 mt-2">Ready to contribute from day one! 🚀</div>
        </div>
      )
    }
  };

  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === '') return;

    // Add to history
    setHistory(prev => [...prev, { type: 'input', content: cmd }]);

    if (commands[command]) {
      const output = commands[command].execute(args);
      if (output !== null) {
        setHistory(prev => [...prev, { type: 'output', content: output }]);
      }
    } else {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: (
          <div>
            <span className="text-red-400">Command not found: {command}</span>
            <div className="text-slate-400 text-sm mt-1">Type 'help' for available commands</div>
          </div>
        )
      }]);
    }

    // Add to command history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Arrow up/down for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Show welcome message on mount with available commands
  useEffect(() => {
    setHistory([
      { 
        type: 'output', 
        content: (
          <div className="space-y-3">
            <div className="text-emerald-400 font-bold text-lg">Welcome to Kushagra's Interactive Terminal! 🚀</div>
            <div className="text-slate-400">Available commands:</div>
            <div className="ml-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {Object.entries(commands).map(([cmd, info]) => (
                <div key={cmd} className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">{cmd}</span>
                  <span className="text-slate-500">-</span>
                  <span className="text-slate-500 text-xs">{info.description}</span>
                </div>
              ))}
            </div>
            <div className="text-slate-500 text-sm mt-2">💡 Tip: Use ↑/↓ arrows for command history</div>
          </div>
        )
      }
    ]);
  }, []);

  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="w-4 h-4" />
            <span className="text-sm font-mono">kushagra@portfolio:~$</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">Interactive Terminal</div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-[350px] overflow-auto p-4 font-mono text-sm"
      >
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              {item.type === 'input' && (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">visitor@kushagra</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">~</span>
                  <span className="text-slate-500">$</span>
                  <span className="text-slate-300">{item.content}</span>
                </div>
              )}
              {item.type === 'output' && (
                <div className="ml-0 text-slate-300">{item.content}</div>
              )}
              {item.type === 'error' && (
                <div className="ml-0">{item.content}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <span className="text-emerald-400">visitor@kushagra</span>
          <span className="text-slate-500">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-slate-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-slate-300 font-mono caret-emerald-400"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default InteractiveTerminal;

