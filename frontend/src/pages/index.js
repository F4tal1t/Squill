import { useState } from 'react';
import Login from './login';
import DemoIntegrated from './demo-integrated';


export default function Home() {
  const [user, setUser] = useState(null);

  const handleLogin = (email) => {
    setUser(email);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <DemoIntegrated user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}