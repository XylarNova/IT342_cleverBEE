import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api'; // ✅ use your deployed backend connector

const StudyTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', profilePic: '/default-avatar.png' });
  const [studyHours, setStudyHours] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    learningStyle: 'visual', // Options: visual, auditory, kinesthetic
  });

  const maxHours = 100;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setUser({
          name: data.username || data.name || 'Guest',
          profilePic: data.profilePic || '/default-avatar.png',
        });
      } catch (error) {
        console.error('Error fetching user data', error);
        navigate('/login');
      }
    };

    fetchUser();

    const fetchStudyData = async () => {
      // If you have study hours tracking in backend, fetch it here.
      // For now, still using dummy/fake data.
      const fetchedHours = 62;
      setStudyHours(fetchedHours);
    };

    fetchStudyData();
  }, [navigate]);

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
              src={user.profilePic}
              alt="User Profile"
              className="w-12 h-12 rounded-full border-2 border-yellow-500 shadow-md object-cover"
            />
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-yellow-600 text-lg">{user.name}</p>
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
              { label: 'Pomodoro Timer', image: 'pomodoro.png', color: 'from-pink-100 to-pink-200', route: '/tools/pomodoro' },
              { label: 'Flashcards', image: 'flashcards.png', color: 'from-blue-100 to-blue-200', route: '/tools/flashcards' },
              { label: 'Quiz', image: 'quiz.png', color: 'from-green-100 to-green-200', route: '/tools/quiz' }
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

      </main>
    </div>
  );
};

export default StudyTools;
