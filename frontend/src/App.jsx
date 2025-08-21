import { useState } from "react";

export default function App() {
  const [domain, setDomain] = useState("");
  const [stats, setStats] = useState([]);
  const [snippet, setSnippet] = useState("");

  const fetchStats = async () => {
    if (!domain) return;
    const res = await fetch(`/api/analytics?domain=${domain}`);
    const data = await res.json();
    setStats(data);

    setSnippet(`<script>
fetch("/api/analytics", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "${domain}",
    path: window.location.pathname,
    referrer: document.referrer,
    ts: Date.now(),
  }),
});
</script>`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">📊 Website Analytics</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your domain (example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border rounded-lg p-2 w-72"
        />
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Load Stats
        </button>
      </div>

      {snippet && (
        <div className="w-full max-w-xl bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Tracking Script</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {snippet}
          </pre>
        </div>
      )}

      {stats.length > 0 && (
        <table className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Path</th>
              <th className="p-3 text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{row.path}</td>
                <td className="p-3 text-right">{row.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

