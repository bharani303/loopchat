import { useState } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ChatApp from './pages/ChatApp';
import CreateAccount from './pages/CreateAccount';

export default function App() {
  const [route, setRoute] = useState('landing');
  
  if (route === 'login') return <Login onLogin={() => setRoute('chat')} onBack={() => setRoute('landing')} onCreateAccount={() => setRoute('create')} />;
  if (route === 'create') return <CreateAccount onRegister={() => setRoute('chat')} onBack={() => setRoute('login')} />;
  if (route === 'chat') return <ChatApp onLogout={() => setRoute('landing')} />;
  return <Landing onNavigate={setRoute} />;
}
