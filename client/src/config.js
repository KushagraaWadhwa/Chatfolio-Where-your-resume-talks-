/**
 * Application configuration
 * 
 * This file contains environment-specific configuration settings
 * for the Chatfolio application.
 */

// Get the current environment
const ENV = import.meta.env.MODE || 'development';

// Try to get API URL from environment variables
const envApiUrl = import.meta.env.VITE_API_URL;

// Configuration for different environments
const config = {
  development: {
    apiBaseUrl: envApiUrl || 'http://localhost:8083',
  },
  production: {
    // Backend URL - MUST be set via Vercel environment variable (VITE_API_URL)
    // Set this in your Vercel frontend project settings to your Docker backend URL
    // e.g., https://chatfolio.onrender.com or https://chatfolio.fly.dev
    apiBaseUrl: envApiUrl || 'http://localhost:8083',
  },
  // You can add more environments like 'staging' if needed
};

// Export the configuration for the current environment
export default config[ENV] || config.development;
