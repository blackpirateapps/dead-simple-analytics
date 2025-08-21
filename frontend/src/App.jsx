import { useState } from "react";
import ClipboardIcon from "./ClipboardIcon";

export default function App() {
  const [domain, setDomain] = useState("");
  const [stats, setStats] = useState([]);
  const [snippet, setSnippet] = useState("");
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchStats = async () => {
    if (!domain) {
      setError("Please enter a domain.");
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/analytics?domain=${domain}`);
      if (!res.ok) {
        throw new Error("Failed to fetch analytics data.");
      }
      const data = await res.json();
      setStats(data);

      const script = `<script>
  fetch("https://dead-simple-analytics. M-Abdullah-13.workers.dev/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "${domain}",
      path: window.location.pathname,
      referrer: document.referrer,
      ts: Date.now(),
    }),
  });
</script>`;
      setSnippet(script);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800">
            📊 Dead Simple Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Your privacy-focused, dead-simple website analytics.
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter your domain (e.g., example.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="border rounded-lg p-3 w-full flex-grow focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={fetchStats}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto hover:bg-blue-700 transition"
            >
              Load Stats
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {snippet && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Your Tracking Snippet
              </h2>
              <button
                onClick={handleCopy}
                className="bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition flex items-center"
              >
                <ClipboardIcon className="h-4 w-4 mr-1" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{snippet}</code>
            </pre>
          </div>
        )}

        {stats.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-gray-600">Path</th>
                  <th className="p-4 text-right text-gray-600">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-4">{row.path}</td>
                    <td className="p-4 text-right">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
