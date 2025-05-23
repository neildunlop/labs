import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { Project } from '../types';
import { getProjects, getProject } from '../api/projects';

// Copy of mapApiProjectToFrontend from admin/Projects.tsx for consistency
function mapApiProjectToFrontend(project: any): Project {
  const meta = project.metadata || {};
  return {
    id: project.id,
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

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
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
    }
    fetchProjects();
  }, []);

  return (
    <section className="projects-section">
      <div className="projects-header-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Projects</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--gray-700)', maxWidth: '900px', margin: '0 auto' }}>
          Explore our current Labs projects and discover what our teams are working on. Whether you want to join an existing project, get inspired by what others are building, or suggest your own idea, there's a place for you in Burendo Labs.<br /><br />
          Browse the list below to find something that sparks your interest, or use the "Suggest an Idea" button to start something new!
        </p>
      </div>
      {loading && <div>Loading projects...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <Routes>
          <Route index element={<ProjectList projects={projects} />} />
          <Route path=":id" element={<ProjectDetailRoute />} />
        </Routes>
      )}
    </section>
  );
};

const ProjectDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProject(id)
      .then((data) => setProject(mapApiProjectToFrontend(data)))
      .catch((err) => setError(err.message || 'Failed to fetch project'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (error || !project) {
    return (
      <div className="hero">
        <h3 className="hero-title">Project Not Found</h3>
        <p className="hero-subtitle">The project you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return <ProjectDetail project={project} />;
}; 