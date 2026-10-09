import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './theme/ThemeContext';
import './theme/theme.css';
import { svgLoader } from './services/mascot/svgLoader';
import { PRISMA_ANIMATIONS } from './services/mascot/animationRegistry';

// Preload canonical idle mascot immediately
if (typeof window !== 'undefined') {
  svgLoader.loadSvg(PRISMA_ANIMATIONS.idle.svgPath);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

