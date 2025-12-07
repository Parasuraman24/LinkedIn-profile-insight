import { useState, useEffect } from 'react';
import { LoginView } from './components/LoginView';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string, headline: string } | null>(null);

  // Check auth state on load
  useEffect(() => {
    chrome.storage?.local.get(['authToken', 'userProfile'], (result) => {
      if (result.authToken && result.userProfile) {
        setIsAuthenticated(true);
        setUser(result.userProfile as { name: string, headline: string });
      }
    });
  }, []);

  const handleLogin = () => {
    // Determine backend URL (localhost for now)
    const BACKEND_URL = 'http://localhost:3000/auth/linkedin';

    // Open auth in new tab
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url: BACKEND_URL });
    } else {
      window.open(BACKEND_URL, '_blank');
    }
  };

  const handleLogout = () => {
    chrome.storage?.local.clear(() => {
      setIsAuthenticated(false);
      setUser(null);
    });
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      user={user || { name: 'Guest', headline: 'Welcome' }}
      onLogout={handleLogout}
    />
  );
}

export default App;
