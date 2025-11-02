#!/usr/bin/env python3
"""
OpenAI API Key Tester
Tests if an OpenAI API key is valid and working
"""

import os
import sys
from dotenv import load_dotenv

try:
    import openai
except ImportError:
    print("❌ OpenAI package not installed!")
    print("Install it with: pip install openai")
    sys.exit(1)

def test_openai_key(api_key=None):
    """
    Test if an OpenAI API key is valid and working.
    
    Args:
        api_key: OpenAI API key to test. If None, will try to load from environment.
    
    Returns:
        bool: True if key is valid, False otherwise
    """
    # Try to get key from parameter, environment variable, or .env file
    if not api_key:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("❌ No API key provided!")
        print("\nOptions to provide the key:")
        print("1. Set OPENAI_API_KEY environment variable")
        print("2. Add OPENAI_API_KEY to .env file")
        print("3. Pass as argument: python test_openai_key.py YOUR_KEY_HERE")
        return False
    
    print("🔍 Testing OpenAI API Key...")
    print(f"📝 Key preview: {api_key[:8]}...{api_key[-4:]}")
    print("-" * 60)
    
    # Test 1: Key format validation
    print("\n1️⃣ Checking key format...")
    if not api_key.startswith('sk-'):
        print("   ❌ Invalid format! OpenAI keys should start with 'sk-'")
        return False
    print("   ✅ Format looks good")
    
    # Test 2: API connection
    print("\n2️⃣ Testing API connection...")
    try:
        client = openai.OpenAI(api_key=api_key)
        
        # Make a minimal API call to test
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Say 'API key is working!' in one sentence"}
            ],
            max_tokens=20
        )
        
        print("   ✅ API connection successful!")
        
    except openai.AuthenticationError:
        print("   ❌ Authentication failed! Invalid API key.")
        return False
    except openai.RateLimitError:
        print("   ⚠️  Rate limit exceeded! Key is valid but you've hit the rate limit.")
        print("   ✅ This means the key IS working, just needs cooldown")
        return True
    except openai.APIError as e:
        print(f"   ❌ API Error: {str(e)}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {str(e)}")
        return False
    
    # Test 3: Response validation
    print("\n3️⃣ Validating response...")
    try:
        message = response.choices[0].message.content
        print(f"   📨 Response: {message}")
        print("   ✅ Response received successfully!")
    except Exception as e:
        print(f"   ⚠️  Could not parse response: {str(e)}")
        print("   ✅ But API key is valid!")
        return True
    
    # Test 4: Check available models
    print("\n4️⃣ Checking available models...")
    try:
        models = client.models.list()
        model_ids = [model.id for model in models.data]
        print(f"   ✅ Access to {len(model_ids)} models")
        
        # Show some important models
        important_models = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
        available = [m for m in important_models if any(m in mid for mid in model_ids)]
        if available:
            print(f"   📋 Available models: {', '.join(available)}")
    except Exception as e:
        print(f"   ⚠️  Could not fetch models: {str(e)}")
        print("   ✅ But API key is still valid!")
    
    # Final result
    print("\n" + "=" * 60)
    print("✅ SUCCESS! Your OpenAI API key is working perfectly!")
    print("=" * 60)
    
    return True


def main():
    """Main function to run the test"""
    print("=" * 60)
    print("🔑 OpenAI API Key Tester")
    print("=" * 60)
    
    # Check if key was passed as command line argument
    api_key = None
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
        print(f"Using key from command line argument")
    
    # Run the test
    success = test_openai_key(api_key)
    
    if success:
        print("\n✨ Your API key is ready to use!")
        sys.exit(0)
    else:
        print("\n❌ API key test failed. Please check your key and try again.")
        sys.exit(1)


if __name__ == "__main__":
    main()

