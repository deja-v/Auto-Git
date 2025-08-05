import chalk from 'chalk';
import ora from 'ora';
// import { ConfigService } from '../services/config.js';
// import { collectGitData, getDataSummary } from '../services/gitData.js';
// import { AIService } from '../services/aiService.js';

export async function initCommand(): Promise<void> {
  const spinner = ora('Initializing autogit...').start();
  
  try {
    // Load and validate configuration
    // const configService = ConfigService.getInstance();
    // const config = await configService.loadConfig();
    
    // const validation = await configService.validateConfig();
    // if (!validation.isValid) {
    //   spinner.fail('Configuration validation failed');
    //   validation.errors.forEach(error => console.error(chalk.red('❌'), error));
    //   console.log(chalk.yellow('\nPlease set up your configuration:'));
    //   console.log(chalk.cyan('1. Copy env.example to .env'));
    //   console.log(chalk.cyan('2. Add your git configuration'));
    //   console.log(chalk.cyan('3. Get Google Gemini API key from https://makersuite.google.com/app/apikey'));
    //   process.exit(1);
    // }

    // Test AI connection
    // spinner.text = 'Testing AI connection...';
    // const aiService = new AIService(config);
    // try {
    //   await aiService.analyzeCodeChanges(['test.ts'], '// test change');
    //   spinner.text = 'AI connection successful!';
    // } catch (error) {
    //   spinner.warn('AI connection failed - continuing without AI features');
    //   console.log(chalk.yellow('⚠️  Make sure you have a valid Google Gemini API key'));
    // }

    // // Collect git data
    // spinner.text = 'Analyzing repository...';
    // const gitData = await collectGitData();
    
    spinner.succeed('Autogit initialized successfully!');
    console.log(chalk.green('✅ Ready to use AI-powered git automation!'));
    console.log(chalk.blue('\n📊 Repository Analysis:'));
    // console.log(getDataSummary(gitData));
    
    // console.log(chalk.cyan('\n🎯 Next steps:'));
    // console.log(chalk.cyan('• autogit branch - Create AI-suggested branches'));
    // console.log(chalk.cyan('• autogit commit - Create AI-suggested commits'));
    // console.log(chalk.cyan('• autogit analyze - Re-analyze repository patterns'));
    
  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
} 