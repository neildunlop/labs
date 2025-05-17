import React, { useState, useEffect } from 'react';
import { AuthUser } from '../../services/types';

interface UserFormData {
  email: string;
  password: string;
  role: 'admin' | 'user';
  is_active: boolean;
}

// Mock data for development
const mockUsers: AuthUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    sub: '123',
    role: 'admin',
    is_active: true,
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    sub: '456',
    role: 'user',
    is_active: true,
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    role: 'user',
    is_active: true,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...formData }
            : user
        ));
      } else {
        // Create new user
        const newUser: AuthUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          username: formData.email.split('@')[0],
          email: formData.email,
          sub: Math.random().toString(36).substring(7),
          role: formData.role,
          is_active: formData.is_active,
        };
        setUsers([...users, newUser]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
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

  const handleEdit = (user: AuthUser) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active,
    });
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      role: 'user',
      is_active: true,
    });
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Manage Users</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!selectedUser}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedUser ? 'Update User' : 'Create User'}
          </button>
          {selectedUser && (
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
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(user.id)}
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