import React, { useState } from 'react';

const PopupForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '', // Add description field to formData
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
            <h2 className="text-2xl font-bold mb-4">New Project</h2>
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

export default PopupForm;
