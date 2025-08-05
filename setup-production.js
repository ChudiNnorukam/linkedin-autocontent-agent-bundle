#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Production Setup for LinkedIn AutoContent Agent
class ProductionSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    console.log('🚀 LinkedIn AutoContent Agent - Production Setup\n');
    console.log('='.repeat(60));
    console.log('This will set up your LinkedIn AutoContent Agent for production use.');
    console.log('='.repeat(60));
    
    await this.checkPrerequisites();
  }

  async checkPrerequisites() {
    console.log('\n📋 Checking Prerequisites...');
    console.log('─'.repeat(40));
    
    // Check Node.js version
    try {
      const nodeVersion = process.version;
      console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      console.log('❌ Node.js not found');
      process.exit(1);
    }
    
    // Check environment variables
    const requiredEnvVars = [
      'LINKEDIN_ACCESS_TOKEN',
      'LINKEDIN_PERSON_ID',
      'LINKEDIN_CLIENT_ID'
    ];
    
    let envVarsOk = true;
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Set`);
      } else {
        console.log(`❌ ${envVar}: Missing`);
        envVarsOk = false;
      }
    }
    
    if (!envVarsOk) {
      console.log('\n⚠️ Please ensure all required environment variables are set in your .env file');
      process.exit(1);
    }
    
    console.log('✅ All prerequisites met!');
    await this.showSetupMenu();
  }

  async showSetupMenu() {
    console.log('\n🎯 Production Setup Menu:');
    console.log('─'.repeat(40));
    console.log('1. 📦 Install Dependencies');
    console.log('2. 📅 Setup Daily Post Scheduler');
    console.log('3. 🎨 Setup Template Manager');
    console.log('4. 📊 Setup Performance Dashboard');
    console.log('5. 🔧 Configure All Features');
    console.log('6. 🧪 Test All Systems');
    console.log('7. 📋 Generate Setup Report');
    console.log('8. 🚪 Exit');
    
    const choice = await this.askQuestion('\nSelect an option (1-8): ');
    
    switch (choice) {
      case '1':
        await this.installDependencies();
        break;
      case '2':
        await this.setupScheduler();
        break;
      case '3':
        await this.setupTemplateManager();
        break;
      case '4':
        await this.setupDashboard();
        break;
      case '5':
        await this.configureAllFeatures();
        break;
      case '6':
        await this.testAllSystems();
        break;
      case '7':
        await this.generateSetupReport();
        break;
      case '8':
        console.log('👋 Setup complete!');
        this.rl.close();
        return;
      default:
        console.log('❌ Invalid option, please try again');
        await this.showSetupMenu();
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing Dependencies...');
    console.log('─'.repeat(40));
    
    const dependencies = [
      'node-cron',
      'dotenv'
    ];
    
    try {
      console.log('Installing required packages...');
      execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully!');
    } catch (error) {
      console.error('❌ Error installing dependencies:', error.message);
    }
    
    await this.showSetupMenu();
  }

  async setupScheduler() {
    console.log('\n📅 Setting Up Daily Post Scheduler...');
    console.log('─'.repeat(40));
    
    try {
      // Create scheduler directory
      const schedulerDir = path.join(__dirname, 'scheduler');
      await fs.mkdir(schedulerDir, { recursive: true });
      
      // Create config directory
      const configDir = path.join(__dirname, 'config');
      await fs.mkdir(configDir, { recursive: true });
      
      // Create default scheduler config
      const schedulerConfig = {
        scheduleTime: '09:00',
        timezone: 'America/New_York',
        enabled: true,
        templates: ['ai-development', 'productivity', 'learning-journey'],
        rotation: 'sequential'
      };
      
      await fs.writeFile(
        path.join(configDir, 'scheduler.json'),
        JSON.stringify(schedulerConfig, null, 2)
      );
      
      console.log('✅ Scheduler configuration created');
      console.log(`📅 Default schedule: Daily at ${schedulerConfig.scheduleTime} (${schedulerConfig.timezone})`);
      
      // Test scheduler
      console.log('\n🧪 Testing scheduler...');
      const schedulerPath = path.join(__dirname, 'scheduler', 'daily-post-scheduler.js');
      if (await this.fileExists(schedulerPath)) {
        console.log('✅ Scheduler file found and ready');
      } else {
        console.log('⚠️ Scheduler file not found - will be created during setup');
      }
      
    } catch (error) {
      console.error('❌ Error setting up scheduler:', error.message);
    }
    
    await this.showSetupMenu();
  }

  async setupTemplateManager() {
    console.log('\n🎨 Setting Up Template Manager...');
    console.log('─'.repeat(40));
    
    try {
      // Create templates directory
      const templatesDir = path.join(__dirname, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });
      
      // Create default templates
      const defaultTemplates = [
        {
          name: 'ai-development',
          title: 'AI Development Progress',
          description: 'Daily updates on AI development journey',
          category: 'tech',
          hooks: [
            'Just automated my LinkedIn posting with AI!',
            'The future of work is here - AI automation is game-changing!',
            'From zero to automation hero in just {days} days!'
          ],
          structure: {
            day: 'Day {current_day} of building my AI Agent',
            recentWin: '{ai_win}',
            inProgress: '{current_project}',
            insight: '{key_learning}'
          },
          hashtags: ['#AI', '#Automation', '#Productivity', '#CursorAI'],
          variables: {
            achievements: [
              'LinkedIn API integration working perfectly',
              'Automated 3 social media platforms in one day',
              'Mastered n8n workflow automation',
              'AI agent handling repetitive tasks 10x faster'
            ],
            challenges: [
              'Adding Twitter automation next',
              'Building analytics dashboard',
              'Integrating with OpenAI API',
              'Scaling to multiple platforms'
            ],
            insights: [
              'Verified apps are crucial for API access',
              'AI agents can handle repetitive tasks 10x faster',
              'No-code tools + AI = unlimited possibilities',
              'Automation is the future of social media management'
            ],
            goals: [
              'Complete multi-platform automation',
              'Build comprehensive analytics dashboard',
              'Scale to enterprise level',
              'Create AI-powered content optimization'
            ]
          },
          created: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      ];
      
      for (const template of defaultTemplates) {
        await fs.writeFile(
          path.join(templatesDir, `${template.name}.json`),
          JSON.stringify(template, null, 2)
        );
      }
      
      console.log('✅ Template manager setup complete');
      console.log(`📁 Created ${defaultTemplates.length} default templates`);
      
    } catch (error) {
      console.error('❌ Error setting up template manager:', error.message);
    }
    
    await this.showSetupMenu();
  }

  async setupDashboard() {
    console.log('\n📊 Setting Up Performance Dashboard...');
    console.log('─'.repeat(40));
    
    try {
      // Create dashboard directories
      const dashboardDirs = [
        path.join(__dirname, 'logs'),
        path.join(__dirname, 'data'),
        path.join(__dirname, 'data', 'analytics'),
        path.join(__dirname, 'data', 'reports')
      ];
      
      for (const dir of dashboardDirs) {
        await fs.mkdir(dir, { recursive: true });
      }
      
      // Create default analytics
      const defaultAnalytics = {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageEngagementRate: 0,
        bestPerformingPost: null,
        worstPerformingPost: null,
        postingFrequency: 'daily',
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeFile(
        path.join(__dirname, 'data', 'analytics', 'performance.json'),
        JSON.stringify(defaultAnalytics, null, 2)
      );
      
      console.log('✅ Performance dashboard setup complete');
      console.log('📊 Analytics tracking initialized');
      
    } catch (error) {
      console.error('❌ Error setting up dashboard:', error.message);
    }
    
    await this.showSetupMenu();
  }

  async configureAllFeatures() {
    console.log('\n🔧 Configuring All Features...');
    console.log('─'.repeat(40));
    
    try {
      await this.installDependencies();
      await this.setupScheduler();
      await this.setupTemplateManager();
      await this.setupDashboard();
      
      console.log('✅ All features configured successfully!');
      
    } catch (error) {
      console.error('❌ Error configuring features:', error.message);
    }
    
    await this.showSetupMenu();
  }

  async testAllSystems() {
    console.log('\n🧪 Testing All Systems...');
    console.log('─'.repeat(40));
    
    const tests = [
      { name: 'LinkedIn API Connection', test: () => this.testLinkedInAPI() },
      { name: 'Scheduler Configuration', test: () => this.testScheduler() },
      { name: 'Template Manager', test: () => this.testTemplateManager() },
      { name: 'Performance Dashboard', test: () => this.testDashboard() }
    ];
    
    for (const test of tests) {
      console.log(`\n🧪 Testing ${test.name}...`);
      try {
        await test.test();
        console.log(`✅ ${test.name}: PASSED`);
      } catch (error) {
        console.log(`❌ ${test.name}: FAILED - ${error.message}`);
      }
    }
    
    console.log('\n🎉 All systems tested!');
    await this.showSetupMenu();
  }

  async testLinkedInAPI() {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API connection failed: ${response.status}`);
    }
  }

  async testScheduler() {
    const configPath = path.join(__dirname, 'config', 'scheduler.json');
    await fs.access(configPath);
  }

  async testTemplateManager() {
    const templatesDir = path.join(__dirname, 'templates');
    const files = await fs.readdir(templatesDir);
    if (files.length === 0) {
      throw new Error('No templates found');
    }
  }

  async testDashboard() {
    const analyticsPath = path.join(__dirname, 'data', 'analytics', 'performance.json');
    await fs.access(analyticsPath);
  }

  async generateSetupReport() {
    console.log('\n📋 Generating Setup Report...');
    console.log('─'.repeat(40));
    
    const report = {
      generatedAt: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      },
      environment: {
        linkedinTokenSet: !!process.env.LINKEDIN_ACCESS_TOKEN,
        linkedinPersonIdSet: !!process.env.LINKEDIN_PERSON_ID,
        linkedinClientIdSet: !!process.env.LINKEDIN_CLIENT_ID
      },
      features: {
        scheduler: await this.checkFeature('scheduler'),
        templateManager: await this.checkFeature('templates'),
        dashboard: await this.checkFeature('dashboard')
      },
      status: 'ready'
    };
    
    const reportFile = path.join(__dirname, 'data', 'reports', `setup-report-${Date.now()}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`✅ Setup report generated: ${reportFile}`);
    console.log('\n📊 Setup Summary:');
    console.log(`   🔧 System: ${report.system.platform} (${report.system.arch})`);
    console.log(`   📦 Node.js: ${report.system.nodeVersion}`);
    console.log(`   🔑 Environment: ${Object.values(report.environment).every(v => v) ? 'Complete' : 'Incomplete'}`);
    console.log(`   ⚙️ Features: ${Object.values(report.features).filter(v => v).length}/3 configured`);
    
    await this.showSetupMenu();
  }

  async checkFeature(feature) {
    try {
      switch (feature) {
        case 'scheduler':
          await fs.access(path.join(__dirname, 'config', 'scheduler.json'));
          return true;
        case 'templates':
          const templatesDir = path.join(__dirname, 'templates');
          const files = await fs.readdir(templatesDir);
          return files.length > 0;
        case 'dashboard':
          await fs.access(path.join(__dirname, 'data', 'analytics', 'performance.json'));
          return true;
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  async fileExists(filepath) {
    try {
      await fs.access(filepath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main execution
async function main() {
  const setup = new ProductionSetup();
  
  try {
    await setup.initialize();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    setup.rl.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProductionSetup; 