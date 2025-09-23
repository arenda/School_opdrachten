import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Info from './components/Info';
import './components/css/info.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Info />
  </StrictMode>
);