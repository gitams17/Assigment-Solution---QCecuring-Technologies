import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/logs');
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch audit logs.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionClass = (action) => {
    if (action === 'Create Task') return 'action-create';
    if (action === 'Update Task') return 'action-update';
    if (action === 'Delete Task') return 'action-delete';
    return '';
  };

  const formatTimestamp = (isoString) => {
    return new Date(isoString).toLocaleString();
  };
  
  // Format updatedContent object for display
  const formatContent = (content) => {
    if (!content) return '-';
    return Object.entries(content)
      .map(([key, value]) => `<strong>${key}:</strong> "${value}"`)
      .join('\n');
  };

  return (
    <div className="audit-log-container">
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Task ID</th>
              <th>Updated Content</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan="4">Loading logs...</td></tr>}
            {error && <tr><td colSpan="4" className="error-message">{error}</td></tr>}
            {!isLoading && !error && logs.map((log) => (
              <tr key={log.id}>
                <td>{formatTimestamp(log.timestamp)}</td>
                <td>
                  <span className={`action-badge ${getActionClass(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td>{log.taskId}</td>
                <td>
                  <div 
                    className="updated-content"
                    dangerouslySetInnerHTML={{ __html: formatContent(log.updatedContent) }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;