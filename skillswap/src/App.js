import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home';
import Register from './pages/register';
import SkillPage from './pages/skillPage';
import { ProfileProvider } from './profileContext';
import './App.css';
import Header from './components/header';
import SessionPage from './pages/sessionPage';
import ProfilePage from './pages/profile';

function App() {
  return (
    <ProfileProvider>
      <div>
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/skill/:skillId" element={<SkillPage />} />
            <Route path="/session/:sessionId" element={<SessionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </ProfileProvider>
  );
}

export default App;
