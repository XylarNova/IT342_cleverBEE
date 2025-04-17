import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizStart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic;

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentSlide, setCurrentSlide] = useState(0); // 👈 for animation keying

  const generateChoices = (correct, allAnswers) => {
    const wrong = allAnswers.filter(ans => ans !== correct);
    const sampled = wrong.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...sampled, correct].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    if (!topic) {
      navigate("/tools/quiz");
    } else {
      const allAnswers = topic.flashcards.map(f => f.answer);
      const qWithChoices = topic.flashcards.map(card => ({
        question: card.question,
        answer: card.answer,
        choices: card.choices?.length >= 4
          ? card.choices
          : generateChoices(card.answer, allAnswers)
      }));
      setQuestions(qWithChoices);
      setSelectedAnswers(new Array(qWithChoices.length).fill(null));
    }
  }, [topic, navigate]);

  useEffect(() => {
    if (score !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(timer);
          handleSubmitQuiz();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [score]);

  const handleSelect = (index, choice) => {
    const updated = [...selectedAnswers];
    updated[index] = choice;
    setSelectedAnswers(updated);
    setCurrentSlide(index); // update slide for animation
  };

  const handleSubmitQuiz = () => {
    const correctCount = questions.reduce((acc, q, i) => {
      return acc + (q.answer.trim().toLowerCase() === selectedAnswers[i]?.trim().toLowerCase() ? 1 : 0);
    }, 0);
  
    // 🧠 Save the result to localStorage for review later
    localStorage.setItem(`quizResult_${topic.label}`, JSON.stringify({
      score: correctCount,
      selectedAnswers,
      timestamp: new Date().toISOString()
    }));
  
    setScore(correctCount);
    setShowReview(true);
  };
  

  const getProgress = () => {
    const answered = selectedAnswers.filter(ans => ans !== null).length;
    return Math.floor((answered / questions.length) * 100);
  };

  if (!topic || questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-yellow-100 border-b border-yellow-300 p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-yellow-700">📝 Quiz: {topic.label}</h1>
        {score === null && (
          <span className="text-md font-medium text-red-600">⏱️ {timeLeft}s</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200">
        <div
          className="h-3 bg-yellow-500 transition-all duration-700"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      <div className="flex-grow p-6 md:p-10 space-y-8">
        {!showReview ? (
          <>
            {questions.map((q, index) => (
              <div
                key={index}
                className={`bg-white border border-yellow-200 p-6 rounded-2xl shadow-md transform transition duration-500 ease-out ${
                  currentSlide === index ? "translate-x-0 opacity-100" : "translate-x-2 opacity-80"
                }`}
              >
                <p className="font-semibold text-gray-800 mb-4">
                  Q{index + 1}: {q.question}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.choices.map((choice, cIndex) => (
                    <label
                      key={cIndex}
                      className={`border p-3 rounded-xl cursor-pointer transition ${
                        selectedAnswers[index] === choice
                          ? "bg-yellow-300 border-yellow-500 font-semibold"
                          : "hover:bg-yellow-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={choice}
                        checked={selectedAnswers[index] === choice}
                        onChange={() => handleSelect(index, choice)}
                        className="mr-2"
                      />
                      {choice}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                onClick={handleSubmitQuiz}
                className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full transition"
              >
                Submit Quiz
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center text-2xl font-bold text-yellow-800">
              ✅ You scored {score} / {questions.length}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Review Answers:</h2>
              <div className="space-y-6">
                {questions.map((q, index) => {
                  const isCorrect =
                    selectedAnswers[index]?.trim().toLowerCase() === q.answer.trim().toLowerCase();

                  return (
                    <div
                      key={index}
                      className={`p-5 rounded-xl shadow-md border-l-4 transition-all ${
                        isCorrect
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                      }`}
                    >
                      <p className="font-semibold mb-2">
                        Q{index + 1}: {q.question}
                      </p>
                      <p className="text-sm">
                        ✅ Correct Answer: <strong>{q.answer}</strong>
                      </p>
                      <p className="text-sm">
                        🧠 Your Answer:{" "}
                        <strong className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {selectedAnswers[index] || "No Answer"}
                        </strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate("/tools/quiz")}
                className="flex items-center gap-2 bg-white text-yellow-600 font-semibold px-5 py-2 rounded-full border border-yellow-300 shadow hover:scale-105 transition"
              >
                Back to Quiz List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizStart;
