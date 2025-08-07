import { simpleGit, SimpleGit } from 'simple-git';
import { GitData } from '../types/index.js';

let git: SimpleGit;

function getGit() {
  if (!git) {
    git = simpleGit(process.cwd());
  }
  return git;
}

export async function getRepositoryState() {
  try {
    const gitInstance = getGit();
    const [currentBranch, stagedFiles, modifiedFiles] = await Promise.all([
      gitInstance.branch(),
      gitInstance.diff(['--cached', '--name-only']),
      gitInstance.diff(['--name-only'])
    ]);

    return {
      currentBranch: currentBranch.current,
      stagedFiles: stagedFiles.split('\n').filter(Boolean),
      modifiedFiles: modifiedFiles.split('\n').filter(Boolean)
    };
  } catch (error) {
    throw new Error(`Failed to get repository state: ${error}`);
  }
}

export async function getStagedChanges() {
  try {
    const gitInstance = getGit();
    const diff = await gitInstance.diff(['--cached']);
    return diff || 'No staged changes';
  } catch (error) {
    throw new Error(`Failed to get staged changes: ${error}`);
  }
}

export async function getRecentCommits(limit: number = 10) {
  try {
    const gitInstance = getGit();
    const log = await gitInstance.log({ maxCount: limit });
    return log.all.map(commit => `${commit.hash} - ${commit.message}`);
  } catch (error) {
    throw new Error(`Failed to get recent commits: ${error}`);
  }
}

export async function createBranch(branchName: string) {
  try {
    const gitInstance = getGit();
    await gitInstance.checkoutBranch(branchName, 'HEAD');
  } catch (error) {
    throw new Error(`Failed to create branch '${branchName}': ${error}`);
  }
}

export async function stageFiles(files: string[]) {
  try {
    const gitInstance = getGit();
    await gitInstance.add(files);
  } catch (error) {
    throw new Error(`Failed to stage files: ${error}`);
  }
}

export async function createCommit(message: string) {
  try {
    const gitInstance = getGit();
    await gitInstance.commit(message);
  } catch (error) {
    throw new Error(`Failed to create commit: ${error}`);
  }
}

export async function isRepository() {
  try {
    const gitInstance = getGit();
    await gitInstance.status();
    return true;
  } catch {
    return false;
  }
}

export async function getRepositoryRoot() {
  try {
    const gitInstance = getGit();
    return await gitInstance.revparse(['--show-toplevel']);
  } catch (error) {
    throw new Error(`Failed to get repository root: ${error}`);
  }
} 