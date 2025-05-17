import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { AuthUser } from './services/auth';
import { getCurrentUser } from './services/auth';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import SuggestProject from './pages/SuggestProject';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Only log the error if it's not an unauthenticated error
        if (!(error instanceof Error && error.message.includes('User needs to be authenticated'))) {
          console.error('Error initializing auth:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onSignOut={() => setUser(null)} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/projects" /> : <Auth onAuth={setUser} />}
            />
            <Route
              path="/projects"
              element={user ? <Projects /> : <Navigate to="/" />}
            />
            <Route
              path="/projects/:id"
              element={user ? <ProjectDetail /> : <Navigate to="/" />}
            />
            <Route
              path="/suggest-project"
              element={user ? <SuggestProject /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
