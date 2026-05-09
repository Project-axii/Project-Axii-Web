import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginScreen from './login';
import Settings from './settings';
import DeviceManagement from './home';
import RegisterScreen from './register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginScreen onLogin={() => setIsLoggedIn(true)} />
            )
          } 
        />
        
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <DeviceManagement onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            isLoggedIn ? (
              <Settings onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/register" 
          element={
            isLoggedIn ? (
              <DeviceManagement onLogout={handleLogout} />
            ) : (
              <RegisterScreen/>
            )
          } 
        />

        <Route 
          path="*" 
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;