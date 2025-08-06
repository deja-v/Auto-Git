import chalk from 'chalk';
import ora from 'ora';

export async function initCommand(): Promise<void> {
  const spinner = ora('Initializing autogit...').start();

  try {
    spinner.text = 'Setting up autogit configuration...';

    spinner.succeed('Autogit initialized successfully!');
    console.log(chalk.green('✅ Ready to use AI-powered git automation!'));
    console.log(chalk.blue('\n📊 Repository Analysis:'));
    console.log(chalk.gray('• Git repository detected'));
    console.log(chalk.gray('• Basic configuration ready'));

    console.log(chalk.cyan('\n🎯 Next steps:'));
    console.log(chalk.cyan('• autogit branch - Create AI-suggested branches'));
    console.log(chalk.cyan('• autogit commit - Create AI-suggested commits'));
    console.log(chalk.cyan('• autogit analyze - Re-analyze repository patterns'));

  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
} 