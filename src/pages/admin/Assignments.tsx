import React, { useState, useEffect } from 'react';
import { Assignment, Project, User } from '../../types';
import { mockAssignments, mockProjects } from '../../data/mockData';
import { mockUsers } from '../../data/mockUsers';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit as FaEditIcon, FaTrash as FaTrashIcon } from 'react-icons/fa';

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
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
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
                <td><span className={`pill pill-role pill-role-${assignment.role.toLowerCase()}`}>{assignment.role}</span></td>
                <td>{assignment.status}</td>
                <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
                <td>{assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : '-'}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary icon-btn"
                    onClick={() => navigate(`/admin/assignments/${assignment.id}/edit`)}
                    aria-label="Edit Assignment"
                    title="Edit Assignment"
                  >
                    {FaEditIcon({})}
                  </button>
                  <button
                    className="btn btn-small btn-danger icon-btn"
                    onClick={() => handleDelete(assignment.id)}
                    aria-label="Delete Assignment"
                    title="Delete Assignment"
                  >
                    {FaTrashIcon({})}
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