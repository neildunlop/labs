import { useState } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'AI-Powered Code Review',
      description: 'An intelligent system that helps developers review code more efficiently using machine learning.',
      status: 'In Progress',
      members: 5,
      technologies: ['Python', 'TensorFlow', 'React'],
    },
    {
      id: 2,
      title: 'Cloud Migration Tool',
      description: 'A comprehensive tool to help organizations migrate their infrastructure to the cloud seamlessly.',
      status: 'Planning',
      members: 3,
      technologies: ['AWS', 'Terraform', 'Go'],
    },
    {
      id: 3,
      title: 'DevOps Dashboard',
      description: 'A unified dashboard for monitoring and managing DevOps pipelines and infrastructure.',
      status: 'Active',
      members: 8,
      technologies: ['React', 'Node.js', 'Docker'],
    },
    {
      id: 4,
      title: 'Security Scanner',
      description: 'Automated security scanning tool for identifying vulnerabilities in code and dependencies.',
      status: 'Planning',
      members: 4,
      technologies: ['Rust', 'React', 'PostgreSQL'],
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="projects-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Our Projects</h1>
          <p className="hero-subtitle">
            Explore our innovative projects and find the perfect opportunity to contribute
            and grow your skills.
          </p>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <div className="projects-header">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search projects..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in progress">In Progress</option>
                <option value="active">Active</option>
              </select>
            </div>
            <Link to="/suggest-project" className="btn btn-primary">Suggest Project</Link>
          </div>

          <div className="project-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="card project-card">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span className="project-status">{project.status}</span>
                  <span className="project-members">{project.members} Members</span>
                </div>
                <div className="project-technologies">
                  {project.technologies.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <Link to={`/projects/${project.id}`} className="btn btn-secondary">View Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects; 