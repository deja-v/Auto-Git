import { GoogleGenerativeAI } from '@google/generative-ai';
import { Config, AIAnalysis } from '../types/index.js';
import { loadConfig } from './config.js';

let genAI: GoogleGenerativeAI;
let model: any;
let config: Config;

export async function initializeAI(){
  config = await loadConfig();
  genAI = new GoogleGenerativeAI(config.ai.apiKey);
  model = genAI.getGenerativeModel({
    model: config.ai.model,
    generationConfig: {
      temperature: config.ai.temperature,
    },
  });
}

async function ensureInitialized(){
  if (!model) {
    await initializeAI();
  }
}

function buildCommitAnalysisPrompt(stagedChanges: string, recentCommits: string[]): string {
  const recentCommitsText = recentCommits.length > 0 
    ? `\nRecent commits for context:\n${recentCommits.slice(0, 5).join('\n')}`
    : '';

  return `Analyze the following staged changes and suggest a commit message.

Staged changes:
${stagedChanges}${recentCommitsText}

Please provide your analysis in the following JSON format:
{
  "type": "feat|fix|docs|refactor|test|chore",
  "description": "Brief, descriptive commit message",
  "confidence": 0.85,
  "reasoning": "Brief explanation of why this type and message were chosen"
}

Focus on:
- Conventional commit format
- Clear, concise description
- Appropriate commit type based on changes
- Consider recent commit patterns for consistency`;
}

function buildBranchSuggestionPrompt(changes: string, baseBranch: string): string {
  return `Based on the following changes, suggest a descriptive branch name.

Changes:
${changes}
Base branch: ${baseBranch}

Requirements:
- Use kebab-case (lowercase with hyphens)
- Be descriptive but concise (max 50 chars)
- Include the type of change (feature, fix, etc.)
- Avoid special characters except hyphens

Examples:
- feature/user-authentication
- fix/login-validation
- docs/api-documentation
- refactor/database-schema

Return only the branch name, nothing else.`;
}

function buildPatternAnalysisPrompt(commitHistory: string[]): string {
  return `Analyze the following commit history and extract patterns.

Commit history:
${commitHistory.join('\n')}

Please provide analysis in JSON format:
{
  "commitTypes": {
    "feat": 15,
    "fix": 8,
    "docs": 3
  },
  "branchPrefixes": {
    "feature": 12,
    "fix": 6,
    "hotfix": 2
  },
  "filePatterns": {
    "src/components": "React components",
    "src/services": "Business logic services",
    "tests": "Test files"
  }
}

Focus on:
- Most common commit types
- Branch naming patterns
- File organization patterns`;
}

function parseCommitAnalysis(text: string): AIAnalysis {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        type: parsed.type || 'feat',
        description: parsed.description || 'Update',
        confidence: parsed.confidence || 0.5,
        reasoning: parsed.reasoning || 'AI analysis'
      };
    }
  } catch (error) {
    // Fallback parsing
  }

  const lines = text.split('\n').filter(line => line.trim());
  const description = lines[0] || 'Update';

  return {
    type: 'feat',
    description: description.replace(/^[a-z]+\/?:?\s*/i, '').trim(),
    confidence: 0.5,
    reasoning: 'AI analysis'
  };
}

function parseBranchSuggestion(text: string): string {
  const cleanText = text.trim().replace(/^["']|["']$/g, '');

  return cleanText
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

function parsePatternAnalysis(text: string): {
  commitTypes: Record<string, number>;
  branchPrefixes: Record<string, number>;
  filePatterns: Record<string, string>;
} {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    // Fallback parsing
  }

  return {
    commitTypes: {},
    branchPrefixes: {},
    filePatterns: {}
  };
}

export async function analyzeCommit(stagedChanges: string, recentCommits: string[] = []) {
  await ensureInitialized();

  const prompt = buildCommitAnalysisPrompt(stagedChanges, recentCommits);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return parseCommitAnalysis(text);
}

export async function suggestBranchName(changes: string, baseBranch: string = 'main') {
  await ensureInitialized();

  const prompt = buildBranchSuggestionPrompt(changes, baseBranch);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return parseBranchSuggestion(text);
}

export async function analyzePatterns(commitHistory: string[]) {
  await ensureInitialized();

  const prompt = buildPatternAnalysisPrompt(commitHistory);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return parsePatternAnalysis(text);
} 