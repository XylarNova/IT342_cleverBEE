// src/pages/features/FlashcardStudy.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaRandom } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';
import { updateFlashcard, deleteFlashcard } from '../../../api/flashcardApi';

const FlashcardStudy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { topic } = location.state;

  const [shuffledCards, setShuffledCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const shuffled = [...topic.flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, [topic.flashcards]);

  const card = shuffledCards[index] || { question: '', answer: '', id: null };
  const progress = shuffledCards.length > 0 ? ((index + 1) / shuffledCards.length) * 100 : 0;

  const reshuffle = () => {
    const newShuffle = [...topic.flashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(newShuffle);
    setIndex(0);
    setShowAnswer(false);
  };

  const handleEditSave = async () => {
    try {
      await updateFlashcard(card.id, {
        question: editQ,
        answer: editA,
        category: topic.label,
        tags: [],
      });

      const updated = [...shuffledCards];
      updated[index].question = editQ;
      updated[index].answer = editA;
      setShuffledCards(updated);

      setEditing(false);
      setShowAnswer(false);
    } catch (error) {
      console.error('Failed to update flashcard', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteFlashcard(card.id);
      const updated = shuffledCards.filter((_, i) => i !== index);
      setShuffledCards(updated);
      setIndex(0);
      setShowAnswer(false);
      setShowOptions(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete flashcard', error);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-700">{topic.label} Flashcards</h1>
          <button
            onClick={() => navigate('/tools/flashcards')}
            className="flex items-center gap-2 bg-white text-yellow-600 font-semibold px-5 py-2 rounded-full border border-yellow-300 shadow hover:scale-105 transition"
          >
            <FaArrowLeft /> Back to Topics
          </button>
        </div>

        <div className="bg-white border border-yellow-300 rounded-2xl shadow-md p-8 relative">
          {/* More Options */}
          <div className="absolute top-4 right-4 z-20 w-10 h-10">
            <div className="relative w-full h-full">
              <button
                onClick={() => setShowOptions(prev => !prev)}
                className="w-full h-full flex items-center justify-center"
              >
                <FiMoreVertical className="text-gray-500 text-xl hover:text-gray-700" />
              </button>
              {showOptions && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setEditQ(card.question);
                      setEditA(card.answer);
                      setEditing(true);
                      setShowOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Flashcard Progress */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 text-center">
              Card {index + 1} of {shuffledCards.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Flashcard Content */}
          <div className="text-center min-h-[6rem] mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {showAnswer ? card.answer : card.question}
            </h2>
          </div>

          {/* Toggle Question/Answer Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-full shadow transition"
            >
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 items-center">
            <button
              onClick={() => {
                setIndex((prev) => Math.max(prev - 1, 0));
                setShowAnswer(false);
              }}
              disabled={index === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-full shadow disabled:opacity-40"
            >
              <FaArrowLeft /> Previous
            </button>

            <button
              onClick={reshuffle}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full border border-yellow-300 shadow"
            >
              <FaRandom /> Shuffle
            </button>

            <button
              onClick={() => {
                setIndex((prev) => Math.min(prev + 1, shuffledCards.length - 1));
                setShowAnswer(false);
              }}
              disabled={index === shuffledCards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full shadow transition disabled:opacity-40"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-4">Edit Flashcard</h2>
            <input
              value={editQ}
              onChange={(e) => setEditQ(e.target.value)}
              placeholder="Question"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              value={editA}
              onChange={(e) => setEditA(e.target.value)}
              placeholder="Answer"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">Are you sure?</h2>
            <p className="text-sm text-gray-700 mb-5">
              Do you really want to delete this flashcard?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardStudy;
