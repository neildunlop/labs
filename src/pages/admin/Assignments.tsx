import React, { useState, useEffect } from 'react';
import { Project } from './Projects';
import { User } from '../../../src/types';

interface Assignment {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
  project?: Project;
  user?: User;
}

interface AssignmentFormData {
  project_id: number;
  user_id: number;
  role: string;
  status: Assignment['status'];
}

// Mock data for development
const mockAssignments: Assignment[] = [
  {
    id: 1,
    project_id: 1,
    user_id: 1,
    role: 'developer',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    project_id: 2,
    user_id: 2,
    role: 'designer',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Mobile App Development',
    description: 'Create a new mobile app for iOS and Android',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>({
    project_id: 0,
    user_id: 0,
    role: 'developer',
    status: 'pending',
  });

  useEffect(() => {
    fetchAssignments();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchAssignments = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'project_id' || name === 'user_id' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedAssignment) {
        // Update existing assignment
        setAssignments(assignments.map(assignment => 
          assignment.id === selectedAssignment.id 
            ? { ...assignment, ...formData, updated_at: new Date().toISOString() }
            : assignment
        ));
      } else {
        // Create new assignment
        const newAssignment: Assignment = {
          id: Math.max(...assignments.map(a => a.id)) + 1,
          project_id: formData.project_id,
          user_id: formData.user_id,
          role: formData.role,
          status: formData.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setAssignments([...assignments, newAssignment]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      project_id: assignment.project_id,
      user_id: assignment.user_id,
      role: assignment.role,
      status: assignment.status,
    });
  };

  const resetForm = () => {
    setSelectedAssignment(null);
    setFormData({
      project_id: 0,
      user_id: 0,
      role: 'developer',
      status: 'pending',
    });
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Manage Assignments</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="project_id">Project</label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="user_id">User</label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            placeholder="e.g., Developer, Designer, QA"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedAssignment ? 'Update Assignment' : 'Create Assignment'}
          </button>
          {selectedAssignment && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{assignment.project?.title}</td>
                <td>{assignment.user?.email}</td>
                <td>{assignment.role}</td>
                <td>{assignment.status}</td>
                <td>{new Date(assignment.created_at).toLocaleDateString()}</td>
                <td>{new Date(assignment.updated_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEdit(assignment)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 