#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Performance Monitoring Dashboard for LinkedIn AutoContent Agent
class PerformanceDashboard {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.dataDir = path.join(__dirname, '../data');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    console.log('📊 LinkedIn AutoContent Agent - Performance Dashboard\n');
    console.log('='.repeat(60));
    
    await this.createDirectories();
    await this.loadData();
  }

  async createDirectories() {
    const dirs = [
      this.logsDir,
      this.dataDir,
      path.join(this.dataDir, 'analytics'),
      path.join(this.dataDir, 'reports')
    ];
    
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  async loadData() {
    this.posts = await this.loadPosts();
    this.errors = await this.loadErrors();
    this.analytics = await this.loadAnalytics();
  }

  async loadPosts() {
    try {
      const postsFile = path.join(this.logsDir, 'posts.json');
      const data = await fs.readFile(postsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async loadErrors() {
    try {
      const errorsFile = path.join(this.logsDir, 'errors.json');
      const data = await fs.readFile(errorsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async loadAnalytics() {
    try {
      const analyticsFile = path.join(this.dataDir, 'analytics', 'performance.json');
      const data = await fs.readFile(analyticsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return this.generateDefaultAnalytics();
    }
  }

  generateDefaultAnalytics() {
    return {
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
  }

  async showMainMenu() {
    console.log('\n📊 Performance Dashboard Menu:');
    console.log('─'.repeat(40));
    console.log('1. 📈 Overview Statistics');
    console.log('2. 📝 Recent Posts');
    console.log('3. 🎯 Performance Analysis');
    console.log('4. 📊 Engagement Metrics');
    console.log('5. 🚨 Error Logs');
    console.log('6. 📋 Generate Report');
    console.log('7. 🔄 Refresh Data');
    console.log('8. 🚪 Exit');
    
    const choice = await this.askQuestion('\nSelect an option (1-8): ');
    
    switch (choice) {
      case '1':
        await this.showOverviewStatistics();
        break;
      case '2':
        await this.showRecentPosts();
        break;
      case '3':
        await this.showPerformanceAnalysis();
        break;
      case '4':
        await this.showEngagementMetrics();
        break;
      case '5':
        await this.showErrorLogs();
        break;
      case '6':
        await this.generateReport();
        break;
      case '7':
        await this.refreshData();
        break;
      case '8':
        console.log('👋 Goodbye!');
        this.rl.close();
        return;
      default:
        console.log('❌ Invalid option, please try again');
        await this.showMainMenu();
    }
  }

  async showOverviewStatistics() {
    console.log('\n📈 Overview Statistics');
    console.log('─'.repeat(40));
    
    const totalPosts = this.posts.length;
    const totalErrors = this.errors.length;
    const successRate = totalPosts > 0 ? ((totalPosts - totalErrors) / totalPosts * 100).toFixed(1) : 0;
    
    console.log(`📝 Total Posts: ${totalPosts}`);
    console.log(`✅ Success Rate: ${successRate}%`);
    console.log(`❌ Errors: ${totalErrors}`);
    
    if (totalPosts > 0) {
      const latestPost = this.posts[this.posts.length - 1];
      const firstPost = this.posts[0];
      const daysActive = Math.ceil((new Date(latestPost.timestamp) - new Date(firstPost.timestamp)) / (1000 * 60 * 60 * 24));
      
      console.log(`📅 Days Active: ${daysActive}`);
      console.log(`📊 Average Posts/Day: ${(totalPosts / daysActive).toFixed(1)}`);
      console.log(`🕐 Last Post: ${new Date(latestPost.timestamp).toLocaleString()}`);
    }
    
    await this.showMainMenu();
  }

  async showRecentPosts() {
    console.log('\n📝 Recent Posts');
    console.log('─'.repeat(40));
    
    if (this.posts.length === 0) {
      console.log('📭 No posts found');
      await this.showMainMenu();
      return;
    }
    
    const recentPosts = this.posts.slice(-5).reverse();
    
    for (let i = 0; i < recentPosts.length; i++) {
      const post = recentPosts[i];
      console.log(`\n📄 Post ${i + 1}:`);
      console.log(`   🆔 ID: ${post.postId}`);
      console.log(`   📅 Date: ${new Date(post.timestamp).toLocaleString()}`);
      console.log(`   📊 Status: ${post.status}`);
      console.log(`   📝 Content: ${post.content.substring(0, 100)}...`);
    }
    
    await this.showMainMenu();
  }

  async showPerformanceAnalysis() {
    console.log('\n🎯 Performance Analysis');
    console.log('─'.repeat(40));
    
    if (this.posts.length === 0) {
      console.log('📭 No posts to analyze');
      await this.showMainMenu();
      return;
    }
    
    // Calculate performance metrics
    const postsByDay = {};
    this.posts.forEach(post => {
      const date = new Date(post.timestamp).toDateString();
      postsByDay[date] = (postsByDay[date] || 0) + 1;
    });
    
    console.log('📊 Posts by Day:');
    Object.entries(postsByDay).forEach(([date, count]) => {
      console.log(`   ${date}: ${count} posts`);
    });
    
    // Find best and worst performing posts (mock data)
    const mockPerformance = this.posts.map((post, index) => ({
      postId: post.postId,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 10) + 1,
      shares: Math.floor(Math.random() * 5) + 0
    }));
    
    const bestPost = mockPerformance.reduce((best, current) => {
      const currentEngagement = current.likes + current.comments + current.shares;
      const bestEngagement = best.likes + best.comments + best.shares;
      return currentEngagement > bestEngagement ? current : best;
    });
    
    const worstPost = mockPerformance.reduce((worst, current) => {
      const currentEngagement = current.likes + current.comments + current.shares;
      const worstEngagement = worst.likes + worst.comments + worst.shares;
      return currentEngagement < worstEngagement ? current : worst;
    });
    
    console.log(`\n🏆 Best Performing Post:`);
    console.log(`   🆔 ID: ${bestPost.postId}`);
    console.log(`   👁️ Views: ${bestPost.views}`);
    console.log(`   👍 Likes: ${bestPost.likes}`);
    console.log(`   💬 Comments: ${bestPost.comments}`);
    console.log(`   🔄 Shares: ${bestPost.shares}`);
    
    console.log(`\n📉 Worst Performing Post:`);
    console.log(`   🆔 ID: ${worstPost.postId}`);
    console.log(`   👁️ Views: ${worstPost.views}`);
    console.log(`   👍 Likes: ${worstPost.likes}`);
    console.log(`   💬 Comments: ${worstPost.comments}`);
    console.log(`   🔄 Shares: ${worstPost.shares}`);
    
    await this.showMainMenu();
  }

  async showEngagementMetrics() {
    console.log('\n📊 Engagement Metrics');
    console.log('─'.repeat(40));
    
    if (this.posts.length === 0) {
      console.log('📭 No posts to analyze');
      await this.showMainMenu();
      return;
    }
    
    // Mock engagement data
    const mockEngagement = this.posts.map((post, index) => ({
      postId: post.postId,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 10) + 1,
      shares: Math.floor(Math.random() * 5) + 0
    }));
    
    const totalViews = mockEngagement.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = mockEngagement.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = mockEngagement.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = mockEngagement.reduce((sum, post) => sum + post.shares, 0);
    
    console.log(`👁️ Total Views: ${totalViews.toLocaleString()}`);
    console.log(`👍 Total Likes: ${totalLikes.toLocaleString()}`);
    console.log(`💬 Total Comments: ${totalComments.toLocaleString()}`);
    console.log(`🔄 Total Shares: ${totalShares.toLocaleString()}`);
    
    const avgViews = totalViews / this.posts.length;
    const avgLikes = totalLikes / this.posts.length;
    const avgComments = totalComments / this.posts.length;
    const avgShares = totalShares / this.posts.length;
    
    console.log(`\n📈 Averages per Post:`);
    console.log(`   👁️ Views: ${avgViews.toFixed(0)}`);
    console.log(`   👍 Likes: ${avgLikes.toFixed(1)}`);
    console.log(`   💬 Comments: ${avgComments.toFixed(1)}`);
    console.log(`   🔄 Shares: ${avgShares.toFixed(1)}`);
    
    const engagementRate = ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2);
    console.log(`\n📊 Overall Engagement Rate: ${engagementRate}%`);
    
    await this.showMainMenu();
  }

  async showErrorLogs() {
    console.log('\n🚨 Error Logs');
    console.log('─'.repeat(40));
    
    if (this.errors.length === 0) {
      console.log('✅ No errors found');
      await this.showMainMenu();
      return;
    }
    
    const recentErrors = this.errors.slice(-5).reverse();
    
    for (let i = 0; i < recentErrors.length; i++) {
      const error = recentErrors[i];
      console.log(`\n❌ Error ${i + 1}:`);
      console.log(`   📅 Date: ${new Date(error.timestamp).toLocaleString()}`);
      console.log(`   🚨 Error: ${error.error}`);
      if (error.stack) {
        console.log(`   📍 Stack: ${error.stack.split('\n')[0]}`);
      }
    }
    
    await this.showMainMenu();
  }

  async generateReport() {
    console.log('\n📋 Generating Performance Report...');
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalPosts: this.posts.length,
        totalErrors: this.errors.length,
        successRate: this.posts.length > 0 ? ((this.posts.length - this.errors.length) / this.posts.length * 100).toFixed(1) : 0
      },
      posts: this.posts,
      errors: this.errors,
      analytics: this.analytics
    };
    
    const reportFile = path.join(this.dataDir, 'reports', `performance-report-${Date.now()}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`✅ Report generated: ${reportFile}`);
    console.log(`📊 Summary:`);
    console.log(`   📝 Total Posts: ${report.summary.totalPosts}`);
    console.log(`   ❌ Total Errors: ${report.summary.totalErrors}`);
    console.log(`   ✅ Success Rate: ${report.summary.successRate}%`);
    
    await this.showMainMenu();
  }

  async refreshData() {
    console.log('\n🔄 Refreshing Data...');
    
    await this.loadData();
    
    console.log(`✅ Data refreshed:`);
    console.log(`   📝 Posts: ${this.posts.length}`);
    console.log(`   ❌ Errors: ${this.errors.length}`);
    console.log(`   📊 Analytics: Updated`);
    
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
  const dashboard = new PerformanceDashboard();
  
  try {
    await dashboard.initialize();
    await dashboard.showMainMenu();
  } catch (error) {
    console.error('❌ Error:', error.message);
    dashboard.rl.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceDashboard; 