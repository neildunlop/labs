import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { AuthUser } from './services/types';
import { getCurrentUser, useAuth, AuthProvider } from './services/auth';
import { AdminLayout } from './components/AdminLayout';
import { AdminUsers } from './pages/admin/Users';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import SuggestProject from './pages/SuggestProject';
import ProjectDetail from './pages/ProjectDetail';
import './styles/admin.css';

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onSignOut={handleSignOut} />
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
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                path="users"
                element={<AdminUsers />}
              />
              {/* Add more admin routes here */}
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
