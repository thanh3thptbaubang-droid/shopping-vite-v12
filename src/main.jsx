import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RegisterSeller from './pages/RegisterSeller';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import Wallet from './pages/Wallet';
import './index.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/register-seller' element={<RegisterSeller />} />
      <Route path='/admin' element={<AdminPanel />} />
      <Route path='/admin/overview' element={<Dashboard />} />
      <Route path='/wallet' element={<Wallet />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  </BrowserRouter>
);