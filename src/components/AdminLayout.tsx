import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2 className="admin-title">Admin Panel</h2>
        <nav className="admin-nav">
          <Link to="/admin/users" className="admin-nav-link">
            Users
          </Link>
          <Link to="/admin/projects" className="admin-nav-link">
            Projects
          </Link>
          <Link to="/admin/assignments" className="admin-nav-link">
            Assignments
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}; 