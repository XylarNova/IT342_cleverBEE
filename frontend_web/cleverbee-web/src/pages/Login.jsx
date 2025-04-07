import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const playBuzz = () => {
    const buzz = new Audio("/buzz.mp3");
    buzz.volume = 0.2;
    buzz.play();
  };

  // Random Bee Movements
  const bees = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const randomTop = Math.floor(Math.random() * 85);
      const randomLeft = Math.floor(Math.random() * 90);
      const animationName = `beeFly${Math.floor(Math.random() * 3) + 1}`;
      const animationDuration = (Math.random() * 4 + 5).toFixed(2);
      const animationDelay = (Math.random() * 3).toFixed(2);

      return {
        id: i,
        top: `${randomTop}vh`,
        left: `${randomLeft}vw`,
        animationName,
        animationDuration: `${animationDuration}s`,
        animationDelay: `${animationDelay}s`,
      };
    });
  }, []);

  // Handle Sign In
  const handleSignIn = () => {
    if (email && password) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center relative overflow-hidden px-4">
      {/* 🐝 Bees flying in front of the form */}
      {bees.map((bee) => (
        <img
          key={bee.id}
          src="/bee.png"
          alt="Bee"
          className="bee bee-wiggle bee-glow"
          onMouseEnter={playBuzz}
          style={{
            top: bee.top,
            left: bee.left,
            animationName: bee.animationName,
            animationDuration: bee.animationDuration,
            animationDelay: bee.animationDelay,
            cursor: "pointer",
            zIndex: 50, // This ensures the bees fly above the form
          }}
        />
      ))}

      {/* 🔐 Login Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10 text-center">
        <h1 className="text-2xl font-bold text-yellow-700 mb-1">
          Welcome to CleverBee
        </h1>
        <p className="text-gray-500 mb-6">Buzz into something amazing!</p>

        <div className="text-left">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Forgot Password Link */}
          <div className="text-sm text-gray-600 mb-4">
            <span
              onClick={() => alert("Forgot password functionality here")}
              className="text-yellow-700 cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>
        </div>

        <button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-yellow-700 font-semibold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
