import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Project, ProjectSection } from '../../types/index';
import { getProject, createProject, updateProject } from '../../api/projects';
import { ProjectSectionEditor } from '../../components/admin/ProjectSectionEditor';
import { MDXEditor } from '@mdxeditor/editor';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  InsertImage,
  InsertTable,
  InsertCodeBlock,
  InsertFrontmatter
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './AdminProjectForm.css';

const initialFormData: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  overview: '',
  status: 'draft',
  objectives: [],
  deliverables: [],
  considerations: [],
  metadata: {
    type: '',
    estimatedTime: '',
    teamSize: { min: 1, max: 1 },
    difficulty: 'beginner',
    tags: [],
  },
  sections: [],
};

export const AdminProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at'>>(initialFormData);

  useEffect(() => {
    if (id) {
      loadProject();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const project = await getProject(id!);
      setFormData({
        title: project.title || '',
        overview: project.overview || '',
        status: project.status || 'draft',
        objectives: project.objectives || [],
        deliverables: project.deliverables || [],
        considerations: project.considerations || [],
        metadata: {
          type: project.metadata?.type || '',
          estimatedTime: project.metadata?.estimatedTime || '',
          teamSize: project.metadata?.teamSize || { min: 1, max: 1 },
          difficulty: project.metadata?.difficulty || 'beginner',
          tags: project.metadata?.tags || [],
        },
        sections: project.sections || [],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        ...formData,
        description: formData.overview,
        team: [],
        timeline: formData.metadata.estimatedTime,
        technologies: [],
        techStack: {
          frontend: [],
          backend: [],
          database: [],
          infrastructure: [],
          tools: [],
          other: []
        }
      };

      console.log('Submitting project data:', JSON.stringify(projectData, null, 2));

      if (id) {
        console.log('Updating project with ID:', id);
        const response = await updateProject(id, projectData);
        console.log('Update response:', response);
      } else {
        console.log('Creating new project');
        const response = await createProject(projectData);
        console.log('Create response:', response);
      }
      navigate('/admin/projects');
    } catch (err: any) {
      console.error('Error submitting project:', err);
      // Try to get more detailed error information
      let errorMessage = 'Failed to save project';
      if (err.response) {
        try {
          const errorData = await err.response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = err.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTeamSizeChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value, 10) || 1;
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        teamSize: {
          ...prev.metadata.teamSize,
          [field]: numValue,
        },
      },
    }));
  };

  const handleArrayInputChange = (field: keyof Project, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split('\n').filter(item => item.trim()),
    }));
  };

  const handleSectionsChange = (sections: ProjectSection[]) => {
    setFormData(prev => ({
      ...prev,
      sections,
    }));
  };

  const editorPlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <UndoRedo />
          <BlockTypeSelect />
          <BoldItalicUnderlineToggles />
          <ListsToggle />
          <CreateLink />
          <InsertImage />
          <InsertTable />
          <InsertCodeBlock />
          <InsertThematicBreak />
          <InsertFrontmatter />
        </>
      )
    })
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div className="error-message">
      <h3>Error</h3>
      <p>{error}</p>
      <button onClick={() => setError(null)}>Dismiss</button>
    </div>
  );

  return (
    <div className="admin-form-container">
      <h2>{id ? 'Edit Project' : 'Create Project'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="overview">Overview</label>
          <MDXEditor
            markdown={formData.overview || ''}
            onChange={(markdown) => setFormData(prev => ({ ...prev, overview: markdown }))}
            plugins={editorPlugins}
            contentEditableClassName="mdx-editor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="objectives">Objectives</label>
          <MDXEditor
            markdown={(formData.objectives || []).join('\n\n')}
            onChange={(markdown) => setFormData(prev => ({
              ...prev,
              objectives: markdown.split('\n\n').filter(item => item.trim())
            }))}
            plugins={editorPlugins}
            contentEditableClassName="mdx-editor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliverables">Deliverables</label>
          <MDXEditor
            markdown={(formData.deliverables || []).join('\n\n')}
            onChange={(markdown) => setFormData(prev => ({
              ...prev,
              deliverables: markdown.split('\n\n').filter(item => item.trim())
            }))}
            plugins={editorPlugins}
            contentEditableClassName="mdx-editor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="considerations">Considerations</label>
          <MDXEditor
            markdown={(formData.considerations || []).join('\n\n')}
            onChange={(markdown) => setFormData(prev => ({
              ...prev,
              considerations: markdown.split('\n\n').filter(item => item.trim())
            }))}
            plugins={editorPlugins}
            contentEditableClassName="mdx-editor"
          />
        </div>

        <div className="form-section">
          <h2>Project Metadata</h2>
          <div className="form-group">
            <label htmlFor="metadata.type">Type</label>
            <input
              type="text"
              id="metadata.type"
              name="metadata.type"
              value={formData.metadata.type}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="metadata.estimatedTime">Estimated Time</label>
            <input
              type="text"
              id="metadata.estimatedTime"
              name="metadata.estimatedTime"
              value={formData.metadata.estimatedTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Team Size</label>
            <div className="team-size-inputs">
              <input
                type="number"
                value={formData.metadata.teamSize.min}
                onChange={(e) => handleTeamSizeChange('min', e.target.value)}
                min="1"
                required
              />
              <span>to</span>
              <input
                type="number"
                value={formData.metadata.teamSize.max}
                onChange={(e) => handleTeamSizeChange('max', e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="metadata.difficulty">Difficulty</label>
            <select
              id="metadata.difficulty"
              name="metadata.difficulty"
              value={formData.metadata.difficulty}
              onChange={handleInputChange}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="metadata.tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="metadata.tags"
              name="metadata.tags"
              value={formData.metadata.tags.join(', ')}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    tags,
                  },
                }));
              }}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Project Sections</h2>
          <ProjectSectionEditor
            sections={formData.sections}
            onChange={handleSectionsChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {id ? 'Update Project' : 'Create Project'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}; 