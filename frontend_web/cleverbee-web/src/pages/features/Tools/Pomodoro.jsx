import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaRedo, FaArrowLeft, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// 🌟 Setup axios API
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const HoneycombSVG = ({ children }) => (
  <svg viewBox="0 0 200 173.2" width="300" height="260" className="drop-shadow-2xl">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#facc15" />
      </filter>
    </defs>
    <polygon
      points="100,0 200,50 200,123.2 100,173.2 0,123.2 0,50"
      fill="#f6a800"
      stroke="#e6a000"
      strokeWidth="8"
      filter="url(#glow)"
    />
    <foreignObject x="20" y="30" width="160" height="120">
      <div className="w-full h-full flex items-center justify-center text-5xl font-extrabold text-white">
        {children}
      </div>
    </foreignObject>
  </svg>
);

const Pomodoro = () => {
  const navigate = useNavigate();
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('cleverbee_sound');
    return saved === null ? true : JSON.parse(saved);
  });
  const [beesEnabled, setBeesEnabled] = useState(true);

  const intervalRef = useRef(null);
  const tickAudio = useRef(null);

  const MODES = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const motivationalQuotes = {
    focus: "Go go go! Time to shine, champ! 🌟",
    short: "Good job! Time for a cozy break 🍵",
    long: "You're amazing! Take a well-earned rest 🌙",
  };

  // 🛠 Load sessions
  const fetchSessions = async () => {
    try {
      const res = await api.get('/pomodoro/sessions'); // Updated to match backend API
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions(); // Fetch sessions when the component mounts
  }, []); // Empty dependency array to run only once

  // 🎵 Sound setup
  useEffect(() => {
    const tick = new Audio('/tick.mp3');
    tick.loop = false;
    tickAudio.current = tick;

    const loopTick = () => {
      if (tick.currentTime >= 27.7) {
        tick.currentTime = 0;
        tick.play();
      }
    };
    tick.addEventListener('timeupdate', loopTick);

    return () => {
      tick.removeEventListener('timeupdate', loopTick);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cleverbee_sound', JSON.stringify(soundEnabled));
    if (!soundEnabled && isRunning) {
      tickAudio.current.pause();
    } else if (soundEnabled && isRunning) {
      tickAudio.current.play();
    }
  }, [soundEnabled, isRunning]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (mode) => {
    clearInterval(intervalRef.current);
    tickAudio.current.pause();
    setIsRunning(false);
    setCurrentMode(mode);
    setTimeLeft(MODES[mode]);
    setCycleCount(0);
  };

  // 🍯 ADD a new session (connected to backend)
  const handleAddSession = async () => {
    if (sessionTitle.trim() === '' || sessionsBeforeLongBreak <= 0) {
      return;
    }
    try {
      const userResponse = await api.get('/user/me'); // 🐝 Fetch current user
      const userId = userResponse.data.id;

      const newSession = {
        title: sessionTitle,
        mode: currentMode,
        sessionsBeforeLongBreak: sessionsBeforeLongBreak,
        status: "Ongoing",
        userId: userId, // 🐝 Add userId
      };

      await api.post('/pomodoro/sessions', newSession); // Updated to backend API path

      fetchSessions(); // reload sessions
      setSessionTitle('');
      setSessionsBeforeLongBreak(4);
    } catch (error) {
      console.error("Error adding session:", error);
    }
  };

  // ✏️ EDIT session title (connected to backend)
  const handleEditSession = async (id, currentTitle) => {
    const newTitle = prompt('Edit Session Title', currentTitle);
    if (newTitle && newTitle.trim() !== '') {
      try {
        const response = await api.put(`/pomodoro/sessions/${id}`, { // Updated to backend API path
          title: newTitle,
        });
        setSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, title: response.data.title } : s))
        );
      } catch (error) {
        console.error('Error editing session:', error);
      }
    }
  };

  // 🗑️ DELETE session (connected to backend)
  const handleDeleteSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/pomodoro/sessions/${id}`); // Updated to backend API path
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 relative flex flex-col items-center justify-start px-6 py-8 font-sans overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, #fef3c7 0%, #fde68a 20%, #fef9c3 100%)',
      }}
    >
      {/* 🐝 Floating Bees */}
      {beesEnabled && (
        <>
          {[...Array(10)].map((_, idx) => (
            <motion.div
              key={idx}
              className="absolute w-8 h-8"
              animate={{ y: [0, -20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 3,
                ease: "easeInOut",
              }}
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
              }}
            >
              <img src="/bee.png" alt="Bee" />
            </motion.div>
          ))}
        </>
      )}

      {/* 🔙 Back Button */}
      <button onClick={() => navigate('/tools')} className="btn-back flex items-center gap-2">
        <FaArrowLeft /> Back to Study Tools
      </button>

      {/* ✨ Tabs */}
      <div className="flex gap-4 my-4">
        {['focus', 'short', 'long'].map((mode) => (
          <button
            key={mode}
            onClick={() => switchMode(mode)}
            className={`px-4 py-2 rounded-full font-bold ${
              currentMode === mode ? 'bg-yellow-400 text-black' : 'bg-white text-yellow-700'
            }`}
          >
            {mode === 'focus' ? 'Pomodoro' : mode === 'short' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      {/* 🐝 Bee Mascot */}
      <div className="w-20 h-20 bg-white border-4 border-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-md animate-bounce">
        <img src="/mainBee.png" alt="Bee mascot" className="w-14 h-14 object-contain" />
      </div>

      {/* 🍯 Timer */}
      <HoneycombSVG>{formatTime(timeLeft)}</HoneycombSVG>

      {/* 📢 Mode Label */}
      <div className="mt-4 text-xl font-bold text-yellow-700 flex items-center gap-2">
        {currentMode === 'focus' ? '🍅 Pomodoro' : currentMode === 'short' ? '🍵 Short Break' : '🌙 Long Break'}
      </div>

      {/* 🌟 Motivational Quote */}
      <div className="mt-4 text-lg font-medium text-gray-700 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {motivationalQuotes[currentMode]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 📝 Session Inputs */}
      <div className="mt-8 w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="flex flex-col w-full">
          <label className="text-md font-bold text-yellow-700 mb-2 flex items-center gap-2">
            🍯 Session Title
          </label>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="Enter Session Title (ex: Study Math)"
            className="px-6 py-3 rounded-full border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full text-center"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-md font-bold text-yellow-700 mb-2 flex items-center gap-2">
            📈 Sessions Before Long Break
          </label>
          <input
            type="number"
            min="1"
            value={sessionsBeforeLongBreak}
            onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value))}
            className="px-6 py-3 rounded-full border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full text-center"
          />
        </div>

        <button
          onClick={handleAddSession}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg text-xl transition-transform transform hover:scale-105 w-full"
        >
          ➕ Add Session
        </button>
      </div>

      {/* 🎵 Toggles */}
      <div className="mt-6 flex items-center gap-6">
        <label className="flex items-center text-sm font-semibold text-yellow-700 gap-2">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            className="accent-yellow-500 w-4 h-4"
          />
          Bee Sounds
        </label>
        <label className="flex items-center text-sm font-semibold text-yellow-700 gap-2">
          <input
            type="checkbox"
            checked={beesEnabled}
            onChange={() => setBeesEnabled(!beesEnabled)}
            className="accent-yellow-500 w-4 h-4"
          />
          Floating Bees
        </label>
      </div>

      {/* ▶️ Controls */}
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        {!isRunning ? (
          <button
            onClick={() => {
              setIsRunning(true);
              if (soundEnabled) tickAudio.current.play();
              intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                  if (prev === 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full shadow-lg text-xl font-bold transition-transform transform hover:scale-105"
          >
            <FaPlay className="inline mr-2" /> Start
          </button>
        ) : (
          <button
            onClick={() => {
              clearInterval(intervalRef.current);
              tickAudio.current.pause();
              setIsRunning(false);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-black px-8 py-3 rounded-full shadow-lg text-xl font-bold transition-transform transform hover:scale-105"
          >
            <FaPause className="inline mr-2" /> Pause
          </button>
        )}
        <button
          onClick={() => {
            clearInterval(intervalRef.current);
            tickAudio.current.pause();
            setIsRunning(false);
            setTimeLeft(MODES[currentMode]);
            setCycleCount(0);
          }}
          className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-full shadow-lg text-xl font-bold transition-transform transform hover:scale-105"
        >
          <FaRedo className="inline mr-2" /> Reset
        </button>
      </div>

      {/* 🍯 Progress Circles */}
      <div className="mt-8 flex gap-2">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 rounded-full border-2 ${
              idx < cycleCount % 4 ? 'bg-yellow-500 border-yellow-600' : 'bg-white border-yellow-400'
            }`}
          />
        ))}
      </div>

      {/* 📚 Session Cards */}
      <div className="mt-8 w-full max-w-2xl flex flex-col gap-4">
        {loadingSessions ? (
          <div className="text-gray-500 text-center text-md italic">Loading sessions... 🍯</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-500 text-center text-md italic">
            No sessions yet. Add a session to start your journey! 🍯
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-yellow-300 hover:scale-105 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {session.mode === 'focus' ? '🍅' : session.mode === 'short' ? '🍵' : '🌙'}
                </span>
                <div className="flex flex-col">
                  <div className="font-bold text-yellow-700">{session.title}</div>
                  <div className="text-xs text-gray-500">
                    {session.status === "Completed" ? "✅ Completed" : "⏳ Ongoing"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 text-yellow-600">
                {/* ✏️ Edit */}
                <button
                  onClick={() => handleEditSession(session.id, session.title)}
                  className="hover:text-yellow-800"
                  title="Edit Session"
                >
                  <FaEdit />
                </button>
                {/* 👁️ View */}
                <button
                  onClick={() => alert(`Session: ${session.title}\nMode: ${session.mode}\nStatus: ${session.status}`)}
                  className="hover:text-yellow-800"
                  title="View Session"
                >
                  <FaEye />
                </button>
                {/* 🗑️ Delete */}
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="hover:text-red-600"
                  title="Delete Session"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-gray-600 text-sm font-medium">
        “Stay sweet and focused.” – CleverBee 🍯
      </div>
    </div>
  );
};

export default Pomodoro;
