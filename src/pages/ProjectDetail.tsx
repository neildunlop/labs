import { useParams, Link } from 'react-router-dom';
import { MDXEditor } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { useEffect, useState } from 'react';
import { getProject } from '../api/projects';
import type { Project } from '../api/projects';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="project-detail container">Loading...</div>;
  }

  if (error || !project) {
    return <div className="project-detail container">Error: {error || 'Project not found'}</div>;
  }

  return (
    <div className="project-detail container">
      <div className="project-detail-header">
        <div className="project-detail-header-content">
          <h1 className="project-detail-title">{project.title}</h1>
          <div className="project-detail-description markdown-content">
            <MDXEditor
              markdown={project.description}
              readOnly={true}
              contentEditableClassName="mdx-editor-readonly"
            />
          </div>
        </div>
        <Link to="/signup" className="btn btn-primary">
          Join Project
        </Link>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Project Details</h2>
        <div className="project-detail-grid">
          <div>
            <h3 className="project-detail-section-title">Objectives</h3>
            <div className="markdown-content">
              <MDXEditor
                markdown={project.objectives.join('\n\n')}
                readOnly={true}
                contentEditableClassName="mdx-editor-readonly"
              />
            </div>
          </div>
          <div>
            <h3 className="project-detail-section-title">Technologies</h3>
            <div className="project-detail-tags">
              {project.technologies.map((tech) => (
                <span key={tech} className="project-detail-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Team</h2>
        <div className="project-detail-team-grid">
          {project.team.map((member) => (
            <div key={member.name} className="project-detail-team-member">
              <h3 className="project-detail-team-member-name">{member.name}</h3>
              <p className="project-detail-team-member-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="project-detail-section">
        <h2 className="project-detail-section-title">Project Status</h2>
        <div className="project-detail-status">
          <div className="project-detail-status-info">
            <span className="project-detail-status-label">{project.status}</span>
            <p className="project-detail-timeline">Timeline: {project.timeline}</p>
          </div>
          <div className="project-detail-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-detail-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 