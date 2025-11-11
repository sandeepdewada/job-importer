export default function LogTable({ logs }) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return <div className="center muted">No import logs yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="log-table" cellSpacing="0" cellPadding="8">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Total</th>
            <th>New</th>
            <th>Updated</th>
            <th>Failed</th>
            <th>Timestamp</th>
            <th>Failed Reasons</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id || l.timestamp}>
              <td>{l.fileName || "—"}</td>
              <td>{l.totalFetched ?? 0}</td>
              <td>{l.newJobs ?? 0}</td>
              <td>{l.updatedJobs ?? 0}</td>
              <td>{l.failedJobs ?? 0}</td>
              <td>{new Date(l.timestamp || l.createdAt || Date.now()).toLocaleString()}</td>
              <td style={{ maxWidth: 400, overflowWrap: "anywhere" }}>
                {Array.isArray(l.failedReasons) && l.failedReasons.length > 0
                  ? l.failedReasons.join("; ")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
