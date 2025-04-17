import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all stored data (like username, tokens, etc.)
    localStorage.clear();

    // Redirect to login after 2.5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center text-center px-4">
      <img
        src="/bee.png"
        alt="Bee"
        className="w-24 mb-4 animate-bounce"
        loading="lazy"
      />
      <h1 className="text-3xl font-bold text-yellow-800 mb-2">Logged Out</h1>
      <p className="text-gray-700">You’ve been signed out. Buzzing you back to login... 🐝</p>
    </div>
  );
}
