
export async function run({ topic, context, hookTemplate }) {
  return `Day ${context.day} of building an AI Agent:
✅ ${context.recentWin}
🔄 ${context.inProgress}
💡 ${context.insight}

${hookTemplate.replace('{{hook}}', topic)} #AI #CursorAI #LinkedInAutomation`;
}
