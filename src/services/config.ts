import { Config } from '../types/index.js';

let config: Config | null = null;

export async function loadConfig(): Promise<Config> {
  if (config) {
    return config;
  }

  config = {
    ai: {
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      apiKey: process.env.GEMINI_API_KEY || '',
      temperature: 0.3,
    },
    git: {
      authorName: process.env.GIT_AUTHOR_NAME || '',
      authorEmail: process.env.GIT_AUTHOR_EMAIL || '',
    },
    workflow: {
      autoConfirm: false,
      defaultCommitType: 'feat',
      logLevel: 'info',
    },
    patterns: {
      commitTypes: {},
      branchPrefixes: {},
      filePatterns: {},
      totalCommitsAnalyzed: 0,
    },
  };

  return config;
}

export async function validateConfig(): Promise<{ isValid: boolean; errors: string[] }> {
  const config = await loadConfig();
  const errors: string[] = [];

  if (!config.ai.apiKey) {
    errors.push('GEMINI_API_KEY is required');
  }

  if (!config.git.authorName) {
    errors.push('GIT_AUTHOR_NAME is required');
  }

  if (!config.git.authorEmail) {
    errors.push('GIT_AUTHOR_EMAIL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
} 