import React, { useState, useEffect } from 'react';
import { Assignment, Project, User } from '../../types';
import { mockAssignments, mockProjects } from '../../data/mockData';
import { mockUsers } from '../../data/mockUsers';
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
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
      setError('Failed to load assignments. Please try again later.');
    } finally {
      setIsLoading(false);
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
      setError('Failed to delete assignment. Please try again later.');
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

  if (isLoading) {
    return (
      <AdminLayout 
        title="Assignments" 
        subtitle="Loading assignments..."
      >
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Loading assignments...
            </Typography>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Assignments"
      subtitle="Manage project assignments and team members"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Assignments' }
      ]}
    >
      <Box sx={{ mb: theme.spacing(3), display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/assignments/new')}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Create New Assignment
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
              <TableCell>Project</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow 
                key={assignment.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.grey[50],
                  },
                }}
              >
                <TableCell>{getProjectTitle(assignment.project_id)}</TableCell>
                <TableCell>{getUserName(assignment.user_id)}</TableCell>
                <TableCell>
                  <Chip
                    label={assignment.role}
                    color={assignment.role.toLowerCase() === 'lead' ? 'primary' : 'default'}
                    size="small"
                    sx={{ minWidth: '100px' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={assignment.status}
                    color={assignment.status === 'active' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(assignment.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : '-'}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/admin/assignments/${assignment.id}/edit`)}
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
                    onClick={() => handleDelete(assignment.id)}
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
    </AdminLayout>
  );
}; 