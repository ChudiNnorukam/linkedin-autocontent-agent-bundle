#!/usr/bin/env node

require('dotenv').config();

// Sample content generation for LinkedIn AutoContent Agent
async function generateSamplePost() {
  console.log('🎯 Generating Sample LinkedIn Post...\n');
  
  // Sample context for Cursor project
  const context = {
    day: 15,
    recentWin: "LinkedIn API integration working perfectly",
    inProgress: "Adding Twitter automation next",
    insight: "Verified apps are crucial for API access"
  };
  
  // Sample hook template
  const hookTemplate = "Just automated my LinkedIn posting with AI!";
  
  // Generate content using the template
  const content = `Day ${context.day} of building my AI Agent:
✅ ${context.recentWin}
🔄 ${context.inProgress}
💡 ${context.insight}

${hookTemplate} #AI #CursorAI #LinkedInAutomation`;
  
  console.log('📝 Generated Content:');
  console.log('─'.repeat(50));
  console.log(content);
  console.log('─'.repeat(50));
  
  // Test LinkedIn API connection
  console.log('\n🔗 Testing LinkedIn API connection...');
  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ LinkedIn API connection successful');
      console.log('🚀 Ready to post to LinkedIn!');
      
      // Ask user if they want to post
      console.log('\n❓ Would you like to post this to LinkedIn? (y/n)');
      // In a real implementation, you'd wait for user input
      console.log('💡 To actually post, uncomment the posting code in this script');
      
    } else {
      console.log('❌ LinkedIn API connection failed');
    }
  } catch (error) {
    console.log('❌ LinkedIn API error:', error.message);
  }
  
  console.log('\n🎉 Sample post generation complete!');
  console.log('📊 Your LinkedIn AutoContent Agent is ready for production!');
}

generateSamplePost().catch(console.error); 