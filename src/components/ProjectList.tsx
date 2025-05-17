import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { Link } from 'react-router-dom';

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    difficulty: 'all',
    search: '',
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesType = filters.type === 'all' || project.metadata.type === filters.type;
      const matchesDifficulty = filters.difficulty === 'all' || project.metadata.difficulty === filters.difficulty;
      const matchesSearch = project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          project.overview.toLowerCase().includes(filters.search.toLowerCase()) ||
                          project.metadata.tags.some((tag: string) => tag.toLowerCase().includes(filters.search.toLowerCase()));

      return matchesStatus && matchesType && matchesDifficulty && matchesSearch;
    });
  }, [projects, filters]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.metadata.type)));
  }, [projects]);

  return (
    <div className="projects-section">
      <div className="search-filter">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="search">Search Projects</label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
              placeholder="Search by title, description, or tags..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="status-filter"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="status-filter"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="project-grid">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="hero">
          <h3 className="hero-title">No projects found</h3>
          <p className="hero-subtitle">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}; 