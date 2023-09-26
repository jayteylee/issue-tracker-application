import React, { useState } from 'react';

const TaskForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    status: 'open',
    due_date: '', // Initialize the due_date field as an empty string
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="bg-white w-1/2 rounded-lg p-4 shadow-lg z-50">
          <div className='flex flex-row justify-between'>
            <h2 className="text-2xl font-bold mb-4">New Task</h2>
            <button className="mb-4" onClick={onClose}>
              <span className="text-xl font-bold">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <div className="mb-2">
              <label htmlFor="priority" className="block font-semibold text-sm mb-1">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="status" className="block font-semibold text-sm mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="due_date" className="block font-semibold text-sm mb-1">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default TaskForm;
