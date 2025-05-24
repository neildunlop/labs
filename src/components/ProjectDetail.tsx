import React from 'react';
import { Project } from '../types';
import ReactMarkdown from 'react-markdown';
import './ProjectDetail.css';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  return (
    <div className="project-detail">
      <div className="project-header">
        <h1>{project.title}</h1>
        <div className="project-meta">
          <span className="status">{project.status}</span>
          <span className="difficulty">{project.metadata.difficulty}</span>
          <span className="team-size">
            Team: {project.metadata.teamSize.min}-{project.metadata.teamSize.max}
          </span>
          <span className="estimated-time">
            Est. Time: {project.metadata.estimatedTime}
          </span>
        </div>
      </div>

      <div className="project-overview">
        <h2>Overview</h2>
        <p>{project.overview}</p>
      </div>

      <div className="project-objectives">
        <h2>Objectives</h2>
        <ul>
          {project.objectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="project-deliverables">
        <h2>Deliverables</h2>
        <ul>
          {project.deliverables.map((deliverable, index) => (
            <li key={index}>{deliverable}</li>
          ))}
        </ul>
      </div>

      <div className="project-considerations">
        <h2>Considerations</h2>
        <ul>
          {project.considerations.map((consideration, index) => (
            <li key={index}>{consideration}</li>
          ))}
        </ul>
      </div>

      <div className="project-sections">
        {project.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className={`project-section section-${section.type}`}>
              <h2>{section.title}</h2>
              <div className="section-content">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          ))}
      </div>

      <div className="project-tags">
        {project.metadata.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
