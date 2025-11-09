// Avoid importing @vercel/node types to satisfy local TypeScript without dev deps
import { generateBusinessReport } from "./_lib/groq";

function uuid(): string {
  // Node 18+ has crypto.randomUUID
  try {
    // @ts-ignore
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const rawBody = req.body ?? {};
  const body = typeof rawBody === "string" ? safeJsonParse(rawBody) : rawBody;
  const { query, depth } = (body || {}) as { query?: string; depth?: number };
  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "Missing or invalid 'query'" });
    return;
  }

  const requestId = uuid();

  try {
    // Prototype: generate the report synchronously and return immediately
    const report = await generateBusinessReport({ query, depth: depth ?? 2 });
    res.status(200).json({ requestId, status: "completed", report });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to generate report" });
  }
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}