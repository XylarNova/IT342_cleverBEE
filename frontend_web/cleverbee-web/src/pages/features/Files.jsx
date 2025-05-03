import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FaPlus, FaSearch, FaFolderPlus, FaEllipsisV, FaStickyNote } from 'react-icons/fa';
import api from '../../api/api'; 

const Files = () => {
  const fileInputRef = useRef(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [menuFileId, setMenuFileId] = useState(null);
  const [renameMode, setRenameMode] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [annotationText, setAnnotationText] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await api.get('/folders');
      const fetchedFolders = Array.isArray(response.data)
        ? response.data.map(folder => ({
            ...folder,
            image: folder.folderImage || `/Folder${Math.floor(Math.random() * 4) + 1}.png`
          }))
        : [];
      setFolders(fetchedFolders);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const loadFiles = async (folderId) => {
    setFiles([]);
    try {
      const response = await api.get(`/files/folder/${folderId}`);
      setFiles(response.data);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === '') return;
    try {
      const randomImage = `/Folder${Math.floor(Math.random() * 4) + 1}.png`;
      const response = await api.post('/folders', { 
        folderName: newFolderName,
        folderImage: randomImage
      });

      const createdFolder = {
        ...response.data,
        image: response.data.folderImage || randomImage
      };
      setFolders(prev => [...prev, createdFolder]);
      setNewFolderName('');
      setShowCreateFolderModal(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    loadFiles(folder.id);
  };

  const handleFileUpload = async (e) => {
    if (!selectedFolder) {
      alert('⚠️ Please select a folder first.');
      return;
    }

    const uploadedFiles = Array.from(e.target.files);
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];

    const invalidFiles = uploadedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      alert('❌ Only .txt, .pdf, .doc, and .docx files are allowed!');
      e.target.value = '';
      return;
    }

    setPendingFile(uploadedFiles[0]);
    setAnnotationText("");
    setShowAnnotationModal(true);
    e.target.value = '';
  };

  const handleUploadWithAnnotation = async () => {
    if (!pendingFile || !selectedFolder) return;

    const formData = new FormData();
    formData.append("file", pendingFile);
    formData.append("annotation", annotationText);
    formData.append("folderId", selectedFolder.id);

    try {
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      loadFiles(selectedFolder.id);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }

    setShowAnnotationModal(false);
    setPendingFile(null);
  };
  const handleDeleteFile = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await api.delete(`/files/${id}`);
        loadFiles(selectedFolder.id);
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
      setMenuFileId(null);
    }
  };

  const handleRenameFile = async (id) => {
    if (renameValue.trim() === '') return;
    try {
      await api.put(`/files/${id}/annotation?annotation=${renameValue}`);
      loadFiles(selectedFolder.id);
    } catch (error) {
      console.error("Failed to update annotation:", error);
    }
    setRenameMode(null);
    setMenuFileId(null);
  };

  const handleDeleteFolder = async (id) => {
    if (window.confirm("Are you sure you want to delete this folder and all its files?")) {
      try {
        await api.delete(`/folders/${id}`);
        setFolders(prev => prev.filter(folder => folder.id !== id));
        if (selectedFolder && selectedFolder.id === id) {
          setSelectedFolder(null);
          setFiles([]);
        }
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
      setMenuFileId(null);
    }
  };

  const handleRenameFolder = async (id, newName) => {
    if (newName.trim() === '') return;
    try {
      await api.put(`/folders/${id}`, { folderName: newName });
      loadFolders();
    } catch (error) {
      console.error("Failed to rename folder:", error);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.folderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-yellow-50 p-8 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-bold text-yellow-600">Files</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search folders..."
                className="pl-10 pr-4 py-2 border-2 border-yellow-400 bg-yellow-100 rounded-md w-64 focus:ring-2 focus:ring-yellow-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute top-3 left-3 text-yellow-500" />
            </div>

            <button
              onClick={() => setShowCreateFolderModal(true)}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-x-2 gap-y-6">
            {filteredFolders.map(folder => (
              <div
                key={folder.id}
                className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform relative group"
              >
                <img
                  src={folder.image}
                  alt="Folder"
                  className="w-32 h-32"
                  onClick={() => handleFolderClick(folder)}
                />
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-center font-semibold text-gray-700 text-sm">
                    {folder.folderName.length > 15 ? folder.folderName.substring(0, 12) + '...' : folder.folderName}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuFileId(folder.id);
                    }}
                    className="text-gray-500 hover:text-yellow-500"
                  >
                    <FaEllipsisV />
                  </button>
                </div>

                {menuFileId === folder.id && (
                  <div className="absolute top-12 right-0 bg-white border border-yellow-400 rounded-lg shadow-lg p-2 z-50 space-y-2 animate-fade">
                    <button
                      onClick={() => {
                        const newName = prompt("Rename Folder", folder.folderName);
                        if (newName) {
                          handleRenameFolder(folder.id, newName);
                        }
                        setMenuFileId(null);
                      }}
                      className="block w-full text-left hover:bg-yellow-100 px-2 py-1 rounded-md text-sm"
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="block w-full text-left hover:bg-yellow-100 px-2 py-1 rounded-md text-sm text-red-500"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Files inside selected folder */}
        {selectedFolder && (
          <>
            <div className="flex justify-between items-center mt-10">
              <h2 className="text-2xl font-bold text-yellow-600">
                📄 Files in {selectedFolder.folderName}
              </h2>
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md flex items-center gap-2"
              >
                <FaPlus /> Upload Files
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {files.length === 0 ? (
              <div className="text-center text-gray-600 mt-10">
                <p className="text-md">No files uploaded yet in this folder.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <div className="grid grid-cols-12 items-center px-4 py-2 font-bold text-yellow-700 bg-yellow-100 rounded-t-md">
                  <div className="col-span-2">File</div>
                  <div className="col-span-6">File Name</div>
                  <div className="col-span-4">Annotation</div>
                </div>

                {files.map(file => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 items-center bg-white px-4 py-3 border-b border-yellow-100 hover:bg-yellow-50 transition"
                  >
                    <div className="col-span-2 flex justify-center">
                      <img
                        src={`/FileIcon${Math.floor(Math.random() * 4) + 1}.png`}
                        alt="File Icon"
                        className="w-10 h-10"
                      />
                    </div>

                    <div className="col-span-6 text-gray-700 font-medium">
                      <a
                        href={`https://cleverbee-backend.onrender.com/uploads/${file.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {file.fileName.length > 40 ? file.fileName.substring(0, 37) + '...' : file.fileName}
                      </a>
                    </div>

                    <div className="col-span-4 flex items-center justify-between">
                      {renameMode === file.id ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRenameFile(file.id)}
                          className="border p-1 rounded w-3/4 text-sm"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-500 italic text-sm">
                          {file.annotation ? `"${file.annotation}"` : "No annotation"}
                        </span>
                      )}

                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => {
                            setRenameMode(file.id);
                            setRenameValue(file.annotation || "");
                            setMenuFileId(null);
                          }}
                          className="text-yellow-500 hover:text-yellow-700 text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Annotation Modal */}
        {showAnnotationModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
            <div className="bg-white border-4 border-yellow-400 rounded-xl p-6 w-full max-w-md space-y-4 relative shadow-lg">
              <button
                onClick={() => {
                  setShowAnnotationModal(false);
                  setPendingFile(null);
                }}
                className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>

              <div className="flex items-center gap-3">
                <FaStickyNote className="text-yellow-500 text-3xl" />
                <h2 className="text-xl font-bold text-yellow-600">
                  Add a note for <span className="text-black">{pendingFile?.name}</span>
                </h2>
              </div>

              <textarea
                className="w-full border-2 border-yellow-300 p-2 rounded-md focus:ring-2 focus:ring-yellow-300"
                placeholder="Type your annotation here..."
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                rows={4}
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowAnnotationModal(false);
                    setPendingFile(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadWithAnnotation}
                  className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Files;
