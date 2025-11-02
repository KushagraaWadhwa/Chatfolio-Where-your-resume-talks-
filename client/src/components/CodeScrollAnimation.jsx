import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CodeScrollAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Real code snippets from actual projects
  const codeSnippets = [
    {
      language: 'python',
      title: 'Advanced RAG System',
      code: `# Production RAG with Query Enhancement
from langchain_google_genai import GoogleGenerativeAI
from langchain_chroma import Chroma
from sentence_transformers import CrossEncoder

class AdvancedRAG:
    def __init__(self):
        self.llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp")
        self.embeddings = HuggingFaceEmbeddings(model="all-MiniLM-L6-v2")
        self.reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        self.vector_store = Chroma(persist_directory="chroma_db")
    
    def retrieve_with_mmr(self, query: str, k: int = 5):
        """MMR for relevance + diversity"""
        retriever = self.vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={"k": k, "fetch_k": 20, "lambda_mult": 0.7}
        )
        return retriever.invoke(query)
    
    def rerank_documents(self, query: str, docs: List):
        pairs = [[query, doc.page_content] for doc in docs]
        scores = self.reranker.predict(pairs)
        return sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)`
    },
    {
      language: 'javascript',
      title: 'React AI Chat',
      code: `// Real-time AI Chat with Streaming
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  
  const sendMessage = async (input) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setMessages(prev => [...prev, chunk]);
    }
  };
};`
    },
    {
      language: 'python',
      title: 'Agentic AI System',
      code: `# Multi-Tool Reasoning Agent
class PortfolioAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.tools = {
            'rag_search': self._rag_search,
            'github_stats': self._github_stats,
            'resume_tailor': self._resume_tailor
        }
    
    def plan_action(self, query: str) -> Dict:
        """Agent reasons about which tools to use"""
        tool_schemas = [tool.to_schema() for tool in self.tools.values()]
        
        prompt = f\"\"\"
        Available Tools: {json.dumps(tool_schemas, indent=2)}
        User Query: "{query}"
        
        Analyze and determine:
        1. Which tool(s) to use
        2. Parameters for each tool
        3. Reasoning behind your choice
        \"\"\"
        
        response = self.model.generate_content(prompt)
        return json.loads(response.text)
    
    def execute_plan(self, plan: Dict):
        results = []
        for tool_call in plan['tools_to_use']:
            tool = self.tools[tool_call['tool_name']]
            result = tool.execute(**tool_call['parameters'])
            results.append(result)
        return self.synthesize_response(query, results)`
    },
    {
      language: 'python',
      title: 'Data Analytics Automation',
      code: `# Automated PDF Data Extraction & Analysis
import pdfplumber
import pandas as pd
import re
from typing import Dict, List

class DocumentParser:
    def __init__(self):
        self.patterns = {
            'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'phone': r'\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}',
            'date': r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'
        }
    
    def extract_structured_data(self, pdf_path: str) -> Dict:
        """Extract and structure data from complex PDFs"""
        with pdfplumber.open(pdf_path) as pdf:
            text = ''.join(page.extract_text() for page in pdf.pages)
            tables = [page.extract_tables() for page in pdf.pages]
        
        # Apply NLP-based classification
        data = {
            'emails': re.findall(self.patterns['email'], text),
            'phones': re.findall(self.patterns['phone'], text),
            'tables': self._process_tables(tables)
        }
        
        # Create analytics dashboard data
        df = pd.DataFrame(data['tables'])
        return self._generate_insights(df)
    
    def _generate_insights(self, df: pd.DataFrame) -> Dict:
        """Real-time analytics from extracted data"""
        return {
            'total_records': len(df),
            'coverage': self._calculate_coverage(df),
            'quality_score': self._assess_quality(df)
        }`
    },
    {
      language: 'javascript',
      title: 'FastAPI Backend',
      code: `// FastAPI Chat Endpoint
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # Rate limiting
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429)
    
    # Detect intent
    is_resume = detect_resume_command(request.message)
    
    if is_resume:
        return tailor_resume(request.message)
    
    # Use advanced RAG
    rag = get_rag_instance()
    response = rag.process_query(
        request.message,
        use_cache=True,
        use_agent=True
    )
    
    return ChatResponse(
        response=response['answer'],
        metadata=response['metadata']
    )`
    }
  ];

  // Auto-rotate code snippets
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1">
      {/* Terminal Header */}
      <div className="bg-slate-900 rounded-t-xl px-4 py-3 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-slate-400 font-mono">
            {codeSnippets[activeIndex].title}.{codeSnippets[activeIndex].language}
          </span>
        </div>
      </div>

      {/* Code Display with Typing Effect */}
      <div className="relative bg-slate-900 rounded-b-xl p-6 h-[400px] overflow-hidden">
        <motion.pre
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-mono text-slate-300 leading-relaxed overflow-auto h-full"
        >
          <code className="language-python">
            {codeSnippets[activeIndex].code.split('\n').map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="hover:bg-slate-800/50 px-2 -mx-2 rounded transition-colors"
              >
                <span className="text-slate-500 select-none mr-4">{String(i + 1).padStart(2, ' ')}</span>
                <span dangerouslySetInnerHTML={{ 
                  __html: syntaxHighlight(line) 
                }} />
              </motion.div>
            ))}
          </code>
        </motion.pre>

        {/* Scroll indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {codeSnippets.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-violet-500 w-8' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple syntax highlighting
const syntaxHighlight = (line) => {
  return line
    .replace(/\b(class|def|async|await|return|if|for|while|import|from|self|True|False|None)\b/g, 
      '<span class="text-purple-400">$1</span>')
    .replace(/\b(str|int|Dict|List|Optional)\b/g, 
      '<span class="text-cyan-400">$1</span>')
    .replace(/(#.*$)/g, 
      '<span class="text-slate-500">$1</span>')
    .replace(/(".*?"|'.*?')/g, 
      '<span class="text-emerald-400">$1</span>')
    .replace(/\b(\d+)\b/g, 
      '<span class="text-amber-400">$1</span>')
    .replace(/(@\w+)/g, 
      '<span class="text-pink-400">$1</span>')
    .replace(/\b(self|query|response|request|llm|embeddings)\b/g, 
      '<span class="text-blue-300">$1</span>');
};

export default CodeScrollAnimation;

