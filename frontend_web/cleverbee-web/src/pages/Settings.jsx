import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './features/Sidebar';

const Settings = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    language: 'English',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveChanges = () => {
    alert('Profile updated!');
  };

  return (
    <div className="flex bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="border-b pb-4">
            <h1 className="text-4xl font-bold text-yellow-600">Settings</h1>
            <p className="text-gray-600">Manage your profile, preferences, and security settings</p>
          </div>

          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">👤 Profile Information</h2>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={profilePic || '/default-profile.png'}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-yellow-500 object-cover"
                />
                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                  />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="English">English</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Spanish">Spanish</option>
                </select>
                <div className="text-right">
                  <button
                    onClick={saveChanges}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold shadow"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">🎛️ Preferences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <label className="flex justify-between items-center">
                <span>🌙 Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="form-checkbox text-yellow-500"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>📩 Email Notifications</span>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                  className="form-checkbox text-yellow-500"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>📱 SMS Alerts</span>
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={() => setSmsNotif(!smsNotif)}
                  className="form-checkbox text-yellow-500"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>📰 Subscribe to Newsletter</span>
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={() => setNewsletter(!newsletter)}
                  className="form-checkbox text-yellow-500"
                />
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">🔐 Security</h2>
            <button
              onClick={() => alert("Redirect to password change screen")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold shadow"
            >
              Change Password
            </button>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 border border-red-300 rounded-2xl shadow p-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">🗑️ Danger Zone</h2>
            <p className="text-sm text-red-500 mb-4">This action cannot be undone. Please proceed with caution.</p>
            <button
              onClick={() => alert("Account deletion flow")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow"
            >
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
