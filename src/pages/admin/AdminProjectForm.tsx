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
            Project Details
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
            <>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="overview">Overview</label>
                <textarea
                  id="overview"
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.metadata.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, type: e.target.value as 'website' | 'ai' }
                  })}
                >
                  <option value="website">Website</option>
                  <option value="ai">AI</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={formData.metadata.difficulty}
                  onChange={(e) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }
                  })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <>
              <div className="form-group">
                <label>Objectives</label>
                {formData.objectives.map((objective: string, index: number) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayInput(formData.objectives, index, e.target.value, 
                        (newArray) => setFormData({ ...formData, objectives: newArray }))}
                    />
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem(formData.objectives, index,
                        (newArray) => setFormData({ ...formData, objectives: newArray }))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-small btn-secondary"
                  onClick={() => addArrayItem(formData.objectives,
                    (newArray) => setFormData({ ...formData, objectives: newArray }))}
                >
                  Add Objective
                </button>
              </div>

              <div className="form-group">
                <label>Considerations</label>
                {formData.considerations.map((consideration, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={consideration}
                      onChange={(e) => handleArrayInput(formData.considerations, index, e.target.value,
                        (newArray) => setFormData({ ...formData, considerations: newArray }))}
                    />
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem(formData.considerations, index,
                        (newArray) => setFormData({ ...formData, considerations: newArray }))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-small btn-secondary"
                  onClick={() => addArrayItem(formData.considerations,
                    (newArray) => setFormData({ ...formData, considerations: newArray }))}
                >
                  Add Consideration
                </button>
              </div>

              <div className="form-group">
                <label>Tags</label>
                {formData.metadata.tags.map((tag, index) => (
                  <div key={index} className="array-input-group">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayInput(formData.metadata.tags, index, e.target.value,
                        (newArray) => setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, tags: newArray }
                        }))}
                    />
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeArrayItem(formData.metadata.tags, index,
                        (newArray) => setFormData({
                          ...formData,
                          metadata: { ...formData.metadata, tags: newArray }
                        }))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-small btn-secondary"
                  onClick={() => addArrayItem(formData.metadata.tags,
                    (newArray) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, tags: newArray }
                    }))}
                >
                  Add Tag
                </button>
              </div>
            </>
          )}

          {activeTab === 'tech' && (
            <>
              {Object.entries(formData.techStack).map(([category, items]) => (
                <div key={category} className="form-group">
                  <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                  {items.map((item: string, index: number) => (
                    <div key={index} className="array-input-group">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index] = e.target.value;
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, [category]: newItems }
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          const newItems = items.filter((_: string, i: number) => i !== index);
                          setFormData({
                            ...formData,
                            techStack: { ...formData.techStack, [category]: newItems }
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        techStack: {
                          ...formData.techStack,
                          [category]: [...items, '']
                        }
                      });
                    }}
                  >
                    Add {category.charAt(0).toUpperCase() + category.slice(1)} Item
                  </button>
                </div>
              ))}
            </>
          )}

          {activeTab === 'sections' && (
            <>
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
                    rows={4}
                  />
                </div>
              ))}
            </>
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