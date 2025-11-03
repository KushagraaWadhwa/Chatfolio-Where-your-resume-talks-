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
    // Your Railway backend URL
    apiBaseUrl: envApiUrl || 'https://web-production-e20d.up.railway.app',
  },
  // You can add more environments like 'staging' if needed
};

// Export the configuration for the current environment
export default config[ENV] || config.development;
