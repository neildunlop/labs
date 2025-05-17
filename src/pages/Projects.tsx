import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { Project } from '../types';
import { mockProjects } from '../data/mockProjects';

export const Projects: React.FC = () => {
  return (
    <section className="projects-section">
      <div className="projects-header-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Projects</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--gray-700)', maxWidth: '900px', margin: '0 auto' }}>
          Explore our current Labs projects and discover what our teams are working on. Whether you want to join an existing project, get inspired by what others are building, or suggest your own idea, there's a place for you in Burendo Labs.<br /><br />
          Browse the list below to find something that sparks your interest, or use the "Suggest an Idea" button to start something new!
        </p>
      </div>
      <Routes>
        <Route index element={<ProjectList projects={mockProjects} />} />
        <Route 
          path=":id" 
          element={<ProjectDetailRoute />} 
        />
      </Routes>
    </section>
  );
};

const ProjectDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = id ? mockProjects.find(p => p.id.toString() === id) : undefined;

  if (!project) {
    return (
      <div className="hero">
        <h3 className="hero-title">Project Not Found</h3>
        <p className="hero-subtitle">The project you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return <ProjectDetail project={project} />;
}; 