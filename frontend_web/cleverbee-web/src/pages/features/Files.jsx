import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaPlus, FaSearch } from 'react-icons/fa';

const Files = () => {
  const fileInputRef = useRef(null);
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const randomFolderImage = `/Folder${Math.floor(Math.random() * 4) + 1}.png`;
      setFolders(prev => [...prev, { id: Date.now(), name, image: randomFolderImage, files: [] }]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['txt', 'pdf', 'docx'].includes(ext);
    });

    if (validFiles.length !== files.length) {
      alert('Only .txt, .pdf, and .docx files are allowed!');
    }

    const newFiles = validFiles.map(file => ({
      name: file.name,
      type: file.name.split('.').pop(),
      annotation: prompt(`Add a note for ${file.name} (optional):`) || "",
      date: new Date().toISOString(),
    }));

    setFolders(prev => prev.map(folder => 
      folder.id === selectedFolder.id 
      ? { ...folder, files: [...folder.files, ...newFiles] } 
      : folder
    ));

    e.target.value = '';
  };

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-yellow-50 p-8 space-y-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-yellow-600">Files</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search folders..."
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-yellow-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
            </div>

            <button
              onClick={handleCreateFolder}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md flex items-center gap-2"
            >
              <FaPlus /> New Folder
            </button>
          </div>
        </div>

        {/* Folder Grid */}
        {filteredFolders.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-xl">No folders yet 📂</p>
            <p className="text-sm mt-2">Click "New Folder" to start organizing your files!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredFolders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => setSelectedFolder(folder)}
                className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
              >
                <img src={folder.image} alt="Folder" className="w-24 h-24" />
                <p className="mt-2 text-center font-semibold text-gray-700">{folder.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Folder Modal */}
        {selectedFolder && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-2xl relative space-y-6">
              <button 
                onClick={() => setSelectedFolder(null)} 
                className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-yellow-600 mb-4">{selectedFolder.name}</h2>

              <div className="flex justify-end">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
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

              {/* List of Uploaded Files */}
              {selectedFolder.files.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  No files uploaded yet in this folder.
                </div>
              ) : (
                <div className="space-y-4 mt-6">
                  {selectedFolder.files.map((file, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50">
                      <p className="font-semibold">{file.name}</p>
                      {file.annotation && (
                        <p className="text-sm text-gray-600 italic">📝 {file.annotation}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{new Date(file.date).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Files;
