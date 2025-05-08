import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

const StudyTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', profilePic: '/default-avatar.png' });
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(1);
  const [quote, setQuote] = useState('');

  const maxSessions = 100;

  const motivationalQuotes = [
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "Stay focused and never give up on your dreams.",
    "Small progress is still progress. Keep buzzing!",
    "Your only limit is your mind. Break the hive walls!",
    "Push yourself because no one else is going to do it for you.",
    "It always seems impossible until it's done. Then it's honey-sweet victory!",
    "Don't wish for it, work for it — one flap at a time.",
    "You are capable of more than you know. Believe and bee-lieve!",
    "A busy bee is a productive bee. Keep flying forward!",
    "Even the smallest bee makes a difference in the hive.",
    "Great things come from daily buzzing effort.",
    "Buzz through obstacles — wings were made to flap!",
    "Turn your focus into nectar. Hard work pays off!",
    "No flower blooms overnight. Keep pollinating your goals.",
    "Bees don’t wait for perfect weather. They fly anyway.",
    "You’re not just studying — you’re becoming unstoppable!"
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/user/me', {
          headers: { Authorization: `Bearer ${token}` },
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

    // Initialize quote
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    // Track session count (can increase on tool use)
    const savedCount = parseInt(localStorage.getItem('studySessions')) || 0;
    setSessionCount(savedCount);

    // Daily streak tracking
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLoginDate');
    let savedStreak = parseInt(localStorage.getItem('loginStreak')) || 1;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (new Date(lastLogin).toDateString() === yesterday.toDateString()) {
        savedStreak += 1;
      } else {
        savedStreak = 1;
      }
      localStorage.setItem('lastLoginDate', today);
      localStorage.setItem('loginStreak', savedStreak.toString());
    }

    setStreak(savedStreak);
    fetchUser();
  }, [navigate]);

  const progress = Math.min((sessionCount / maxSessions) * 100, 100);

  const getRank = () => {
    if (sessionCount >= 75) return "🐝 Elite Bee";
    if (sessionCount >= 50) return "🧠 Smart Bee";
    if (sessionCount >= 25) return "📚 Active Bee";
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

        {/* Motivation Widget */}
        <section className="bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-yellow-600 mb-2">💬 Motivation of the Day</h2>
          <p className="italic text-gray-700">"{quote}"</p>
        </section>

        {/* Streak & Progress */}
        <section className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-10">
          <img
            src="/mainBee.png"
            alt="Bee"
            className="w-32 h-32 md:w-40 md:h-40 object-contain animate-bounce-slow"
          />
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
            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(progress)}% toward your 100-session milestone
            </p>
          </div>
        </section>

        {/* Tool Cards */}
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
                onClick={() => {
                  const newCount = sessionCount + 1;
                  localStorage.setItem('studySessions', newCount.toString());
                  setSessionCount(newCount);
                  navigate(tool.route);
                }}
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
