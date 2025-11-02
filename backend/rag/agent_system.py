"""
Agentic System for Portfolio Chatbot
Implements an agent that can:
- Use multiple tools (RAG, GitHub stats, resume tailoring, web search)
- Reason about which tool to use
- Chain multiple tool calls
- Provide enhanced responses
"""

import os
import json
from typing import List, Dict, Optional, Callable
from dotenv import load_dotenv
import google.generativeai as genai
from enum import Enum

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)


class ToolType(Enum):
    """Available tools for the agent"""
    RAG_SEARCH = "rag_search"
    GITHUB_STATS = "github_stats"
    RESUME_TAILOR = "resume_tailor"
    CLARIFY = "clarify"
    DIRECT_ANSWER = "direct_answer"


class Tool:
    """Represents a tool that the agent can use"""
    
    def __init__(self, name: str, description: str, parameters: Dict, function: Callable):
        self.name = name
        self.description = description
        self.parameters = parameters
        self.function = function
    
    def execute(self, **kwargs) -> Dict:
        """Execute the tool with given parameters"""
        try:
            return {
                "success": True,
                "result": self.function(**kwargs)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def to_schema(self) -> Dict:
        """Convert tool to schema format for LLM"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }


class PortfolioAgent:
    """
    Agentic system that can reason about queries and use appropriate tools.
    """
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.tools = {}
        self.conversation_history = []
        self._register_tools()
    
    def _register_tools(self):
        """Register all available tools"""
        
        # RAG Search Tool
        self.register_tool(
            Tool(
                name="rag_search",
                description="Search through Kushagra's portfolio information including work experience, projects, skills, and education. Use this for any query about his professional background.",
                parameters={
                    "query": "The search query to find relevant information from the portfolio"
                },
                function=self._rag_search_placeholder
            )
        )
        
        # GitHub Stats Tool
        self.register_tool(
            Tool(
                name="github_stats",
                description="Retrieve GitHub statistics including repositories, commits, and activity. Use this when asked about GitHub, repositories, or coding activity.",
                parameters={
                    "query": "What GitHub information to retrieve"
                },
                function=self._github_stats_placeholder
            )
        )
        
        # Resume Tailoring Tool
        self.register_tool(
            Tool(
                name="resume_tailor",
                description="Generate a tailored resume based on a job description. Use this when the user asks to tailor or customize a resume for a specific job.",
                parameters={
                    "job_description": "The job description to tailor the resume for"
                },
                function=self._resume_tailor_placeholder
            )
        )
        
        # Clarification Tool
        self.register_tool(
            Tool(
                name="clarify",
                description="Ask the user for clarification when the query is ambiguous or lacks necessary information.",
                parameters={
                    "clarification_question": "The question to ask the user for clarification"
                },
                function=self._clarify
            )
        )
        
        # Direct Answer Tool
        self.register_tool(
            Tool(
                name="direct_answer",
                description="Provide a direct answer for simple greetings, thank you messages, or general conversation without needing to search.",
                parameters={
                    "response": "The direct response to give"
                },
                function=self._direct_answer
            )
        )
    
    def register_tool(self, tool: Tool):
        """Register a new tool"""
        self.tools[tool.name] = tool
    
    def _rag_search_placeholder(self, query: str) -> str:
        """Placeholder for RAG search - to be replaced with actual implementation"""
        return f"[RAG_SEARCH_NEEDED: {query}]"
    
    def _github_stats_placeholder(self, query: str) -> str:
        """Placeholder for GitHub stats - to be replaced with actual implementation"""
        return f"[GITHUB_STATS_NEEDED: {query}]"
    
    def _resume_tailor_placeholder(self, job_description: str) -> str:
        """Placeholder for resume tailoring - to be replaced with actual implementation"""
        return f"[RESUME_TAILOR_NEEDED: {job_description}]"
    
    def _clarify(self, clarification_question: str) -> str:
        """Ask for clarification"""
        return clarification_question
    
    def _direct_answer(self, response: str) -> str:
        """Provide a direct answer"""
        return response
    
    def plan_action(self, query: str) -> Dict:
        """
        Use LLM to reason about which tool(s) to use for the given query.
        """
        tool_schemas = [tool.to_schema() for tool in self.tools.values()]
        
        prompt = f"""You are an intelligent assistant helping users learn about Kushagra Wadhwa's professional portfolio.

Available Tools:
{json.dumps(tool_schemas, indent=2)}

User Query: "{query}"

Analyze the query and determine:
1. Which tool(s) should be used (you can use multiple tools in sequence)
2. What parameters to pass to each tool
3. The reasoning behind your choice

Respond in this JSON format:
{{
    "reasoning": "Why you chose this approach",
    "tools_to_use": [
        {{
            "tool_name": "name of the tool",
            "parameters": {{"param_name": "param_value"}},
            "purpose": "what this tool call accomplishes"
        }}
    ]
}}

IMPORTANT: 
- For greetings or simple conversational messages, use "direct_answer"
- For questions about work, projects, skills, or education, use "rag_search"
- For GitHub-related queries, use "github_stats"
- For resume tailoring requests, use "resume_tailor"
- If the query is unclear, use "clarify"
"""
        
        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Extract JSON from response
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
            
            plan = json.loads(response_text)
            return plan
        
        except Exception as e:
            print(f"Planning failed: {e}")
            # Fallback to RAG search
            return {
                "reasoning": "Defaulting to RAG search due to planning error",
                "tools_to_use": [
                    {
                        "tool_name": "rag_search",
                        "parameters": {"query": query},
                        "purpose": "Search portfolio information"
                    }
                ]
            }
    
    def execute_plan(self, plan: Dict) -> List[Dict]:
        """Execute the planned tool calls"""
        results = []
        
        for tool_call in plan.get("tools_to_use", []):
            tool_name = tool_call.get("tool_name")
            parameters = tool_call.get("parameters", {})
            purpose = tool_call.get("purpose", "")
            
            if tool_name in self.tools:
                tool = self.tools[tool_name]
                result = tool.execute(**parameters)
                results.append({
                    "tool": tool_name,
                    "purpose": purpose,
                    "result": result
                })
            else:
                results.append({
                    "tool": tool_name,
                    "purpose": purpose,
                    "result": {
                        "success": False,
                        "error": f"Tool '{tool_name}' not found"
                    }
                })
        
        return results
    
    def synthesize_response(self, query: str, plan: Dict, execution_results: List[Dict]) -> str:
        """
        Synthesize the final response based on tool execution results.
        """
        # If it's a direct answer, just return it
        if len(execution_results) == 1 and execution_results[0]["tool"] == "direct_answer":
            return execution_results[0]["result"]["result"]
        
        # If it's a clarification, return the question
        if len(execution_results) == 1 and execution_results[0]["tool"] == "clarify":
            return execution_results[0]["result"]["result"]
        
        # Otherwise, synthesize from multiple tool results
        context = ""
        for result in execution_results:
            if result["result"]["success"]:
                context += f"\nTool: {result['tool']}\nPurpose: {result['purpose']}\nResult: {result['result']['result']}\n"
        
        synthesis_prompt = f"""Given the user's query and the results from various tools, synthesize a clear, professional response.

User Query: {query}

Reasoning: {plan.get('reasoning', '')}

Tool Results:
{context}

Synthesize a professional, coherent response that:
1. Directly addresses the user's query
2. Integrates information from all tool results
3. Maintains a professional tone
4. Is clear and concise

Response:"""
        
        try:
            response = self.model.generate_content(synthesis_prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Synthesis failed: {e}")
            return "I apologize, but I encountered an error while processing your request."
    
    def process_query(self, query: str) -> Dict:
        """
        Main method to process a user query using the agentic system.
        
        Returns:
            Dict with response, plan, and execution details
        """
        # Step 1: Plan the action
        plan = self.plan_action(query)
        
        # Step 2: Execute the plan
        execution_results = self.execute_plan(plan)
        
        # Step 3: Synthesize the response
        response = self.synthesize_response(query, plan, execution_results)
        
        # Store in conversation history
        self.conversation_history.append({
            "query": query,
            "plan": plan,
            "execution_results": execution_results,
            "response": response
        })
        
        return {
            "response": response,
            "plan": plan,
            "execution_results": execution_results,
            "reasoning": plan.get("reasoning", "")
        }
    
    def set_tool_implementation(self, tool_name: str, implementation: Callable):
        """
        Replace a tool's placeholder implementation with actual implementation.
        """
        if tool_name in self.tools:
            self.tools[tool_name].function = implementation


# Singleton instance
_agent_instance = None

def get_agent_instance() -> PortfolioAgent:
    """Get or create the singleton agent instance"""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = PortfolioAgent()
    return _agent_instance


if __name__ == "__main__":
    # Test the agent
    agent = PortfolioAgent()
    
    test_queries = [
        "Hi!",
        "What projects has Kushagra worked on with AI?",
        "Show me his GitHub stats",
        "Can you tailor his resume for a Data Scientist position at Google?"
    ]
    
    for query in test_queries:
        print(f"\n{'='*80}")
        print(f"Query: {query}")
        print(f"{'='*80}")
        
        result = agent.process_query(query)
        print(f"\nReasoning: {result['reasoning']}")
        print(f"\nPlan: {json.dumps(result['plan']['tools_to_use'], indent=2)}")
        print(f"\nResponse:\n{result['response']}")

