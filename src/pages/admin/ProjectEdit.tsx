import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Chip,
  Stack,
  Autocomplete,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Project as ApiProject } from '../../api/projects';
import { getProject, createProject, updateProject } from '../../api/projects';
import { AdminLayout } from '../../components/layout/AdminLayout';

const statusOptions = ['draft', 'published', 'archived'];
const technologyOptions = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'PostgreSQL',
  'GraphQL',
];

export const ProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const theme = useTheme();

  const [project, setProject] = useState<Partial<ApiProject>>({
    title: '',
    description: '',
    status: 'draft',
    technologies: [],
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProject(id!);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!project.title?.trim()) {
      errors.title = 'Title is required';
    }
    if (!project.description?.trim()) {
      errors.description = 'Description is required';
    }
    if (!project.status) {
      errors.status = 'Status is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isNew) {
        await createProject(project as ApiProject);
      } else {
        await updateProject(id!, project as ApiProject);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title={isNew ? "New Project" : "Edit Project"} 
        subtitle="Loading project..."
      >
        <Card>
          <Box sx={{ p: theme.spacing(3), textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Loading project...
            </Typography>
          </Box>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={isNew ? "New Project" : "Edit Project"}
      subtitle={isNew ? "Create a new project" : "Edit project details"}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: 'Projects', href: '/admin/projects' },
        { label: isNew ? 'New Project' : 'Edit Project' }
      ]}
    >
      <Card>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: theme.spacing(3) }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                error={!!formErrors.description}
                helperText={formErrors.description}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={project.status}
                  label="Status"
                  onChange={(e) => setProject({ ...project, status: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.grey[300],
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      <Chip
                        label={status.charAt(0).toUpperCase() + status.slice(1)}
                        color={status === 'published' ? 'success' : 'default'}
                        size="small"
                        sx={{ minWidth: '100px' }}
                      />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Autocomplete
                multiple
                options={technologyOptions}
                value={project.technologies || []}
                onChange={(_, newValue) => setProject({ ...project, technologies: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Technologies"
                    placeholder="Select technologies"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="primary"
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={project.tags || []}
                onChange={(_, newValue) => setProject({ ...project, tags: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      variant="outlined"
                      size="small"
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.grey[100],
                        },
                      }}
                    />
                  ))
                }
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

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: theme.spacing(4),
            pt: theme.spacing(2),
            borderTop: `1px solid ${theme.palette.divider}`
          }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/projects')}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                },
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{
                px: theme.spacing(4),
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {isNew ? 'Create Project' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Card>
    </AdminLayout>
  );
}; 