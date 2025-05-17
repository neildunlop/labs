import { Project, Assignment } from '../types';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    overview: 'A modern e-commerce platform with advanced features',
    status: 'active',
    objectives: [
      'Build a scalable e-commerce platform',
      'Implement secure payment processing',
      'Create an intuitive admin dashboard',
    ],
    deliverables: [
      {
        title: 'Frontend Development',
        description: 'React-based user interface',
        status: 'completed',
      },
      {
        title: 'Backend API',
        description: 'Node.js REST API',
        status: 'in_progress',
      },
    ],
    considerations: [
      'Security and data protection',
      'Scalability and performance',
      'Mobile responsiveness',
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'TypeScript'],
      database: ['PostgreSQL', 'Redis'],
      infrastructure: ['AWS', 'Docker', 'Kubernetes'],
    },
    metadata: {
      client: 'Retail Corp',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      budget: 150000,
      teamSize: 5,
    },
    sections: [
      {
        title: 'Project Overview',
        content: 'Detailed project description and goals',
      },
      {
        title: 'Technical Architecture',
        content: 'System design and architecture details',
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    title: 'AI Chatbot',
    overview: 'An intelligent chatbot for customer support',
    status: 'draft',
    objectives: [
      'Develop an AI-powered chatbot',
      'Integrate with existing systems',
      'Implement natural language processing',
    ],
    deliverables: [
      {
        title: 'Chatbot Core',
        description: 'AI model and conversation logic',
        status: 'pending',
      },
      {
        title: 'Integration Layer',
        description: 'API integration with existing systems',
        status: 'pending',
      },
    ],
    considerations: [
      'AI model accuracy',
      'Response time optimization',
      'Data privacy compliance',
    ],
    techStack: {
      frontend: ['React', 'TypeScript'],
      backend: ['Python', 'FastAPI'],
      database: ['MongoDB'],
      infrastructure: ['AWS', 'Docker'],
    },
    metadata: {
      client: 'Support Inc',
      startDate: '2024-02-01',
      endDate: null,
      budget: 100000,
      teamSize: 3,
    },
    sections: [
      {
        title: 'AI Model Design',
        content: 'Details about the AI model architecture',
      },
      {
        title: 'Integration Plan',
        content: 'System integration strategy',
      },
    ],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    project_id: 1,
    user_id: 1,
    role: 'Lead Developer',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    notes: 'Leading the frontend development team',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    project_id: 1,
    user_id: 2,
    role: 'UI/UX Designer',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    notes: 'Responsible for user interface design',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    project_id: 2,
    user_id: 3,
    role: 'AI Engineer',
    status: 'pending',
    start_date: '2024-02-01',
    end_date: null,
    notes: 'Developing the AI model and integration',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]; 