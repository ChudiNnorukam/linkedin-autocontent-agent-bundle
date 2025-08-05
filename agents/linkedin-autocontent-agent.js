
export default async function LinkedInAutoContentAgent({ cursorLog, keyword, hookFormat }) {
  const rawPost = await runTask('cursor-linkedin-post', { topic: keyword, context: cursorLog, hookTemplate: hookFormat });
  const humanPost = await runTask('copyleaks-bypass-rewrite', { content: rawPost });
  const postResult = await runUtil('linkedin-api-client', { content: humanPost });
  if (!postResult.success) throw new Error('LinkedIn post failed.');
  const engagement = await runUtil('post-performance-tracker', { postId: postResult.id });
  await runTask('performance-score-hook', { hook: hookFormat, engagement });
  return { success: true, posted: humanPost, analytics: engagement };
}
