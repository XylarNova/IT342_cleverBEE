import React, { useState } from 'react';
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaLightbulb,
  FaFolderOpen,
  FaMapMarkerAlt,
  FaCog,
  FaBars,
} from 'react-icons/fa';
import { FiLogOut, FiEdit, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const Tasks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const tasks = [
    {
      id: 1,
      label: 'Create Wireframe',
      progress: 85,
      priority: 'high',
      due: '2025-03-24T12:00',
      color: 'bg-red-100',
      dot: 'bg-red-500',
    },
    {
      id: 2,
      label: 'Library Works',
      progress: 0,
      priority: 'low',
      due: '2025-04-01T15:00',
      color: 'bg-yellow-100',
      dot: 'bg-yellow-500',
    },
    {
      id: 3,
      label: 'IS - Reporting',
      progress: 50,
      priority: 'medium',
      due: '2025-03-29T23:59',
      color: 'bg-blue-100',
      dot: 'bg-blue-500',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const formatDueDate = (dueStr) => {
    const date = new Date(dueStr);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const isUrgent = (dueStr) => {
    const diff = new Date(dueStr).getTime() - Date.now();
    return diff < 3 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-[#f6a800] text-black px-3 py-4 flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className="flex flex-col items-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-xl mb-2 self-end ${collapsed ? 'mr-0' : 'mr-2'}`}
          >
            <FaBars />
          </button>
          <div className={`transition-all duration-300 ${collapsed ? 'mb-3' : 'mb-6'}`}>
            <img
              src="/logo.png"
              alt="Logo"
              className={`object-contain ${collapsed ? 'w-10 h-10' : 'w-32 h-32'}`}
            />
          </div>
          <nav className={`space-y-3 text-base w-full ${collapsed ? 'px-0' : 'px-2'}`}>
            <NavItem icon={<FaHome />} label="Dashboard" path="/dashboard" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaTasks />} label="Tasks" path="/tasks" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaCalendarAlt />} label="Schedule" path="/schedule" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaLightbulb />} label="Study Tools" path="/tools" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaFolderOpen />} label="Files" path="/files" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaMapMarkerAlt />} label="Study Map" path="/map" isActive={isActive} collapsed={collapsed} navigate={navigate} />
            <NavItem icon={<FaCog />} label="Settings" path="/settings" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          </nav>
        </div>
        <button className={`bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${collapsed ? 'w-12 mx-auto px-0' : 'w-full px-4 mt-6'}`}>
          <FiLogOut className={`${collapsed ? 'text-3xl' : ''}`} />
          {!collapsed && 'Logout'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-yellow-50 space-y-10">
        <div className="text-4xl font-extrabold text-yellow-500">Tasks</div>

        <div className="flex flex-col lg:flex-row justify-between space-y-10 lg:space-y-0 lg:space-x-10">
          {/* Task Section */}
          <div className="bg-white rounded-xl shadow p-6 w-full lg:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Tasks <span className="text-gray-400">(0{tasks.length})</span></h2>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg font-semibold shadow">Add Task</button>
            </div>

            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className={`flex flex-col md:flex-row md:items-center justify-between rounded-md px-4 py-3 ${task.color}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-1/2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{task.id.toString().padStart(2, '0')}</span>
                      <span className="truncate">{task.label}</span>
                    </div>
                    <span className="text-xs flex items-center gap-1 text-gray-700">
                      <span className={`w-2 h-2 rounded-full ${task.dot}`}></span>
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-end gap-3 w-full md:w-1/2">
                    <div className="w-full">
                      <div className="relative group w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 rounded-full bg-yellow-400"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                        <span className="absolute -top-6 right-0 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded shadow">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-gray-700 text-md">
                      <FiEdit className="cursor-pointer hover:text-blue-500" />
                      <FiTrash2 className="cursor-pointer hover:text-red-500" />
                      <FiCheckCircle className="cursor-pointer hover:text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline Section */}
          <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/3">
            <h2 className="text-lg font-bold mb-2">Deadlines</h2>
            <div className="divide-y text-sm">
              {tasks.map(task => (
                <div key={task.id} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${task.dot}`}></span>
                    <span>{task.label}</span>
                  </div>
                  <span className={`font-semibold ${isUrgent(task.due) ? 'text-red-500' : 'text-gray-700'}`}>
                    {formatDueDate(task.due)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, path, isActive, collapsed, navigate }) => (
  <div
    onClick={() => navigate(path)}
    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-300 
      ${isActive(path) ? 'bg-black/20 text-white' : 'hover:bg-black/10'} 
      ${collapsed ? 'justify-center text-3xl' : 'text-base'}`}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
);

export default Tasks;
