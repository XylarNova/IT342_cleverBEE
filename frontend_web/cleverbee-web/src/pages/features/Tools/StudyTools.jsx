// StudyTools.jsx (fully integrated with backend + educational comments)

import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

const motivationalQuotes = [
  "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
  "Stay focused and never give up on your dreams.",
  "Small progress is still progress. Keep buzzing!",
  "Your only limit is your mind. Break the hive walls!",
  "Push yourself because no one else is going to do it for you.",
  "It always seems impossible until it's done. Then it's honey-sweet victory!",
  "Don't wish for it, work for it — one flap at a time.",
  "You’re not just studying — you’re becoming unstoppable!"
];

const StudyTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', profilePic: '/default-avatar.png' });
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(1);
  const [quote, setQuote] = useState('');

  const maxSessions = 30; // Updated to a more achievable milestone

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Get user data including streak/sessionCount from backend
        const response = await api.get('/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setUser({
          name: data.username || data.name,
          profilePic: data.profilePic || '/default-avatar.png'
        });
        setSessionCount(data.sessionCount || 0);
        setStreak(data.loginStreak || 1);

        // Immediately update streak on login
        await api.patch('/user/update-streak');
      } catch (error) {
        console.error('Error fetching user data', error);
        navigate('/login');
      }
    };

    fetchUser();
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, [navigate]);

  const incrementSession = async (toolRoute) => {
    try {
      await api.patch('/user/increment-session'); // Backend session count
      setSessionCount((prev) => prev + 1);
      navigate(toolRoute);
    } catch (error) {
      console.error('Failed to increment session count', error);
    }
  };

  const progress = Math.min((sessionCount / maxSessions) * 100, 100);
  const getRank = () => {
    if (sessionCount >= 25) return "🐝 Elite Bee";
    if (sessionCount >= 15) return "🧠 Smart Bee";
    if (sessionCount >= 7) return "📚 Active Bee";
    return "🌱 New Bee";
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-yellow-50 to-white p-6 md:p-10 space-y-12">
        {/* Header */}
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

        {/* Motivation Quote */}
        <section className="bg-yellow-100 border-l-8 border-yellow-400 rounded-2xl p-6 shadow">
          <h2 className="text-xl font-bold text-yellow-600 mb-2">💬 Motivation of the Day</h2>
          <p className="italic text-gray-800 text-lg">“{quote}”</p>
        </section>

        {/* Progress Widget */}
        <section className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
          {/* Animated Bee Streak */}
          <div className="flex flex-wrap justify-center gap-1 w-40">
            {Array.from({ length: streak }).map((_, i) => (
              <img
                key={i}
                src="/mainBee.png"
                alt="Bee"
                className="w-10 h-10 animate-bounce"
              />
            ))}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-yellow-600">📈 Study Progress</h2>
            <p className="text-gray-700 text-lg">
              🎯 Sessions Completed: <span className="font-semibold">{sessionCount}</span>
            </p>
            <p className="text-gray-700 text-lg">
              🔥 Daily Streak: <span className="font-semibold">{streak} day{streak !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-gray-700 text-lg">
              🏅 Rank: <span className="font-semibold">{getRank()}</span>
            </p>
            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {Math.round(progress)}% toward your {maxSessions}-session goal
            </p>
          </div>
        </section>

        {/* Tool Cards */}
        <section>
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">🛠️ Choose a Study Tool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              label: 'Pomodoro Timer', image: 'pomodoro.png', color: 'from-pink-100 to-pink-200', route: '/tools/pomodoro'
            }, {
              label: 'Flashcards', image: 'flashcards.png', color: 'from-blue-100 to-blue-200', route: '/tools/flashcards'
            }, {
              label: 'Quiz', image: 'quiz.png', color: 'from-green-100 to-green-200', route: '/tools/quiz'
            }].map((tool) => (
              <div
                key={tool.label}
                onClick={() => incrementSession(tool.route)}
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
