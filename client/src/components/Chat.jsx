// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { ChatContext } from './ChatContext';
// import { Send, User, Bot, MoreHorizontal, ChevronDown, RefreshCw } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Chat() {
//   const { messages, setMessages } = useContext(ChatContext);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(true);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
  
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!isLoading && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isLoading]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = {
//       id: Date.now().toString(),
//       content: input,
//       role: 'user',
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: input }),
//       });

//       if (!response.ok) {
//         throw new Error(`Server responded with status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       const botMessage = {
//         id: (Date.now() + 1).toString(),
//         content: data.response,
//         role: 'assistant',
//         timestamp: new Date(),
//         metadata: data.metadata,
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = {
//         id: (Date.now() + 1).toString(),
//         content: `Sorry, I encountered an error: ${error.message}. Please ensure the backend server is running.`,
//         role: 'assistant',
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearChat = () => {
//     setMessages([]);
//   };

//   const typingBubbleVariants = {
//     initial: { opacity: 0, scale: 0.8 },
//     animate: { 
//       opacity: 1, 
//       scale: 1,
//       transition: { duration: 0.3 }
//     },
//     exit: { 
//       opacity: 0, 
//       scale: 0.8,
//       transition: { duration: 0.2 }
//     }
//   };

//   const messageVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.4, ease: 'easeOut' }
//     }
//   };

//   const headerVariants = {
//     expanded: { height: 'auto', opacity: 1 },
//     collapsed: { height: 0, opacity: 0 }
//   };

//   return (
    
//     <div className="flex min-h-0 flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
//       {/* Chat Header */}
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
//             <Bot className="w-5 h-5 text-blue-500" />
//           </div>
//           <h3 className="font-bold text-white">Kushagra's Assistant</h3>
//         </div>
//         <div className="flex gap-2">
//           <button 
//             onClick={clearChat}
//             className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
//             title="Clear chat"
//           >
//             <RefreshCw className="w-4 h-4 text-white" />
//           </button>



//         </div>
//       </div>
       

//       {/* Messages Area */}
//       <div className={`flex-1 min-h-0 p-4 space-y-6 bg-gray-50 dark:bg-gray-800 ${
//   messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'
// }`}>

//         <AnimatePresence>
//           {messages.length === 0 && (   
//             <motion.div 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6"
//             >
//               <div className="w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
//                 <Bot className="w-8 h-8 text-blue-500" />
//               </div>
//               <h3 className="text-lg font-medium mb-2">Chat with Me!</h3>
//               <p className="max-w-sm">Ask me anything about Kushagra's work, experience, education, skills, education....</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {messages.map((message) => (
//           <motion.div
//             key={message.id}
//             variants={messageVariants}
//             initial="initial"
//             animate="animate"
//             className={`flex items-start gap-3 ${
//               message.role === 'user' ? 'flex-row-reverse' : ''
//             }`}
//           >
//             <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//               message.role === 'user' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
//             }`}>
//               {message.role === 'user' ? (
//                 <User className="w-4 h-4" />
//               ) : (
//                 <Bot className="w-4 h-4" />
//               )}
//             </div>
//             <div
//               className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
//                 message.role === 'user'
//                   ? 'bg-blue-500 text-white rounded-tr-none'
//                   : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
//               }`}
//             >
//               <div className="whitespace-pre-wrap">
//                 <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
//                   {message.content}
//                 </ReactMarkdown>
//                 {message.metadata?.sources && (
//                   <motion.div 
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     transition={{ delay: 0.3 }}
//                     className="mt-2 text-sm opacity-80 border-t pt-2 border-gray-200 dark:border-gray-600"
//                   >
//                     <p className="font-semibold">Sources:</p>
//                     <ul className="list-disc list-inside">
//                       {message.metadata.sources.map((source, index) => (
//                         <li key={index}>{source}</li>
//                       ))}
//                     </ul>
//                   </motion.div>
//                 )}
//                 {message.metadata?.github_data && (
//                   <motion.div 
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     transition={{ delay: 0.3 }}
//                     className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
//                   >
//                     <pre className="text-sm overflow-x-auto">
//                       {JSON.stringify(message.metadata.github_data, null, 2)}
//                     </pre>
//                   </motion.div>
//                 )}
//               </div>
//               <div className="flex justify-end mt-1 text-xs opacity-70">
//                 <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//               </div>
//             </div>
//           </motion.div>
//         ))}
        
//         <AnimatePresence>
//           {isLoading && (
//             <motion.div 
//               variants={typingBubbleVariants}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//               className="flex items-start gap-3"
//             >
//               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
//                 <Bot className="w-4 h-4" />
//               </div>
//               <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-gray-700 shadow-sm">
//                 <div className="flex space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
//                   <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
//                   <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '600ms' }}></div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//         <div className="flex gap-2 items-center">
//           <input
//             ref={inputRef}
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask me anything about Kushagra's work..."
//             className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//           />
//           <motion.button
//             type="submit"
//             disabled={isLoading}
//             whileTap={{ scale: 0.95 }}
//             whileHover={{ scale: 1.05 }}
//             className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all duration-200"
//           >
//             <Send className="w-5 h-5" />
//           </motion.button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useContext, useState, useRef, useEffect } from 'react';
import { ChatContext } from './ChatContext';
import { Send, User, Bot, RefreshCw, Mic, MicOff, Loader, X, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const { messages, setMessages } = useContext(ChatContext);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioVisualization, setAudioVisualization] = useState([]);
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
      const response = await fetch('/api/chat', {
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
        content: `Sorry, I encountered an error: ${error.message}. Please ensure the backend server is running.`,
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

  // Create audio visualization data
  const updateAudioVisualization = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    // Generate visualization data - we'll use 20 bars
    const bars = [];
    const barCount = 20;
    const step = Math.floor(dataArray.length / barCount);
    
    for (let i = 0; i < barCount; i++) {
      // Get average value for this segment
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += Math.abs((dataArray[i * step + j] / 128.0) - 1);
      }
      // Scale the value (0-1) for visualization
      const value = (sum / step) * 1.5;
      bars.push(value);
    }
    
    setAudioVisualization(bars);
    animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
  };

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up audio analyzer for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      
      // Start visualization update loop
      updateAudioVisualization();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required for voice input. Please enable it in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks to release the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clean up audio context and stop animation
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
      
      // Stop all audio tracks to release the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clean up audio context and stop animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clear the audio chunks
      audioChunksRef.current = [];
      setAudioVisualization([]);
    }
  };

  const processRecording = async () => {
    stopRecording();
    setIsProcessingAudio(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create form data to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      // Send to Whisper API endpoint
      const response = await fetch('/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Set the transcribed text to the input field
      setInput(data.text);
      
      // If transcription is successful and there's text, automatically submit
      if (data.text && data.text.trim()) {
        // Small delay to allow user to see what was transcribed
        setTimeout(() => {
          handleSubmit();
        }, 500);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again or type your message instead.');
    } finally {
      setIsProcessingAudio(false);
    }
  };

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

  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <div className="flex min-h-0 flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
            <Bot className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="font-bold text-white">Kushagra's Assistant</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            title="Clear chat"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
       
      {/* Messages Area */}
      <div className={`flex-1 min-h-0 p-4  space-y-6 bg-gray-50 dark:bg-gray-800 ${
        messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'
      }`}>
        <AnimatePresence>
          {messages.length === 0 && (   
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6"
            >
              <div className="w-16 h-16 mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Chat with Me!</h3>
              <p className="max-w-sm">Ask me anything about Kushagra's work, experience, education, skills, education....</p>
              <div className="mt-4 flex flex-col items-center">
                <p className="text-sm mb-2">Now with voice input capability!</p>
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  <span>Try Voice Input</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div
              className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">
                <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                  {message.content}
                </ReactMarkdown>
                {message.metadata?.sources && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 text-sm opacity-80 border-t pt-2 border-gray-200 dark:border-gray-600"
                  >
                    <p className="font-semibold">Sources:</p>
                    <ul className="list-disc list-inside">
                      {message.metadata.sources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {message.metadata?.github_data && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
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
            </div>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-gray-700 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {isRecording ? (
          <div className="flex flex-col w-full">
            {/* Audio visualization */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-center h-12">
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
                      className="w-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-full mx-px"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recording controls */}
            <div className="flex justify-center space-x-4">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={cancelRecording}
                className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5 
                }}
                className="p-3 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <Mic className="w-5 h-5" />
              </motion.div>
              
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={processRecording}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              >
                <Check className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Recording... Click ✓ to send or ✕ to cancel
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={startRecording}
              disabled={isProcessingAudio}
              className={`p-3 rounded-full hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
                isProcessingAudio 
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400' 
                  : 'bg-blue-100 dark:bg-gray-800 text-blue-500'
              }`}
            >
              {isProcessingAudio ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </motion.button>
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isProcessingAudio ? "Processing audio..." : "Ask me anything about Kushagra's work..."}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isProcessingAudio}
            />
            
            <motion.button
              type="submit"
              disabled={isLoading || isProcessingAudio || !input.trim()}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        )}
        
        {isProcessingAudio && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-sm text-blue-500 dark:text-blue-400"
          >
            Processing your voice input...
          </motion.div>
        )}
      </form>
    </div>
  );
}