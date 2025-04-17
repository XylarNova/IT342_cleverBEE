import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarIcon = ({ icon, collapsed }) => {
  return (
    <div className="flex items-center justify-center w-12 h-12">
      <img
        src={icon}
        alt="icon"
        className={`${collapsed ? 'w-8 h-8' : 'w-8 h-8'} object-contain`}
      />
    </div>
  );
};

const NavItem = ({ icon, label, path, isActive, collapsed, navigate }) => (
  <div
    onClick={() => navigate(path)}
    className={`group relative flex items-center ${
      collapsed ? 'justify-center' : 'justify-start px-4'
    } h-14 rounded-md transition-all duration-200 cursor-pointer ${
      isActive(path) ? 'bg-yellow-200 font-bold' : 'hover:bg-yellow-300'
    }`}
  >
    <SidebarIcon icon={icon} collapsed={collapsed} />
    {!collapsed && <span className="ml-3 text-sm whitespace-nowrap">{label}</span>}
    {collapsed && <span className="tooltip-text">{label}</span>}
  </div>
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  return (
    <aside
      className={`relative z-20 bg-[#f6a800] text-black py-2 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-56'
      } shadow-lg`}
    >
      {/* TOP */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex justify-end px-4 mb-1">
          <button onClick={toggleSidebar}>
            <img src="/icons/menu-toggle.png" alt="Toggle" className="w-6 h-6 object-contain" />
          </button>
        </div>

        <img
          src="/logo.png"
          alt="Logo"
          className={`object-contain mb-2 ${collapsed ? 'w-16 h-16' : 'w-24 h-24'}`}
        />

        <nav className="flex flex-col gap-1 w-full mt-1">
          <NavItem icon="/icons/dashboard-icon.png" label="Dashboard" path="/dashboard" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/tasks-icon.png" label="Tasks" path="/tasks" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/schedule-icon.png" label="Schedule" path="/schedule" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/study-tools-icon.png" label="Study Tools" path="/tools" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/files-icon.png" label="Files" path="/files" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/study-map-icon.png" label="Study Map" path="/map" isActive={isActive} collapsed={collapsed} navigate={navigate} />
          <NavItem icon="/icons/settings-icon.png" label="Settings" path="/settings" isActive={isActive} collapsed={collapsed} navigate={navigate} />
        </nav>
      </div>

      {/* LOGOUT */}
      <div className="flex justify-center mt-2 px-4">
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/logout');
          }}
          className={`bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
            collapsed ? 'w-12 h-12' : 'w-full px-4'
          }`}
        >
          <FiLogOut className={`${collapsed ? 'text-2xl' : 'text-lg'}`} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
