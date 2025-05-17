import React, { useState, useEffect } from 'react';
import { Assignment, Project, User } from '../../types';
import { mockAssignments, mockProjects } from '../../data/mockData';
import { mockUsers } from '../../data/mockUsers';
import { useNavigate, useParams } from 'react-router-dom';

interface AssignmentFormData {
  project_id: number;
  user_id: number;
  role: 'lead' | 'member';
  status: 'pending' | 'active' | 'completed';
  start_date: string;
  end_date: string;
  notes: string;
}

const initialFormData: AssignmentFormData = {
  project_id: 0,
  user_id: 0,
  role: 'member',
  status: 'pending',
  start_date: '',
  end_date: '',
  notes: ''
};

export const AdminAssignmentForm: React.FC = () => {
  const [formData, setFormData] = useState<AssignmentFormData>(initialFormData);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate API calls
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 500)),
        new Promise(resolve => setTimeout(resolve, 500)),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      setAssignments(mockAssignments);
      setProjects(mockProjects);
      setUsers(mockUsers);

      if (id) {
        const assignment = mockAssignments.find(a => a.id === parseInt(id));
        if (assignment) {
          setFormData({
            project_id: assignment.project_id,
            user_id: assignment.user_id,
            role: assignment.role,
            status: assignment.status,
            start_date: assignment.start_date,
            end_date: assignment.end_date || '',
            notes: assignment.notes
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAssignment: Assignment = {
        id: Date.now(),
        project_id: formData.project_id,
        user_id: formData.user_id,
        role: formData.role,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        notes: formData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (id) {
        // Update existing assignment
        setAssignments(assignments.map(a => 
          a.id === parseInt(id) ? { ...newAssignment, id: parseInt(id) } : a
        ));
      } else {
        // Create new assignment
        setAssignments([...assignments, newAssignment]);
      }
      
      navigate('/admin/assignments');
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'project_id' || name === 'user_id' 
        ? parseInt(value) 
        : name === 'role' 
          ? (value as 'lead' | 'member')
          : name === 'status'
            ? (value as 'pending' | 'active' | 'completed')
            : value
    }));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-page-title">
          {id ? 'Edit Assignment' : 'Create New Assignment'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="project_id">Project</label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a project</option>
            {projects.map(project => (
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
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="member">Member</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? 'Update Assignment' : 'Create Assignment'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/assignments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAssignmentForm; 