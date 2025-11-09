export type GrokCompletionOptions = {
  query: string;
  depth?: number;
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Minimal env shim without referencing 'process' identifier (no @types/node required)
const env: Record<string, string | undefined> = (
  ((globalThis as any)?.process?.env) ?? {}
) as Record<string, string | undefined>;
const fetchFn: any = (globalThis as any)?.fetch;

export async function generateBusinessReport({ query, depth = 2 }: GrokCompletionOptions): Promise<string> {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }

  const systemPrompt = [
    "You are an expert business research analyst.",
    "Given a topic, perform concise but thorough desk research:",
    "- Identify key trends, market size, growth drivers, and risks.",
    "- Summarize competition, differentiators, and go-to-market insights.",
    "- Provide actionable recommendations and cite sources inline.",
    "Keep the report structured with headings and bullet points where helpful.",
  ].join(" \n");

  const userPrompt = `Topic: ${query}\nDepth: ${depth}\nPlease produce a compact, comprehensive research brief with cited sources.`;

  if (!fetchFn) {
    throw new Error("Global fetch is unavailable in this runtime");
  }

  const resp = await fetchFn(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Groq API error ${resp.status}: ${text}`);
  }

  const json = await resp.json();
  const content: string | undefined = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from Groq API");
  }

  return content.trim();
}