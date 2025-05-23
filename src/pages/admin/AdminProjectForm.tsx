import React, { useState, useEffect } from 'react';
import { Project, Deliverable, TechStack } from '../../types';
import { getProjects, createProject, updateProject, getProject } from '../../api/projects';
import { useNavigate, useParams } from 'react-router-dom';

interface ProjectFormData {
  title: string;
  overview: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  objectives: string[];
  deliverables: Deliverable[];
  considerations: string[];
  techStack: TechStack;
  metadata: {
    type: 'website' | 'ai';
    estimatedTime: string;
    teamSize: {
      min: number;
      max: number;
    };
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  };
  sections: Record<string, {
    title: string;
    content: string;
  }>;
}

const initialFormData: ProjectFormData = {
  title: '',
  overview: '',
  status: 'draft',
  objectives: [''],
  deliverables: [{
    id: 1,
    title: '',
    description: '',
    type: 'code',
    requirements: ['']
  }],
  considerations: [''],
  techStack: {
    frontend: [''],
    backend: [''],
    database: [''],
    infrastructure: [''],
    tools: [''],
    other: [''],
  },
  metadata: {
    type: 'website',
    estimatedTime: '',
    teamSize: {
      min: 1,
      max: 1
    },
    difficulty: 'intermediate',
    tags: ['']
  },
  sections: {
    publicFeatures: {
      title: 'Public Features',
      content: ''
    }
  }
};

function mapFormDataToProject(formData: ProjectFormData): any {
  // Map form data to backend Project type, filling in required fields
  return {
    ...formData,
    description: formData.overview, // Use overview as description for now
    tags: formData.metadata.tags || [],
    team: [], // You can add a team field in the UI if needed
    timeline: formData.metadata.estimatedTime || '',
    technologies: [
      ...(formData.techStack.frontend || []),
      ...(formData.techStack.backend || []),
      ...(formData.techStack.database || []),
      ...(formData.techStack.infrastructure || []),
      ...(formData.techStack.tools || []),
      ...(formData.techStack.other || [])
    ],
    createdAt: undefined,
    updatedAt: undefined,
  };
}

function isValidMetadata(meta: any): meta is ProjectFormData['metadata'] {
  return (
    meta &&
    typeof meta === 'object' &&
    typeof meta.type === 'string' &&
    typeof meta.estimatedTime === 'string' &&
    typeof meta.teamSize === 'object' &&
    typeof meta.difficulty === 'string' &&
    Array.isArray(meta.tags)
  );
}

function mapApiProjectToFormData(project: any): ProjectFormData {
  return {
    title: project.title || '',
    overview: project.overview || project.description || '',
    status: project.status || 'draft',
    objectives: Array.isArray(project.objectives) ? project.objectives : [],
    deliverables: Array.isArray(project.deliverables)
      ? project.deliverables.map((d: any, idx: number) => ({
          id: d.id ?? idx + 1,
          title: d.title ?? '',
          description: d.description ?? '',
          type: d.type ?? 'code',
          requirements: d.requirements ?? []
        }))
      : [],
    considerations: Array.isArray(project.considerations) ? project.considerations : [],
    techStack: project.techStack || {
      frontend: [], backend: [], database: [], infrastructure: [], tools: [], other: []
    },
    metadata: isValidMetadata(project.metadata)
      ? project.metadata
      : initialFormData.metadata,
    sections: project.sections || {},
  };
}

export const AdminProjectForm: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'tech' | 'sections'>('basic');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // Fetch the project from the API for editing
      (async () => {
        try {
          const project = await getProject(id);
          setFormData(mapApiProjectToFormData(project));
        } catch (error) {
          setError('Failed to load project for editing');
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const mapped = mapFormDataToProject(formData);
      if (id) {
        // Update existing project
        await updateProject(id, mapped);
      } else {
        // Create new project
        await createProject(mapped);
      }
      navigate('/admin/projects');
    } catch (error: any) {
      setError(error.message || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayInput = (
    array: string[],
    index: number,
    value: string,
    setter: (newArray: string[]) => void
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (array: string[], setter: (newArray: string[]) => void) => {
    setter([...array, '']);
  };

  const removeArrayItem = (array: string[], index: number, setter: (newArray: string[]) => void) => {
    setter(array.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-page-title">{id ? 'Edit Project' : 'Create New Project'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/admin/projects')}
        >
          Back to Projects
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            Tech Stack
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
            onClick={() => setActiveTab('sections')}
          >
            Sections
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'basic' && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="overview">Overview</label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.metadata.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, type: e.target.value as 'website' | 'ai' }
                  })}
                  required
                >
                  <option value="website">Website</option>
                  <option value="ai">AI</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.metadata.difficulty}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }
                  })}
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input
                  type="text"
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.metadata.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, estimatedTime: e.target.value } })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Team Size</label>
                <div className="form-row">
                  <input
                    type="number"
                    name="teamSize.min"
                    value={formData.metadata.teamSize.min}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, teamSize: { ...formData.metadata.teamSize, min: Number(e.target.value) } }
                    })}
                    min="1"
                    required
                  />
                  <span>to</span>
                  <input
                    type="number"
                    name="teamSize.max"
                    value={formData.metadata.teamSize.max}
                    onChange={(e) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, teamSize: { ...formData.metadata.teamSize, max: Number(e.target.value) } }
                    })}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="form-section">
              <div className="form-group">
                <label>Frontend Technologies</label>
                <div className="array-input-group">
                  {(formData.techStack.frontend || []).map((tech, index) => (
                    <div key={index} className="form-row">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => {
                          const newItems = [...(formData.techStack.frontend || [])];
                          newItems[index] = e.target.value;
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, frontend: newItems }
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newItems = (formData.techStack.frontend || []).filter((_: string, i: number) => i !== index);
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, frontend: newItems }
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => setFormData({
                      ...formData,
                      techStack: { ...formData.techStack, frontend: [...(formData.techStack.frontend || []), ''] }
                    })}
                  >
                    Add Frontend Tech
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Backend Technologies</label>
                <div className="array-input-group">
                  {(formData.techStack.backend || []).map((tech, index) => (
                    <div key={index} className="form-row">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => {
                          const newItems = [...(formData.techStack.backend || [])];
                          newItems[index] = e.target.value;
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, backend: newItems }
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newItems = (formData.techStack.backend || []).filter((_: string, i: number) => i !== index);
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, backend: newItems }
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => setFormData({
                      ...formData,
                      techStack: { ...formData.techStack, backend: [...(formData.techStack.backend || []), ''] }
                    })}
                  >
                    Add Backend Tech
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="form-section">
              <div className="form-group">
                <label>Project Sections</label>
                {Object.entries(formData.sections).map(([key, section]) => (
                  <div key={key} className="form-group">
                    <label>{section.title}</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => setFormData({
                        ...formData,
                        sections: {
                          ...formData.sections,
                          [key]: { ...section, content: e.target.value }
                        }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
        </div>
      </form>

      {loading && <div className="admin-loading">Saving project...</div>}
      {error && <div className="admin-error">{error}</div>}
    </div>
  );
};

export default AdminProjectForm; 