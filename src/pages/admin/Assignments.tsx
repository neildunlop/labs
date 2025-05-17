import React, { useState, useEffect } from 'react';
import { Assignment, Project, User } from '../../types';
import { mockAssignments, mockProjects } from '../../data/mockData';
import { mockUsers } from '../../data/mockUsers';
import { Link, useNavigate } from 'react-router-dom';

export const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

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
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getProjectTitle = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : 'Unknown Project';
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-page-title">Manage Assignments</h1>
        <Link to="/admin/assignments/new" className="btn btn-primary">
          Create New Assignment
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td>{getProjectTitle(assignment.project_id)}</td>
                <td>{getUserName(assignment.user_id)}</td>
                <td>{assignment.role}</td>
                <td>{assignment.status}</td>
                <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
                <td>{assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : '-'}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => navigate(`/admin/assignments/${assignment.id}/edit`)}
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