import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import TaskTracker from './components/TaskTracker';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<TaskTracker />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 