import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const data = {
    dl121130: Number(await kv.get("dl121130") || 0),
    dl121123: Number(await kv.get("dl121123") || 0),
    dl121121p: Number(await kv.get("dl121121p") || 0),
    dl121121: Number(await kv.get("dl121121") || 0),
  };

  res.status(200).json(data);
}
