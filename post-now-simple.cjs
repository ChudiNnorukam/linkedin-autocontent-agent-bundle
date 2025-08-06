#!/usr/bin/env node

// Simple LinkedIn Auto-Post Script
// This version avoids ES module conflicts

const fs = require('fs');
const path = require('path');

// Load environment variables manually if .env exists
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  const lines = envFile.split('\n');
  lines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.log('📝 No .env file found, using system environment variables');
}

async function postToLinkedIn() {
  console.log('🚀 LinkedIn AutoContent Agent - Simple Post');
  console.log(`⏰ Current time: ${new Date().toLocaleString()}`);
  console.log(`📅 PST time: ${new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'})}`);
  
  // Check environment variables
  if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_PERSON_ID) {
    console.error('❌ Missing required environment variables:');
    console.error('   LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_ID required');
    process.exit(1);
  }
  
  // Generate content for LinkedIn post about debugging this system
  const debuggingPost = `🔧 Just debugged my LinkedIn automation system - what a journey!

📊 THE PROBLEM:
• Auto-posting wasn't working at 9 AM PST
• PM2 process stuck in restart loops
• Timezone misconfigured (EST vs PST)
• System dependent on local machine being awake 24/7

🧠 MY APPROACH:
• Step-by-step debugging with log analysis
• Identified SIGTERM restart cycles in PM2
• Tested timezone configurations  
• Built multiple deployment options

💡 THE SOLUTION:
• Fixed PM2 cron scheduling with proper flags
• Configured PST timezone correctly
• Created cloud deployment options (GitHub Actions, Railway, Render)
• Built fallback local cron system

✅ THE RESULT:
• Daily 9 AM PST posts now working
• System runs independently in cloud
• Robust error handling and logging
• No more manual intervention needed

🎯 Key lesson: Sometimes the simplest problems require systematic debugging. Process management, timezone handling, and deployment architecture all matter for automation.

What's your biggest automation debugging win recently?

#Automation #DebuggingLife #LinkedIn #TechLearning #ProcessManagement #AI #ContentAutomation`;

  console.log('📝 Generated LinkedIn post about the debugging journey:');
  console.log('─'.repeat(60));
  console.log(debuggingPost);
  console.log('─'.repeat(60));
  
  try {
    // Make the API call using Node.js built-in fetch (Node 18+)
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
              text: debuggingPost
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
      console.log('🎉 LinkedIn post published successfully!');
      console.log(`🆔 Post ID: ${result.id}`);
      console.log('🔗 Check your LinkedIn profile to see the post');
      
      // Log success
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'debugging_journey_post',
        postId: result.id,
        content: debuggingPost.substring(0, 100) + '...',
        status: 'published'
      };
      
      if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs', { recursive: true });
      }
      
      fs.writeFileSync('./logs/posts.json', JSON.stringify([logEntry], null, 2));
      
    } else {
      const errorText = await response.text();
      console.error('❌ Post failed:', response.status, response.statusText);
      console.error('Response:', errorText);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error posting to LinkedIn:', error.message);
    process.exit(1);
  }
}

// Run the post
postToLinkedIn().catch(console.error); 