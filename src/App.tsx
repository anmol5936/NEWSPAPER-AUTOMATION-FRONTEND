import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { DelivererDashboard } from './pages/DelivererDashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={
              !user ? (
                <Login />
              ) : (
                <Navigate 
                  to={user.role === 'manager' ? '/manager' : '/deliverer'} 
                  replace 
                />
              )
            } 
          />
          <Route 
            path="/manager" 
            element={
              user?.role === 'manager' ? (
                <ManagerDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/deliverer" 
            element={
              user?.role === 'deliverer' ? (
                <DelivererDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;