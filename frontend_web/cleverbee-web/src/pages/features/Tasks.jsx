import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from './Sidebar';

const Tasks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formError, setFormError] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    progress: 0,
    due_date: ''
  });

  const resetModal = () => {
    setNewTask({ title: '', description: '', priority: '', progress: 0, due_date: '' });
    setEditingTaskId(null);
    setEditMode(false);
    setShowModal(false);
    setFormError('');
  };

  const handleAddTask = () => {
    const { title, due_date, priority } = newTask;
    if (!title || !due_date || !priority) {
      setFormError('⚠️ Please fill in all required fields!');
      return;
    }

    setFormError('');
    if (editMode) {
      setTasks(prev =>
        prev.map(task => task.id === editingTaskId ? { ...task, ...newTask } : task)
      );
    } else {
      const newId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
      setTasks([...tasks, { ...newTask, id: newId }]);
    }
    resetModal();
  };

  const confirmDeleteTask = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);
  const handleDeleteTask = () => {
    setTasks(prev => prev.filter(task => task.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      progress: task.progress,
      due_date: task.due_date
    });
    setEditingTaskId(task.id);
    setEditMode(true);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-yellow-50 p-10 space-y-6 text-gray-800">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-4xl font-bold text-yellow-600">Task Management</h1>
          <button
            onClick={() => {
              setEditMode(false);
              setNewTask({ title: '', description: '', priority: '', progress: 0, due_date: '' });
              setShowModal(true);
              setFormError('');
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-semibold shadow w-fit"
          >
            ➕ Add Task
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-yellow-300 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">📋 My Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No tasks yet. Add one to get started!</p>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-yellow-50 border border-black/10 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-lg">{task.title}</p>
                      <p className="text-sm text-gray-600 italic mb-1">{task.description}</p>
                      <p className="text-sm text-gray-500">Due: {task.due_date}</p>
                      <p className="text-sm capitalize">
                        Priority: <span className={`font-medium ${
                          task.priority === 'high' ? 'text-red-500' :
                          task.priority === 'medium' ? 'text-blue-500' : 'text-gray-700'
                        }`}>{task.priority}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xl text-gray-700">
                      <FiEdit className="cursor-pointer hover:text-blue-500" onClick={() => handleEditTask(task)} />
                      <FiTrash2 className="cursor-pointer hover:text-red-500" onClick={() => confirmDeleteTask(task.id)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-400' :
                          task.priority === 'medium' ? 'bg-blue-400' : 'bg-sky-300'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-2 text-yellow-500 text-center">
              {editMode ? '✏️ Edit Task' : '🐝 Add New Task'}
            </h2>

            {formError && (
              <p className="text-sm text-red-600 font-medium mb-4 text-center">{formError}</p>
            )}

            {/* Title */}
            <label className="block font-medium text-gray-700 mb-1">Task Title</label>
            <input
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="e.g. Finish project report"
              className="w-full px-4 py-2 border border-black rounded shadow-sm mb-4"
            />

            {/* Description */}
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="What is this task about?"
              className="w-full px-4 py-2 border border-black rounded shadow-sm mb-4"
            />

            {/* Due Date */}
            <label className="block font-medium text-gray-700 mb-1">Deadline</label>
            <DatePicker
              selected={newTask.due_date ? new Date(newTask.due_date) : null}
              onChange={(date) =>
                setNewTask({ ...newTask, due_date: date.toISOString().split("T")[0] })
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="Select deadline"
              className="w-full px-4 py-2 border border-black rounded shadow-sm mb-4"
            />

            {/* Priority */}
            <label className="block font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded shadow-sm mb-4"
            >
              <option value="" disabled>Select priority</option>
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Progress */}
            <label className="block font-medium text-gray-700 mb-1">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newTask.progress}
              onChange={e => setNewTask({ ...newTask, progress: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 75"
              className="w-full px-4 py-2 border border-black rounded shadow-sm mb-6"
            />

            <div className="flex justify-end gap-3">
              <button onClick={resetModal} className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddTask} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded font-bold">
                {editMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal-box max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-red-600">Are you sure?</h2>
            <p className="mb-6 text-gray-700">Do you really want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
