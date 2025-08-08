#!/usr/bin/env node

require('dotenv').config();
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

// Daily Post Scheduler for LinkedIn AutoContent Agent
class DailyPostScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduleTime = '09:00'; // Default: 9 AM daily
    this.timezone = 'America/Los_Angeles';
    this.templatePath = path.join(__dirname, '../templates');
    this.logPath = path.join(__dirname, '../logs/scheduler.log');
  }

  async initialize() {
    console.log('🚀 Initializing Daily Post Scheduler...');
    
    // Create necessary directories
    await this.createDirectories();
    
    // Load configuration
    await this.loadConfiguration();
    
    // Test LinkedIn API connection only when posting is enabled
    const shouldPost = String(process.env.POSTING_ENABLED).toLowerCase() === 'true';
    if (shouldPost) {
      await this.testLinkedInConnection();
    } else {
      console.log('🧪 Dry-run mode detected (POSTING_ENABLED != true). Skipping API connectivity test.');
    }
    
    console.log('✅ Scheduler initialized successfully');
  }

  async createDirectories() {
    const dirs = [
      path.join(__dirname, '../logs'),
      path.join(__dirname, '../templates'),
      path.join(__dirname, '../data/scheduled')
    ];
    
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  async loadConfiguration() {
    try {
      const configPath = path.join(__dirname, '../config/scheduler.json');
      const configData = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configData);
      
      this.scheduleTime = config.scheduleTime || '09:00';
      this.timezone = config.timezone || 'America/New_York';
      
      console.log(`📅 Schedule: Daily at ${this.scheduleTime} (${this.timezone})`);
    } catch (error) {
      console.log('📝 Using default configuration');
      await this.createDefaultConfig();
    }
  }

  async createDefaultConfig() {
    const config = {
      scheduleTime: '09:00',
      timezone: 'America/New_York',
      enabled: true,
      templates: ['ai-development', 'productivity', 'learning-journey'],
      rotation: 'sequential'
    };
    
    const configDir = path.join(__dirname, '../config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(
      path.join(configDir, 'scheduler.json'),
      JSON.stringify(config, null, 2)
    );
  }

  async testLinkedInConnection() {
    try {
      const token = process.env.LINKEDIN_ACCESS_TOKEN || '';
      if (!token) {
        throw new Error('Missing LINKEDIN_ACCESS_TOKEN');
      }
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const profile = await response.json();
        console.log(`✅ LinkedIn API connected: ${profile.localizedFirstName} ${profile.localizedLastName}`);
      } else {
        const body = await response.text();
        throw new Error(`API connection failed: ${response.status} ${response.statusText} | ${body.slice(0,200)}`);
      }
    } catch (error) {
      console.error('❌ LinkedIn API connection failed:', error.message);
      throw error;
    }
  }

  async generateDailyContent() {
    console.log('📝 Generating daily content...');
    
    const templates = await this.loadTemplates();
    const selectedTemplate = this.selectTemplate(templates);
    const content = await this.generateContent(selectedTemplate);
    
    return content;
  }

  async loadTemplates() {
    const templates = [];
    const templateDir = path.join(__dirname, '../templates');
    
    try {
      const files = await fs.readdir(templateDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const templateData = await fs.readFile(path.join(templateDir, file), 'utf8');
          const template = JSON.parse(templateData);
          templates.push(template);
        }
      }
    } catch (error) {
      console.log('📝 Creating default templates...');
      await this.createDefaultTemplates();
      return await this.loadTemplates();
    }
    
    return templates;
  }

  async createDefaultTemplates() {
    const templates = [
      {
        name: 'ai-development',
        title: 'AI Development Progress',
        hooks: [
          'Just automated my LinkedIn posting with AI!',
          'The future of work is here - AI automation is game-changing!',
          'From zero to automation hero in just {days} days!'
        ],
        structure: {
          day: '{current_day}',
          recentWin: '{ai_win}',
          inProgress: '{current_project}',
          insight: '{key_learning}'
        },
        hashtags: ['#AI', '#Automation', '#Productivity', '#CursorAI']
      },
      {
        name: 'productivity',
        title: 'Productivity Breakthrough',
        hooks: [
          'Just saved {hours} hours with automation!',
          'This {tool} changed my workflow forever!',
          'Productivity hack: {method} = {result}!'
        ],
        structure: {
          day: '{current_day}',
          recentWin: '{productivity_win}',
          inProgress: '{next_optimization}',
          insight: '{productivity_insight}'
        },
        hashtags: ['#Productivity', '#Automation', '#Workflow', '#Efficiency']
      },
      {
        name: 'learning-journey',
        title: 'Learning Journey',
        hooks: [
          'Learning {skill} in {timeframe} - here\'s what worked!',
          'From beginner to {level} in {days} days!',
          'The {number} things I learned about {topic}!'
        ],
        structure: {
          day: '{current_day}',
          recentWin: '{learning_achievement}',
          inProgress: '{current_learning}',
          insight: '{learning_insight}'
        },
        hashtags: ['#Learning', '#Growth', '#Development', '#Skills']
      }
    ];
    
    for (const template of templates) {
      await fs.writeFile(
        path.join(__dirname, '../templates', `${template.name}.json`),
        JSON.stringify(template, null, 2)
      );
    }
  }

  selectTemplate(templates) {
    // Simple rotation strategy
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const templateIndex = dayOfYear % templates.length;
    
    return templates[templateIndex];
  }

  async generateContent(template) {
    const currentDate = new Date();
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Enhanced content generation with structured elements
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
    
    // Get structured content elements
    const metrics = getRandomElement(template.variables.metrics || ['📊 80% time reduction on content creation']);
    const technical = getRandomElement(template.variables.technical_details || ['🔧 Built with Node.js, PM2, LinkedIn API v2']);
    const challenge = getRandomElement(template.variables.challenges || ['🎯 LinkedIn API rate limiting during peak hours']);
    const solution = getRandomElement(template.variables.solutions || ['✅ Implemented exponential backoff for API retries']);
    const insight = getRandomElement(template.variables.insights || ['💡 AI agents can handle repetitive tasks 10x faster']);
    const question = getRandomElement(template.variables.questions || ['🤔 What\'s your biggest automation challenge?']);
    
    // Build enhanced content structure
    const content = `Day ${dayOfYear} of building my AI Agent:

${metrics}
${technical}
${challenge}
${solution}
${insight}

${question}

${template.hashtags.join(' ')}`;
    
    return content;
  }

  async postToLinkedIn(content) {
    try {
      if (String(process.env.POSTING_ENABLED).toLowerCase() !== 'true') {
        console.log('🧪 POSTING_ENABLED is not true. Dry-run: not posting to LinkedIn.');
        await this.logPost(content, 'dry-run');
        return { ok: true, id: 'dry-run', dryRun: true };
      }
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Post published successfully!');
        console.log(`🆔 Post ID: ${result.id}`);
        
        // Log the post
        await this.logPost(content, result.id);
        
        return result;
      } else {
        const body = await response.text();
        throw new Error(`Post failed: ${response.status} ${response.statusText} | ${body.slice(0,200)}`);
      }
    } catch (error) {
      console.error('❌ Post failed:', error.message);
      throw error;
    }
  }

  async logPost(content, postId) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      postId: postId,
      content: content,
      status: 'published'
    };
    
    const logFile = path.join(__dirname, '../logs/posts.json');
    let logs = [];
    
    try {
      const existingLogs = await fs.readFile(logFile, 'utf8');
      logs = JSON.parse(existingLogs);
    } catch (error) {
      // File doesn't exist yet
    }
    
    logs.push(logEntry);
    await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
  }

  async runScheduledPost() {
    try {
      console.log('🕐 Running scheduled post...');
      if (await this.hasPostedToday()) {
        console.log('⏭️ Already posted today. Skipping.');
        return { skipped: true };
      }
      
      const content = await this.generateDailyContent();
      console.log('📝 Generated content:');
      console.log('─'.repeat(50));
      console.log(content);
      console.log('─'.repeat(50));
      
      const result = await this.postToLinkedIn(content);
      
      console.log('✅ Scheduled post completed successfully!');
      return result;
      
    } catch (error) {
      console.error('❌ Scheduled post failed:', error.message);
      await this.logError(error);
    }
  }

  async hasPostedToday() {
    try {
      const logFile = path.join(__dirname, '../logs/posts.json');
      const raw = await fs.readFile(logFile, 'utf8');
      const logs = JSON.parse(raw);
      if (!Array.isArray(logs) || logs.length === 0) return false;
      const last = logs[logs.length - 1];
      const lastDate = new Date(last.timestamp).toLocaleDateString('en-US', { timeZone: this.timezone });
      const today = new Date().toLocaleDateString('en-US', { timeZone: this.timezone });
      return lastDate === today;
    } catch {
      return false;
    }
  }

  async logError(error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    };
    
    const logFile = path.join(__dirname, '../logs/errors.json');
    let errors = [];
    
    try {
      const existingErrors = await fs.readFile(logFile, 'utf8');
      errors = JSON.parse(existingErrors);
    } catch (e) {
      // File doesn't exist yet
    }
    
    errors.push(errorLog);
    await fs.writeFile(logFile, JSON.stringify(errors, null, 2));
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduler is already running');
      return;
    }
    
    console.log('🚀 Starting daily post scheduler...');
    console.log(`📅 Schedule: Daily at ${this.scheduleTime} (${this.timezone})`);
    
    // Parse schedule time
    const [hour, minute] = this.scheduleTime.split(':');
    const cronExpression = `${minute} ${hour} * * *`;
    
    // Schedule the job
    cron.schedule(cronExpression, () => {
      this.runScheduledPost();
    }, {
      timezone: this.timezone
    });
    
    this.isRunning = true;
    console.log('✅ Scheduler started successfully');
    console.log('💡 Press Ctrl+C to stop the scheduler');
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Scheduler is not running');
      return;
    }
    
    console.log('🛑 Stopping scheduler...');
    this.isRunning = false;
    process.exit(0);
  }
}

// Main execution
async function main() {
  const scheduler = new DailyPostScheduler();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    scheduler.stop();
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    scheduler.stop();
  });
  
  try {
    await scheduler.initialize();
    scheduler.start();
  } catch (error) {
    console.error('❌ Failed to start scheduler:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DailyPostScheduler; 