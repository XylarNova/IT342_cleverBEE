import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Task Management",
    description: "Easily create, prioritize, and track your study tasks in one place.",
  },
  {
    title: "Study Techniques",
    description: "Use proven methods like Pomodoro, flashcards, and quizzes.",
  },
  {
    title: "Progress Tracking",
    description: "Visualize your accomplishments and stay motivated daily.",
  },
  {
    title: "File Management",
    description: "Upload, sort, and access notes and study materials quickly.",
  },
  {
    title: "Smart Reminders",
    description: "Never forget deadlines with intelligent study alerts.",
  },
  {
    title: "Goal Setting",
    description: "Set academic goals and build consistent study habits.",
  },
];

export default function Landing() {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="font-sans text-gray-800 bg-white scroll-smooth">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white shadow z-50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-yellow-500">CleverBee 🐝</h1>
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 font-medium text-gray-700">
            <a href="#features" className="hover:text-yellow-500 transition">Features</a>
            <a href="#about" className="hover:text-yellow-500 transition">About</a>
            <a href="#contact" className="hover:text-yellow-500 transition">Contact</a>
          </nav>
          <button
            onClick={handleSignIn}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold shadow transition"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 bg-yellow-100 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <img
          src="/Cleverbee_bee.png"
          alt="Study Bee"
          className="w-40 h-40 mb-6 floating-bee hero-glow"
        />
        <h2 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow">
          Plan Smarter. Study Better.
        </h2>
        <p className="text-xl text-gray-700 max-w-2xl mb-8 leading-relaxed">
          CleverBee helps you stay organized, productive, and focused—designed especially for students.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-white text-lg px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="text-center mb-16">
          <h3 className="relative inline-block text-4xl font-bold text-gray-800 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-2 after:bg-yellow-300 after:rounded-full">
            Why Choose CleverBee?
          </h3>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Discover features that help you focus, organize, and study smarter.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-14">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col-reverse md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              } items-center gap-8 transition duration-500`}
            >
              <div className="flex-shrink-0 text-5xl text-yellow-400">🐝</div>
              <div className="bg-yellow-50 hover:bg-yellow-100 transition rounded-2xl shadow-soft p-8 w-full">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-yellow-100 py-24 px-6 text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">About CleverBee</h3>
        <p className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed">
          CleverBee is your all-in-one digital planner that empowers students with powerful tools
          like task management, personalized study methods, and smart scheduling—helping you reach
          your goals with less stress and more success.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 text-center bg-white">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h3>
        <p className="text-gray-700 mb-2 text-lg">
          We’d love to hear from you! Whether it's feedback, questions, or just saying hello:
        </p>
        <p className="font-medium text-gray-800 text-lg mb-1">📧 support@cleverbee.com</p>
        <p className="font-medium text-gray-800 text-lg">📞 +1 234 567 890</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 text-sm">
        © 2025 CleverBee. All rights reserved.
      </footer>

      {/* Back to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          title="Back to top"
          className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg z-50 transition transform hover:scale-110"
        >
          ⬆
        </button>
      )}
    </div>
  );
}
