import React from 'react';

function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Task Manager
      </div>
      <nav>
        <ul>
          <li
            data-icon="T"
            className={activeView === 'Tasks' ? 'active' : ''}
            onClick={() => setActiveView('Tasks')}
          >
            <span>Tasks</span>
          </li>
          <li
            data-icon="A"
            className={activeView === 'AuditLogs' ? 'active' : ''}
            onClick={() => setActiveView('AuditLogs')}
          >
            <span>Audit Logs</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;