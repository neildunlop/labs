import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { usersService } from '../../services/users';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to load users',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title="Users" 
        subtitle="Loading users..."
      >
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Loading users...
            </Typography>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Users"
      subtitle="Manage system users and their roles"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Users' }
      ]}
    >
      <Box sx={{ mb: theme.spacing(3), display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/users/new')}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Create New User
        </Button>
      </Box>

      {error && (
        <Typography 
          color="error" 
          sx={{ 
            mb: theme.spacing(3),
            p: theme.spacing(2),
            backgroundColor: theme.palette.error.light,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[1] }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role.toLowerCase() === 'admin' ? 'primary' : 'default'}
                    size="small"
                    sx={{ minWidth: '100px' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(user.id)}
                    sx={{
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.contrastText,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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