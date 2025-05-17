import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'admin',
    status: 'active',
    metadata: {
      department: 'Engineering',
      position: 'Senior Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'user',
    status: 'active',
    metadata: {
      department: 'Design',
      position: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'HTML', 'CSS'],
    },
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    email: 'bob.wilson@example.com',
    name: 'Bob Wilson',
    role: 'user',
    status: 'inactive',
    metadata: {
      department: 'Engineering',
      position: 'Backend Developer',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    },
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]; 