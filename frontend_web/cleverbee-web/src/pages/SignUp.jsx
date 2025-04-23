import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

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
    const { username, firstName, lastName, email, password, confirmPassword } = formData;

    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        username,
        firstName,
        lastName,
        email,
        password,
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/welcome");
      }, 3000);
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed");
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center text-center px-4">
        <img
          src="/bee.png"
          alt="Bee"
          className="w-24 mb-4 animate-bounce"
          loading="lazy"
        />
        <h1 className="text-3xl font-bold text-yellow-800 mb-2">Success!</h1>
        <p className="text-gray-700">Welcome to the hive 🐝 Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center relative overflow-hidden px-4">
      {/* Bees */}
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
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
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Sign Up Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full z-10 text-center mt-6 mb-6">
        <h1 className="text-3xl font-bold text-yellow-700 mb-4">Sign Up</h1>
        <p className="text-gray-500 mb-6">Join the hive today! 🐝</p>

        <div className="text-left mb-4 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* First Name & Last Name Side by Side */}
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-9 text-gray-600 hover:text-yellow-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-3 top-9 text-gray-600 hover:text-yellow-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
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
