import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { loadConfig } from '../services/config.js';
import { createCommit, getRecentCommits, getRepositoryState, getStagedChanges, isRepository } from '../services/git.js';
import { analyzeCommit, initializeAI } from '../services/ai.js';

export async function commitCommand() {
  const spinner = ora('Analyzing staged changes...').start();

  try {
    const config = await loadConfig();

    const isRepo = await isRepository();
    if (!isRepo) {
      spinner.fail('Not a git repository');
      console.error(chalk.red('❌ Please run this command from a git repository'));
      process.exit(1);
    }

    const repoState = await getRepositoryState();
    const stagedChanges = await getStagedChanges();
    const recentCommits = await getRecentCommits(10);

    if (repoState.stagedFiles.length === 0) {
      spinner.fail('No staged changes');
      console.log(chalk.yellow('📝 No staged changes found'));
      console.log(chalk.gray('Stage some files first: git add .'));
      return;
    }

    spinner.succeed('Staged changes analyzed');

    console.log(chalk.blue('\n📊 Staged Changes:'));
    repoState.stagedFiles.forEach(file => {
      console.log(chalk.gray(`  • ${file}`));
    });

    spinner.start('Initializing AI...');
    await initializeAI();
    spinner.succeed('AI initialized');

    spinner.start('Analyzing changes...');
    const analysis = await analyzeCommit(stagedChanges, recentCommits);
    spinner.succeed('Analysis complete');

    console.log(chalk.cyan('\n🎯 AI Analysis:'));
    console.log(chalk.white(`• Type: ${analysis.type}`));
    console.log(chalk.white(`• Description: ${analysis.description}`));
    console.log(chalk.white(`• Confidence: ${Math.round(analysis.confidence * 100)}%`));
    console.log(chalk.gray(`• Reasoning: ${analysis.reasoning}`));

    const commitMessage = `${analysis.type}: ${analysis.description}`;

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'commitType',
        message: 'Commit type:',
        choices: [
          { name: 'feat: New feature', value: 'feat' },
          { name: 'fix: Bug fix', value: 'fix' },
          { name: 'docs: Documentation', value: 'docs' },
          { name: 'refactor: Code refactoring', value: 'refactor' },
          { name: 'test: Adding tests', value: 'test' },
          { name: 'chore: Maintenance', value: 'chore' }
        ],
        default: analysis.type
      },
      {
        type: 'input',
        name: 'description',
        message: 'Commit description:',
        default: analysis.description,
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Description cannot be empty';
          }
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Create this commit?',
        default: true
      }
    ]);

    if (!answers.confirm) {
      console.log(chalk.yellow('Commit cancelled'));
      return;
    }

    const finalCommitMessage = `${answers.commitType}: ${answers.description}`;

    spinner.start('Creating commit...');
    await createCommit(finalCommitMessage);
    spinner.succeed('Commit created successfully!');

    console.log(chalk.green('\n✅ Commit created'));
    console.log(chalk.blue(`• Message: ${finalCommitMessage}`));
    console.log(chalk.blue(`• Files: ${repoState.stagedFiles.length} staged`));

    console.log(chalk.cyan('\n🎯 Next steps:'));
    console.log(chalk.cyan('• Push changes: git push'));
    console.log(chalk.cyan('• Create PR: git push --set-upstream origin <branch>'));

  } catch (error) {
    spinner.fail('Commit creation failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
} 