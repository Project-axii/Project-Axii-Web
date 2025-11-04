import { useState } from 'react';
import LoginScreen from './login';
import DeviceManagement from './dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <DeviceManagement />
      )}
    </>
  );
}

export default App;