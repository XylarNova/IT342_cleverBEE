import React, { useState } from 'react';
import {
  FaHome, FaTasks, FaCalendarAlt, FaLightbulb,
  FaFolderOpen, FaMapMarkerAlt, FaCog, FaBars,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const Schedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const deadlines = [
    { label: 'Create Wireframe', date: 24, color: 'bg-red-500' },
    { label: 'IS - Reporting', date: 29, color: 'bg-indigo-500' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-[#f6a800] text-black px-3 py-4 flex flex-col justify-between transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className="flex flex-col items-center">
          <button onClick={() => setCollapsed(!collapsed)} className={`text-xl mb-2 self-end ${collapsed ? 'mr-0' : 'mr-2'}`}>
            <FaBars />
          </button>
          <div className={`transition-all duration-300 ${collapsed ? 'mb-3' : 'mb-6'}`}>
            <img src="/logo.png" alt="Logo" className={`object-contain ${collapsed ? 'w-10 h-10' : 'w-32 h-32'}`} />
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
      <main className="flex-1 bg-yellow-50 p-10 space-y-10 text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold text-yellow-500 drop-shadow">Schedule</h1>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-md shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:scale-105 transition">🔍</button>
          </div>
        </div>

        {/* Schedule Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class Schedule */}
          <div className="bg-white border border-yellow-300 p-6 rounded-xl shadow-xl col-span-1">
            <h2 className="text-xl font-bold mb-2">📘 Class Schedule</h2>
            <p className="text-md italic text-gray-600">You don’t have any classes today. 🎉</p>
          </div>

          {/* Calendar */}
          <div className="bg-white border border-yellow-300 p-6 rounded-xl shadow-xl col-span-2">
            <div className="flex justify-between items-center mb-4">
              <button className="text-xl font-bold text-yellow-500">&lt;</button>
              <h2 className="text-2xl font-bold">{currentMonth}</h2>
              <button className="text-xl font-bold text-yellow-500">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
              {days.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-2">
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const deadline = deadlines.find(d => d.date === day);
                return (
                  <div
                    key={day}
                    className={`py-2 rounded-full transition-all ${
                      deadline
                        ? `${deadline.color} text-white font-semibold shadow`
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today Overview */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-yellow-300">
          <h2 className="text-xl font-bold mb-2">🗓️ Today: {today.toDateString()}</h2>
          <p className="text-md leading-relaxed">
            It’s <strong>{today.toLocaleString('default', { weekday: 'long' })}</strong> and you're doing amazing! ✨ <br />
            No class schedules — maybe a perfect time to tackle your tasks, do some light revision, or rest. Stay hydrated and buzz strong! 🐝
          </p>
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

export default Schedule;
