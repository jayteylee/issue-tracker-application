import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import TaskBox from './components/taskbox';
import PopupForm from './components/popupform';
import TaskForm from './components/taskform';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/tasks?project_id=${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  const handleProjectSelect = async (projectId) => {
    setSelectedProjectId(projectId);
    // Fetch tasks only when a project is selected
    if (projectId) {
      fetchTasks(projectId)
    } else {
      // Clear tasks when no project is selected
      setTasks([]);
    }
  };

  const handleOpenPopup = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const openTaskForm = () => {
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
  };

  const handleTaskSubmit = async (formData) => {
    try {
      // Send a POST request to your server with the form data
      const response = await axios.post('http://localhost:8081/api/tasks', {
        ...formData,
        project_id: selectedProjectId,
      });

      // Check the response and handle it as needed
      if (response.status === 201) {
        await fetchTasks(selectedProjectId)
        // The task was created successfully
        closeTaskForm(); // Close the modal
      } else {
        // Handle other response statuses or errors
        console.error('Error creating task:', response.data);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };


  const handleFormSubmit = async (formData) => {

    // Handle form submission here (e.g., send data to a server)
    try {
      const response = await axios.post('http://localhost:8081/api/projects', formData);

      console.log(response)
      // Fetch the updated products after adding a new product
      await fetchProjects();

      // Clear the form fields after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    // Close the pop-up form after submission
    handleClosePopup();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Send a DELETE request to your server with the task_id
      const response = await axios.delete(`http://localhost:8081/api/tasks/${taskId}`);

      // Check the response and handle it as needed
      if (response.status === 200) {
        // The task was deleted successfully
        await fetchTasks(selectedProjectId)
      } else {
        // Handle other response statuses or errors
        console.error('Error deleting task:', response.data);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks by selected project
  const filteredTasks = selectedProjectId
    ? tasks.filter((task) => task.project_id === selectedProjectId)
    : tasks;

  // Categorize tasks by status
  const todoTasks = filteredTasks.filter((task) => task.status === 'open');
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'in_progress');
  const inReviewTasks = filteredTasks.filter((task) => task.status === 'in_review');
  const completedTasks = filteredTasks.filter((task) => task.status === 'completed');


  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className='flex w-full h-24 bg-cyan-600 items-center justify-center shadow-lg'>
        <h1 className='text-3xl text-white font-bold'>Issue Tracker</h1>
      </div>
      <div className='w-full h-full flex flex-row justify-center items-center'>
        <div className='basis-1/5 h-full bg-cyan-300 justify-center items-center shadow-md'>
          <h2 className='text-center text-2xl font-bold my-8'>Projects</h2>
          {projects.map((project) => (
            <div key={project.project_id} onClick={() => handleProjectSelect(project.project_id)}
              // className="p-3 shadow-md rounded-lg mx-8 my-2 bg-white hover:shadow-xl hover:cursor-pointer hover:bg-slate-100">
              className={`p-3 shadow-md rounded-lg mx-8 my-2 bg-white hover:shadow-lg hover:cursor-pointer ${selectedProjectId === project.project_id ? 'bg-slate-200 shadow-lg' : ''
                }`}
            >
              <h1 className='text-sm text-center'>{project.project_name}</h1>
            </div>
          ))}
          <h3 onClick={() => handleOpenPopup()} className='underline text-center mt-4 hover:font-semibold hover:cursor-pointer'>Create New Project</h3>
          <PopupForm
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
            onSubmit={handleFormSubmit}
          />

        </div>
        <div className="h-full basis-4/5 flex flex-col">
          <div className='flex flex-row justify-between'>
            <h1 className='font-bold text-2xl ml-8 my-8 '>Tasks</h1>
          </div>
          {/* Conditional rendering for task columns */}
          {selectedProjectId ? (
            <div className='flex flex-row w-full h-full gap-6'>
              <div className='basis-1/4 flex flex-col rounded-lg'>
                <div className='mx-6 '>
                  <h2 className='text-2xl font-bold text-center mb-4'>To Do</h2>
                  <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-400'></hr>
                  {todoTasks.map((task) => (
                    <TaskBox key={task.task_id} task={task} onDelete={handleDeleteTask} />
                  ))}
                  <div className='flex flex-col'>
                    <h1 onClick={() => openTaskForm()} className='items-center justify-center mx-auto font-normal text-sm my- underline hover: cursor-pointer'> + New Task</h1>
                    <TaskForm
                      isOpen={isTaskFormOpen}
                      onClose={closeTaskForm}
                      onSubmit={handleTaskSubmit}
                    />
                  </div>
                </div>
              </div>
              <div className='basis-1/4 flex flex-col rounded-lg'>
                <div className='mx-6'>
                  <h2 className='text-2xl text-black font-bold text-center mb-4'>In Progress</h2>
                  <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-400'></hr>
                  {inProgressTasks.map((task) => (
                    <TaskBox key={task.task_id} task={task} onDelete={handleDeleteTask} />
                  ))}
                  <div className='flex flex-col'>
                    <h1 onClick={() => openTaskForm()} className='items-center justify-center mx-auto font-normal text-sm my- underline hover: cursor-pointer'> + New Task</h1>                    <TaskForm
                      isOpen={isTaskFormOpen}
                      onClose={closeTaskForm}
                      onSubmit={handleTaskSubmit}
                    />
                  </div>
                </div>
              </div>
              <div className='basis-1/4 flex flex-col rounded-lg'>
                <div className='mx-6'>
                  <h2 className='text-2xl font-bold text-center mb-4'>In Review</h2>
                  <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-400'></hr>
                  {inReviewTasks.map((task) => (
                    <TaskBox key={task.task_id} task={task} onDelete={handleDeleteTask} />
                  ))}
                  <div className='flex flex-col'>
                    <h1 onClick={() => openTaskForm()} className='items-center justify-center mx-auto font-normal text-sm my- underline hover: cursor-pointer'> + New Task</h1>                    <TaskForm
                      isOpen={isTaskFormOpen}
                      onClose={closeTaskForm}
                      onSubmit={handleTaskSubmit}
                    />
                  </div>
                </div>
              </div>
              <div className='basis-1/4 flex flex-col rounded-lg'>
                <div className='mx-6'>
                  <h2 className='text-2xl font-bold text-center mb-4'>Completed</h2>
                  <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-400'></hr>
                  {completedTasks.map((task) => (
                    <TaskBox key={task.task_id} task={task} onDelete={handleDeleteTask} />
                  ))}
                  <div className='flex flex-col'>
                    <h1 onClick={() => openTaskForm()} className='items-center justify-center mx-auto font-normal text-sm my- underline hover: cursor-pointer'> + New Task</h1>                    <TaskForm
                      isOpen={isTaskFormOpen}
                      onClose={closeTaskForm}
                      onSubmit={handleTaskSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center mt-4 text-gray-600'>
              Please select a project...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
