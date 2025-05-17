export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  metadata: {
    department: string;
    position: string;
    skills: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  overview: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  
  // Core challenge information
  objectives: string[];
  deliverables: Deliverable[];
  considerations: string[];
  techStack: TechStack;
  
  // Challenge-specific metadata
  metadata: {
    type: 'website' | 'ai' | 'sustainability' | 'agent' | 'sdlc';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    teamSize: {
      min: number;
      max: number;
    };
    tags: string[];
  };
  
  // Flexible sections that can be customized per challenge type
  sections: {
    [key: string]: ChallengeSection;
  };
}

export interface Deliverable {
  id: number;
  title: string;
  description: string;
  type: 'code' | 'documentation' | 'presentation' | 'demo' | 'other';
  requirements: string[];
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  tools?: string[];
  aiTools?: string[];
  other?: string[];
}

export interface ChallengeSection {
  title: string;
  content: string;
  type: 'text' | 'list' | 'table' | 'code' | 'markdown';
  order: number;
  isRequired: boolean;
}

// Challenge-specific interfaces
export interface WebsiteChallenge extends Challenge {
  sections: {
    publicFeatures: ChallengeSection;
    adminFeatures: ChallengeSection;
    contentStructure: ChallengeSection;
  };
}

export interface AIChallenge extends Challenge {
  sections: {
    implementationOptions: ChallengeSection;
    coreFeatures: ChallengeSection;
    costConsiderations: ChallengeSection;
  };
}

export interface SustainabilityChallenge extends Challenge {
  sections: {
    subChallenges: ChallengeSection;
    monitoringTools: ChallengeSection;
    carbonMetrics: ChallengeSection;
  };
}

export interface AgentChallenge extends Challenge {
  sections: {
    agentStructure: ChallengeSection;
    workflow: ChallengeSection;
    humanInteraction: ChallengeSection;
  };
}

export interface SDLCChallenge extends Challenge {
  sections: {
    sdlcStages: ChallengeSection;
    aiIntegration: ChallengeSection;
    testingStrategy: ChallengeSection;
  };
}

export interface Project {
  id: number;
  title: string;
  overview: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  objectives: string[];
  deliverables: {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
  }[];
  considerations: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  metadata: {
    client: string;
    startDate: string;
    endDate: string | null;
    budget: number;
    teamSize: number;
  };
  sections: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: number;
  project_id: number;
  user_id: number;
  role: 'lead' | 'member';
  status: 'pending' | 'active' | 'completed';
  start_date: string;
  end_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteProject extends Project {
  sections: {
    publicFeatures: {
      title: string;
      content: string;
    };
    adminFeatures: {
      title: string;
      content: string;
    };
  };
}

export interface AIProject extends Project {
  sections: {
    knowledgeBase: {
      title: string;
      content: string;
    };
    chatbot: {
      title: string;
      content: string;
    };
    integration: {
      title: string;
      content: string;
    };
  };
} 