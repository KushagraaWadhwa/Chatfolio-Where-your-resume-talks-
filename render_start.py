import os
import uvicorn
from main import app

if __name__ == "__main__":
    # Get port from environment variable for Render deployment
    port = int(os.getenv("PORT", 10000))
    print(f"Starting server on port {port}")
    # Explicitly bind to 0.0.0.0 and the PORT specified by Render
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
