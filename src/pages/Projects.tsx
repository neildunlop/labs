import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { Project } from '../types';
import { mockProjects } from '../data/mockProjects';

export const Projects: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectList projects={mockProjects} />} />
      <Route 
        path=":id" 
        element={<ProjectDetailRoute />} 
      />
    </Routes>
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