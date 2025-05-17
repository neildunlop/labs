import { getCurrentUser } from '../services/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  objectives: string[];
  team: Array<{
    name: string;
    role: string;
  }>;
  timeline: string;
  technologies: string[];
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = async () => {
  const user = await getCurrentUser();
  return {
    'Content-Type': 'application/json',
    'Authorization': user ? `Bearer ${user.token}` : '',
  };
};

export const getProjects = async (): Promise<Project[]> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/projects`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

export const getProject = async (id: string): Promise<Project> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/projects/${id}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers,
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (id: string): Promise<void> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
}; 