import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  MenuItem,
  Typography,
  useTheme,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { AdminLayout } from '../layout/AdminLayout';
import { User } from '../../types';
import { usersService } from '../../services/users';

interface UserFormProps {
  mode: 'create' | 'edit';
}

export const UserForm: React.FC<UserFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    metadata: {
      department: '',
      title: '',
    },
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchUser();
    }
  }, [mode, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await usersService.getUser(Number(id));
      setFormData(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to load user data');
      setSnackbar({
        open: true,
        message: 'Failed to load user data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'create') {
        await usersService.createUser(formData as Omit<User, 'id'>);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success',
        });
      } else if (mode === 'edit' && id) {
        await usersService.updateUser(Number(id), formData);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      }
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <AdminLayout 
        title={mode === 'create' ? 'Create User' : 'Edit User'}
        subtitle="Loading..."
      >
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Loading user data...
            </Typography>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={mode === 'create' ? 'Create User' : 'Edit User'}
      subtitle={mode === 'create' ? 'Add a new user to the system' : 'Update user information'}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Users', href: '/admin/users' },
        { label: mode === 'create' ? 'Create User' : 'Edit User' }
      ]}
    >
      <Card sx={{ p: theme.spacing(3) }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                name="metadata.department"
                value={formData.metadata?.department || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="metadata.title"
                value={formData.metadata?.title || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mt: theme.spacing(2),
                p: theme.spacing(2),
                backgroundColor: theme.palette.error.light,
                borderRadius: theme.shape.borderRadius,
              }}
            >
              {error}
            </Typography>
          )}

          <Box sx={{ mt: theme.spacing(3), display: 'flex', gap: theme.spacing(2), justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {mode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
}; 