"""
Comprehensive RAG Evaluation System
Evaluates the RAG system's performance against recruiter-style questions
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
import re

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.rag.generator import generate_response

# Test Dataset: 50 Recruiter Questions with Expected Answers
EVALUATION_DATASET = [
    # WORK EXPERIENCE QUESTIONS (15 questions)
    {
        "id": 1,
        "category": "work_experience",
        "question": "What is Kushagra's current role and company?",
        "expected_answer": "Software Engineer at ShorthillsAI",
        "key_facts": ["Software Engineer", "ShorthillsAI", "July 2025", "Present"],
        "weight": 1.0
    },
    {
        "id": 2,
        "category": "work_experience",
        "question": "Tell me about the HR Resume Assistant project at ShorthillsAI",
        "expected_answer": "AI-powered bot on Microsoft Teams for recruitment workflows, includes resume generation and semantic candidate search",
        "key_facts": ["HR Resume Assistant", "Microsoft Teams", "AI-powered", "recruitment", "semantic search"],
        "weight": 1.5
    },
    {
        "id": 3,
        "category": "work_experience",
        "question": "What technologies did Kushagra use for the Earnings Call Intelligence Platform?",
        "expected_answer": "Generative AI, real-time speaker identification, financial segment summarization, automated alerts",
        "key_facts": ["Generative AI", "speaker identification", "financial", "real-time"],
        "weight": 1.5
    },
    {
        "id": 4,
        "category": "work_experience",
        "question": "How long has Kushagra been working at ShorthillsAI?",
        "expected_answer": "Started as intern in February 2025, then became Software Engineer in July 2025, currently working",
        "key_facts": ["February 2025", "intern", "July 2025", "Software Engineer"],
        "weight": 1.0
    },
    {
        "id": 5,
        "category": "work_experience",
        "question": "What did Kushagra work on at ProdigalAI?",
        "expected_answer": "Domain-specific chatbot using LlamaIndex and Gemini with RAG pipeline for document queries",
        "key_facts": ["chatbot", "LlamaIndex", "Gemini", "RAG", "documents"],
        "weight": 1.5
    },
    {
        "id": 6,
        "category": "work_experience",
        "question": "What was Kushagra's achievement at Deutsche Telekom?",
        "expected_answer": "Designed document parser achieving 95% coverage from HR forms, built Streamlit dashboard",
        "key_facts": ["document parser", "95%", "HR forms", "Streamlit", "dashboard"],
        "weight": 1.5
    },
    {
        "id": 7,
        "category": "work_experience",
        "question": "What automation tools did Kushagra use at ShorthillsAI?",
        "expected_answer": "Apache NiFi and n8n for workflow automation",
        "key_facts": ["Apache NiFi", "n8n", "automation", "workflow"],
        "weight": 1.0
    },
    {
        "id": 8,
        "category": "work_experience",
        "question": "What is Kushagra currently working on?",
        "expected_answer": "DataDog automation initiative for enhanced analysis reports and observability insights",
        "key_facts": ["DataDog", "automation", "analysis reports", "observability"],
        "weight": 1.0
    },
    {
        "id": 9,
        "category": "work_experience",
        "question": "When did Kushagra work at Deutsche Telekom Digital Labs?",
        "expected_answer": "June 2024 to August 2024",
        "key_facts": ["June 2024", "August 2024", "Deutsche Telekom"],
        "weight": 1.0
    },
    {
        "id": 10,
        "category": "work_experience",
        "question": "When was Kushagra at ProdigalAI?",
        "expected_answer": "September 2024 to November 2024",
        "key_facts": ["September 2024", "November 2024", "ProdigalAI"],
        "weight": 1.0
    },
    {
        "id": 11,
        "category": "work_experience",
        "question": "What Microsoft Teams features did Kushagra implement?",
        "expected_answer": "Adaptive Cards for intuitive UI in HR Resume Assistant",
        "key_facts": ["Adaptive Cards", "Microsoft Teams", "UI", "HR Resume"],
        "weight": 1.0
    },
    {
        "id": 12,
        "category": "work_experience",
        "question": "Who are the end users of the Earnings Call platform?",
        "expected_answer": "Financial analysts and fund managers",
        "key_facts": ["financial analysts", "fund managers", "investment decisions"],
        "weight": 1.0
    },
    {
        "id": 13,
        "category": "work_experience",
        "question": "What role did Kushagra have at ShorthillsAI before becoming Software Engineer?",
        "expected_answer": "Software Engineer Intern from February to June 2025",
        "key_facts": ["intern", "February", "June", "2025"],
        "weight": 1.0
    },
    {
        "id": 14,
        "category": "work_experience",
        "question": "What product lifecycle responsibilities did Kushagra have?",
        "expected_answer": "Owned complete product lifecycle of HR Resume Assistant",
        "key_facts": ["product lifecycle", "owned", "HR Resume Assistant"],
        "weight": 1.0
    },
    {
        "id": 15,
        "category": "work_experience",
        "question": "What AI-driven features did Kushagra design?",
        "expected_answer": "AI-driven resume generation and semantic candidate search",
        "key_facts": ["AI-driven", "resume generation", "semantic search", "candidate"],
        "weight": 1.0
    },
    
    # PROJECTS QUESTIONS (15 questions)
    {
        "id": 16,
        "category": "projects",
        "question": "Tell me about the SalesAssist AI project",
        "expected_answer": "Conversational AI framework using RAG and LLM for real-time customer query resolution",
        "key_facts": ["SalesAssist", "RAG", "LLM", "real-time", "customer queries"],
        "weight": 1.5
    },
    {
        "id": 17,
        "category": "projects",
        "question": "What technologies are used in SalesAssist AI?",
        "expected_answer": "LLM, RAG, Python, LangChain, Vector Databases",
        "key_facts": ["LLM", "RAG", "Python", "LangChain", "Vector Databases"],
        "weight": 1.0
    },
    {
        "id": 18,
        "category": "projects",
        "question": "What does the Food Rating ML project do?",
        "expected_answer": "Predicts food ratings based on ingredients and cooking methods using machine learning",
        "key_facts": ["food rating", "ingredients", "cooking", "machine learning", "prediction"],
        "weight": 1.0
    },
    {
        "id": 19,
        "category": "projects",
        "question": "What vector database did Kushagra use in Smart Learning Engine?",
        "expected_answer": "Pinecone for high-speed vector search",
        "key_facts": ["Pinecone", "vector search", "Smart Learning Engine"],
        "weight": 1.0
    },
    {
        "id": 20,
        "category": "projects",
        "question": "What voice technology is used in the Sales Assistant?",
        "expected_answer": "OpenAI Whisper for voice integration",
        "key_facts": ["OpenAI Whisper", "voice", "Sales Assistant"],
        "weight": 1.0
    },
    {
        "id": 21,
        "category": "projects",
        "question": "Tell me about the CAPTCHA Solver project",
        "expected_answer": "OpenCV-based automated CAPTCHA solver using deep learning and OCR",
        "key_facts": ["CAPTCHA", "OpenCV", "OCR", "deep learning", "automated"],
        "weight": 1.0
    },
    {
        "id": 22,
        "category": "projects",
        "question": "What does GrocExpress application do?",
        "expected_answer": "Full-stack grocery store management system with inventory tracking and admin dashboard",
        "key_facts": ["GrocExpress", "grocery", "inventory", "admin dashboard", "Flask"],
        "weight": 1.0
    },
    {
        "id": 23,
        "category": "projects",
        "question": "What is Homeyfy?",
        "expected_answer": "Multi-user platform connecting customers with household service professionals with role-based access",
        "key_facts": ["Homeyfy", "household services", "RBAC", "customers", "professionals"],
        "weight": 1.0
    },
    {
        "id": 24,
        "category": "projects",
        "question": "What technologies are used in Homeyfy?",
        "expected_answer": "Flask, Vue.js, SQLite, Redis",
        "key_facts": ["Flask", "Vue.js", "SQLite", "Redis"],
        "weight": 1.0
    },
    {
        "id": 25,
        "category": "projects",
        "question": "What does AskYourPDF project do?",
        "expected_answer": "Chatbot for querying PDF documents using embeddings and vector search",
        "key_facts": ["AskYourPDF", "PDF", "chatbot", "embeddings", "questions"],
        "weight": 1.0
    },
    {
        "id": 26,
        "category": "projects",
        "question": "What is the Smart Learning Engine?",
        "expected_answer": "Educational content discovery system using RAG and semantic similarity with Pinecone",
        "key_facts": ["Smart Learning", "educational", "semantic similarity", "RAG", "Pinecone"],
        "weight": 1.5
    },
    {
        "id": 27,
        "category": "projects",
        "question": "What database does the Sales Assistant use?",
        "expected_answer": "ChromaDB for vector storage and retrieval",
        "key_facts": ["ChromaDB", "vector", "Sales Assistant"],
        "weight": 1.0
    },
    {
        "id": 28,
        "category": "projects",
        "question": "What features does SalesAssist support?",
        "expected_answer": "Real-time query resolution, dynamic conversation, RAG retrieval, multi-language support",
        "key_facts": ["real-time", "conversational", "RAG", "multi-language"],
        "weight": 1.0
    },
    {
        "id": 29,
        "category": "projects",
        "question": "What organization was the CAPTCHA project for?",
        "expected_answer": "BDO India",
        "key_facts": ["BDO India", "CAPTCHA"],
        "weight": 1.0
    },
    {
        "id": 30,
        "category": "projects",
        "question": "What problem did the PDF Extractor solve?",
        "expected_answer": "Extracts structured data from PDFs without using LLMs, using regex and NLP",
        "key_facts": ["PDF", "structured data", "no LLM", "regex", "NLP"],
        "weight": 1.0
    },
    
    # EDUCATION & SKILLS (10 questions)
    {
        "id": 31,
        "category": "education",
        "question": "What degree does Kushagra have?",
        "expected_answer": "Bachelor of Technology in Artificial Intelligence and Machine Learning",
        "key_facts": ["Bachelor", "Technology", "AI", "Machine Learning"],
        "weight": 1.0
    },
    {
        "id": 32,
        "category": "education",
        "question": "Which university did Kushagra graduate from?",
        "expected_answer": "Guru Gobind Singh Indraprastha University, New Delhi",
        "key_facts": ["GGSIPU", "Indraprastha", "New Delhi"],
        "weight": 1.0
    },
    {
        "id": 33,
        "category": "education",
        "question": "What AI-related coursework did Kushagra complete?",
        "expected_answer": "AI, ML, NLP, ANN, Data Warehousing, Statistics",
        "key_facts": ["Artificial Intelligence", "Machine Learning", "NLP", "Neural Networks"],
        "weight": 1.0
    },
    {
        "id": 34,
        "category": "skills",
        "question": "What RAG frameworks has Kushagra used?",
        "expected_answer": "LangChain, LlamaIndex with various vector databases",
        "key_facts": ["LangChain", "LlamaIndex", "RAG"],
        "weight": 1.0
    },
    {
        "id": 35,
        "category": "skills",
        "question": "What vector databases has Kushagra worked with?",
        "expected_answer": "Pinecone, ChromaDB, and general vector database implementations",
        "key_facts": ["Pinecone", "ChromaDB", "vector databases"],
        "weight": 1.0
    },
    {
        "id": 36,
        "category": "skills",
        "question": "What backend frameworks does Kushagra know?",
        "expected_answer": "Flask, FastAPI for Python backend development",
        "key_facts": ["Flask", "FastAPI", "Python"],
        "weight": 1.0
    },
    {
        "id": 37,
        "category": "skills",
        "question": "What frontend technologies has Kushagra used?",
        "expected_answer": "Vue.js, HTML, CSS, JavaScript, Streamlit",
        "key_facts": ["Vue.js", "HTML", "CSS", "JavaScript", "Streamlit"],
        "weight": 1.0
    },
    {
        "id": 38,
        "category": "skills",
        "question": "What machine learning libraries does Kushagra use?",
        "expected_answer": "Scikit-learn, Pandas for ML and data analysis",
        "key_facts": ["Scikit-learn", "Pandas", "machine learning"],
        "weight": 1.0
    },
    {
        "id": 39,
        "category": "skills",
        "question": "What workflow automation tools has Kushagra used?",
        "expected_answer": "Apache NiFi and n8n",
        "key_facts": ["Apache NiFi", "n8n", "automation"],
        "weight": 1.0
    },
    {
        "id": 40,
        "category": "skills",
        "question": "Has Kushagra worked with OpenAI technologies?",
        "expected_answer": "Yes, OpenAI Whisper for voice and GPT models for various AI applications",
        "key_facts": ["OpenAI", "Whisper", "GPT"],
        "weight": 1.0
    },
    
    # PERSONAL & BEHAVIORAL (10 questions)
    {
        "id": 41,
        "category": "personal",
        "question": "What is Kushagra's age?",
        "expected_answer": "21 years old, born on June 2nd, 2003",
        "key_facts": ["21", "June 2", "2003"],
        "weight": 0.5
    },
    {
        "id": 42,
        "category": "personal",
        "question": "Where is Kushagra from?",
        "expected_answer": "Born in Alwar, Rajasthan, currently lives in Dwarka, New Delhi",
        "key_facts": ["Alwar", "Rajasthan", "Dwarka", "New Delhi"],
        "weight": 0.5
    },
    {
        "id": 43,
        "category": "personal",
        "question": "What languages does Kushagra speak?",
        "expected_answer": "French, English, and Hindi",
        "key_facts": ["French", "English", "Hindi"],
        "weight": 0.5
    },
    {
        "id": 44,
        "category": "personal",
        "question": "What are Kushagra's hobbies?",
        "expected_answer": "Badminton, Cricket, Football, Table Tennis, Travelling, Music, Dancing",
        "key_facts": ["Badminton", "Cricket", "Football", "Dancing", "Music"],
        "weight": 0.5
    },
    {
        "id": 45,
        "category": "personal",
        "question": "What leadership experience does Kushagra have?",
        "expected_answer": "President of college Dance Club, led team of 15 people, 40+ competitions",
        "key_facts": ["President", "Dance Club", "15 people", "40 competitions"],
        "weight": 1.0
    },
    {
        "id": 46,
        "category": "technical",
        "question": "What databases has Kushagra worked with?",
        "expected_answer": "SQLite, Redis, Vector Databases (Pinecone, ChromaDB)",
        "key_facts": ["SQLite", "Redis", "Pinecone", "ChromaDB"],
        "weight": 1.0
    },
    {
        "id": 47,
        "category": "technical",
        "question": "What AI models has Kushagra integrated?",
        "expected_answer": "Gemini, OpenAI GPT, Whisper, and various LLMs",
        "key_facts": ["Gemini", "OpenAI", "Whisper", "LLM"],
        "weight": 1.0
    },
    {
        "id": 48,
        "category": "technical",
        "question": "Does Kushagra have experience with real-time systems?",
        "expected_answer": "Yes, built real-time earnings call platform and sales assistant",
        "key_facts": ["real-time", "earnings call", "sales assistant"],
        "weight": 1.0
    },
    {
        "id": 49,
        "category": "technical",
        "question": "What document processing experience does Kushagra have?",
        "expected_answer": "PDF extraction, OCR, document parsers achieving 95% accuracy",
        "key_facts": ["PDF", "OCR", "document parser", "95%"],
        "weight": 1.0
    },
    {
        "id": 50,
        "category": "technical",
        "question": "Has Kushagra worked with any Google Cloud technologies?",
        "expected_answer": "Yes, used Gemini AI for chatbot development and RAG pipelines",
        "key_facts": ["Gemini", "Google", "AI", "chatbot"],
        "weight": 1.0
    }
]


def calculate_answer_score(actual_answer: str, expected_answer: str, key_facts: List[str]) -> Tuple[float, List[str], List[str]]:
    """
    Calculate how well the actual answer matches expected answer
    Returns: (score, found_facts, missing_facts)
    """
    actual_lower = actual_answer.lower()
    
    found_facts = []
    missing_facts = []
    
    for fact in key_facts:
        # Check if fact or close variation is in the answer
        fact_lower = fact.lower()
        if fact_lower in actual_lower:
            found_facts.append(fact)
        else:
            missing_facts.append(fact)
    
    # Calculate precision: what % of key facts were mentioned
    if len(key_facts) > 0:
        precision = len(found_facts) / len(key_facts)
    else:
        precision = 1.0
    
    return precision, found_facts, missing_facts


def evaluate_rag_system():
    """
    Run comprehensive evaluation on RAG system
    """
    print("=" * 100)
    print("RAG SYSTEM COMPREHENSIVE EVALUATION")
    print("=" * 100)
    print(f"\nStarting evaluation at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total questions: {len(EVALUATION_DATASET)}\n")
    
    results = []
    category_stats = {}
    
    for i, test_case in enumerate(EVALUATION_DATASET, 1):
        print(f"\n{'='*100}")
        print(f"Question {i}/{len(EVALUATION_DATASET)} [Category: {test_case['category'].upper()}]")
        print(f"{'='*100}")
        print(f"\n❓ QUESTION: {test_case['question']}")
        print(f"\n📋 EXPECTED: {test_case['expected_answer']}")
        print(f"\n🔑 KEY FACTS: {', '.join(test_case['key_facts'])}")
        
        try:
            # Query the RAG system
            response = generate_response(test_case['question'])
            actual_answer = response.get('answer', '')
            
            print(f"\n🤖 RAG RESPONSE:\n{actual_answer}")
            
            # Calculate scores
            precision, found_facts, missing_facts = calculate_answer_score(
                actual_answer,
                test_case['expected_answer'],
                test_case['key_facts']
            )
            
            weighted_score = precision * test_case['weight']
            
            print(f"\n📊 SCORING:")
            print(f"   ✅ Found Facts ({len(found_facts)}/{len(test_case['key_facts'])}): {', '.join(found_facts) if found_facts else 'None'}")
            print(f"   ❌ Missing Facts ({len(missing_facts)}): {', '.join(missing_facts) if missing_facts else 'None'}")
            print(f"   📈 Precision: {precision:.2%}")
            print(f"   ⚖️  Weighted Score: {weighted_score:.2f}")
            
            # Store results
            result = {
                'id': test_case['id'],
                'category': test_case['category'],
                'question': test_case['question'],
                'expected': test_case['expected_answer'],
                'actual': actual_answer,
                'key_facts': test_case['key_facts'],
                'found_facts': found_facts,
                'missing_facts': missing_facts,
                'precision': precision,
                'weight': test_case['weight'],
                'weighted_score': weighted_score,
                'status': 'PASS' if precision >= 0.6 else 'FAIL'
            }
            results.append(result)
            
            # Update category stats
            if test_case['category'] not in category_stats:
                category_stats[test_case['category']] = {
                    'total': 0,
                    'passed': 0,
                    'total_precision': 0,
                    'total_weight': 0,
                    'total_weighted_score': 0
                }
            
            category_stats[test_case['category']]['total'] += 1
            category_stats[test_case['category']]['total_precision'] += precision
            category_stats[test_case['category']]['total_weight'] += test_case['weight']
            category_stats[test_case['category']]['total_weighted_score'] += weighted_score
            if precision >= 0.6:
                category_stats[test_case['category']]['passed'] += 1
            
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            result = {
                'id': test_case['id'],
                'category': test_case['category'],
                'question': test_case['question'],
                'error': str(e),
                'status': 'ERROR'
            }
            results.append(result)
    
    # Generate final report
    generate_final_report(results, category_stats)
    
    return results, category_stats


def generate_final_report(results: List[Dict], category_stats: Dict):
    """
    Generate comprehensive evaluation report
    """
    print("\n\n")
    print("=" * 100)
    print(" " * 30 + "FINAL EVALUATION REPORT")
    print("=" * 100)
    
    # Overall Statistics
    total_questions = len(results)
    passed = sum(1 for r in results if r.get('status') == 'PASS')
    failed = sum(1 for r in results if r.get('status') == 'FAIL')
    errors = sum(1 for r in results if r.get('status') == 'ERROR')
    
    total_precision = sum(r.get('precision', 0) for r in results if 'precision' in r)
    avg_precision = total_precision / total_questions if total_questions > 0 else 0
    
    total_weighted = sum(r.get('weighted_score', 0) for r in results if 'weighted_score' in r)
    max_weighted = sum(r.get('weight', 0) for r in results if 'weight' in r)
    weighted_accuracy = (total_weighted / max_weighted * 100) if max_weighted > 0 else 0
    
    print(f"\n📊 OVERALL STATISTICS:")
    print(f"   Total Questions: {total_questions}")
    print(f"   ✅ Passed (≥60% precision): {passed} ({passed/total_questions*100:.1f}%)")
    print(f"   ❌ Failed (<60% precision): {failed} ({failed/total_questions*100:.1f}%)")
    print(f"   ⚠️  Errors: {errors}")
    print(f"\n   📈 Average Precision: {avg_precision:.2%}")
    print(f"   ⚖️  Weighted Accuracy: {weighted_accuracy:.2f}%")
    print(f"   🎯 Overall Score: {total_weighted:.2f}/{max_weighted:.2f}")
    
    # Category-wise Statistics
    print(f"\n\n📂 CATEGORY-WISE PERFORMANCE:")
    print(f"{'='*100}")
    print(f"{'Category':<20} {'Questions':<12} {'Passed':<12} {'Pass Rate':<12} {'Avg Precision':<15} {'Weighted Acc'}")
    print(f"{'-'*100}")
    
    for category, stats in sorted(category_stats.items()):
        pass_rate = (stats['passed'] / stats['total'] * 100) if stats['total'] > 0 else 0
        avg_prec = (stats['total_precision'] / stats['total']) if stats['total'] > 0 else 0
        weighted_acc = (stats['total_weighted_score'] / stats['total_weight'] * 100) if stats['total_weight'] > 0 else 0
        
        print(f"{category:<20} {stats['total']:<12} {stats['passed']:<12} {pass_rate:<11.1f}% {avg_prec*100:<14.1f}% {weighted_acc:.1f}%")
    
    # Top Failures
    print(f"\n\n❌ TOP FAILURES (Lowest Precision):")
    print(f"{'='*100}")
    failed_questions = [r for r in results if r.get('precision', 1) < 0.6]
    failed_questions.sort(key=lambda x: x.get('precision', 0))
    
    for i, result in enumerate(failed_questions[:10], 1):
        print(f"\n{i}. [Precision: {result.get('precision', 0):.1%}] {result['question']}")
        print(f"   Missing: {', '.join(result.get('missing_facts', []))}")
    
    # Top Successes
    print(f"\n\n✅ TOP SUCCESSES (Highest Precision):")
    print(f"{'='*100}")
    successful_questions = [r for r in results if r.get('precision', 0) >= 0.9]
    successful_questions.sort(key=lambda x: x.get('precision', 0), reverse=True)
    
    for i, result in enumerate(successful_questions[:10], 1):
        print(f"\n{i}. [Precision: {result.get('precision', 0):.1%}] {result['question']}")
        print(f"   Found: {', '.join(result.get('found_facts', []))}")
    
    # Recommendations
    print(f"\n\n💡 RECOMMENDATIONS:")
    print(f"{'='*100}")
    
    if avg_precision < 0.7:
        print("⚠️  Overall precision is below 70%. Consider:")
        print("   - Improving embedding quality")
        print("   - Increasing chunk overlap")
        print("   - Fine-tuning retrieval parameters")
    
    if weighted_accuracy < 75:
        print("⚠️  Weighted accuracy is below 75%. Focus on:")
        print("   - High-weight categories (work_experience, projects)")
        print("   - Improving context relevance")
    
    worst_category = min(category_stats.items(), key=lambda x: x[1]['total_precision']/x[1]['total'])[0]
    print(f"\n🎯 Focus Area: '{worst_category}' category needs improvement")
    
    print(f"\n{'='*100}")
    print(f"Evaluation completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*100}\n")
    
    # Save detailed JSON report
    save_json_report(results, category_stats, {
        'total': total_questions,
        'passed': passed,
        'failed': failed,
        'errors': errors,
        'avg_precision': avg_precision,
        'weighted_accuracy': weighted_accuracy,
        'total_score': total_weighted,
        'max_score': max_weighted
    })


def save_json_report(results: List[Dict], category_stats: Dict, overall_stats: Dict):
    """Save detailed evaluation report as JSON"""
    report = {
        'timestamp': datetime.now().isoformat(),
        'overall_statistics': overall_stats,
        'category_statistics': category_stats,
        'detailed_results': results
    }
    
    output_file = Path(__file__).parent / f"evaluation_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(output_file, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📁 Detailed JSON report saved to: {output_file}")


if __name__ == "__main__":
    print("\n🚀 Starting RAG System Evaluation...")
    print("This will test 50 recruiter questions against your RAG system.\n")
    
    results, category_stats = evaluate_rag_system()
    
    print("\n✅ Evaluation Complete!")
    print("Check the generated JSON report for detailed results.")

