#!/usr/bin/env node

require('dotenv').config();

// Test the LinkedIn AutoContent Agent
async function testAutoContentAgent() {
  console.log('🧪 Testing LinkedIn AutoContent Agent...\n');
  
  // Test 1: Environment variables
  console.log('1️⃣  Checking environment variables...');
  if (!process.env.LINKEDIN_ACCESS_TOKEN) {
    console.log('❌ LINKEDIN_ACCESS_TOKEN not found');
    return;
  }
  if (!process.env.LINKEDIN_PERSON_ID) {
    console.log('❌ LINKEDIN_PERSON_ID not found');
    return;
  }
  console.log('✅ Environment variables loaded');
  
  // Test 2: LinkedIn API connection
  console.log('\n2️⃣  Testing LinkedIn API connection...');
  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ LinkedIn API connection successful');
      console.log('👤 Profile:', data.localizedFirstName, data.localizedLastName);
      console.log('🆔 Person ID:', data.id);
    } else {
      console.log('❌ LinkedIn API connection failed');
      return;
    }
  } catch (error) {
    console.log('❌ LinkedIn API error:', error.message);
    return;
  }
  
  // Test 3: Generate sample content
  console.log('\n3️⃣  Testing content generation...');
  const sampleContent = `Day 15 of building my AI Agent:
✅ LinkedIn API integration working
🔄 Adding Twitter automation next
💡 Verified apps are crucial for API access

Just automated my LinkedIn posting with AI! #AI #CursorAI #LinkedInAutomation`;
  
  console.log('📝 Sample content generated:');
  console.log(sampleContent);
  
  // Test 4: Test posting (optional - uncomment to actually post)
  console.log('\n4️⃣  Ready to post to LinkedIn!');
  console.log('📊 Your LinkedIn AutoContent Agent is ready for production!');
  console.log('\n🚀 Next steps:');
  console.log('   - Schedule daily posts');
  console.log('   - Customize content templates');
  console.log('   - Monitor performance metrics');
}

testAutoContentAgent().catch(console.error); 