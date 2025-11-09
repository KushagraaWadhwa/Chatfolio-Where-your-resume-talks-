"""
Mini RAG Evaluation - 10 Most Important Questions
For testing when quota is limited
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.rag.generator import generate_response

# Mini Test Dataset: 10 Critical Recruiter Questions
MINI_EVALUATION_DATASET = [
    {
        "id": 1,
        "category": "work_experience",
        "question": "What is Kushagra's current role and company?",
        "expected_answer": "Software Engineer at ShorthillsAI",
        "key_facts": ["Software Engineer", "ShorthillsAI", "July 2025", "Present"],
    },
    {
        "id": 2,
        "category": "work_experience",
        "question": "Tell me about the HR Resume Assistant project at ShorthillsAI",
        "expected_answer": "AI-powered bot on Microsoft Teams for recruitment workflows",
        "key_facts": ["HR Resume Assistant", "Microsoft Teams", "AI-powered", "recruitment"],
    },
    {
        "id": 3,
        "category": "projects",
        "question": "What is SalesAssist AI and what technologies does it use?",
        "expected_answer": "RAG-based sales assistant using LLM, ChromaDB, LangChain for real-time query resolution",
        "key_facts": ["SalesAssist", "RAG", "LLM", "ChromaDB", "LangChain"],
    },
    {
        "id": 4,
        "category": "education",
        "question": "What degree does Kushagra have and from which university?",
        "expected_answer": "BTech in AI & ML from Guru Gobind Singh Indraprastha University",
        "key_facts": ["BTech", "AI", "Machine Learning", "Indraprastha", "GGSIPU"],
    },
    {
        "id": 5,
        "category": "skills",
        "question": "What vector databases has Kushagra worked with?",
        "expected_answer": "Pinecone, ChromaDB",
        "key_facts": ["Pinecone", "ChromaDB", "vector"],
    },
    {
        "id": 6,
        "category": "work_experience",
        "question": "What automation tools did Kushagra use at ShorthillsAI?",
        "expected_answer": "Apache NiFi and n8n",
        "key_facts": ["Apache NiFi", "n8n"],
    },
    {
        "id": 7,
        "category": "projects",
        "question": "Tell me about the Earnings Call Intelligence Platform",
        "expected_answer": "Real-time platform with speaker identification, financial summarization, automated alerts",
        "key_facts": ["real-time", "speaker identification", "financial", "earnings call"],
    },
    {
        "id": 8,
        "category": "skills",
        "question": "What backend frameworks does Kushagra know?",
        "expected_answer": "FastAPI, Flask",
        "key_facts": ["FastAPI", "Flask"],
    },
    {
        "id": 9,
        "category": "work_experience",
        "question": "What was Kushagra's achievement at Deutsche Telekom?",
        "expected_answer": "Document parser with 95% coverage, Streamlit dashboard",
        "key_facts": ["document parser", "95%", "Streamlit"],
    },
    {
        "id": 10,
        "category": "personal",
        "question": "What languages does Kushagra speak?",
        "expected_answer": "French, English, Hindi",
        "key_facts": ["French", "English", "Hindi"],
    }
]


def evaluate_mini():
    """Run mini evaluation"""
    print("=" * 80)
    print(" " * 20 + "RAG MINI EVALUATION (10 Questions)")
    print("=" * 80)
    
    results = []
    total_precision = 0
    passed = 0
    
    for i, test in enumerate(MINI_EVALUATION_DATASET, 1):
        print(f"\n\nQuestion {i}/10: {test['question']}")
        print("-" * 80)
        
        try:
            response = generate_response(test['question'])
            answer = response.get('answer', '')
            
            # Check key facts
            answer_lower = answer.lower()
            found = [f for f in test['key_facts'] if f.lower() in answer_lower]
            missing = [f for f in test['key_facts'] if f.lower() not in answer_lower]
            
            precision = len(found) / len(test['key_facts']) if test['key_facts'] else 0
            total_precision += precision
            
            if precision >= 0.6:
                passed += 1
                status = "✅ PASS"
            else:
                status = "❌ FAIL"
            
            print(f"\n{status} | Precision: {precision:.1%}")
            print(f"Found: {found}")
            print(f"Missing: {missing}")
            print(f"\nAnswer Preview: {answer[:200]}...")
            
            results.append({
                'question': test['question'],
                'precision': precision,
                'found': found,
                'missing': missing,
                'status': status
            })
            
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            results.append({'question': test['question'], 'error': str(e)})
    
    # Summary
    print("\n\n" + "=" * 80)
    print(" " * 25 + "EVALUATION SUMMARY")
    print("=" * 80)
    print(f"\nTotal Questions: 10")
    print(f"✅ Passed (≥60%): {passed}/10 ({passed*10}%)")
    print(f"❌ Failed (<60%): {10-passed}/10 ({(10-passed)*10}%)")
    print(f"📈 Average Precision: {(total_precision/10)*100:.1f}%")
    print("\n" + "=" * 80)
    
    # Save report
    with open('rag_mini_evaluation.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total': 10,
                'passed': passed,
                'failed': 10-passed,
                'avg_precision': total_precision/10
            },
            'results': results
        }, f, indent=2)
    
    print("\n📁 Report saved to: rag_mini_evaluation.json")

if __name__ == "__main__":
    evaluate_mini()

