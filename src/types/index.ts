export interface Deliverable {
  id: string;
  title: string;
  description: string;
  type: string;
  requirements: string[];
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  infrastructure?: string[];
  tools?: string[];
  other?: string[];
}

export interface ChallengeSection {
  title: string;
  content: string;
}

export interface ProjectMetadata {
  type: string;
  estimatedTime: string;
  teamSize: {
    min: number;
    max: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  overview: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  objectives: string[];
  deliverables: string[];
  considerations: string[];
  metadata: {
    type: string;
    estimatedTime: string;
    teamSize: {
      min: number;
      max: number;
    };
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  };
  sections: ProjectSection[];
}

export interface ProjectSection {
  id: string;
  title: string;
  content: string; // Markdown content
  order: number;
  type: 'text' | 'code' | 'image' | 'link' | 'custom';
  metadata?: Record<string, any>; // For any additional section-specific metadata
}

export interface WebsiteProject extends Project {
  sections: {
    publicFeatures: ChallengeSection;
    adminFeatures: ChallengeSection;
  };
}

export interface AIProject extends Project {
  sections: {
    knowledgeBase: ChallengeSection;
    chatbot: ChallengeSection;
    integration: ChallengeSection;
  };
}

export interface SustainabilityProject extends Project {
  sections: {
    environmental: ChallengeSection;
    social: ChallengeSection;
    economic: ChallengeSection;
  };
} 