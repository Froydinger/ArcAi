import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import netlifyIdentity from 'netlify-identity-widget';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// --- UPDATED: Re-enabled Netlify Identity initialization ---
netlifyIdentity.init({
  APIUrl: 'https://askarc.xyz/.netlify/identity'
});

const applyInitialTheme = () => {
  try {
    const savedSettings = localStorage.getItem('arcana_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.theme) {
        document.documentElement.setAttribute('data-theme', parsed.theme);
      } else {
         document.documentElement.setAttribute('data-theme', 'blue');
      }
    } else {
       document.documentElement.setAttribute('data-theme', 'blue');
    }
  } catch (e) {
    console.error("Failed to apply initial theme:", e);
    document.documentElement.setAttribute('data-theme', 'blue');
  }
};

applyInitialTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Removed splash screen logic

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
