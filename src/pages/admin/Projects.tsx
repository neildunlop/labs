import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Project as ApiProject } from '../../api/projects';
import { getProjects, deleteProject } from '../../api/projects';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Projects" subtitle="Loading projects...">
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Loading projects...
            </Typography>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Projects" subtitle="Error loading projects">
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={loadProjects}
              sx={{ mt: theme.spacing(2) }}
            >
              Retry
            </Button>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Projects" 
      subtitle="Manage your projects and their details"
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Projects' }
      ]}
    >
      <Box sx={{ mb: theme.spacing(4) }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: theme.spacing(3) 
        }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/projects/new')}
          >
            New Project
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Card>
            <Box sx={{ p: theme.spacing(4), textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: theme.spacing(2) }}>
                Create your first project to get started!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/admin/projects/new')}
              >
                Create Project
              </Button>
            </Box>
          </Card>
        ) : (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Technologies</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow
                      key={project.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.grey[50],
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <CodeIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {project.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '300px',
                            }}>
                              {project.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.status}
                          color={project.status === 'published' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {project.technologies.slice(0, 2).map((tech, index) => (
                            <Chip
                              key={index}
                              label={tech}
                              color="primary"
                              size="small"
                            />
                          ))}
                          {project.technologies.length > 2 && (
                            <Chip
                              label={`+${project.technologies.length - 2}`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: theme.spacing(0.5) }}>
                          {(project.tags || []).slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {(project.tags || []).length > 3 && (
                            <Chip
                              label={`+${(project.tags || []).length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(project.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>
    </AdminLayout>
  );
}; 