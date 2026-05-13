import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import Home from './pages/Home.jsx';
import Authorize from './pages/Authorize.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      {/* <App /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authorize" element={<Authorize />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
