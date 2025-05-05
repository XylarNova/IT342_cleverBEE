import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../../api/api";
import MiniCalendar from "./MiniCalendar";
import ScheduleModal from "./ScheduleModal";
 // ✅ imported your deployed backend connector

const Schedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewSchedule, setViewSchedule] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    recurringDay: "",
    recurring: false,
    classType: "",
    professor: "",
    room: "",
    isOnline: false,
  });
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const classList = data.filter(item => item.classType !== "EVENT");
        const eventList = data.filter(item => item.classType === "EVENT");
        setClasses(classList);
        setEvents(eventList);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };
    fetchSchedules();
  }, [navigate]);

  const handleClearClasses = async () => {
    if (!window.confirm("Are you sure you want to clear your Class List? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      for (const cls of classes) {
        await api.delete(`/schedules/${cls.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setClasses([]);
    } catch (err) {
      console.error("Error clearing classes:", err);
      alert("Failed to clear classes.");
    }
  };

  const handleClearEvents = async () => {
    if (!window.confirm("Are you sure you want to clear your Events? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      for (const evt of events) {
        await api.delete(`/schedules/${evt.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setEvents([]);
    } catch (err) {
      console.error("Error clearing events:", err);
      alert("Failed to clear events.");
    }
  };
  const handleAddOrEditSchedule = async () => {
    const token = localStorage.getItem("token");
    const { subject, description, room, professor, date, startTime, endTime, recurring, recurringDay, classType, isOnline } = formData;

    if (!subject || !date || !startTime || !endTime || !classType) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        subject,
        description,
        room,
        instructor: professor,
        date,
        startTime,
        endTime,
        recurring,
        recurringDay,
        classType,
        isOnline
      };

      let res;
      if (selectedSchedule) {
        res = await api.put(`/schedules/${selectedSchedule.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await api.post("/schedules", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const newSchedule = res.data;

      if (newSchedule.classType === "EVENT") {
        setEvents(prev =>
          selectedSchedule
            ? prev.map(evt => evt.id === newSchedule.id ? newSchedule : evt)
            : [...prev, newSchedule]
        );
      } else {
        setClasses(prev =>
          selectedSchedule
            ? prev.map(cls => cls.id === newSchedule.id ? newSchedule : cls)
            : [...prev, newSchedule]
        );
      }

      resetForm();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError("Error saving schedule. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      recurringDay: "",
      recurring: false,
      classType: "",
      professor: "",
      room: "",
      isOnline: false,
    });
    setSelectedSchedule(null);
    setShowAddModal(false);
    setError("");
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      subject: schedule.subject,
      description: schedule.description || "",
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      recurringDay: schedule.recurringDay || "",
      recurring: schedule.recurring,
      classType: schedule.classType,
      professor: schedule.professor || "",
      room: schedule.room || "",
      isOnline: schedule.isOnline,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id, type) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await api.delete(`/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "class") {
        setClasses(prev => prev.filter(cls => cls.id !== id));
      } else if (type === "event") {
        setEvents(prev => prev.filter(evt => evt.id !== id));
      }
    } catch (err) {
      console.error("Error deleting schedule:", err);
      alert("Error deleting schedule. Please try again.");
    }
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const newHour = hour % 12 || 12;
    return `${newHour}:${minutes} ${period}`;
  };

  const getDayColor = (day) => {
    switch (day) {
      case "Monday": return "#FF6B6B";
      case "Tuesday": return "#A29BFE";
      case "Wednesday": return "#FFD166";
      case "Thursday": return "#FDCBFF";
      case "Friday": return "#A8DADC";
      case "Saturday": return "#FFE0B2";
      case "Sunday": return "#B2B2FF";
      default: return "#E0E0E0";
    }
  };

  const getClassesForToday = () =>
    classes.filter(cls => {
      const today = currentDate.toLocaleDateString();
      const clsDate = new Date(cls.date).toLocaleDateString();
      return cls.recurring
        ? cls.recurringDay === currentDate.toLocaleDateString("en-US", { weekday: "long" })
        : clsDate === today;
    });

  const getEventsForToday = () =>
    events.filter(evt => {
      const today = currentDate.toLocaleDateString();
      const evtDate = new Date(evt.date).toLocaleDateString();
      return evtDate === today;
    });

  const getClassAt = (day, hour) => {
    return classes.find(cls => {
      const clsDate = new Date(cls.date);
      const clsDay = cls.recurring
        ? cls.recurringDay
        : clsDate.toLocaleDateString("en-US", { weekday: "long" });
      const clsHour = parseInt(cls.startTime.split(":")[0]);
      return clsDay === day && clsHour === hour;
    });
  };

  const formatClassType = (type) => {
    switch (type) {
      case "ONLINE": return "💻 Online";
      case "FACE_TO_FACE": return "🏫 Face-to-Face";
      case "HYBRID": return "🔀 Hybrid";
      case "EVENT": return "🎉 Event";
      default: return type;
    }
  };
  return (
    <div className="flex min-h-screen bg-yellow-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 bg-gradient-to-br from-yellow-50 to-white flex flex-col p-6 min-h-0 overflow-auto relative">     
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-600">📅 Calendar</h1>
            <p className="text-gray-600 mt-3 text-base">Your study plan for the week</p>
          </div>
          <div className="absolute right-[355px] top-[110px] z-30">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white text-xl font-bold px-4 py-2 rounded-full shadow-lg"
                title="Add Schedule"
              >
                +
              </button>
          </div>


        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-6 min-h-0">
          {/* Calendar Section */}
          <div className="flex-1 overflow-x-hidden h-[700px] rounded-2xl shadow-lg border border-yellow-300 bg-white flex flex-col">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-20 bg-yellow-100/90 backdrop-blur-md shadow-md">
              <div className="text-center font-bold py-3 border-b border-yellow-300">Time</div>
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center font-bold py-3 border-l border-b border-yellow-300"
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[80px_repeat(7,1fr)]">
              {hours.map((hour) => (
                <React.Fragment key={hour}>
                  {/* Hour Label */}
                  <div className="text-center bg-white py-6 text-sm font-bold text-yellow-600 border-t border-yellow-300">
                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </div>

                  {/* Calendar cells */}
                  {days.map((day) => {
                    const match = getClassAt(day, hour);
                    const isEvenRow = hour % 2 === 0;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`border-t border-l border-yellow-100 h-24 relative ${isEvenRow ? "bg-yellow-50" : "bg-white"} hover:bg-yellow-100 cursor-pointer`}
                      >
                        {match && (
                          <div
                            className="absolute left-1 right-1 border-l-[6px] rounded-xl p-2 text-xs font-semibold shadow-md text-black z-10"
                            style={{
                              top: "4px",
                              height: `${
                                ((parseInt(match.endTime.split(":")[0]) - parseInt(match.startTime.split(":")[0])) || 1) * 96
                              }px`,
                              backgroundColor: getDayColor(match.recurringDay || new Date(match.date).toLocaleDateString("en-US", { weekday: "long" })),
                              borderColor: "#555",
                            }}
                          >
                            <p className="truncate">{match.subject}</p>
                            <p className="text-[11px] font-medium">
                              {convertTo12HourFormat(match.startTime)} - {convertTo12HourFormat(match.endTime)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[320px] shrink-0 flex flex-col gap-6">
            <MiniCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} events={events} />

            {/* 📚 Class List */}
            <div className="bg-white rounded-xl border border-yellow-200 shadow-lg p-4 h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-yellow-800">📚 Class List</h3>
                <button
                  onClick={handleClearClasses}
                  className="text-xs text-red-600 underline hover:font-semibold"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {classes.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No classes added.</p>
                ) : (
                  classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-yellow-50 p-3 rounded-lg flex justify-between items-center border-l-4 border-yellow-400 shadow"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{cls.subject}</p>
                        <p className="text-xs text-gray-600">
                          {convertTo12HourFormat(cls.startTime)} - {convertTo12HourFormat(cls.endTime)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setViewSchedule(cls)} className="text-green-600 text-xs">📋</button>
                        <button onClick={() => handleEdit(cls)} className="text-blue-600 text-xs">✏️</button>
                        <button onClick={() => handleDelete(cls.id, "class")} className="text-red-600 text-xs">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 🎉 Event List */}
            <div className="bg-white rounded-xl border border-yellow-200 shadow-lg p-4 h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-yellow-800">🎉 Events</h3>
                <button
                  onClick={handleClearEvents}
                  className="text-xs text-red-600 underline hover:font-semibold"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {events.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No events added.</p>
                ) : (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-yellow-100 p-3 rounded-lg flex justify-between items-center border-l-4 border-yellow-600 shadow"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{evt.subject}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(evt.date).toLocaleDateString()} • {convertTo12HourFormat(evt.startTime)} - {convertTo12HourFormat(evt.endTime)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setViewSchedule(evt)} className="text-green-600 text-xs">📋</button>
                        <button onClick={() => handleEdit(evt)} className="text-blue-600 text-xs">✏️</button>
                        <button onClick={() => handleDelete(evt.id, "event")} className="text-red-600 text-xs">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modal to Add/Edit */}
      {showAddModal && (
        <ScheduleModal
          formData={formData}
          setFormData={setFormData}
          onSave={handleAddOrEditSchedule}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedSchedule(null);
          }}
          error={error}
        />
      )}

      {/* View Schedule Modal */}
      {viewSchedule && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">📄 Schedule Details</h2>

            <div className="flex flex-col gap-2 text-gray-700 text-sm">
              <p><b>Subject:</b> {viewSchedule.subject}</p>
              <p><b>Description:</b> {viewSchedule.description || "None"}</p>
              <p><b>Date:</b> {new Date(viewSchedule.date).toLocaleDateString()}</p>
              <p><b>Time:</b> {convertTo12HourFormat(viewSchedule.startTime)} - {convertTo12HourFormat(viewSchedule.endTime)}</p>
              <p><b>Professor:</b> {viewSchedule.professor || "None"}</p>
              <p><b>Room:</b> {viewSchedule.room || "None"}</p>
              <p><b>Class Type:</b> {formatClassType(viewSchedule.classType)}</p>
              <p><b>Recurring:</b> {viewSchedule.recurring ? "Yes" : "No"}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewSchedule(null)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
