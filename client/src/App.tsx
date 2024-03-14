import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegistrationPage from './pages/Auth/RegistrationPage';
import AddProductPage from './pages/Invoice/AddProductPage';
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/register" element={<RegistrationPage />} />
  <Route path="/add-product" element={<AddProductPage />} />
</Routes>
    </Router>
  );
};

export default App;
