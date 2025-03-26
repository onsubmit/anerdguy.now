import './main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter, Route, Routes } from 'react-router';

import { App } from './App';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path="/:file?" element={<App />}></Route>
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>,
);
