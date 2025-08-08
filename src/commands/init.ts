import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, validateConfig } from '../services/config.js';

export async function initCommand(){
  const spinner = ora('Initializing autogit...').start();

  try {
    const config = await loadConfig();
    const validation = await validateConfig();

    if (!validation.isValid) {
      spinner.fail('Configuration validation failed');
      validation.errors.forEach(error => console.error(chalk.red('❌'), error));
      console.log(chalk.yellow('\nSetup required:'));
      console.log(chalk.cyan('1. Copy env.example to .env'));
      console.log(chalk.cyan('2. Add your configuration'));
      process.exit(1);
    }

    spinner.succeed('Autogit initialized successfully!');
    console.log(chalk.green('✅ Ready to use AI-powered git automation!'));
    console.log(chalk.blue('\n📊 Configuration:'));
    console.log(chalk.gray(`• AI Provider: ${config.ai.provider}`));
    console.log(chalk.gray(`• Git Author: ${config.git.authorName} <${config.git.authorEmail}>`));

    console.log(chalk.cyan('\n🎯 Next steps:'));
    console.log(chalk.cyan('• autogit branch - Create AI-suggested branches'));
    console.log(chalk.cyan('• autogit commit - Create AI-suggested commits'));

  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
} 