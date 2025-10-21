import React, { useState, useEffect } from 'react';

// Simple sanitizer to prevent XSS [cite: 154]
const sanitizeInput = (str) => {
  return str.replace(/<[^>]*>?/gm, ''); // Removes HTML tags
};

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const validate = () => {
    const newErrors = {};
    
    // Non-empty validation [cite: 152]
    if (!title.trim()) newErrors.title = 'Title must not be empty.';
    if (!description.trim()) newErrors.description = 'Description must not be empty.';

    // Length validation [cite: 153]
    if (title.length > 100) newErrors.title = 'Title must be 100 characters or less.';
    if (description.length > 500) newErrors.description = 'Description must be 500 characters or less.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Sanitize inputs before sending [cite: 154]
      const saneTitle = sanitizeInput(title);
      const saneDescription = sanitizeInput(description);
      
      onSave({ title: saneTitle, description: saneDescription });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
            <button type="button" className="modal-close" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Plan sprint backlog"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="error-message">{errors.title}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Add scope, owners, and due dates"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="error-message">{errors.description}</p>}
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;