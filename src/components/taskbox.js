
import React from 'react';

const TaskBox = ({ task, onDelete}) => {

  return (
    <div className="bg-white w-full my-4">
      <h2 className="text-md font-semibold mb-2">{task.task_name}</h2>
      <p className="text-gray-600 text-sm">{task.task_description}</p>
      <p className="text-gray-600 text-sm">{task.priority}</p>
      <p className="text-gray-600 text-sm">{task.due_date}</p>
      <div className="flex justify-between mt-4">
        <button className="text-red-500 hover:underline" onClick={() => onDelete(task.task_id)}>Delete</button>
      </div>
      <hr className='mt-3'></hr>
    </div>
  );
};

export default TaskBox;