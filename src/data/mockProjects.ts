import type { Project, WebsiteProject, AIProject } from '../types';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Building the Burendo Labs Website and Admin Platform',
    overview: 'Create a modern, responsive website for Burendo Labs that showcases our projects and provides an admin interface for managing content.',
    status: 'active',
    created_at: '2024-03-20',
    updated_at: '2024-03-20',
    objectives: [
      'Create a user-friendly website that showcases Burendo Labs projects',
      'Implement an admin interface for content management',
      'Ensure the platform is responsive and accessible',
      'Integrate with existing Burendo systems'
    ],
    deliverables: [
      {
        id: '1',
        title: 'Public Website',
        description: 'A modern, responsive website that showcases Burendo Labs projects and initiatives.',
        type: 'Website',
        requirements: [
          'Responsive design that works on all devices',
          'Project showcase with filtering and search',
          'About page with team information',
          'Contact form'
        ]
      },
      {
        id: '2',
        title: 'Admin Platform',
        description: 'A secure admin interface for managing website content and projects.',
        type: 'Admin',
        requirements: [
          'Secure authentication system',
          'Project management interface',
          'Content editor with markdown support',
          'User management system'
        ]
      }
    ],
    considerations: [
      'Ensure the design aligns with Burendo brand guidelines',
      'Consider accessibility requirements',
      'Plan for future scalability',
      'Implement proper security measures'
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express'],
      database: ['PostgreSQL'],
      infrastructure: ['AWS', 'Docker'],
      tools: ['Git', 'GitHub Actions']
    },
    metadata: {
      type: 'website',
      estimatedTime: '2-3 months',
      teamSize: {
        min: 2,
        max: 4
      },
      difficulty: 'intermediate',
      tags: ['Web Development', 'React', 'TypeScript', 'AWS']
    },
    sections: {
      publicFeatures: {
        title: 'Public Features',
        content: 'The public website will include project showcase with filtering and search, about page with team information, contact form, and blog section for updates.'
      },
      adminFeatures: {
        title: 'Admin Features',
        content: 'The admin platform will include secure authentication, project management, content editor, and user management.'
      }
    }
  } as WebsiteProject,
  {
    id: 2,
    title: 'AI Powered Knowledge Base',
    overview: 'Develop an AI-powered knowledge base system that helps Burendo team members access and share information efficiently.',
    status: 'draft',
    created_at: '2024-03-20',
    updated_at: '2024-03-20',
    objectives: [
      'Create a centralized knowledge base system',
      'Implement AI-powered search and recommendations',
      'Develop a chatbot interface for quick access',
      'Ensure easy content creation and management'
    ],
    deliverables: [
      {
        id: '1',
        title: 'Knowledge Base System',
        description: 'A centralized system for storing and managing team knowledge.',
        type: 'System',
        requirements: [
          'Document storage and versioning',
          'Search functionality',
          'Content organization',
          'Access control'
        ]
      },
      {
        id: '2',
        title: 'AI Chatbot',
        description: 'An AI-powered chatbot for quick access to knowledge base content.',
        type: 'AI',
        requirements: [
          'Natural language processing',
          'Context-aware responses',
          'Learning from user interactions',
          'Integration with knowledge base'
        ]
      }
    ],
    considerations: [
      'Ensure data privacy and security',
      'Consider scalability for growing content',
      'Plan for regular AI model updates',
      'Implement proper access controls'
    ],
    techStack: {
      frontend: ['React', 'TypeScript'],
      backend: ['Python', 'FastAPI'],
      database: ['PostgreSQL', 'Redis'],
      infrastructure: ['AWS', 'Docker'],
      tools: ['Git', 'GitHub Actions']
    },
    metadata: {
      type: 'ai',
      estimatedTime: '3-4 months',
      teamSize: {
        min: 3,
        max: 5
      },
      difficulty: 'advanced',
      tags: ['AI', 'Machine Learning', 'Python', 'React']
    },
    sections: {
      knowledgeBase: {
        title: 'Knowledge Base',
        content: 'The knowledge base system will include document storage and versioning, search functionality, content organization, and access control.'
      },
      chatbot: {
        title: 'AI Chatbot',
        content: 'The chatbot will include natural language processing, context-aware responses, learning from interactions, and knowledge base integration.'
      },
      integration: {
        title: 'System Integration',
        content: 'Integration features will include API endpoints for external access, webhook support, authentication and authorization, and rate limiting.'
      }
    }
  } as AIProject
]; 