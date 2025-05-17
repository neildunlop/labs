import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { getProjects, deleteProject } from '../../api/projects';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit as FaEditIcon, FaTrash as FaTrashIcon } from 'react-icons/fa';

function isModernMetadata(meta: any): meta is { type: string; difficulty: string } {
  return (
    meta &&
    typeof meta === 'object' &&
    typeof meta.type === 'string' &&
    typeof meta.difficulty === 'string'
  );
}

function mapApiProjectToFrontend(project: any): Project {
  // Defensive mapping for all required fields
  const meta = project.metadata || {};
  // Only include type/difficulty if they exist, otherwise fallback to empty string/default
  return {
    id: typeof project.id === 'string' ? parseInt(project.id, 10) : project.id,
    title: project.title || '',
    overview: project.overview || '',
    status: project.status || 'draft',
    created_at: project.created_at || project.createdAt || '',
    updated_at: project.updated_at || project.updatedAt || '',
    objectives: Array.isArray(project.objectives) ? project.objectives : [],
    deliverables: Array.isArray(project.deliverables) ? project.deliverables : [],
    considerations: Array.isArray(project.considerations) ? project.considerations : [],
    techStack: project.techStack || {
      frontend: [], backend: [], database: [], infrastructure: [], tools: [], other: []
    },
    metadata: {
      ...(typeof meta === 'object' ? meta : {}),
      type: typeof meta.type === 'string' ? meta.type : '',
      estimatedTime: typeof meta.estimatedTime === 'string' ? meta.estimatedTime : '',
      teamSize: meta.teamSize || { min: 1, max: 1 },
      difficulty: typeof meta.difficulty === 'string' ? meta.difficulty : 'beginner',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
    },
    sections: project.sections || {},
  };
}

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data.map(mapApiProjectToFrontend) : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    setDeletingId(projectId);
    setError(null);
    try {
      await deleteProject(projectId.toString());
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeletingId(null);
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

      {loading && <div className="admin-loading">Loading projects...</div>}
      {error && <div className="admin-error">{error}</div>}

      {!loading && !error && (
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
                      {isModernMetadata(project.metadata)
                        ? project.metadata.type.charAt(0).toUpperCase() + project.metadata.type.slice(1)
                        : ''}
                    </span>
                  </td>
                  <td>
                    <span className={`project-status status-${project.status}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`pill pill-difficulty pill-difficulty-${isModernMetadata(project.metadata) ? project.metadata.difficulty.toLowerCase() : 'beginner'}`}>{isModernMetadata(project.metadata) ? project.metadata.difficulty : 'beginner'}</span>
                  </td>
                  <td>{project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}</td>
                  <td>{project.updated_at ? new Date(project.updated_at).toLocaleDateString() : ''}</td>
                  <td>
                    <button
                      className="btn btn-small btn-secondary icon-btn"
                      onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                      aria-label="Edit Project"
                      title="Edit Project"
                    >
                      {FaEditIcon({}) as JSX.Element}
                    </button>
                    <button
                      className="btn btn-small btn-danger icon-btn"
                      onClick={() => handleDelete(project.id)}
                      aria-label="Delete Project"
                      title="Delete Project"
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? '...' : (FaTrashIcon({}) as JSX.Element)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 