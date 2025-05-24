import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactMarkdown from 'react-markdown';
import './ProjectSectionEditor.css';

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'code' | 'image' | 'link' | 'custom';
  metadata?: Record<string, any>;
}

interface ProjectSectionEditorProps {
  sections: ProjectSection[];
  onChange: (sections: ProjectSection[]) => void;
}

interface SortableSectionProps {
  section: ProjectSection;
  onEdit: (section: ProjectSection) => void;
  onPreview: (section: ProjectSection) => void;
  onDelete: (id: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  onEdit,
  onPreview,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="section-item">
      <div className="section-header">
        <div {...attributes} {...listeners} className="drag-handle">
          ⋮⋮
        </div>
        <h4>{section.title || 'Untitled Section'}</h4>
        <div className="section-actions">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(section)}
          >
            Edit
          </button>
          <button
            type="button"
            className="preview-button"
            onClick={() => onPreview(section)}
          >
            Preview
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(section.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProjectSectionEditor: React.FC<ProjectSectionEditorProps> = ({
  sections = [],
  onChange,
}) => {
  const [editingSection, setEditingSection] = useState<ProjectSection | null>(null);
  const [previewSection, setPreviewSection] = useState<ProjectSection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section: ProjectSection) => section.id === active.id);
      const newIndex = sections.findIndex((section: ProjectSection) => section.id === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex).map((section: ProjectSection, index: number) => ({
        ...section,
        order: index,
      }));
      
      onChange(newSections);
    }
  };

  const addSection = () => {
    const newSection: ProjectSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: '',
      order: sections.length,
      type: 'text',
    };
    setEditingSection(newSection);
  };

  const updateSection = (updatedSection: ProjectSection) => {
    // Check if this is a new section (not in the sections array)
    const isNewSection = !sections.some(section => section.id === updatedSection.id);
    
    let newSections;
    if (isNewSection) {
      // Add the new section to the array
      newSections = [...sections, updatedSection];
    } else {
      // Update existing section
      newSections = sections.map(section =>
        section.id === updatedSection.id ? updatedSection : section
      );
    }
    
    onChange(newSections);
    setEditingSection(null);
  };

  const deleteSection = (sectionId: string) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    onChange(newSections);
  };

  return (
    <div className="section-editor">
      <div className="section-editor-header">
        <h3>Project Sections</h3>
        <button type="button" className="add-section-button" onClick={addSection}>
          Add Section
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="sections-list">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onEdit={setEditingSection}
                onPreview={setPreviewSection}
                onDelete={deleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingSection && (
        <div className="section-edit-modal">
          <div className="section-edit-content">
            <h3>Edit Section</h3>
            <div className="form-group">
              <label htmlFor="section-title">Title</label>
              <input
                type="text"
                id="section-title"
                value={editingSection.title}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, title: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="section-type">Type</label>
              <select
                id="section-type"
                value={editingSection.type}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    type: e.target.value as ProjectSection['type'],
                  })
                }
              >
                <option value="text">Text</option>
                <option value="code">Code</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="section-content">Content</label>
              <textarea
                id="section-content"
                value={editingSection.content}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, content: e.target.value })
                }
                rows={10}
              />
            </div>
            <div className="section-edit-actions">
              <button
                type="button"
                className="save-button"
                onClick={() => updateSection(editingSection)}
              >
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setEditingSection(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {previewSection && (
        <div className="section-preview-modal">
          <div className="section-preview-content">
            <h3>{previewSection.title}</h3>
            <div className="section-preview">
              <ReactMarkdown>{previewSection.content}</ReactMarkdown>
            </div>
            <button
              type="button"
              className="close-button"
              onClick={() => setPreviewSection(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 