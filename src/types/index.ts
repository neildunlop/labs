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
  id: number;
  title: string;
  overview: string;
  status: 'active' | 'draft' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  objectives: string[];
  deliverables: Deliverable[];
  considerations: string[];
  techStack: TechStack;
  metadata: ProjectMetadata;
  sections: Record<string, ChallengeSection>;
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