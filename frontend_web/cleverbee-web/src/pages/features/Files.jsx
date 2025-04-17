import React, { useState, useRef, useEffect } from 'react';
import {
  FaHome, FaTasks, FaCalendarAlt, FaLightbulb,
  FaFolderOpen, FaMapMarkerAlt, FaCog, FaBars,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Files = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      let type = 'file';
      if (extension === 'pdf') type = 'pdf';
      else if (['doc', 'docx'].includes(extension)) type = 'word';
      else if (['ppt', 'pptx'].includes(extension)) type = 'ppt';

      return {
        name: file.name,
        type,
        date: new Date().toISOString().split('T')[0],
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // reset so same file can be uploaded again
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return '/pdf.png';
      case 'word': return '/word.png';
      case 'ppt': return '/ppt.png';
      default: return '/file.png';
    }
  };

  const groupFilesByDate = () => {
    const groups = {};
    uploadedFiles.forEach(file => {
      const date = new Date(file.date).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(file);
    });
    return groups;
  };

  const groupedFiles = groupFilesByDate();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-yellow-50 p-8 space-y-10 text-gray-800">
  {/* Header */}
  <div className="flex justify-between items-center">
  <h1 className="text-4xl font-bold text-yellow-600">Files</h1>

          <button
        onClick={() => fileInputRef.current.click()}
        className="add-button"
      >
        + Upload Files
      </button>

    <input
      type="file"
      multiple
      ref={fileInputRef}
      className="hidden"
      onChange={handleFileUpload}
    />
  </div>

  {/* No Files Yet */}
  {uploadedFiles.length === 0 ? (
    <div className="text-center text-gray-600 mt-20">
      <p className="text-xl">No files uploaded yet. 📂</p>
      <p className="text-sm mt-2">Click the upload button to add your class materials or documents.</p>
    </div>
  ) : (
    <div className="space-y-10">
      {Object.keys(groupedFiles).map((date, idx) => (
        <div key={idx}>
          <div className="flex justify-between items-center mb-4">
            <hr className="border-gray-300 flex-1" />
            <span className="px-4 font-semibold text-md text-gray-600">{date}</span>
            <hr className="border-gray-300 flex-1" />
          </div>

          {/* File Icons */}
          <div className="flex flex-wrap justify-start sm:justify-center gap-6 px-2">
            {groupedFiles[date].map((file, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={getIcon(file.type)}
                  alt={file.type}
                  className="w-16 h-16 sm:w-20 sm:h-20 hover:scale-105 transition-transform"
                />
                <p className="text-sm mt-2 text-center max-w-[8rem] break-words text-gray-700 font-medium">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
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

export default Files;
