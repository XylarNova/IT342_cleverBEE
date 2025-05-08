import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Guest" });
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/user/me");
        setUser(response.data);
      } catch (error) {
        navigate("/login");
      }
    };

    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules");
        setSchedules(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching schedules", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };

    fetchUser();
    fetchSchedules();
    fetchTasks();
  }, [navigate]);

  const toggleComplete = async (taskId, isCompleted) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle-completed?completed=${!isCompleted}`);
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, completed: !isCompleted } : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle task completion", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-50 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-yellow-600">Dashboard</h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
          {/* LEFT */}
          <div className="space-y-8">
            <section className="bg-pink-200 rounded-3xl p-6 shadow-lg hover:shadow-xl flex items-center gap-4 transition">
              <img
                src={user.profilePic || "/avatar1.png"}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-yellow-300 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-yellow-800">
                  Hi, {user.username || user.name} 👋
                </h2>
                <p className="text-sm text-gray-700 mt-1">
                  Let’s achieve great things today!
                </p>
              </div>
            </section>

            <CalendarCard schedules={schedules} />
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <section className="bg-purple-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
              <h2 className="text-lg font-bold mb-4 text-purple-800">📋 My Tasks</h2>
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-700">No tasks yet.</p>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between py-2">
                    <div className={task.completed ? "line-through text-gray-400" : ""}>
                      <p className="font-medium text-sm">{task.label}</p>
                      <p className="text-xs text-gray-600">{task.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id, task.completed)}
                      className="form-checkbox w-5 h-5 text-purple-600"
                    />
                  </div>
                ))
              )}
            </section>

            <section className="bg-yellow-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
              <h2 className="text-lg font-bold mb-4 text-yellow-800">📅 Upcoming Schedules</h2>
              {schedules.length === 0 ? (
                <p className="text-sm text-gray-700">No schedules available.</p>
              ) : (
                schedules.map(schedule => (
                  <div key={schedule.id} className="mb-3">
                    <div className="text-md font-medium">{schedule.subject}</div>
                    <div className="text-sm text-gray-700">
                      {new Date(schedule.date).toLocaleDateString("en-US", { weekday: "long" })} —{" "}
                      {new Date(`1970-01-01T${schedule.startTime}Z`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })} -{" "}
                      {new Date(`1970-01-01T${schedule.endTime}Z`).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      })}
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

const CalendarCard = ({ schedules }) => {
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

  const getClassTypeColor = (type) => {
    switch (type) {
      case "EVENT": return "bg-pink-400";
      case "FACE_TO_FACE": return "bg-purple-400";
      case "HYBRID": return "bg-green-400";
      case "ONLINE": return "bg-blue-400";
      default: return "bg-gray-400";
    }
  };

  const scheduleMap = {};
  schedules.forEach(event => {
    const d = new Date(event.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!scheduleMap[day]) scheduleMap[day] = [];
      scheduleMap[day].push(event.classType);
    }
  });

  return (
    <section className="bg-teal-200 p-6 rounded-3xl shadow-lg hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-lg font-bold text-teal-700">
          {"<"}
        </button>
        <h2 className="text-xl font-bold text-teal-800">{monthName} {year}</h2>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-lg font-bold text-teal-700">
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-sm mb-2 text-gray-700">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 text-sm text-center gap-1">
        {dates.map((date, i) => {
          const isToday =
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div key={i} className="flex flex-col items-center justify-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-md ${isToday ? "bg-yellow-300 ring-2 ring-yellow-500 font-bold text-white" : "hover:bg-yellow-100 text-gray-800"}`}>
                {date || ""}
              </div>
              <div className="flex gap-0.5 mt-0.5">
                {(scheduleMap[date] || []).map((type, idx) => (
                  <span key={idx} className={`w-2 h-2 rounded-full ${getClassTypeColor(type)}`} title={type} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-700">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-400 rounded-full"></span> Class</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-400 rounded-full"></span> Event</div>
      </div>
    </section>
  );
};

export default Dashboard;
