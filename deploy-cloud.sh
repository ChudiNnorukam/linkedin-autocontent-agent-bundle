#!/bin/bash

# LinkedIn AutoContent Agent - Cloud Deployment Script
# This deploys your agent to run 24/7 independent of your local machine

echo "🚀 LinkedIn AutoContent Agent - Cloud Deployment"
echo "================================================"

# Configuration
PROJECT_NAME="linkedin-autocontent-agent"
CLOUD_PROVIDER="github-actions"  # Free tier option
LOCAL_DIR="/Users/chudinnorukam/Documents/n8n/linkedin-autocontent-agent-bundle"

echo "📋 Deployment Options:"
echo "1. GitHub Actions (Free) - Runs on GitHub's servers"
echo "2. Railway (Free $5 credit) - Simple deployment"
echo "3. Render (Free tier) - Web service deployment"
echo "4. Local cron setup (runs when your Mac is on)"

# GitHub Actions Workflow (Free Option)
create_github_actions() {
    echo "🔧 Setting up GitHub Actions deployment..."
    
    mkdir -p .github/workflows
    
    cat > .github/workflows/linkedin-scheduler.yml << 'EOF'
name: LinkedIn AutoContent Scheduler

on:
  schedule:
    # Runs at 9:00 AM PST (17:00 UTC)
    - cron: '0 17 * * *'
  workflow_dispatch: # Manual trigger

env:
  NODE_VERSION: '18'

jobs:
  post-content:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Generate and post content
      env:
        LINKEDIN_ACCESS_TOKEN: ${{ secrets.LINKEDIN_ACCESS_TOKEN }}
        LINKEDIN_PERSON_ID: ${{ secrets.LINKEDIN_PERSON_ID }}
        LINKEDIN_CLIENT_ID: ${{ secrets.LINKEDIN_CLIENT_ID }}
        LINKEDIN_CLIENT_SECRET: ${{ secrets.LINKEDIN_CLIENT_SECRET }}
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      run: |
        echo "🕘 Current time: $(date)"
        echo "🌍 UTC time: $(date -u)"
        echo "📅 PST time: $(TZ='America/Los_Angeles' date)"
        node post-now.js
        
    - name: Upload logs as artifacts
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: posting-logs-${{ github.run_number }}
        path: logs/
        retention-days: 30
EOF

    echo "✅ GitHub Actions workflow created"
    echo "📝 Next steps:"
    echo "   1. Push this repo to GitHub"
    echo "   2. Add secrets in GitHub repo settings:"
    echo "      - LINKEDIN_ACCESS_TOKEN"
    echo "      - LINKEDIN_PERSON_ID" 
    echo "      - LINKEDIN_CLIENT_ID"
    echo "      - LINKEDIN_CLIENT_SECRET"
    echo "      - OPENAI_API_KEY"
    echo "   3. Enable GitHub Actions in repo settings"
}

# Railway Deployment (Simple and reliable)
create_railway_config() {
    echo "🚂 Setting up Railway deployment..."
    
    cat > railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "restartPolicyType": "on-failure",
    "restartPolicyMaxRetries": 3
  }
}
EOF

    cat > Procfile << 'EOF'
web: node scheduler/daily-post-scheduler.js
EOF

    echo "✅ Railway configuration created"
    echo "📝 Deploy to Railway:"
    echo "   1. Install Railway CLI: npm install -g @railway/cli"
    echo "   2. Login: railway login"
    echo "   3. Deploy: railway up"
    echo "   4. Set environment variables in Railway dashboard"
}

# Render Deployment 
create_render_config() {
    echo "🎨 Setting up Render deployment..."
    
    cat > render.yaml << 'EOF'
services:
  - type: cron
    name: linkedin-autocontent-scheduler
    env: node
    buildCommand: npm install
    startCommand: node scheduler/daily-post-scheduler.js
    schedule: "0 17 * * *"  # 9 AM PST = 5 PM UTC
    envVars:
      - key: NODE_ENV
        value: production
      - key: LINKEDIN_ACCESS_TOKEN
        sync: false
      - key: LINKEDIN_PERSON_ID  
        sync: false
      - key: OPENAI_API_KEY
        sync: false
EOF

    echo "✅ Render configuration created"
    echo "📝 Deploy to Render:"
    echo "   1. Connect GitHub repo to Render"
    echo "   2. Set environment variables in Render dashboard"
    echo "   3. Deploy as a Cron Job service"
}

# Local cron setup (fallback)
setup_local_cron() {
    echo "💻 Setting up local cron job..."
    
    # Create a wrapper script that handles environment
    cat > linkedin-cron-wrapper.sh << EOF
#!/bin/bash
cd $LOCAL_DIR
source .env 2>/dev/null || true
/usr/local/bin/node post-now.js >> logs/cron.log 2>&1
EOF
    
    chmod +x linkedin-cron-wrapper.sh
    
    # Add to crontab (9 AM PST = 9 AM local if you're in PST)
    CRON_JOB="0 9 * * * $LOCAL_DIR/linkedin-cron-wrapper.sh"
    
    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -F "$LOCAL_DIR/linkedin-cron-wrapper.sh"; then
        echo "⚠️  Cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        echo "✅ Cron job added"
    fi
    
    echo "📝 Local cron setup complete"
    echo "   - Runs daily at 9 AM PST"
    echo "   - Logs saved to logs/cron.log"
    echo "   - Requires your Mac to be on and awake"
}

# Main menu
echo ""
read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        create_github_actions
        ;;
    2)  
        create_railway_config
        ;;
    3)
        create_render_config
        ;;
    4)
        setup_local_cron
        ;;
    *)
        echo "❌ Invalid choice. Run script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Deployment configured!"
echo "💡 Recommended: Use GitHub Actions (option 1) for free 24/7 posting"
echo "🔧 Current PM2 processes will continue running locally" 