import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ChatProvider } from './components/ChatContext';
import ErrorBoundary from './components/ErrorBoundary';

// Force scroll to top before React renders
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Disable scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
