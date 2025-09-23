import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Leader from './components/Leader';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Leader />
  </StrictMode>
);
