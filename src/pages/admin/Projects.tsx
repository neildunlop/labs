import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { mockProjects } from '../../data/mockProjects';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit as FaEditIcon, FaTrash as FaTrashIcon } from 'react-icons/fa';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-page-title">Manage Projects</h1>
        <Link to="/admin/projects/new" className="btn btn-primary">
          Create New Project
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Difficulty</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  <span className="tech-tag">
                    {project.metadata.type.charAt(0).toUpperCase() + project.metadata.type.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`project-status status-${project.status}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
                <td>
                  <span className={`pill pill-difficulty pill-difficulty-${project.metadata.difficulty.toLowerCase()}`}>{project.metadata.difficulty}</span>
                </td>
                <td>{new Date(project.created_at).toLocaleDateString()}</td>
                <td>{new Date(project.updated_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary icon-btn"
                    onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                    aria-label="Edit Project"
                    title="Edit Project"
                  >
                    {FaEditIcon({})}
                  </button>
                  <button
                    className="btn btn-small btn-danger icon-btn"
                    onClick={() => handleDelete(project.id)}
                    aria-label="Delete Project"
                    title="Delete Project"
                  >
                    {FaTrashIcon({})}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 