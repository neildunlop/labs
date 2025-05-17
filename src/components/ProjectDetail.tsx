import React from 'react';
import { Project, Deliverable, ChallengeSection, TechStack } from '../types';

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <div className="project-detail-header-content">
          <h1 className="project-detail-title">{project.title}</h1>
          <div className="project-detail-status-info">
            <span className="project-detail-status-label">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {project.metadata.estimatedTime}
            </span>
            <span className="project-detail-status-label">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {project.metadata.teamSize.min}-{project.metadata.teamSize.max} people
            </span>
            <span className="tech-tag">
              {project.metadata.difficulty.charAt(0).toUpperCase() + project.metadata.difficulty.slice(1)}
            </span>
          </div>
        </div>
        <span className={`project-status ${
          project.status === 'active' ? 'status-active' :
          project.status === 'draft' ? 'status-draft' :
          project.status === 'completed' ? 'status-completed' :
          'status-archived'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>

      <div className="project-detail-tags">
        {project.metadata.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="tech-tag"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Overview</h2>
        <p className="project-detail-description">{project.overview}</p>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Objectives</h2>
        <ul className="project-detail-list">
          {project.objectives.map((objective: string, index: number) => (
            <li key={index} className="project-detail-list-item">{objective}</li>
          ))}
        </ul>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Deliverables</h2>
        <div className="project-detail-grid">
          {project.deliverables.map((deliverable: Deliverable) => (
            <div key={deliverable.id} className="card">
              <h3 className="project-title">{deliverable.title}</h3>
              <p className="project-description">{deliverable.description}</p>
              <div className="project-technologies">
                <span className="tech-tag">
                  {deliverable.type}
                </span>
              </div>
              {deliverable.requirements.length > 0 && (
                <div className="project-detail-section">
                  <h4 className="project-detail-section-title">Requirements:</h4>
                  <ul className="project-detail-list">
                    {deliverable.requirements.map((req: string, index: number) => (
                      <li key={index} className="project-detail-list-item">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Tech Stack</h2>
        <div className="project-detail-grid">
          {(Object.entries(project.techStack) as [keyof TechStack, string[]][]).map(([category, items]) => (
            items && items.length > 0 && (
              <div key={category} className="card">
                <h3 className="project-title capitalize">{category}</h3>
                <ul className="project-detail-list">
                  {items.map((item: string, index: number) => (
                    <li key={index} className="project-detail-list-item">{item}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="project-detail-section">
        {(Object.entries(project.sections) as [string, ChallengeSection][]).map(([key, section]) => (
          <div key={key}>
            <h2 className="project-detail-section-title">{section.title}</h2>
            <div className="project-detail-description">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Things to Think About</h2>
        <ul className="project-detail-list">
          {project.considerations.map((consideration: string, index: number) => (
            <li key={index} className="project-detail-list-item">{consideration}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 