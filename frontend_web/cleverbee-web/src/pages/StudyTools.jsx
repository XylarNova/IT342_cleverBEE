import React, { useState, useEffect } from 'react';
import {
  FaHome, FaTasks, FaCalendarAlt, FaLightbulb,
  FaFolderOpen, FaMapMarkerAlt, FaCog, FaBars,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

const StudyTools = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Simulated fetched data (replace with real data in future)
  const [studyHours, setStudyHours] = useState(0);
  const maxHours = 100;

  // Auto fetch (simulate)
  useEffect(() => {
    const fetchStudyData = async () => {
      // simulate API or localStorage
      const fetchedHours = 62; // pretend this comes from your backend or DB
      setStudyHours(fetchedHours);
    };
    fetchStudyData();
  }, []);

  const isActive = (path) => location.pathname === path;
  const progress = Math.min((studyHours / maxHours) * 100, 100);

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
      <main className="flex-1 bg-yellow-50 p-8 space-y-10">
      <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-4xl font-extrabold text-yellow-500 drop-shadow">Study Tools</h1>
          <div className="flex gap-3 items-center">
            <input type="text" placeholder="Search..." className="px-4 py-2 rounded-md shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:scale-105 transition">🔍</button>
          </div>
        </div>

        {/* Study Tracker */}
        <div className="bg-yellow-100 p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <img src="/mainBee.png" alt="Bee" className="w-44 h-44" />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2">Study Tracker</h2>
            <p className="text-gray-700 mb-2">You've studied for {studyHours} hours this week!</p>
            <div className="bg-white h-4 rounded-full overflow-hidden shadow-inner w-full">
              <div className="bg-yellow-500 h-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Study Tool Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose To Study</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { label: 'Pomodoro Timer', image: 'pomodoro.png' },
              { label: 'Flashcards', image: 'flashcards.png' },
              { label: 'Quiz', image: 'quiz.png' },
            ].map((tool) => (
              <div key={tool.label} className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                <img src={`/${tool.image}`} alt={tool.label} className="w-36 h-36 mb-4" />
                <h3 className="text-xl font-bold">{tool.label}</h3>
              </div>
            ))}
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

export default StudyTools;
