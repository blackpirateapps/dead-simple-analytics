// api/analytics.js
import { createClient } from "@libsql/client/web";

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { domain, path, referrer, ts } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain required" });

    await client.execute({
      sql: "INSERT INTO pageviews (domain, path, referrer, ts) VALUES (?, ?, ?, ?)",
      args: [domain, path, referrer, ts],
    });

    return res.status(200).json({ success: true });
  }

  if (req.method === "GET") {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ error: "Domain required" });

    const result = await client.execute(
      "SELECT path, COUNT(*) as views FROM pageviews WHERE domain = ? GROUP BY path ORDER BY views DESC",
      [domain]
    );

    return res.status(200).json(result.rows);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

