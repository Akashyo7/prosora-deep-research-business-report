export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { requestId } = (req.query || {}) as { requestId?: string };
  if (!requestId) {
    res.status(400).json({ error: "Missing 'requestId'" });
    return;
  }

  // Prototype: report is returned in /api/research response, no persistence here
  res.status(404).json({ requestId, error: "Report not persisted in prototype. Use /api/research." });
}