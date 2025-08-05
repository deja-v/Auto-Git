#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import commands (will be created next)
import { initCommand } from './commands/init.js';
// import { analyzeCommand } from './commands/analyze.js';
// import { branchCommand } from './commands/branch.js';
// import { commitCommand } from './commands/commit.js';

// CLI Version
const version = '1.0.0';

// Main CLI setup
program
  .name('autogit')
  .description('AI-powered Git workflow automator with OpenAI integration')
  .version(version);

// Commands
program
  .command('init')
  .description('Initialize autogit for this repository')
  .action(initCommand);

// program
//   .command('analyze')
//   .description('Analyze repository and learn patterns')
//   .action(analyzeCommand);

// program
//   .command('branch')
//   .description('Create a new branch with AI-powered naming suggestions')
//   .option('-q, --quick', 'Quick branch creation without prompts')
//   .option('-n, --name <name>', 'Specify branch name directly')
//   .action(branchCommand);

// program
//   .command('commit')
//   .description('Create a commit with AI-powered message suggestions')
//   .option('-q, --quick', 'Quick commit without prompts')
//   .option('-m, --message <message>', 'Specify commit message directly')
//   .option('-i, --interactive', 'Interactive commit with type selection')
//   .action(commitCommand);

// Error handling
program.exitOverride();

try {
  await program.parseAsync();
} catch (err) {
  if (err instanceof Error) {
    console.error(chalk.red('Error:'), err.message);
  } else {
    console.error(chalk.red('An unexpected error occurred'));
  }
  process.exit(1);
} 