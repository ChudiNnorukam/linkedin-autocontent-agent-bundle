#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Template Manager for LinkedIn AutoContent Agent
class TemplateManager {
  constructor() {
    this.templatesDir = path.join(__dirname, 'templates');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    console.log('🎨 LinkedIn AutoContent Agent - Template Manager\n');
    console.log('='.repeat(60));
    
    await this.createTemplatesDirectory();
    await this.loadExistingTemplates();
  }

  async createTemplatesDirectory() {
    try {
      await fs.mkdir(this.templatesDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async loadExistingTemplates() {
    try {
      const files = await fs.readdir(this.templatesDir);
      const templates = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const templateData = await fs.readFile(path.join(this.templatesDir, file), 'utf8');
          const template = JSON.parse(templateData);
          templates.push(template);
        }
      }
      
      this.templates = templates;
      console.log(`📁 Loaded ${templates.length} existing templates`);
    } catch (error) {
      this.templates = [];
      console.log('📁 No existing templates found');
    }
  }

  async showMainMenu() {
    console.log('\n🎯 Template Manager Menu:');
    console.log('─'.repeat(40));
    console.log('1. 📝 Create new template');
    console.log('2. ✏️  Edit existing template');
    console.log('3. 👀 View all templates');
    console.log('4. 🗑️  Delete template');
    console.log('5. 🧪 Test template');
    console.log('6. 📊 Template analytics');
    console.log('7. 🚪 Exit');
    
    const choice = await this.askQuestion('\nSelect an option (1-7): ');
    
    switch (choice) {
      case '1':
        await this.createNewTemplate();
        break;
      case '2':
        await this.editTemplate();
        break;
      case '3':
        await this.viewAllTemplates();
        break;
      case '4':
        await this.deleteTemplate();
        break;
      case '5':
        await this.testTemplate();
        break;
      case '6':
        await this.showTemplateAnalytics();
        break;
      case '7':
        console.log('👋 Goodbye!');
        this.rl.close();
        return;
      default:
        console.log('❌ Invalid option, please try again');
        await this.showMainMenu();
    }
  }

  async createNewTemplate() {
    console.log('\n📝 Creating New Template');
    console.log('─'.repeat(40));
    
    const template = {
      name: await this.askQuestion('Template name (e.g., tech-startup): '),
      title: await this.askQuestion('Template title (e.g., Tech Startup Journey): '),
      description: await this.askQuestion('Template description: '),
      category: await this.askQuestion('Category (e.g., business, tech, lifestyle): '),
      hooks: await this.getHooks(),
      structure: await this.getStructure(),
      hashtags: await this.getHashtags(),
      variables: await this.getVariables(),
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    await this.saveTemplate(template);
    console.log('✅ Template created successfully!');
    
    await this.showMainMenu();
  }

  async getHooks() {
    console.log('\n🎣 Hook Templates (viral opening lines):');
    console.log('Enter hook templates, one per line. Type "done" when finished.');
    
    const hooks = [];
    while (true) {
      const hook = await this.askQuestion('Hook template: ');
      if (hook.toLowerCase() === 'done') break;
      hooks.push(hook);
    }
    
    return hooks;
  }

  async getStructure() {
    console.log('\n🏗️ Content Structure:');
    console.log('Define the structure of your posts. Use placeholders like {variable_name}');
    
    const structure = {
      day: await this.askQuestion('Day format (e.g., "Day {current_day} of {journey}"): '),
      recentWin: await this.askQuestion('Recent win format: '),
      inProgress: await this.askQuestion('In progress format: '),
      insight: await this.askQuestion('Key insight format: ')
    };
    
    return structure;
  }

  async getHashtags() {
    console.log('\n🏷️ Hashtags:');
    console.log('Enter hashtags, separated by spaces:');
    
    const hashtagsInput = await this.askQuestion('Hashtags: ');
    return hashtagsInput.split(' ').filter(tag => tag.trim() !== '');
  }

  async getVariables() {
    console.log('\n📊 Content Variables:');
    console.log('Define variables that will be randomly selected for content generation');
    
    const variables = {};
    const variableTypes = ['achievements', 'challenges', 'insights', 'goals'];
    
    for (const type of variableTypes) {
      console.log(`\n${type.charAt(0).toUpperCase() + type.slice(1)}:`);
      const values = [];
      
      while (true) {
        const value = await this.askQuestion(`${type} option (or "done"): `);
        if (value.toLowerCase() === 'done') break;
        values.push(value);
      }
      
      variables[type] = values;
    }
    
    return variables;
  }

  async saveTemplate(template) {
    const filename = `${template.name}.json`;
    const filepath = path.join(this.templatesDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(template, null, 2));
    console.log(`💾 Template saved as ${filename}`);
  }

  async editTemplate() {
    if (this.templates.length === 0) {
      console.log('❌ No templates available to edit');
      await this.showMainMenu();
      return;
    }
    
    console.log('\n✏️ Edit Template');
    console.log('─'.repeat(40));
    
    for (let i = 0; i < this.templates.length; i++) {
      console.log(`${i + 1}. ${this.templates[i].title} (${this.templates[i].name})`);
    }
    
    const choice = await this.askQuestion('\nSelect template to edit (number): ');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < this.templates.length) {
      const template = this.templates[index];
      await this.editTemplateFields(template);
    } else {
      console.log('❌ Invalid selection');
    }
    
    await this.showMainMenu();
  }

  async editTemplateFields(template) {
    console.log(`\n✏️ Editing: ${template.title}`);
    console.log('─'.repeat(40));
    
    console.log('1. Title');
    console.log('2. Description');
    console.log('3. Hooks');
    console.log('4. Structure');
    console.log('5. Hashtags');
    console.log('6. Variables');
    console.log('7. Back to main menu');
    
    const choice = await this.askQuestion('\nWhat would you like to edit? (1-7): ');
    
    switch (choice) {
      case '1':
        template.title = await this.askQuestion('New title: ');
        break;
      case '2':
        template.description = await this.askQuestion('New description: ');
        break;
      case '3':
        template.hooks = await this.getHooks();
        break;
      case '4':
        template.structure = await this.getStructure();
        break;
      case '5':
        template.hashtags = await this.getHashtags();
        break;
      case '6':
        template.variables = await this.getVariables();
        break;
      case '7':
        return;
      default:
        console.log('❌ Invalid option');
        return;
    }
    
    template.lastModified = new Date().toISOString();
    await this.saveTemplate(template);
    console.log('✅ Template updated successfully!');
  }

  async viewAllTemplates() {
    console.log('\n👀 All Templates');
    console.log('─'.repeat(40));
    
    if (this.templates.length === 0) {
      console.log('📭 No templates found');
      await this.showMainMenu();
      return;
    }
    
    for (const template of this.templates) {
      console.log(`\n📄 ${template.title}`);
      console.log(`   Name: ${template.name}`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Hooks: ${template.hooks.length}`);
      console.log(`   Hashtags: ${template.hashtags.join(', ')}`);
      console.log(`   Created: ${new Date(template.created).toLocaleDateString()}`);
      console.log(`   Modified: ${new Date(template.lastModified).toLocaleDateString()}`);
    }
    
    await this.showMainMenu();
  }

  async deleteTemplate() {
    if (this.templates.length === 0) {
      console.log('❌ No templates available to delete');
      await this.showMainMenu();
      return;
    }
    
    console.log('\n🗑️ Delete Template');
    console.log('─'.repeat(40));
    
    for (let i = 0; i < this.templates.length; i++) {
      console.log(`${i + 1}. ${this.templates[i].title} (${this.templates[i].name})`);
    }
    
    const choice = await this.askQuestion('\nSelect template to delete (number): ');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < this.templates.length) {
      const template = this.templates[index];
      const confirm = await this.askQuestion(`Are you sure you want to delete "${template.title}"? (y/n): `);
      
      if (confirm.toLowerCase() === 'y') {
        const filename = `${template.name}.json`;
        const filepath = path.join(this.templatesDir, filename);
        
        try {
          await fs.unlink(filepath);
          this.templates.splice(index, 1);
          console.log('✅ Template deleted successfully!');
        } catch (error) {
          console.log('❌ Error deleting template:', error.message);
        }
      }
    } else {
      console.log('❌ Invalid selection');
    }
    
    await this.showMainMenu();
  }

  async testTemplate() {
    if (this.templates.length === 0) {
      console.log('❌ No templates available to test');
      await this.showMainMenu();
      return;
    }
    
    console.log('\n🧪 Test Template');
    console.log('─'.repeat(40));
    
    for (let i = 0; i < this.templates.length; i++) {
      console.log(`${i + 1}. ${this.templates[i].title} (${this.templates[i].name})`);
    }
    
    const choice = await this.askQuestion('\nSelect template to test (number): ');
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < this.templates.length) {
      const template = this.templates[index];
      await this.generateTestContent(template);
    } else {
      console.log('❌ Invalid selection');
    }
    
    await this.showMainMenu();
  }

  async generateTestContent(template) {
    console.log(`\n🧪 Testing Template: ${template.title}`);
    console.log('─'.repeat(50));
    
    const currentDate = new Date();
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Generate sample content using template
    const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];
    const achievement = template.variables?.achievements?.[Math.floor(Math.random() * template.variables.achievements.length)] || 'Made significant progress';
    const challenge = template.variables?.challenges?.[Math.floor(Math.random() * template.variables.challenges.length)] || 'Working on next milestone';
    const insight = template.variables?.insights?.[Math.floor(Math.random() * template.variables.insights.length)] || 'Learning valuable lessons';
    
    const content = `${template.structure.day.replace('{current_day}', dayOfYear).replace('{journey}', 'building my AI Agent')}:
✅ ${achievement}
🔄 ${challenge}
💡 ${insight}

${hook} ${template.hashtags.join(' ')}`;
    
    console.log('📝 Generated Content:');
    console.log('─'.repeat(50));
    console.log(content);
    console.log('─'.repeat(50));
    
    const postNow = await this.askQuestion('\nWould you like to post this to LinkedIn? (y/n): ');
    
    if (postNow.toLowerCase() === 'y') {
      await this.postToLinkedIn(content);
    }
  }

  async postToLinkedIn(content) {
    try {
      console.log('🚀 Posting to LinkedIn...');
      
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
      } else {
        throw new Error(`Post failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Post failed:', error.message);
    }
  }

  async showTemplateAnalytics() {
    console.log('\n📊 Template Analytics');
    console.log('─'.repeat(40));
    
    if (this.templates.length === 0) {
      console.log('📭 No templates to analyze');
      await this.showMainMenu();
      return;
    }
    
    console.log(`📈 Total Templates: ${this.templates.length}`);
    
    const categories = {};
    this.templates.forEach(template => {
      categories[template.category] = (categories[template.category] || 0) + 1;
    });
    
    console.log('\n📂 Templates by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
    
    const totalHooks = this.templates.reduce((sum, template) => sum + template.hooks.length, 0);
    const avgHooks = totalHooks / this.templates.length;
    
    console.log(`\n🎣 Average hooks per template: ${avgHooks.toFixed(1)}`);
    console.log(`🏷️ Total hashtags across templates: ${this.templates.reduce((sum, template) => sum + template.hashtags.length, 0)}`);
    
    await this.showMainMenu();
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }
}

// Main execution
async function main() {
  const manager = new TemplateManager();
  
  try {
    await manager.initialize();
    await manager.showMainMenu();
  } catch (error) {
    console.error('❌ Error:', error.message);
    manager.rl.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = TemplateManager; 