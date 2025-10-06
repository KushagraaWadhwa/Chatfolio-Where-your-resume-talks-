import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import config from '../config';
import { ChatContext } from './ChatContext';
import { Send, User, Bot, RefreshCw, Mic, MicOff, Loader, X, Check, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat({ theme = 'light' }) {  // Accept theme as a prop with a default value
  const { messages, setMessages } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioVisualization, setAudioVisualization] = useState([]);
  const [animationMode, setAnimationMode] = useState('default');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Cleanup animation and audio context when component unmounts
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const cycleAnimationMode = () => {
    const modes = ['default', 'bouncy', 'fade', 'slide'];
    const currentIndex = modes.indexOf(animationMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setAnimationMode(modes[nextIndex]);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        metadata: data.metadata,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const updateAudioVisualization = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    const bars = [];
    const barCount = 20;
    const step = Math.floor(dataArray.length / barCount);
    
    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += Math.abs((dataArray[i * step + j] / 128.0) - 1);
      }
      const value = (sum / step) * 1.5;
      bars.push(value);
    }
    
    setAudioVisualization(bars);
    animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          sampleSize: 16
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      
      updateAudioVisualization();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Microphone access is required for voice input. Please ensure your browser has permission to use the microphone.",
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioVisualization([]);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      audioChunksRef.current = [];
      setAudioVisualization([]);
    }
  };

  const processRecording = async () => {
    try {
      stopRecording();
      setIsProcessingAudio(true);

      // Ensure we have audio data
      if (!audioChunksRef.current.length) {
        throw new Error('No audio data recorded');
      }

      const audioBlob = new Blob(audioChunksRef.current, { 
        type: 'audio/webm;codecs=opus'
      });

      // Validate blob size
      if (audioBlob.size === 0) {  // Fixed the typo from "Two0" to "0"
        throw new Error('Audio recording is empty');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      // Send to transcription endpoint
      const response = await fetch(`${config.apiBaseUrl}/transcribe`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.text) {
        throw new Error('No transcription received');
      }

      // Set the transcribed text
      setInput(data.text.trim());

      // Auto-submit if we have text
      if (data.text.trim()) {
        setTimeout(() => {
          handleSubmit();
        }, 500);
      }

    } catch (error) {
      console.error('Audio processing error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `Sorry, I couldn't process the audio: ${error.message}. Please try again or type your message.`,
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessingAudio(false);
      // Clean up audio resources
      audioChunksRef.current = [];
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    }
  };

  // Define animation variants based on the selected mode
  const getAnimationVariants = () => {
    switch (animationMode) {
      case 'bouncy':
        return {
          initial: { opacity: 0, scale: 0.8, y: 20 },
          animate: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              damping: 15, 
              mass: 1 
            }
          },
          exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.5 } },
          exit: { opacity: 0, transition: { duration: 0.3 } }
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: messageRole => messageRole === 'user' ? 100 : -100 },
          animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } },
          exit: { opacity: 0, x: messageRole => messageRole === 'user' ? 100 : -100, transition: { duration: 0.3 } }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
        };
    }
  };

  const messageVariants = getAnimationVariants();

  const typingBubbleVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Use the theme prop instead of the internal state
  const isDarkMode = theme === 'dark';

  // Background pattern SVG
  const patternSvg = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circles" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="${isDarkMode ? '#6366F1' : '#3B82F6'}" fillOpacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)" />
    </svg>
  `;

  return (
    <div 
      className={`flex min-h-0 flex-col h-full ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      } border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out relative`}
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(patternSvg)}")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
      <div className="absolute top-1 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 opacity-70"></div>
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 p-4 flex justify-between items-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 6 + 3}px`,
                    height: `${Math.random() * 6 + 3}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.4 + 0.2,
                    animation: `float ${Math.random() * 8 + 12}s linear infinite`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 z-10"
        >
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
          >
            <Bot className="w-5 h-5 text-blue-500" />
          </motion.div>
          <div>
            <h3 className="font-bold text-white text-lg">Kushagra's Assistant</h3>
            <div className="flex items-center text-xs text-blue-100">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.7, 1, 0.7] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="h-2 w-2 rounded-full bg-green-400 mr-2"
              ></motion.div>
              Online now
            </div>
          </div>
        </motion.div>
        
        <div className="flex gap-2 z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
       
      {/* Messages Area */}
      <div className={`flex-1 min-h-0 p-4 space-y-6 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
      } backdrop-blur-sm ${
        messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'
      } scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent`}>
        <AnimatePresence>
          {messages.length === 0 && (   
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center p-6"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
                className="w-24 h-24 mb-6 rounded-full flex items-center justify-center relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                {/* Orbiting circle */}
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-md"></div>
                </motion.div>
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-medium mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
              >
                Chat with Me!
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`max-w-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Ask me anything about Kushagra's work, experience, education, skills, education....
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex flex-col items-center"
              >
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} font-medium`}>
                  Now with voice input capability!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  disabled={isRecording}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>Try Voice Input</span>
                </motion.button>
              </motion.div>
              
              {/* Sample questions */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex flex-wrap justify-center gap-2"
              >
                <p className={`w-full text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Try asking:</p>
                {["What does Kushagra's work experience look like?", "Tell me about his skills", "What is his Education background"].map((question, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      isDarkMode 
                        ? 'border-blue-800 bg-blue-900/50 text-blue-300 hover:bg-blue-800' 
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    } transition-all duration-200`}
                  >
                    {question}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            custom={message.role}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </motion.div>
            <motion.div
              whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
              className={`p-5 rounded-2xl max-w-[85%] relative ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none'
                  : `${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} rounded-tl-none border-2`
              } shadow-xl transition-all duration-300`}
            >
              {/* Message tail */}
              <div 
                className={`absolute ${
                  message.role === 'user' ? 'right-0 -mr-2' : 'left-0 -ml-2'
                } top-0 w-4 h-4 transform ${
                  message.role === 'user' 
                    ? 'bg-blue-500' 
                    : isDarkMode ? 'bg-gray-800' : 'bg-white'
                } rotate-45 border-t border-l ${
                  message.role === 'user' 
                    ? '' 
                    : isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              ></div>
              
              <div className="relative z-10">
                <ReactMarkdown 
                  className={`prose prose-base max-w-none ${
                    isDarkMode ? 'prose-invert' : 'prose-slate'
                  } ${
                    message.role === 'user' 
                      ? 'prose-headings:text-white prose-p:text-white prose-li:text-white prose-strong:text-blue-100' 
                      : 'prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400'
                  }`}
                  components={{
                    p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-2">{children}</ul>,
                    li: ({children}) => <li className="leading-relaxed">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                    h3: ({children}) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
                    h4: ({children}) => <h4 className="text-base font-medium mb-2 mt-3">{children}</h4>
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                
                {message.metadata?.sources && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className={`mt-4 p-3 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-indigo-50 border-indigo-200'
                    } border`}
                  >
                    <p className={`font-semibold mb-2 text-sm flex items-center gap-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-indigo-800'
                    }`}>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Verified Information Sources:
                    </p>
                    <ul className="space-y-1">
                      {message.metadata.sources.map((source, index) => (
                        <li key={index} className={`text-xs flex items-start gap-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-indigo-700'
                        }`}>
                          <span className="text-indigo-500 mt-1">▸</span>
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {message.metadata?.github_data && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className={`mt-2 p-2 rounded ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(message.metadata.github_data, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </div>
              <div className="flex justify-end mt-1 text-xs opacity-70">
                <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              {/* Decorative pattern for assistant messages */}
              {message.role === 'assistant' && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-5">
                  <div className="absolute -inset-[100%] bg-grid-pattern"></div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
        
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              variants={typingBubbleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className={`p-4 rounded-2xl rounded-tl-none ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex space-x-2">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: [
                        isDarkMode ? '#4B5563' : '#D1D5DB',
                        isDarkMode ? '#9CA3AF' : '#6B7280',
                        isDarkMode ? '#4B5563' : '#D1D5DB'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'}`}
                  ></motion.div>
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: [
                        isDarkMode ? '#4B5563' : '#D1D5DB',
                        isDarkMode ? '#9CA3AF' : '#6B7280',
                        isDarkMode ? '#4B5563' : '#D1D5DB'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'}`}
                  ></motion.div>
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: [
                        isDarkMode ? '#4B5563' : '#D1D5DB',
                        isDarkMode ? '#9CA3AF' : '#6B7280',
                        isDarkMode ? '#4B5563' : '#D1D5DB'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'}`}
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit} 
        className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-900/90' : 'border-gray-200 bg-white/90'
        } backdrop-blur-sm relative`}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        {isRecording ? (
          <div className="flex flex-col w-full">
            {/* Audio visualization */}
            <div className={`${
              theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'
            } rounded-lg p-3 mb-3 border ${
              theme === 'light' ? 'border-blue-200' : 'border-blue-800'
            }`}>
              <div className="flex items-center justify-center h-16">
                <div className="flex items-end justify-between w-full px-2 h-full">
                  {audioVisualization.map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: '15%' }}
                      animate={{ height: `${Math.max(15, height * 100)}%` }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300,
                        damping: 10,
                        mass: 0.2
                      }}
                      className="w-1.5 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full mx-px"
                      style={{
                        boxShadow: '0 0 8px rgba(79, 70, 229, 0.6)'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recording controls */}
            <div className="flex justify-center space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, backgroundColor: theme === 'light' ? '#E5E7EB' : '#4B5563' }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelRecording}
                className={`p-4 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                } text-gray-700 dark:text-gray-300 rounded-full hover:shadow-md transition-all`}
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 20px rgba(239, 68, 68, 0.6)',
                    '0 0 0 rgba(239, 68, 68, 0.4)'
                  ]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5 
                }}
                className="p-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Mic className="w-5 h-5" />
              </motion.div>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, backgroundColor: '#10B981' }}
                whileTap={{ scale: 0.95 }}
                onClick={processRecording}
                className="p-4 bg-green-500 text-white rounded-full hover:shadow-lg transition-all"
              >
                <Check className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className={`text-center text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            } mt-3 font-medium`}>
              Recording... Click ✓ to send or ✕ to cancel
            </div>
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <motion.button
              type="button"
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: theme === 'light' ? '#EFF6FF' : '#1E40AF',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              disabled={isProcessingAudio}
              className={`p-3 rounded-full hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
                isProcessingAudio 
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300'
              }`}
            >
              {isProcessingAudio ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </motion.button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isProcessingAudio ? "Processing audio..." : "Ask me anything about Kushagra's work..."}
                className={`w-full px-4 py-3 pr-10 border ${
                  theme === 'light' 
                    ? 'border-gray-300 bg-white text-gray-900' 
                    : 'border-gray-600 bg-gray-800 text-gray-100'
                } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                disabled={isProcessingAudio}
              />
              
              {/* Subtle gradient animation in input */}
              <div className={`absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 ${
                input.length > 0 ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}></div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading || isProcessingAudio || !input.trim()}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 12px rgba(79, 70, 229, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 ${
                input.trim() ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-400 dark:bg-gray-600'
              } text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all duration-300`}
            >
              <motion.div
                animate={input.trim() ? { 
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        )}
        
        {isProcessingAudio && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            <span className="inline-flex items-center">
              <Loader className="w-3 h-3 mr-2 animate-spin" />
              Processing your voice input...
            </span>
          </motion.div>
        )}
        
        {/* Floating action buttons when there are messages */}
        {messages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-12 right-4 flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-white text-blue-500 shadow-md' 
                  : 'bg-gray-800 text-blue-400 shadow-md'
              } border ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              } hover:shadow-lg transition-all`}
              onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
              title="Scroll to bottom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </form>
      
      {/* Add CSS for the grid pattern */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        .bg-grid-pattern {
          background-image: radial-gradient(
            ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'} 1px, 
            transparent 1px
          );
          background-size: 16px 16px;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb {
          background: #3B82F6;
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}