import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaPlay, 
  FaClock, 
  FaQuestionCircle, 
  FaBolt, 
  FaWalking, 
  FaHourglassHalf // 🆕 Replace FaTurtle with FaHourglassHalf
} from 'react-icons/fa';
import { getFlashcards } from '../../../api/flashcardApi';

const Quiz = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [selectedSpeed, setSelectedSpeed] = useState({});
  
  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await getFlashcards();
      const grouped = groupByCategory(response.data);
      setTopics(grouped);
    } catch (error) {
      console.error('Failed to fetch flashcards for quiz', error);
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

  const handleStartQuiz = (topic) => {
    if (!selectedSpeed[topic.label]) return;
    navigate('/quiz-start', { state: { topic, timerSetting: selectedSpeed[topic.label] } });
  };

  const handleReviewQuiz = (topic) => {
    const result = localStorage.getItem(`quizResult_${topic.label}`);
    if (result) {
      navigate('/quiz-start', { state: { topic, reviewMode: true, savedResult: JSON.parse(result) } });
    } else {
      alert("No previous quiz result found for this topic.");
    }
  };

  const handleSelectSpeed = (topicLabel, speed) => {
    setSelectedSpeed(prev => ({ ...prev, [topicLabel]: speed }));
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
          <FaQuestionCircle className="text-yellow-500" /> Choose a Topic & Speed
        </h2>

        {topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <img src="/Cleverbee_bee.png" alt="Cute Bee" className="w-32 h-32 animate-bounce" />
            <h3 className="text-2xl font-bold text-yellow-600">Bzzz... No Topics Yet!</h3>
            <p className="text-gray-500">
              Fly to 🐝 <span className="font-semibold text-yellow-700">Flashcards</span> and create your first topic!
            </p>
            <button
              onClick={() => navigate('/tools/flashcards')}
              className="mt-4 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-full shadow transition"
            >
              ➕ Create Flashcards
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const savedResult = localStorage.getItem(`quizResult_${topic.label}`);
              const selected = selectedSpeed[topic.label];

              return (
                <div
                  key={topic.label}
                  className="bg-yellow-100 hover:bg-yellow-200 transition shadow-md px-6 py-5 rounded-2xl text-left border border-yellow-300 hover:scale-105 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-yellow-800 flex gap-2 items-center">
                        <FaQuestionCircle className="text-yellow-500" /> {topic.label}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-yellow-700 mb-4 block">
                      {topic.flashcards.length} cards
                    </span>

                    {/* Dropdown Speed Selection */}
                    <div className="space-y-2 mb-4">
                      <button
                        onClick={() => handleSelectSpeed(topic.label, 'fast')}
                        className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg border ${
                          selected === 'fast' ? 'bg-yellow-300 border-yellow-500' : 'border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <FaBolt /> Fast (15s/question)
                      </button>
                      <button
                        onClick={() => handleSelectSpeed(topic.label, 'moderate')}
                        className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg border ${
                          selected === 'moderate' ? 'bg-yellow-300 border-yellow-500' : 'border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <FaWalking /> Moderate (30s/question)
                      </button>
                      <button
                        onClick={() => handleSelectSpeed(topic.label, 'slow')}
                        className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg border ${
                          selected === 'slow' ? 'bg-yellow-300 border-yellow-500' : 'border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <FaHourglassHalf /> Slow (1min/question)
                      </button>
                    </div>
                  </div>

                  {/* Start Quiz Button */}
                  <button
                    onClick={() => handleStartQuiz(topic)}
                    disabled={!selected}
                    className={`mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full font-bold transition ${
                      selected
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaPlay /> Start Quiz
                  </button>

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
