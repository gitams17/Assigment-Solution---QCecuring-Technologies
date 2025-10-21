import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';
import Pagination from './components/Pagination';
import AuditLog from './components/AuditLog';
import api from './services/api';

function App() {
  const [activeView, setActiveView] = useState('Tasks'); // 'Tasks' or 'AuditLogs'
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch tasks
  const fetchTasks = useCallback(async (page = 1, searchTerm = '') => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch paginated and filtered list
      const response = await api.get('/tasks', {
        params: {
          page: page,
          limit: 5, // 5 per page
          search: searchTerm,
        },
      });
      const { tasks, totalItems, totalPages, currentPage } = response.data;
      setTasks(tasks);
      setPagination({ totalItems, totalPages, currentPage });
    } catch (err) {
      setError('Failed to fetch tasks. Please check your connection or credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (activeView === 'Tasks') {
      fetchTasks(1, '');
    }
  }, [activeView, fetchTasks]);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    fetchTasks(1, term); // Reset to page 1 for new search
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTasks(newPage, search);
    }
  };

  // Handle opening modal
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle CRUD operations
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update Task
        await api.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        // Create Task
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
      fetchTasks(pagination.currentPage, search); // Refresh list
    } catch (err) {
      alert('Failed to save task.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Optional: Add confirmation
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks(pagination.currentPage, search); // Refresh list
      } catch (err) {
        alert('Failed to delete task.');
        console.error(err);
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="main-content">
        <Header activeView={activeView} />
        
        <div className="content-area">
          {activeView === 'Tasks' && (
            <>
              <div className="content-header">
                <input
                  type="text"
                  placeholder="Q Search by title or description"
                  className="search-bar"
                  value={search}
                  onChange={handleSearch}
                />
                <button className="btn btn-primary" onClick={openCreateModal}>
                  + Create Task
                </button>
              </div>

              {isLoading && <p>Loading...</p>}
              {error && <p className="error-message">{error}</p>}
              
              {!isLoading && !error && (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>#{task.id}</td>
                          <td>{task.title}</td>
                          <td className="description-cell">{task.description}</td>
                          <td>{task.createdAt}</td>
                          <td className="action-cell">
                            <button className="btn btn-edit" onClick={() => openEditModal(task)}>Edit</button>
                            <button className="btn btn-delete" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {activeView === 'AuditLogs' && (
            <AuditLog />
          )}
        </div>
      </main>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default App;