# 🔑 API Key Testing Scripts

## Quick Start

Test your API keys to make sure they work before deploying:

### Test OpenAI API Key
```bash
# Option 1: Using environment variable
export OPENAI_API_KEY="sk-your-key-here"
python test_openai_key.py

# Option 2: Using .env file
echo "OPENAI_API_KEY=sk-your-key-here" >> .env
python test_openai_key.py

# Option 3: Pass directly
python test_openai_key.py sk-your-key-here
```

### Test Gemini API Key
```bash
# Option 1: Using environment variable
export GEMINI_API_KEY="your-key-here"
python test_gemini_key.py

# Option 2: Using .env file
echo "GEMINI_API_KEY=your-key-here" >> .env
python test_gemini_key.py

# Option 3: Pass directly
python test_gemini_key.py your-key-here
```

---

## What Each Script Tests

### OpenAI Script (`test_openai_key.py`)
1. ✅ **Format Validation** - Checks if key starts with 'sk-'
2. ✅ **API Connection** - Attempts to connect to OpenAI
3. ✅ **Response Validation** - Makes a test completion request
4. ✅ **Model Access** - Lists available models (GPT-4, GPT-3.5, etc.)

### Gemini Script (`test_gemini_key.py`)
1. ✅ **Format Validation** - Checks key length
2. ✅ **API Configuration** - Configures the Gemini client
3. ✅ **Model Listing** - Lists available Gemini models
4. ✅ **Content Generation** - Tests actual generation
5. ✅ **Metadata Check** - Validates token usage info

---

## Expected Output

### ✅ Success
```
🔑 Gemini API Key Tester
============================================================
🔍 Testing Gemini API Key...
📝 Key preview: AIzaSyAq...H4M
------------------------------------------------------------

1️⃣ Checking key format...
   ✅ Format check passed

2️⃣ Configuring Gemini API...
   ✅ Configuration successful

3️⃣ Checking available models...
   ✅ Found 15 available models
   📋 Gemini models: 8 available

4️⃣ Testing content generation...
   ✅ Content generation successful!
   📨 Response: API key is working!

============================================================
✅ SUCCESS! Your Gemini API key is working perfectly!
============================================================
```

### ❌ Failure
```
❌ Authentication failed! Invalid API key.
```

---

## Common Issues

### "Package not installed"
```bash
pip install openai
# or
pip install google-generativeai
```

### "No API key provided"
Make sure you've set the environment variable or created a .env file.

### "Rate limit exceeded"
Your key is valid but you've hit usage limits. Wait a bit and try again.

---

## Use Before Deployment

**Always test your API keys before deploying to production!**

This prevents:
- ❌ Failed deployments
- ❌ Runtime errors
- ❌ Wasted time debugging
- ❌ Embarrassing "API key invalid" errors

Run these scripts as part of your deployment checklist! ✅

