import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './features/Sidebar';  // Make sure the Sidebar is correctly imported
import api from '../api/api';  // Import the API module

const avatarOptions = [
  '/avatar1.png',
  '/avatar2.png',
  '/avatar3.png',
  '/avatar4.png',
  '/avatar5.png',
];

const Settings = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState('/avatar1.png');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    language: 'English',
  });

  // Fetch user profile data from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login'); // Redirect if no token is found

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/user/me', {
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
      } catch (err) {
        console.error('Failed to load user:', err);
        alert('There was an error loading your profile. Please try again later.');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save changes to the backend
  const saveChanges = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("You're not logged in.");
      return;
    }
  
    try {
      await api.put('/user/update', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        profilePic: selectedAvatar,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="border-b pb-4">
            <h1 className="text-4xl font-bold text-yellow-600">Settings</h1>
            <p className="text-gray-600">Customize your experience</p>
          </div>

          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">👤 Profile Information</h2>
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
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition hover:scale-110 ${selectedAvatar === avatar ? 'border-yellow-500' : 'border-transparent'}`}
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
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-3 border border-gray-300 rounded-lg w-full bg-white"
                  />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg w-full bg-white"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  readOnly
                  className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <button
                  onClick={saveChanges}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full shadow"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">🔐 Security</h2>
            <button
              onClick={() => alert('Redirect to Change Password')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              Change Password
            </button>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-50 border border-red-300 rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">🗑️ Danger Zone</h2>
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
