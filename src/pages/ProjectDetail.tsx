import { useParams, Link } from 'react-router-dom';

// Temporary mock data - this would come from an API in a real application
const mockProject = {
  id: 1,
  title: 'AI-Powered Code Review',
  description: 'Building an AI system to automate code review processes and improve code quality.',
  status: 'Active',
  tags: ['AI', 'Code Quality', 'Automation'],
  objectives: [
    'Develop an AI model to analyze code quality',
    'Create an automated review system',
    'Integrate with existing CI/CD pipelines',
  ],
  team: [
    { name: 'John Doe', role: 'Lead Developer' },
    { name: 'Jane Smith', role: 'AI Engineer' },
    { name: 'Mike Johnson', role: 'DevOps Engineer' },
  ],
  timeline: '3-4 months',
  technologies: ['Python', 'TensorFlow', 'Docker', 'Kubernetes'],
};

const ProjectDetail = () => {
  const { id } = useParams();
  // In a real application, we would fetch the project data based on the ID
  const project = mockProject;

  return (
    <div className="project-detail container">
      <div className="project-detail-header">
        <div className="project-detail-header-content">
          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-description">{project.description}</p>
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
            <ul className="project-detail-list">
              {project.objectives.map((objective, index) => (
                <li key={index} className="project-detail-list-item">
                  {objective}
                </li>
              ))}
            </ul>
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