import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { AuthUser } from './services/types';
import { getCurrentUser, useAuth, AuthProvider } from './services/auth';
import { AdminLayout } from './components/AdminLayout';
import { AdminUsers } from './pages/admin/Users';
import { AdminProjects } from './pages/admin/Projects';
import { AdminProjectForm } from './pages/admin/AdminProjectForm';
import { AdminUserForm } from './pages/admin/AdminUserForm';
import { AdminAssignments } from './pages/admin/Assignments';
import { AdminAssignmentForm } from './pages/admin/AdminAssignmentForm';
import Home from './pages/Home';
import About from './pages/About';
import Landing from './pages/Landing';
import { Projects } from './pages/Projects';
import SignUp from './pages/SignUp';
import SuggestProject from './pages/SuggestProject';
import './styles/admin.css';
import './App.css';

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (location.pathname === '/') {
      root.classList.add('no-root-padding');
      document.body.classList.add('landing-bg');
    } else {
      root.classList.remove('no-root-padding');
      document.body.classList.remove('landing-bg');
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state and navigate even if Amplify signOut fails
      setUser(null);
      navigate('/');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't show navbar on the landing page
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar user={user} onSignOut={handleSignOut} />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={<Landing />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/projects" /> : <Auth onAuth={setUser} />}
          />
          <Route
            path="/projects/*"
            element={user ? <Projects /> : <Navigate to="/auth" />}
          />
          <Route
            path="/suggest-project"
            element={user ? <SuggestProject /> : <Navigate to="/auth" />}
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={user?.role === 'admin' ? <AdminLayout user={user} /> : <Navigate to="/" />}
          >
            <Route
              index
              element={<Navigate to="users" replace />}
            />
            <Route
              path="users"
              element={<AdminUsers />}
            />
            <Route path="projects">
              <Route index element={<AdminProjects />} />
              <Route path="new" element={<AdminProjectForm />} />
              <Route path=":id/edit" element={<AdminProjectForm />} />
            </Route>
            <Route
              path="assignments"
              element={<AdminAssignments />}
            />
          </Route>
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/projects/new" element={<AdminProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/new" element={<AdminUserForm />} />
          <Route path="/admin/users/:id/edit" element={<AdminUserForm />} />
          <Route path="/admin/assignments" element={<AdminAssignments />} />
          <Route path="/admin/assignments/new" element={<AdminAssignmentForm />} />
          <Route path="/admin/assignments/:id/edit" element={<AdminAssignmentForm />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
