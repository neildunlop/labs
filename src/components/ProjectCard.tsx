import React from 'react';
import { Project } from '../types';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <h2 className="project-title">
        {project.title}
      </h2>
      
      <p className="project-description">{project.overview}</p>
      
      <div className="project-meta">
        <span className={`project-status ${
          project.status === 'active' ? 'status-active' :
          project.status === 'draft' ? 'status-draft' :
          project.status === 'completed' ? 'status-completed' :
          'status-archived'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <span className="tech-tag">
          {project.metadata.difficulty.charAt(0).toUpperCase() + project.metadata.difficulty.slice(1)}
        </span>
      </div>
      
      <div className="project-tags">
        {project.metadata.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="project-tag"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="project-actions">
        <Link to={`/projects/${project.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}; 