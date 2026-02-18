import './app/styles/index.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app.tsx';

const bootstrap = async (): Promise<void> => {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

bootstrap();
