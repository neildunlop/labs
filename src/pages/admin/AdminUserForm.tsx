import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockUsers';
import { useNavigate, useParams } from 'react-router-dom';

interface UserFormData {
  email: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  metadata: {
    department: string;
    position: string;
    skills: string[];
  };
}

const initialFormData: UserFormData = {
  email: '',
  name: '',
  role: 'user',
  status: 'active',
  metadata: {
    department: '',
    position: '',
    skills: ['']
  }
};

export const AdminUserForm: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id && users.length > 0) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        setFormData({
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          metadata: user.metadata
        });
      }
    }
  }, [id, users]);

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
      
      if (id) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === parseInt(id)
            ? { ...user, ...formData, updated_at: new Date().toISOString() }
            : user
        ));
      } else {
        // Create new user
        const newUser: User = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUsers([...users, newUser]);
      }
      
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
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
        <h1 className="admin-page-title">{id ? 'Edit User' : 'Create New User'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </button>
      </div>

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
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            value={formData.metadata.department}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, department: e.target.value }
            })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            value={formData.metadata.position}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, position: e.target.value }
            })}
          />
        </div>

        <div className="form-group">
          <label>Skills</label>
          {formData.metadata.skills.map((skill, index) => (
            <div key={index} className="array-input-group">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayInput(formData.metadata.skills, index, e.target.value,
                  (newArray) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, skills: newArray }
                  }))}
              />
              <button
                type="button"
                className="btn btn-small btn-danger"
                onClick={() => removeArrayItem(formData.metadata.skills, index,
                  (newArray) => setFormData({
                    ...formData,
                    metadata: { ...formData.metadata, skills: newArray }
                  }))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => addArrayItem(formData.metadata.skills,
              (newArray) => setFormData({
                ...formData,
                metadata: { ...formData.metadata, skills: newArray }
              }))}
          >
            Add Skill
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserForm; 