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
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const user = { name: 'Fred' };

  const isActive = (path) => location.pathname === path;

  const [tasks, setTasks] = useState([
    {
      id: 1,
      label: 'Create Wireframe',
      priority: 'high',
      progress: 90,
      checked: false,
      dueDate: '2025-04-09',
    },
    {
      id: 2,
      label: 'Library Works',
      priority: 'medium',
      progress: 65,
      checked: false,
      dueDate: '2025-04-11',
    },
    {
      id: 3,
      label: 'IS - Reporting',
      priority: 'normal',
      progress: 40,
      checked: false,
      dueDate: '2025-04-18',
    },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
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

      {/* Main */}
      <main className="flex-1 bg-yellow-50 p-10 transition-all duration-300 text-gray-900 space-y-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold text-yellow-500 drop-shadow">Dashboard</h1>
          <div className="flex gap-3 items-center">
            <input type="text" placeholder="Search..." className="px-4 py-2 rounded-md shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:scale-105 transition">🔍</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tasks & Schedule */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">📋 My Tasks</h2>
              {tasks.map((task) => {
                const colors = {
                  high: { dot: 'bg-red-400', track: 'bg-red-100', fill: 'bg-red-400' },
                  medium: { dot: 'bg-blue-400', track: 'bg-blue-100', fill: 'bg-blue-400' },
                  normal: { dot: 'bg-sky-300', track: 'bg-sky-100', fill: 'bg-sky-300' },
                };
                const { dot, track, fill } = colors[task.priority];
                return (
                  <div key={task.id} className="mb-4">
                    <div onClick={() => toggleTask(task.id)} className="flex justify-between items-center cursor-pointer">
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 ${dot} rounded-full`} />
                        <strong>{task.id.toString().padStart(2, '0')}</strong> {task.label}
                      </span>
                      <span className="text-xl">{task.checked ? '✅' : '⬜'}</span>
                    </div>
                    <div className={`w-full ${track} rounded-full h-2 mt-2`}>
                      <div className={`${fill} h-2 rounded-full`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-bold mb-2">📚 Class Schedule</h2>
              <p className="text-gray-500">No classes yet.</p>
            </div>
          </div>

          {/* Calendar + Greeting */}
          <div className="space-y-8">
            <CalendarCard tasks={tasks} />
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 p-6 rounded-2xl shadow-md flex items-center gap-6 w-full hover:shadow-lg border border-yellow-300">
              <img src="/boy blond.png" alt={`Chibi ${user.name}`} className="w-32 h-32 rounded-full border-4 border-yellow-300 shadow-md" />
              <div className="space-y-2">
                <p className="text-2xl font-bold text-yellow-600">
                  Hi <span className="text-yellow-500">{user.name}</span>! Ready to crush your goals today? 💪
                </p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition">
                  Let’s Go!
                </button>
              </div>
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

const CalendarCard = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getStartDay = (m, y) => new Date(y, m, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const startDay = getStartDay(month, year);
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const formatDate = (d) => new Date(year, month, d).toISOString().split('T')[0];
  const getTaskByDate = (dateStr) => tasks.find((task) => task.dueDate === dateStr);
  const getColorByPriority = (p) => ({
    high: 'bg-red-300 ring-red-500',
    medium: 'bg-blue-300 ring-blue-500',
    normal: 'bg-sky-300 ring-sky-500',
  }[p] || '');

  const dates = [];
  for (let i = 0; i < startDay; i++) dates.push(null);
  for (let i = 1; i <= daysInMonth; i++) dates.push(i);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-lg font-bold">{'<'}</button>
        <h2 className="text-xl font-bold">{monthName} {year}</h2>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-lg font-bold">{'>'}</button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-1">
        {days.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dates.map((date, idx) => {
          const valid = date !== null;
          const isToday = valid && date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const task = valid ? getTaskByDate(formatDate(date)) : null;
          const color = task ? getColorByPriority(task.priority) : '';
          return (
            <div key={idx} className={`py-2 rounded-md transition font-semibold ${valid ? (isToday ? 'bg-yellow-300 ring-2 ring-yellow-500' : task ? `${color} ring-2` : 'hover:bg-gray-100') : ''}`}>
              {valid ? date : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
