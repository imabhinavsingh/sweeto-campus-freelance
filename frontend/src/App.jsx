import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyNavbar from './components/Navbar'; 
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import Profile from './pages/Profile'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div>
      <MyNavbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;