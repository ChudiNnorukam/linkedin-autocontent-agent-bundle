
export async function run({ postId }) {
  const res = await fetch(`https://analytics.example.com/metrics?postId=${postId}`);
  return await res.json();
}
