import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("");

  const loadTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t.id === id);
      await api.put(`/tasks/${id}`, { ...task, status: newStatus });
      loadTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'DONE': return 'status-done';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'LOW': return 'priority-low';
      case 'MEDIUM': return 'priority-medium';
      case 'HIGH': return 'priority-high';
      default: return '';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  };

   const formatPriority = (priority) => {
    switch (priority) {
      case 'LOW': return 'Low';
      case 'MEDIUM': return 'Medium';
      case 'HIGH': return 'High';
      default: return priority;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>{
      const matchesTerm = task.title.toLowerCase().includes(term.toLowerCase());
      const matchesStatus = status === "" ? true : task.status === status;
      return matchesTerm && matchesStatus;
    });
  }, [tasks, term, status]);
 


  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="task-board">
      <div className="task-board-header">
        <h1>Task Board</h1>
        <Link to="/tasks/new" className="btn btn-primary">+ New Task</Link>
      </div>
      <div className= "task-board-controls">        
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        /> 
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="task-status-select">
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Create one to get started!</div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <Link to={`/tasks/${task.id}`} className="task-title">{task.title}</Link>
                <div className='task-status-priority'>
                  <span className={`status-badge ${getPriorityClass(task.priority)}`}>
                  {formatPriority(task.priority)}
                  </span>
                  <span className={`status-badge ${getStatusClass(task.status)}`}>
                    {formatStatus(task.status)}
                  </span>
                </div>                
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-card-footer">
                <span className="task-meta">Created by {task.createdBy}</span>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskBoard;
