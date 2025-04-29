import React, { useEffect, useState } from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import Sidebar from './Sidebar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from "../../api/api"; // Ensure correct API import path

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    label: '',
    description: '',
    priority: 'moderate',
    startDate: null,
    endDate: null
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure the response data is an array and in the expected format
      if (Array.isArray(response.data.data)) {
        setTasks(response.data.data);
      } else {
        console.error("Tasks data is not in expected array format");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addOrUpdateTask = async () => {
    const token = localStorage.getItem("token");
    const taskData = {
      ...newTask,
      startDate: newTask.startDate?.toISOString(),
      endDate: newTask.endDate?.toISOString(),
    };

    try {
      if (editingTaskId) {
        // Update existing task
        await api.put(`/tasks/${editingTaskId}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new task
        await api.post('/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNewTask({ label: '', description: '', priority: 'moderate', startDate: null, endDate: null });
      setEditingTaskId(null);
      setShowForm(false);
      fetchTasks(); // Re-fetch tasks after adding/updating
    } catch (error) {
      console.error("Error adding/updating task:", error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTaskId(null);
    setNewTask({ label: '', description: '', priority: 'moderate', startDate: null, endDate: null });
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Re-fetch tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const priorities = [
    { key: 'high', title: '🐝 Super Important', color: 'bg-red-200' },
    { key: 'moderate', title: '🧸 Kind of Important', color: 'bg-yellow-200' },
    { key: 'low', title: '💤 Not Important', color: 'bg-blue-100' },
  ];

  const toggleComplete = (id) => {
    setCheckedTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleEdit = (task) => {
    setNewTask({
      label: task.label,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate ? new Date(task.startDate) : null,
      endDate: task.endDate ? new Date(task.endDate) : null,
    });
    setEditingTaskId(task.id);
    setShowForm(true);
  };

  const progressPercent = tasks.length ? Math.round((checkedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-yellow-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Task Manager</h1>

        <div className="mb-6 bg-white p-4 rounded shadow flex items-center gap-4">
          <img src="/Cleverbee_bee.png" alt="Bee" className="w-16 h-16" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-700">You're doing great!</p>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="h-3 bg-yellow-400 rounded"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{progressPercent}% completed</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          ➕ Add Task
        </button>

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white border-4 border-yellow-400 p-6 rounded-xl shadow-xl w-full max-w-xl">
              <h2 className="text-xl font-bold text-yellow-500 mb-4 flex items-center gap-2">📝 Add New Task</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newTask.label}
                  onChange={(e) => setNewTask({ ...newTask, label: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <select
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="high">🐝 Super Important</option>
                  <option value="moderate">🧸 Kind of Important</option>
                  <option value="low">💤 Not Important</option>
                </select>
                <div className="flex gap-4">
                  <DatePicker
                    placeholderText="Start Date"
                    selected={newTask.startDate}
                    onChange={(date) => setNewTask({ ...newTask, startDate: date })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <DatePicker
                    placeholderText="End Date"
                    selected={newTask.endDate}
                    onChange={(date) => setNewTask({ ...newTask, endDate: date })}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={addOrUpdateTask}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-md font-semibold"
                >
                  {editingTaskId ? 'Update Task' : 'Save Task'}
                </button>
                <button
                  onClick={cancelForm}
                  className="bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-md font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {priorities.map(({ key, title, color }) => (
            <div key={key} className={`p-4 rounded-lg shadow ${color}`}>
              <h3 className="text-lg font-bold text-yellow-600 mb-4">{title}</h3>
              {tasks
                .filter((task) => task.priority === key)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`relative p-4 mb-3 rounded shadow bg-white ${checkedTasks.includes(task.id) ? 'opacity-50' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <input
                        type="checkbox"
                        checked={checkedTasks.includes(task.id)}
                        onChange={() => toggleComplete(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-yellow-700">{task.label}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="flex gap-2 text-xl">
                        <FiEdit
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={() => handleEdit(task)}
                        />
                        <FiTrash2
                          className="cursor-pointer text-red-500 hover:text-red-600"
                          onClick={() => deleteTask(task.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
