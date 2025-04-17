import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaRedo, FaArrowLeft } from 'react-icons/fa';

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

  const MODES = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const [currentMode, setCurrentMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES[currentMode]);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('cleverbee_sound');
    return saved === null ? true : JSON.parse(saved);
  });
  const intervalRef = useRef(null);
  const tickAudio = useRef(null);
  const chimeAudio = useRef(null);

  useEffect(() => {
    const tick = new Audio('/tick.mp3');
    tick.loop = false;
    tickAudio.current = tick;

    const chime = new Audio('/chime.mp3');
    chimeAudio.current = chime;

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
  }, [soundEnabled]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (soundEnabled) tickAudio.current.play();
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    tickAudio.current.pause();
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    tickAudio.current.pause();
    setIsRunning(false);
    setTimeLeft(MODES[currentMode]);
    setCycleCount(0);
  };

  const handleTimerEnd = () => {
    clearInterval(intervalRef.current);
    tickAudio.current.pause();
    if (soundEnabled) chimeAudio.current.play();
    setIsRunning(false);

    if (currentMode === 'focus') {
      const newCycle = cycleCount + 1;
      setCycleCount(newCycle);

      if (newCycle % 4 === 0) {
        setCurrentMode('long');
        setTimeLeft(MODES['long']);
      } else {
        setCurrentMode('short');
        setTimeLeft(MODES['short']);
      }
    } else {
      setCurrentMode('focus');
      setTimeLeft(MODES['focus']);
    }

    setTimeout(() => handleStart(), 1000);
  };

  return (
    <div
      className="min-h-screen bg-yellow-100 relative flex flex-col items-center justify-center px-6 py-14 font-sans overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 20%, #fef3c7 0%, #fde68a 20%, #fef9c3 100%)',
      }}
    >
      <div className="absolute top-6 left-6 rotate-12 opacity-20 w-40 h-40 rounded-3xl bg-yellow-300 blur-3xl"></div>
      <div className="absolute bottom-6 right-10 -rotate-12 opacity-20 w-52 h-52 rounded-full bg-yellow-400 blur-2xl"></div>

      <button onClick={() => navigate('/tools')} className="btn-back">
      <FaArrowLeft /> Back to Study Tools
      </button>


      <div className={`w-20 h-20 bg-white border-4 border-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-md ${isRunning ? 'animate-bounce' : ''} z-10`}>
        <img src="/mainBee.png" alt="Bee mascot" className="w-14 h-14 object-contain" />
      </div>

      <HoneycombSVG>{formatTime(timeLeft)}</HoneycombSVG>

      <div className="mt-4 text-lg font-bold text-yellow-700">
        {currentMode === 'focus' ? '🐝 Focus Time' : currentMode === 'short' ? '🍵 Short Break' : '🌙 Long Break'}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center text-sm font-semibold text-yellow-700 gap-2">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            className="accent-yellow-500 w-4 h-4"
          />
          Bee Sounds
        </label>
      </div>

      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-black text-yellow-400 px-6 py-3 rounded-full shadow-md text-lg font-bold hover:scale-105 transition"
          >
            <FaPlay className="inline mr-2" /> Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="bg-gray-200 text-black px-6 py-3 rounded-full shadow-md text-lg font-bold hover:scale-105 transition"
          >
            <FaPause className="inline mr-2" /> Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md text-lg font-bold hover:scale-105 transition"
        >
          <FaRedo className="inline mr-2" /> Reset
        </button>
      </div>

      <div className="mt-8 flex gap-2">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className={`w-5 h-5 rounded-full border-2 ${
              idx < cycleCount % 4 ? 'bg-yellow-500 border-yellow-600' : 'bg-white border-yellow-400'
            }`}
          />
        ))}
      </div>

      <div className="mt-10 text-center text-gray-600 text-sm font-medium">
        “Stay sweet and focused.” – CleverBee 🍯
      </div>
    </div>
  );
};

export default Pomodoro;
