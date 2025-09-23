import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Account from './components/Account';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Account />
  </StrictMode>
);
