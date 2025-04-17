import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';

const Quiz = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  useEffect(() => {
    const savedTopics = localStorage.getItem('flashcardTopics');
    if (savedTopics) {
      setTopics(JSON.parse(savedTopics));
    }
  }, []);

  const handleStartQuiz = (topic) => {
    navigate('/quiz-start', { state: { topic } });
  };

  const handleReviewQuiz = (topic) => {
    const result = localStorage.getItem(`quizResult_${topic.label}`);
    if (result) {
      navigate('/quiz-start', { state: { topic, reviewMode: true, savedResult: JSON.parse(result) } });
    } else {
      alert("No previous quiz result found for this topic.");
    }
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/tools')}
          className="flex items-center gap-2 bg-white text-yellow-600 font-semibold px-5 py-2 rounded-full border border-yellow-300 shadow hover:scale-105 transition"
        >
          <FaArrowLeft /> Back to Study Tools
        </button>
      </div>

      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-lg p-6 md:p-10 space-y-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          ❓ Choose a Topic to Start the Quiz
        </h2>

        {topics.length === 0 ? (
          <p className="text-gray-500">No topics available. Create flashcards first to generate quiz content.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topics.map((topic, index) => {
              const savedResult = localStorage.getItem(`quizResult_${topic.label}`);
              return (
                <div
                  key={topic.label}
                  className="relative bg-yellow-100 hover:bg-yellow-200 transition shadow-md px-6 py-5 rounded-2xl text-left border border-yellow-300 hover:scale-105"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-bold text-yellow-800">{topic.label}</span>
                    <button onClick={() => toggleMenu(index)} className="text-yellow-700 hover:text-yellow-900">
                      <FiMoreVertical size={20} />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-yellow-700 mb-1 block">{topic.flashcards.length} questions</span>

                  {/* Dropdown menu */}
                  {openMenuIndex === index && (
                    <div className="absolute right-3 top-12 w-40 bg-white border border-yellow-300 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleStartQuiz(topic)}
                        className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-sm text-gray-700"
                      >
                        Start Quiz
                      </button>
                      <button
                        onClick={() => handleReviewQuiz(topic)}
                        className={`w-full text-left px-4 py-2 hover:bg-yellow-100 text-sm ${
                          savedResult ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!savedResult}
                      >
                        Review Answers
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
