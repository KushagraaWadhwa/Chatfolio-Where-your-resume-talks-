"""
Vercel serverless function entry point for FastAPI
"""
import sys
from pathlib import Path

# Add parent directory to path so we can import main
sys.path.append(str(Path(__file__).parent.parent))

from main import app

# Vercel requires the app to be named 'app' or exported as handler
handler = app

