import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Go up two directories to access 'api.js'

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Guest" });
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, redirecting to login.");
          navigate("/login");
          return;
        }

        const userRes = await api.get("/user/me");
        setUser(userRes.data);

        const taskRes = await api.get("/tasks");
        setTasks(taskRes.data.data.slice(0, 3));

        const scheduleRes = await api.get("/schedules");
        const formattedSchedules = scheduleRes.data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3)
          .map((sched) => ({
            id: sched.id,
            subject: sched.subject,
            day: new Date(sched.date).toLocaleDateString("en-US", { weekday: "long" }),
            time: `${sched.startTime} - ${sched.endTime}`,
          }));
        setSchedules(formattedSchedules);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        navigate("/login");
      }
    };

    fetchUserAndData();
  }, [navigate]);

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle-completed?completed=${!currentStatus}`);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (err) {
      console.error("Error toggling task completion:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-yellow-600">Dashboard</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center gap-4">
              <img
                src={user.profilePic || "/avatar1.png"}
                alt="User Avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-300 shadow-lg hover:scale-105 transition object-cover"
              />

              <div>
                <h2 className="text-xl font-bold text-yellow-600">
                  Hi, {user.username || user.name} 👋
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Let’s achieve great things today!
                </p>
              </div>
            </section>

            <CalendarCard />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">📝 My Tasks</h2>
              </div>
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks yet.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="mb-4 flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.label}</p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id, task.completed)}
                      className="accent-yellow-500 w-5 h-5"
                    />
                  </div>
                ))
              )}
            </section>

            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">📅 Upcoming Classes</h2>
              </div>
              {schedules.length === 0 ? (
                <p className="text-sm text-gray-500">No schedules available.</p>
              ) : (
                schedules.map((schedule) => (
                  <div key={schedule.id} className="mb-3">
                    <div className="text-md font-medium">{schedule.subject}</div>
                    <div className="text-sm text-gray-600">
                      {schedule.day} — {schedule.time}
                    </div>
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
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthName = currentDate.toLocaleString("default", { month: "long" });
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
          {"<"}
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {monthName} {year}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="text-lg font-bold text-yellow-500 hover:text-yellow-600"
        >
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-7 text-center font-semibold text-sm mb-2 text-gray-600">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
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
                date ? "hover:bg-yellow-100" : ""
              } ${
                isToday
                  ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold text-white"
                  : "text-gray-700"
              }`}
            >
              {date || ""}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
