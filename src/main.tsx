import './app/styles/index.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app.tsx';

createRoot(document.getElementById('root')!).render(
    <App />
  // <StrictMode>
  // </StrictMode>
);
