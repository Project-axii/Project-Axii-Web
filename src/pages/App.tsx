import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginScreen from './login';
import Settings from './settings';
import DeviceManagement from './dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/*login*/}
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
        
        {/*Dashboard*/}
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <DeviceManagement />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/*settings*/}
        <Route 
          path="/settings" 
          element={
            isLoggedIn ? (
              <Settings />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Redireciona rotas não encontradas */}
        <Route 
          path="*" 
          element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;