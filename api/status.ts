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

  // Prototype note: report is returned by /api/research directly.
  res.status(200).json({ requestId, status: "completed" });
}