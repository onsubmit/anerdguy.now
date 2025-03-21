import './main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="anerdguynow">
      <Routes>
        <Route path="/:file?" element={<App />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
