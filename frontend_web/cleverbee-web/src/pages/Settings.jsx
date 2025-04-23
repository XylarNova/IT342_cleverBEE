import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './features/Sidebar';
import axios from 'axios';

const avatarOptions = [
  '/avatar1.png',
  '/avatar2.png',
  '/avatar3.png',
  '/avatar4.png',
  '/avatar5.png',
];

const Settings = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const [selectedAvatar, setSelectedAvatar] = useState('/avatar1.png');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    language: 'English',
  });
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const { data } = await axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          language: data.language || 'English',
        });
        setSelectedAvatar(data.profilePic || '/avatar1.png');
        setEmailNotif(data.emailNotif);
        setSmsNotif(data.smsNotif);
        setNewsletter(data.newsletter);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    fetchUser();
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveChanges = () => {
    alert('Profile updated!');
  };

  return (
    <div className="flex min-h-screen bg-yellow-50 dark:bg-gray-900 dark:text-white">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="border-b pb-4">
            <h1 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
          </div>

          {/* Profile Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">👤 Profile Information</h2>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={selectedAvatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-md"
                />
                <div className="flex gap-2 flex-wrap justify-center">
                  {avatarOptions.map((avatar) => (
                    <img
                      key={avatar}
                      src={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      alt="avatar"
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition hover:scale-110 ${
                        selectedAvatar === avatar ? 'border-yellow-500' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
                >
                  <option>English</option>
                  <option>Filipino</option>
                  <option>Spanish</option>
                </select>
                <button
                  onClick={saveChanges}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full shadow"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-6">🎛️ Preferences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <label className="flex justify-between items-center">
                <span>🌙 Dark Mode</span>
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
              </label>
              <label className="flex justify-between items-center">
                <span>📩 Email Notifications</span>
                <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
              </label>
              <label className="flex justify-between items-center">
                <span>📱 SMS Alerts</span>
                <input type="checkbox" checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)} />
              </label>
              <label className="flex justify-between items-center">
                <span>📰 Subscribe to Newsletter</span>
                <input type="checkbox" checked={newsletter} onChange={() => setNewsletter(!newsletter)} />
              </label>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4">🔐 Security</h2>
            <button
              onClick={() => alert('Redirect to Change Password')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              Change Password
            </button>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-300 mb-4">🗑️ Danger Zone</h2>
            <p className="text-sm text-red-500 mb-4">This action cannot be undone. Please proceed with caution.</p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow">
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
