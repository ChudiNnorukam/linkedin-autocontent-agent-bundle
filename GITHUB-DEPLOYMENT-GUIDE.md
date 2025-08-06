# 🚀 GitHub Actions Deployment Guide
## Free 24/7 LinkedIn Auto-Posting

Your LinkedIn automation will run **completely free** on GitHub's servers, posting daily at 9 AM PST without requiring your Mac to be awake.

## ✅ What's Already Done
- ✅ GitHub Actions workflow created (`.github/workflows/linkedin-scheduler.yml`)
- ✅ Script fixed for compatibility (`post-now-simple.cjs`)
- ✅ Timezone configured for PST
- ✅ Error handling and logging included

## 📋 Next Steps (5 minutes)

### 1. Push to GitHub
```bash
# If this isn't already a Git repo
git init
git add .
git commit -m "Add LinkedIn AutoContent Agent with GitHub Actions"

# Create repo on GitHub.com and push
git remote add origin https://github.com/YOUR_USERNAME/linkedin-autocontent-agent.git
git branch -M main
git push -u origin main
```

### 2. Add Secrets to GitHub Repository
Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets (**CRITICAL - Get these from your current working `.env` file**):

| Secret Name | Where to Find Value |
|-------------|-------------------|
| `LINKEDIN_ACCESS_TOKEN` | From your `.env` file |
| `LINKEDIN_PERSON_ID` | From your `.env` file |  
| `LINKEDIN_CLIENT_ID` | From your `.env` file |
| `LINKEDIN_CLIENT_SECRET` | From your `.env` file |
| `OPENAI_API_KEY` | From your `.env` file (optional) |

### 3. Enable GitHub Actions
- Go to **Actions** tab in your repo
- If prompted, click **"I understand my workflows, go ahead and enable them"**

### 4. Test the Setup
- Go to **Actions** → **LinkedIn AutoContent Scheduler**
- Click **"Run workflow"** → **"Run workflow"** (manual trigger)
- Watch it run and post to LinkedIn!

## 🕘 Schedule Details
- **Frequency**: Daily at 9:00 AM PST
- **Runs on**: GitHub's Ubuntu servers (free)
- **Content**: Rotates through your templates automatically
- **Logs**: Saved as artifacts for 30 days

## 🔧 How It Works
1. Every day at 9 AM PST, GitHub triggers the workflow
2. Spins up a fresh Ubuntu container
3. Installs dependencies and runs your posting script
4. Posts to LinkedIn using your saved credentials
5. Uploads logs for monitoring

## 📊 Monitoring
- **View runs**: GitHub repo → Actions tab
- **Check logs**: Click on any workflow run
- **Download artifacts**: Logs are saved as downloadable files
- **Manual triggers**: Run anytime using "Run workflow" button

## 🛡️ Security Features
- All credentials stored as encrypted GitHub secrets
- Fresh container for each run (no persistence)
- Logs automatically cleaned up after 30 days
- No local machine dependency

## 🎯 Benefits vs Local PM2
| Feature | Local PM2 | GitHub Actions |
|---------|-----------|----------------|
| **Cost** | Free | Free |
| **Reliability** | Mac must be awake | Always runs |
| **Maintenance** | Manual updates | Auto-updates |
| **Monitoring** | Local logs only | Web dashboard |
| **Scaling** | One machine | Cloud infrastructure |

## 🚨 Important Notes
- GitHub Actions has usage limits (2,000 minutes/month free) - this uses ~5 minutes/month
- Keep your `.env` file secure and never commit it to GitHub
- The workflow will auto-post every day - disable by going to Actions → Workflow → "..." → Disable

## 🎉 Success!
Once set up, your LinkedIn will automatically post every day at 9 AM PST without any manual intervention. Check your LinkedIn profile tomorrow morning to see it working!

---

**Need help?** Check the Actions tab for any error logs or run the workflow manually to test. 