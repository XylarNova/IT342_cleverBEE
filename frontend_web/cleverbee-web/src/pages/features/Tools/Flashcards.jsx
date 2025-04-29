// src/pages/features/Flashcards.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { getFlashcards, createFlashcards, deleteFlashcardsByCategory, updateFlashcard, deleteFlashcard } from '../../../api/flashcardApi';

const Flashcards = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicName, setEditTopicName] = useState('');
  const [editFlashcards, setEditFlashcards] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFlashcardsData();
  }, []);

  const fetchFlashcardsData = async () => {
    try {
      const res = await getFlashcards();
      const grouped = groupByCategory(res.data);
      setTopics(grouped);
    } catch (error) {
      console.error('Failed to fetch flashcards', error);
    }
  };

  const groupByCategory = (flashcards) => {
    const map = {};
    flashcards.forEach(card => {
      if (!map[card.category]) {
        map[card.category] = [];
      }
      map[card.category].push(card);
    });
    return Object.entries(map).map(([label, flashcards]) => ({ label, flashcards }));
  };

  const handleAddFlashcard = () => {
    setFlashcards([...flashcards, { question: '', answer: '' }]);
  };

  const handleChangeFlashcard = (index, field, value) => {
    const updated = [...flashcards];
    updated[index][field] = value;
    setFlashcards(updated);
  };

  const handleAddTopic = async () => {
    if (topicName && flashcards[0].question && flashcards[0].answer) {
      try {
        const flashcardsToCreate = flashcards.map(card => ({
          question: card.question,
          answer: card.answer,
          category: topicName,
          tags: [],
        }));

        await createFlashcards(flashcardsToCreate);
        showSuccess('Topic created successfully!');
        fetchFlashcardsData();
      } catch (error) {
        console.error('Failed to create flashcards', error);
      }

      setTopicName('');
      setFlashcards([{ question: '', answer: '' }]);
      setShowForm(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      for (const card of editFlashcards) {
        await updateFlashcard(card.id, {
          question: card.question,
          answer: card.answer,
          category: editTopicName,
          tags: [],
        });
      }
      showSuccess('Flashcards updated successfully!');
      fetchFlashcardsData();
    } catch (error) {
      console.error('Failed to update flashcards', error);
    }

    setEditingTopic(null);
    setEditTopicName('');
    setEditFlashcards([]);
    setShowForm(false);
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    try {
      for (const flashcard of topicToDelete.flashcards) {
        await deleteFlashcard(flashcard.id);
      }
      showSuccess('Topic deleted successfully!');
      fetchFlashcardsData();
    } catch (error) {
      console.error('Failed to delete topic', error);
    }
    setTopicToDelete(null);
  };
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStudyTopic = (topic) => {
    navigate('/study', { state: { topic } });
  };

  const handleStartQuiz = (topic) => {
    navigate('/quiz-start', { state: { topic } });
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-8 flex flex-col items-center relative">

      {/* HEADER and BUTTONS */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <button
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 bg-white text-yellow-600 font-semibold px-5 py-2 rounded-full border border-yellow-300 shadow hover:scale-105 transition"
        >
          <FaArrowLeft /> Back to Study Tools
        </button>
        <button
          onClick={() => { setShowForm(true); setEditingTopic(null); }}
          className="add-button flex items-center gap-2"
        >
          <FaPlusCircle className="text-lg" /> Create Flashcards
        </button>
      </div>

      {/* FORM Modal (CREATE or EDIT Flashcards) */}
      {showForm && (
        <div className="modal-overlay">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (editingTopic) {
                handleSaveEdit();
              } else {
                handleAddTopic();
              }
            }}
            className="modal-box space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-yellow-800 flex items-center gap-2">
              <FaPlusCircle className="text-yellow-500" />
              {editingTopic ? 'Edit Flashcards' : 'Create Flashcards'}
            </h3>

            {/* Topic Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">Topic Name</label>
              <input
                type="text"
                placeholder="e.g., Biology"
                value={editingTopic ? editTopicName : topicName}
                onChange={(e) => editingTopic ? setEditTopicName(e.target.value) : setTopicName(e.target.value)}
                className="w-full border border-yellow-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            {/* Flashcards */}
            {(editingTopic ? editFlashcards : flashcards).map((card, index) => (
              <div key={index} className="flex flex-col gap-2 border border-yellow-100 p-3 rounded-md bg-yellow-50 mb-2">
                <label className="text-sm font-medium text-gray-600">Flashcard {index + 1}</label>
                <input
                  type="text"
                  placeholder="Question"
                  value={card.question}
                  onChange={(e) => {
                    const updated = editingTopic ? [...editFlashcards] : [...flashcards];
                    updated[index].question = e.target.value;
                    editingTopic ? setEditFlashcards(updated) : setFlashcards(updated);
                  }}
                  className="w-full border border-yellow-200 p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Answer"
                  value={card.answer}
                  onChange={(e) => {
                    const updated = editingTopic ? [...editFlashcards] : [...flashcards];
                    updated[index].answer = e.target.value;
                    editingTopic ? setEditFlashcards(updated) : setFlashcards(updated);
                  }}
                  className="w-full border border-yellow-200 p-2 rounded-md"
                />
              </div>
            ))}

            {/* Add Another Flashcard */}
            {!editingTopic && (
              <button
                type="button"
                onClick={handleAddFlashcard}
                className="text-sm text-yellow-700 hover:underline"
              >
                + Add another flashcard
              </button>
            )}

            {/* Form Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-full font-semibold transition shadow"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Topics List */}
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-lg p-6 md:p-10 space-y-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📝 Your Topics
        </h2>

        {topics.length === 0 ? (
          <p className="text-gray-500">No topics yet. Click "Create Flashcards" to begin.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div
                key={topic.label}
                className="bg-yellow-100 hover:bg-yellow-200 transition shadow-md px-6 py-5 rounded-2xl text-left flex flex-col justify-between border border-yellow-300 hover:scale-105"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl font-bold text-yellow-800">{topic.label}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTopic(topic);
                        setEditTopicName(topic.label);
                        setEditFlashcards(topic.flashcards);
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setTopicToDelete(topic)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-700 mb-4">{topic.flashcards.length} cards</span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStudyTopic(topic)}
                    className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-full hover:bg-yellow-500"
                  >
                    Study
                  </button>
                  <button
                    onClick={() => handleStartQuiz(topic)}
                    className="bg-white text-yellow-600 font-semibold px-4 py-2 rounded-full border border-yellow-400 hover:bg-yellow-50"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {topicToDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h2 className="text-xl font-bold text-red-600 mb-2">Are you sure?</h2>
            <p className="text-gray-700 text-sm mb-5">
              Do you really want to delete the topic <strong>{topicToDelete.label}</strong>?
              <br />This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100"
                onClick={() => setTopicToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                onClick={confirmDeleteTopic}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-all animate-bounce-in">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
