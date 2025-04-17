import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';

const Schedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [formData, setFormData] = useState({
    subject: "",
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
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("classSchedules");
    if (stored) {
      setClasses(JSON.parse(stored));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const cancelDelete = () => {
    setSelectedSchedule(null);
    setShowDetailsModal(false);
  };

  const getClassesForToday = () => {
    return classes.filter((cls) => {
      const classDate = new Date(cls.date);
      return classDate.getDate() === currentDate.getDate() &&
             classDate.getMonth() === currentDate.getMonth() &&
             classDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getClassAt = (day, hour) => {
    return classes.find((cls) => {
      const clsDate = new Date(cls.date);
      const clsDay = cls.recurring ? cls.recurringDay : clsDate.toLocaleDateString("en-US", { weekday: "long" });
      const clsHour = parseInt(cls.startTime.split(":")[0]);
      return clsDay === day && clsHour === hour;
    });
  };

  const handleSave = () => {
    const updatedClasses = [...classes];
    const index = updatedClasses.findIndex((cls) => cls === selectedSchedule);
    updatedClasses[index] = formData;
    setClasses(updatedClasses);
    localStorage.setItem("classSchedules", JSON.stringify(updatedClasses));
    setIsEditing(false);
    setShowDetailsModal(false);
  };

  const handleDelete = () => {
    if (selectedSchedule) {
      const updatedClasses = classes.filter((cls) => cls !== selectedSchedule);
      setClasses(updatedClasses);
      localStorage.setItem("classSchedules", JSON.stringify(updatedClasses));
      setShowDetailsModal(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({ ...selectedSchedule });
  };

  const handleAddSchedule = () => {
    const { subject, date, startTime, endTime, recurring } = formData;
    if (!subject || !date || !startTime || !endTime) {
      setError("Please fill in all required fields.");
      return;
    }

    const updatedClasses = [...classes, formData];
    setClasses(updatedClasses);
    localStorage.setItem("classSchedules", JSON.stringify(updatedClasses));
    setFormData({
      subject: "",
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
    setShowAddModal(false);
  };

  const hours = Array.from({ length: 11 }, (_, i) => 7 + i); // Time slots from 7 AM to 5 PM

  // Helper function to convert military time to 12-hour format
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const newHour = hour % 12 || 12; // Convert 0 hours to 12 for 12 AM
    return `${newHour}:${minutes} ${period}`;
  };

  // Function to handle schedule block click
  const handleScheduleClick = (match) => {
    if (match) {
      setSelectedSchedule(match);
      setShowDetailsModal(true); // Opens Schedule Details Modal
    }
  };

  // Sort the classes based on startTime
  const sortClassesByTime = (classes) => {
    return classes.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.startTime}:00Z`);
      const timeB = new Date(`1970-01-01T${b.startTime}:00Z`);
      return timeA - timeB;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gradient-to-br from-yellow-50 to-white flex flex-col p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
          <h1 className="text-4xl font-bold text-yellow-600">Calendar</h1>
            <p className="text-gray-600 mt-3 text-base">Your study plan for the week</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="add-button"
          >
            + Add Schedule
          </button>
        </div>

        {/* CALENDAR + SIDEBAR */}
        <div className="flex gap-6 flex-1 min-h-0">
          <div className="flex-1 overflow-x-hidden h-full">
            <div className="overflow-y-auto rounded-2xl shadow-2xl border border-yellow-300 bg-gradient-to-b from-white to-yellow-50 scrollbar-thin">
              <div className="w-full">
                {/* Day Headers */}
                <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-30 bg-yellow-100/90 backdrop-blur-md shadow-md">
                  <div className="text-center font-bold py-3 text-yellow-800 border-b border-yellow-300">Time</div>
                  {days.map((day) => (
                    <div key={day} className="text-center font-bold py-3 border-l border-b border-yellow-300 text-yellow-800">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-[80px_repeat(7,1fr)] w-full">
                  {hours.map((hour) => (
                    <React.Fragment key={hour}>
                      <div
                        id={`hour-${hour}`}
                        className="text-center bg-white text-sm font-semibold text-yellow-600 py-6 border-t border-yellow-300"
                      >
                        {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                      {days.map((day) => {
                        const match = getClassAt(day, hour);
                        const zebra = hour % 2 === 0 ? "bg-white" : "bg-yellow-50";
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className={`border-t border-l border-yellow-100 h-24 relative ${zebra} hover:bg-yellow-100 cursor-pointer`}
                            onClick={() => handleScheduleClick(match)} // Handle click to show details only for schedules
                          >
                            {match && (
                              <div
                                className="absolute top-1 left-1 right-1 bg-yellow-100 border-l-[6px] border-yellow-500 rounded-xl p-2 text-xs font-semibold text-yellow-900 shadow-md"
                              >
                                <p className="truncate">{match.subject}</p>
                                <p className="text-yellow-800 text-[11px] font-medium">
                                  {convertTo12HourFormat(match.startTime)} – {convertTo12HourFormat(match.endTime)}
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
            </div>
          </div>

          {/* Mini Calendar and Class List */}
          <div className="w-[300px] shrink-0 space-y-6">
            {/* Mini Calendar */}
            <div className="bg-white p-4 rounded-xl border border-yellow-200 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-yellow-800">
                  🗓 {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                {/* Navigation buttons for prev/next month */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    className="text-xl text-yellow-600"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    className="text-xl text-yellow-600"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-sm gap-y-2 text-gray-600">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="font-semibold">{d}</div>
                ))}

                {(() => {
                  const today = new Date();
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDayOfMonth = new Date(year, month, 1);
                  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday = 0
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const cells = [];

                  // Empty cells before the first day of the month
                  for (let i = 0; i < startWeekday; i++) {
                    cells.push(<div key={`empty-${i}`}></div>);
                  }

                  // Fill in the days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

                    cells.push(
                      <div
                        key={day}
                        className={`cursor-pointer p-1 rounded-full text-sm font-medium transition ${
                          isToday ? "bg-yellow-500 text-white shadow font-bold" : "hover:bg-yellow-100"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  }

                  return cells;
                })()}
              </div>
            </div>

            {/* Class List */}
            <div className="bg-white p-4 rounded-xl border border-yellow-200 shadow-md overflow-y-auto max-h-60">
              <h3 className="text-lg font-bold text-yellow-800 mb-4">📚 Class List</h3>
              {getClassesForToday().length === 0 ? (
                <p className="text-sm text-gray-500 italic">No classes today</p>
              ) : (
                // Sort the classes by start time before rendering
                sortClassesByTime(getClassesForToday()).map((cls, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg mb-3 shadow-md ${cls.subject === "Graphic Design" ? "bg-blue-100" : "bg-orange-100"} border-l-4 ${cls.subject === "Graphic Design" ? "border-blue-400" : "border-orange-400"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${cls.subject === "Graphic Design" ? "bg-blue-400" : "bg-orange-400"}`}
                      >
                        <span className="text-white text-sm">{cls.subject[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{cls.subject}</p>
                        <p className="text-sm text-gray-600">{convertTo12HourFormat(cls.startTime)} – {convertTo12HourFormat(cls.endTime)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ADD/EDIT SCHEDULE MODAL */}
      {(showAddModal || showDetailsModal) && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="text-xl font-bold text-yellow-700 mb-4">
              {showDetailsModal && !isEditing
                ? "📅 Schedule Details"
                : isEditing
                ? "✏️ Edit Schedule"
                : "➕ Add Schedule"}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 px-3 py-2 mb-4 rounded">
                {error}
              </div>
            )}

            {/* Schedule details or form */}
            {showDetailsModal && !isEditing ? (
              <div>
                <p><strong>Subject:</strong> {selectedSchedule.subject}</p>
                <p><strong>Date:</strong> {selectedSchedule.date}</p>
                <p><strong>Start Time:</strong> {convertTo12HourFormat(selectedSchedule.startTime)}</p>
                <p><strong>End Time:</strong> {convertTo12HourFormat(selectedSchedule.endTime)}</p>
                <p><strong>Recurring:</strong> {selectedSchedule.recurring ? "Yes, every " + selectedSchedule.recurringDay : "No"}</p>
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium">Subject</label>
                <input
                  type="text"
                  className="w-full mb-3 px-3 py-2 border border-black rounded"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />

                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 mb-3 border border-black rounded"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  className="w-full mb-3 px-3 py-2 border border-black rounded"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />

                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="time"
                  className="w-full mb-5 px-3 py-2 border border-black rounded"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </>
            )}

            {/* Buttons for editing and saving */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false) || setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Close
              </button>

              {showDetailsModal && !isEditing && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Save
                </button>
              )}

              {!showDetailsModal && !isEditing && (
                <button
                  onClick={handleAddSchedule}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, path, isActive, collapsed, navigate }) => (
  <div
    onClick={() => navigate(path)}
    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-300
    ${isActive(path) ? "bg-black/20 text-white" : "hover:bg-black/10"} 
    ${collapsed ? "justify-center text-3xl" : "text-base"}`}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
);

export default Schedule;
