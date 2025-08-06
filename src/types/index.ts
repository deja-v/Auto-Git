export interface Config {
  ai: {
    provider: 'gemini';
    model: string;
    apiKey: string;
    temperature: number;
  };
  git: {
    authorName: string;
    authorEmail: string;
  };
  workflow: {
    autoConfirm: boolean;
    defaultCommitType: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  patterns: {
    commitTypes: Record<string, number>;
    branchPrefixes: Record<string, number>;
    filePatterns: Record<string, string>;
    totalCommitsAnalyzed: number;
  };
}

export interface GitData {
  currentBranch: string;
  stagedFiles: string[];
  modifiedFiles: string[];
}

export interface AIAnalysis {
  type: 'feat' | 'fix' | 'docs' | 'refactor' | 'test' | 'chore';
  description: string;
  confidence: number;
  reasoning: string;
} 