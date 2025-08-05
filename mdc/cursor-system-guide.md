
## Cursor Agent Setup Guide
1. Upload this folder into `/workspace` inside Cursor.
2. Set `LINKEDIN_TOKEN` and `LINKEDIN_PERSON_ID` in environment vars.
3. Activate with: `*agent linkedin-autocontent-agent`
4. Schedule with: `*workflow daily-linkedin-post`
5. Customize `hookFormat` in the schedule or use `top-hooks.md`
6. Post logs and CTR data saved to `/data/post-logs.json`
