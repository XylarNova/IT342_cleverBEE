import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

const motivationalQuotes = [
  "🌟 Success doesn't come from what you do occasionally, but what you do consistently!",
  "🚀 Stay focused and never give up — you're almost there!",
  "🐝 Keep buzzing! Small progress is still progress!",
  "💡 Break the hive walls — your only limit is your mind.",
  "🔥 Push harder. You're made for more.",
  "🍯 Sweet success comes after the sting of effort!",
  "🎯 One flap at a time — keep working for it!",
  "🌸 Keep pollinating your goals, the bloom is near!",
  "📚 Study hard today, lead the hive tomorrow!",
  "🧠 Bee-lieve in your brilliance!",
  "🌈 Even rainy days help flowers grow — stay consistent.",
  "🎓 One day you'll thank yourself for not quitting today.",
  "💪 You don’t have to be perfect, just determined!",
  "🌻 Bee the reason your future self smiles.",
  "✏️ Each note you take is a step toward your goals!",
  "🔔 Reminder: Bee proud of how far you’ve come.",
  "🐝 Don’t compare your buzzing to someone else’s — every bee has its rhythm.",
  "🌞 Bee bright. Bee brave. Bee unstoppable!"
];

const StudyTools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Guest', profilePic: '/default-avatar.png' });
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(1);
  const [quote, setQuote] = useState('');
  const maxSessions = 30;

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
          name: data.username || data.name,
          profilePic: data.profilePic || '/default-avatar.png'
        });
        setSessionCount(data.sessionCount || 0);
        setStreak(data.loginStreak || 1);

        // Update streak immediately
        await api.patch('/user/update-streak');
      } catch (error) {
        console.error('Error fetching user', error);
        navigate('/login');
      }
    };

    fetchUser();
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, [navigate]);

  const incrementSession = async (route) => {
    try {
      await api.patch('/user/increment-session');
      setSessionCount(prev => prev + 1);
      navigate(route);
    } catch (err) {
      console.error('Session count update failed', err);
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
            <p className="text-gray-600 mt-3">Buzz through your learning journey!</p>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow-md object-cover"
            />
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-lg font-semibold text-yellow-600">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <section className="bg-gradient-to-r from-yellow-100 to-pink-100 border-l-8 border-yellow-500 rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">💬 Bee Inspired</h2>
          <p className="text-lg text-gray-800 font-medium italic">{quote}</p>
        </section>

        {/* Study Progress */}
        <section className="bg-white rounded-3xl shadow-xl px-8 py-6 flex flex-col md:flex-row gap-10 items-center">
          <img src="/mainBee.png" alt="Big Bee" className="w-32 h-32 md:w-40 md:h-40 object-contain animate-bounce" />

          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-yellow-600">📈 Study Progress</h2>
            <p className="text-gray-800 text-lg">🎯 Sessions Completed: <b>{sessionCount}</b></p>
            <div className="flex items-center gap-2">
              <span className="text-gray-800 text-lg font-medium">🔥 Daily Streak:</span>
              <div className="flex gap-1">
                {Array.from({ length: streak }).map((_, i) => (
                  <img key={i} src="/mainBee.png" alt="Bee" className="w-6 h-6" />
                ))}
              </div>
            </div>
            <p className="text-gray-800 text-lg">🏅 Rank: <b>{getRank()}</b></p>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{Math.round(progress)}% toward your {maxSessions}-session goal</p>
          </div>
        </section>

        {/* Tool Selector */}
        <section>
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">🛠️ Choose a Study Tool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Pomodoro Timer', image: 'pomodoro.png', route: '/tools/pomodoro', color: 'from-red-100 to-pink-200' },
              { label: 'Flashcards', image: 'flashcards.png', route: '/tools/flashcards', color: 'from-blue-100 to-blue-200' },
              { label: 'Quiz', image: 'quiz.png', route: '/tools/quiz', color: 'from-green-100 to-green-200' }
            ].map(tool => (
              <div
                key={tool.label}
                onClick={() => incrementSession(tool.route)}
                className={`rounded-3xl p-6 shadow-md hover:shadow-xl bg-gradient-to-br ${tool.color} flex flex-col items-center transition hover:scale-105 cursor-pointer`}
              >
                <img
                  src={`/${tool.image}`}
                  alt={tool.label}
                  className="w-28 h-28 object-contain mb-3"
                />
                <h3 className="text-lg font-bold text-gray-800">{tool.label}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudyTools;
