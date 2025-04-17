import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [user, setUser] = useState({ name: 'Guest' });
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:3000/api/user/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Failed to fetch user", err));

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedSchedules = JSON.parse(localStorage.getItem('schedules')) || [];

    setTasks(storedTasks.slice(0, 3));
    setSchedules(storedSchedules.slice(0, 3));
  }, []);

  return (
    <div className="flex min-h-screen bg-yellow-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-yellow-600">Dashboard</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Greeting Card */}
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center gap-4">
              <img
                src="/boy blond.png"
                alt="User Avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-300 shadow-lg hover:scale-105 transition"
              />
              <div>
                <h2 className="text-xl font-bold text-yellow-600">Hi, {user.name} 👋</h2>
                <p className="text-sm text-gray-600 mt-1">Let’s achieve great things today!</p>
                <button className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:to-yellow-600 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition">
                  Start Your Day
                </button>
              </div>
            </section>

            <CalendarCard />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Tasks Card */}
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">📝 My Tasks</h2>
              </div>
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks yet.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{task.label}</span>
                      <span className="text-gray-500">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          task.priority === 'high'
                            ? 'bg-red-500'
                            : task.priority === 'medium'
                            ? 'bg-blue-400'
                            : 'bg-green-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Schedule Card */}
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">📅 Upcoming Classes</h2>
              </div>
              {schedules.length === 0 ? (
                <p className="text-sm text-gray-500">No schedules available.</p>
              ) : (
                schedules.map(schedule => (
                  <div key={schedule.id} className="mb-3">
                    <div className="text-md font-medium">{schedule.subject}</div>
                    <div className="text-sm text-gray-600">{schedule.day} — {schedule.time}</div>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const CalendarCard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const dates = Array.from({ length: startDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          className="text-lg font-bold text-yellow-500 hover:text-yellow-600"
        >
          {'<'}
        </button>
        <h2 className="text-xl font-bold text-gray-800">{monthName} {year}</h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="text-lg font-bold text-yellow-500 hover:text-yellow-600"
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-sm mb-2 text-gray-600">
        {days.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 text-sm text-center gap-1">
        {dates.map((date, i) => {
          const isToday =
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          return (
            <div
              key={i}
              className={`py-2 rounded-md ${
                date ? 'hover:bg-yellow-100' : ''
              } ${isToday ? 'bg-yellow-300 ring-2 ring-yellow-500 font-bold text-white' : 'text-gray-700'}`}
            >
              {date || ''}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
