const GEMINI_MODEL = 'gemini-2.0-flash';
const TIMEOUT_MS = 10000;
const MAX_RETRIES = 1;

function buildUrl(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return '';
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
}

export async function callGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  const url = buildUrl();
  if (!url) return null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I will reason step by step and return valid JSON.' }] },
            { role: 'user', parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.status === 429 && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }

      if (!res.ok) return null;

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch {
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      return null;
    }
  }

  return null;
}

export function extractJSON(text: string): Record<string, unknown> | null {
  const match = text.replace(/```(?:json)?/g, '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export function extractJSONArray(text: string): unknown[] | null {
  const cleaned = text.replace(/```(?:json)?/g, '');
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
