#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { initCommand } from './commands/init.js';

dotenv.config();

const version = '1.0.0';

program
  .name('autogit')
  .description('AI-powered Git workflow automator with OpenAI integration')
  .version(version);

// Commands
program
  .command('init')
  .description('Initialize autogit for this repository')
    .action(initCommand);

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