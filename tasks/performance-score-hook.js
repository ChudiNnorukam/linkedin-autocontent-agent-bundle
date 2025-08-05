
export async function run({ hook, engagement }) {
  const score = (engagement.comments + engagement.likes) / engagement.views;
  if (score > 0.075) await runUtil('top-hooks-memory', { hook });
  return score;
}
