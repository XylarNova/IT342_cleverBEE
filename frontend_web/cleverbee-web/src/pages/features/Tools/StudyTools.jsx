import React, { useState, useEffect } from 'react';
import {
  FaHome, FaTasks, FaCalendarAlt, FaLightbulb,
  FaFolderOpen, FaMapMarkerAlt, FaCog, FaBars,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const StudyTools = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Simulated fetched data (replace with real data in future)
  const [studyHours, setStudyHours] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    learningStyle: 'visual', // Options: visual, auditory, kinesthetic
  });

  const maxHours = 100;

  useEffect(() => {
    const fetchStudyData = async () => {
      const fetchedHours = 62; // Replace with API or localStorage
      setStudyHours(fetchedHours);
    };
    fetchStudyData();
  }, []);

  const isActive = (path) => location.pathname === path;
  const progress = Math.min((studyHours / maxHours) * 100, 100);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-gradient-to-br from-yellow-50 to-white p-6 md:p-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-600">Study Tools</h1>
            <p className="text-gray-600 mt-3 text-base">
              Level up your productivity with smart tools built for success.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="/user-profile.png"
              alt="User Profile"
              className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-md object-cover"
            />
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-yellow-600 text-lg">Zucelle</p>
            </div>
          </div>
        </div>

        {/* Study Tracker */}
        <section className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
          <img
            src="/mainBee.png"
            alt="Bee"
            className="w-32 h-32 md:w-40 md:h-40 object-contain animate-bounce-slow"
          />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-yellow-600">Your Weekly Progress</h2>
            <p className="text-gray-700 text-lg">
              You’ve studied for <span className="font-semibold">{studyHours} hours</span> this week.
            </p>
            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(progress)}% of your 100-hr goal
            </p>
          </div>
        </section>

        {/* Tools Section */}
        <section>
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">🛠️ Choose a Study Tool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: 'Pomodoro Timer',
                image: 'pomodoro.png',
                color: 'from-pink-100 to-pink-200',
                route: '/tools/pomodoro',
              },
              {
                label: 'Flashcards',
                image: 'flashcards.png',
                color: 'from-blue-100 to-blue-200',
                route: '/tools/flashcards',
              },
              {
                label: 'Quiz',
                image: 'quiz.png',
                color: 'from-green-100 to-green-200',
                route: '/tools/quiz',
              },
            ].map((tool) => (
              <div
                key={tool.label}
                onClick={() => navigate(tool.route)}
                className={`rounded-3xl p-6 shadow-md hover:shadow-xl bg-gradient-to-br ${tool.color} flex flex-col items-center transition-transform transform hover:scale-105 cursor-pointer`}
              >
                <img
                  src={`/${tool.image}`}
                  alt={tool.label}
                  className="w-32 h-32 object-contain mb-4 drop-shadow-md"
                />
                <h3 className="text-xl font-bold text-gray-800">{tool.label}</h3>
              </div>
            ))}
          </div>
        </section>

{/* Study Recommendations - Better Layout */}
<section className="bg-white rounded-3xl shadow-xl p-8">
  <h2 className="text-2xl font-bold text-yellow-600 mb-6">Personalized Study Tips</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Learning Style Tips */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-md">
      <h3 className="text-xl font-semibold text-yellow-700 mb-2">🎓 Based on Your Learning Style</h3>
      {userPreferences.learningStyle === 'visual' && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Use <span className="font-semibold">diagrams</span> and <span className="font-semibold">charts</span>.</li>
          <li>Make color-coded notes.</li>
          <li>Try digital flashcards with images.</li>
        </ul>
      )}
      {userPreferences.learningStyle === 'auditory' && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Read your notes aloud.</li>
          <li>Record yourself and play it back.</li>
          <li>Study with a partner through discussion.</li>
        </ul>
      )}
      {userPreferences.learningStyle === 'kinesthetic' && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Use hands-on materials or real objects.</li>
          <li>Walk while memorizing content.</li>
          <li>Act out scenarios or processes.</li>
        </ul>
      )}
    </div>

    {/* Activity Level Tips */}
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-md">
      <h3 className="text-xl font-semibold text-yellow-700 mb-2">📈 Based on Your Activity</h3>
      {studyHours < 20 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Try short 25-minute Pomodoro sessions.</li>
          <li>Study at the same time daily to build habit.</li>
        </ul>
      )}
      {studyHours >= 20 && studyHours < 70 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Keep it steady – consistency is key!</li>
          <li>Alternate between Pomodoro and quizzes.</li>
        </ul>
      )}
      {studyHours >= 70 && (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Use spaced repetition to review.</li>
          <li>Do weekly self-assessments.</li>
        </ul>
      )}
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

export default StudyTools;
