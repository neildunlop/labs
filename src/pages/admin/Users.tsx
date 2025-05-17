import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockUsers';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit as FaEditIcon, FaTrash as FaTrashIcon } from 'react-icons/fa';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-page-title">Manage Users</h1>
        <Link to="/admin/users/new" className="btn btn-primary">
          Create New User
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <colgroup>
            <col style={{ width: '28%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`pill pill-role pill-role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>{user.status}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary icon-btn"
                    onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                    aria-label="Edit User"
                    title="Edit User"
                  >
                    {FaEditIcon({})}
                  </button>
                  <button
                    className="btn btn-small btn-danger icon-btn"
                    onClick={() => handleDelete(user.id)}
                    aria-label="Delete User"
                    title="Delete User"
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