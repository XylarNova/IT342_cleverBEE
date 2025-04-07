import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const playBuzz = () => {
    const buzz = new Audio("/buzz.mp3");
    buzz.volume = 0.2;
    buzz.play();
  };

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

  const handleSignUp = async () => {
    if (username && fullname && email && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          // Use relative path for the API call
          const response = await axios.post("/api/auth/register", {
            username,
            fullname,
            email,
            password,
          });

          // Handle success response
          console.log(response.data.message);
          alert("User registered successfully!");
          navigate("/welcome"); // Navigate after successful sign-up
        } catch (error) {
          // Handle error response
          console.error(error.response?.data?.message || "Registration failed");
          alert(error.response?.data?.message || "Registration failed");
        }
      } else {
        alert("Passwords do not match.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center relative overflow-hidden px-4">
      {/* 🐝 Bees flying in the background */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
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
              zIndex: 0, // Ensures bees are behind the form
            }}
          />
        ))}
      </div>

      {/* 🐝 Sign Up Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10 text-center mt-6 mb-6">
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">Sign Up</h1>
        <p className="text-gray-500 mb-6">Join the hive today! 🐝</p>

        <div className="text-left mb-4">
          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition"
          onClick={handleSignUp}
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-yellow-700 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}