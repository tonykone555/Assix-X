const HERMES_URL = process.env.HERMES_URL;
const HERMES_PASSWORD = process.env.HERMES_PASSWORD;

export async function sendToHermes(
  instruction: string
): Promise<string> {
  const res = await fetch(
    `${HERMES_URL}/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HERMES_PASSWORD}`
      },
      body: JSON.stringify({
        model: 'hermes',
        messages: [{ role: 'user', content: instruction }],
        stream: false
      })
    }
  );
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}
