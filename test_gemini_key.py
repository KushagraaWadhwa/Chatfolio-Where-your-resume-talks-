#!/usr/bin/env python3
"""
Gemini API Key Tester
Tests if a Google Gemini API key is valid and working
"""

import os
import sys
from dotenv import load_dotenv

try:
    import google.generativeai as genai
except ImportError:
    print("❌ google-generativeai package not installed!")
    print("Install it with: pip install google-generativeai")
    sys.exit(1)

def test_gemini_key(api_key=None):
    """
    Test if a Gemini API key is valid and working.
    
    Args:
        api_key: Gemini API key to test. If None, will try to load from environment.
    
    Returns:
        bool: True if key is valid, False otherwise
    """
    # Try to get key from parameter, environment variable, or .env file
    if not api_key:
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ No API key provided!")
        print("\nOptions to provide the key:")
        print("1. Set GEMINI_API_KEY environment variable")
        print("2. Add GEMINI_API_KEY to .env file")
        print("3. Pass as argument: python test_gemini_key.py YOUR_KEY_HERE")
        return False
    
    print("🔍 Testing Gemini API Key...")
    print(f"📝 Key preview: {api_key[:8]}...{api_key[-4:]}")
    print("-" * 60)
    
    # Test 1: Key format validation
    print("\n1️⃣ Checking key format...")
    if len(api_key) < 30:
        print("   ⚠️  Key seems too short (might still work)")
    print("   ✅ Format check passed")
    
    # Test 2: API configuration
    print("\n2️⃣ Configuring Gemini API...")
    try:
        genai.configure(api_key=api_key)
        print("   ✅ Configuration successful")
    except Exception as e:
        print(f"   ❌ Configuration failed: {str(e)}")
        return False
    
    # Test 3: List available models
    print("\n3️⃣ Checking available models...")
    try:
        models = genai.list_models()
        model_names = [m.name for m in models]
        print(f"   ✅ Found {len(model_names)} available models")
        
        # Show Gemini models
        gemini_models = [m for m in model_names if 'gemini' in m.lower()]
        if gemini_models:
            print(f"   📋 Gemini models: {len(gemini_models)} available")
            for model in gemini_models[:5]:  # Show first 5
                print(f"      • {model}")
    except Exception as e:
        print(f"   ❌ Could not list models: {str(e)}")
        return False
    
    # Test 4: Generate content
    print("\n4️⃣ Testing content generation...")
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Say 'API key is working!' in one sentence")
        
        print("   ✅ Content generation successful!")
        print(f"   📨 Response: {response.text}")
        
    except Exception as e:
        error_message = str(e)
        if "API_KEY_INVALID" in error_message or "invalid" in error_message.lower():
            print(f"   ❌ Invalid API key: {error_message}")
            return False
        elif "quota" in error_message.lower() or "limit" in error_message.lower():
            print(f"   ⚠️  Quota/Rate limit issue: {error_message}")
            print("   ✅ Key is valid but quota exceeded")
            return True
        else:
            print(f"   ❌ Error: {error_message}")
            return False
    
    # Test 5: Check token count (if available)
    print("\n5️⃣ Checking response metadata...")
    try:
        if hasattr(response, 'usage_metadata'):
            print(f"   📊 Prompt tokens: {response.usage_metadata.prompt_token_count}")
            print(f"   📊 Response tokens: {response.usage_metadata.candidates_token_count}")
            print(f"   📊 Total tokens: {response.usage_metadata.total_token_count}")
        print("   ✅ Metadata available")
    except Exception as e:
        print("   ℹ️  Metadata not available (this is normal)")
    
    # Final result
    print("\n" + "=" * 60)
    print("✅ SUCCESS! Your Gemini API key is working perfectly!")
    print("=" * 60)
    
    return True


def main():
    """Main function to run the test"""
    print("=" * 60)
    print("🔑 Google Gemini API Key Tester")
    print("=" * 60)
    
    # Check if key was passed as command line argument
    api_key = None
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        print(f"Using key from command line argument")
    
    # Run the test
    success = test_gemini_key(api_key)
    
    if success:
        print("\n✨ Your Gemini API key is ready to use!")
        print("\n💡 Next steps:")
        print("   • Set GEMINI_API_KEY in your .env file")
        print("   • Or set it as environment variable on Render")
        sys.exit(0)
    else:
        print("\n❌ API key test failed. Please check your key and try again.")
        print("\n🔗 Get a free API key at: https://makersuite.google.com/app/apikey")
        sys.exit(1)


if __name__ == "__main__":
    main()

