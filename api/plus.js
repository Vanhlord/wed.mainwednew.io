import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const version = req.query.v; // nhận id phiên bản

  if (!version) {
    return res.status(400).json({ error: "Missing version id" });
  }

  const count = Number((await kv.get(version)) || 0);
  await kv.set(version, count + 1);

  res.status(200).json({ ok: true });
}
