import { useEffect, useState } from "react";
import axios from "axios";
import LogTable from "../components/LogTable";

export default function Home() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);

 const fetchLogs = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API}/api/jobs/logs?ts=${Date.now()}`);
    setLogs(res.data.logs || []);
  } catch (err) {
    console.error("Error fetching logs:", err);
    setMessage({ type: "error", text: "Failed to load logs" });
  } finally {
    setLoading(false);
  }
};


  const runImportNow = async () => {
    setImporting(true);
    setMessage(null);
    try {
      const res = await axios.get(`${API}/api/jobs/import`, { timeout: 120000 });
      setMessage({ type: "success", text: `Queued ${res.data.total} jobs` });
    
      setTimeout(fetchLogs, 1500);
    } catch (err) {
      console.error("Error triggering import:", err);
      setMessage({ type: "error", text: "Import trigger failed" });
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    //poll every 30s for updates
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Job Importer — Import History</h1>
          <p className="muted">View import runs and trigger manual import</p>
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={runImportNow} disabled={importing}>
            {importing ? "Queuing jobs..." : "Run Import Now"}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}
        >
          {message.text}
        </div>
      )}

      <main>
        {loading ? (
          <div className="center">Loading logs...</div>
        ) : (
          <LogTable logs={logs} />
        )}
      </main>

      <footer className="footer">
        <small>Backend: {API} · Auto-refresh every 30s</small>
      </footer>
    </div>
  );
}
