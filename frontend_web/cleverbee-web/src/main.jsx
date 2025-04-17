import React from "react";
import ReactDOM from "react-dom/client";
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Welcome from './pages/Welcome';
import Dashboard from "./pages/features/Dashboard.jsx";
import Tasks from './pages/features/Tasks';
import Schedule from './pages/features/Schedule';
import StudyTools from './pages/features/Tools/StudyTools.jsx';
import Pomodoro from './pages/features/Tools/Pomodoro.jsx';
import Flashcards from './pages/features/Tools/Flashcards.jsx';
import FlashcardStudy from './pages/features/Tools/FlashcardStudy.jsx';
import Quiz from './pages/features/Tools/Quiz.jsx';
import QuizStart from './pages/features/Tools/QuizStart.jsx';
import Files from './pages/features/Files';
import Map from './pages/features/Map';
import Settings from './pages/Settings';
import Logout from './pages/Logout';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/tools" element={<StudyTools />} />
        <Route path="/tools/pomodoro" element={<Pomodoro />} />
        <Route path="/tools/flashcards" element={<Flashcards />} />
        <Route path="/study" element={<FlashcardStudy />} />
        <Route path="/tools/quiz" element={<Quiz />} />
        <Route path="/quiz-start" element={<QuizStart />} />
        <Route path="/files" element={<Files />} />
        <Route path="/map" element={<Map />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
