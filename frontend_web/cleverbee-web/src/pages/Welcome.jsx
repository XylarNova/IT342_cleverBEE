import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Bee Explorer";
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 75%)`,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => {
        c.y += c.speed;
        if (c.y > canvas.height) {
          c.y = -10;
          c.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, 2 * Math.PI);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    animate();

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 blur-sm" />

      <div className="relative z-10 p-10 px-14 bg-white/30 backdrop-blur-lg border border-yellow-200 shadow-2xl rounded-3xl flex flex-col items-center animate-fade-in transition-all">
        <img
          src="/bee.png"
          alt="CleverBee Mascot"
          className="w-32 drop-shadow-2xl hover:scale-105 transition-all duration-300"
        />
        <h1 className="text-5xl font-bold text-yellow-700 mt-4 drop-shadow">
          Hello, {username}! 🐝
        </h1>
        <p className="text-lg text-gray-800 mt-2 font-medium">
          You’re buzzing into the CleverBee dashboard.
        </p>
        <p className="text-sm text-gray-600 mt-1 mb-5 italic">
          We’re preparing your hive...
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition duration-300"
        >
          Buzz Me In 🚀
        </button>
      </div>
    </div>
  );
}
