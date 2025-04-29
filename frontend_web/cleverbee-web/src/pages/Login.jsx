import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api"; // 🛠️ Import the centralized API here

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const playBuzz = () => {
    const buzz = new Audio("/buzz.mp3");
    buzz.volume = 0.2;
    buzz.play();
  };

  const bees = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 85)}vh`,
      left: `${Math.floor(Math.random() * 90)}vw`,
      animationName: `beeFly${Math.floor(Math.random() * 3) + 1}`,
      animationDuration: `${(Math.random() * 4 + 5).toFixed(2)}s`,
      animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
    }));
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password }); // 🛠️ use centralized api
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 🛠️ Update Authorization
        setShowSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2500);
      } else {
        alert("No token received. Something went wrong.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      console.error("❌", msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center text-center px-4">
        <img src="/bee.png" alt="Bee" className="w-24 mb-4 animate-bounce" loading="lazy" />
        <h1 className="text-3xl font-bold text-yellow-800 mb-2">Login Successful!</h1>
        <p className="text-gray-700">Buzzing into your dashboard... 🐝</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center relative overflow-hidden px-4">
      {/* 🏠 Home Button (Top Left) */}
      <img
        src="/home.png"
        alt="Home"
        className="w-24 cursor-pointer absolute top-4 left-4 z-50"
        onClick={() => navigate("/")}
      />

      {/* 🐝 Floating Bees */}
      {bees.map((bee) => (
        <img
          key={bee.id}
          src="/bee.png"
          alt="Bee"
          loading="lazy"
          className="bee bee-wiggle bee-glow"
          onMouseEnter={playBuzz}
          style={{
            top: bee.top,
            left: bee.left,
            animationName: bee.animationName,
            animationDuration: bee.animationDuration,
            animationDelay: bee.animationDelay,
            cursor: "pointer",
            position: "absolute",
            zIndex: 40,
          }}
        />
      ))}

      {/* 🧾 Login Box */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10 text-center">
        <h1 className="text-2xl font-bold text-yellow-700 mb-1">Welcome to CleverBee</h1>
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

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
          className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Log In"}
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
