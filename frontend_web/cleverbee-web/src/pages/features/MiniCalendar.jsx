// MiniCalendar.jsx
import React from "react";

const MiniCalendar = ({ currentDate, setCurrentDate, events }) => {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const hasEventOnDay = (day) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const changeMonth = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`}></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(
      <div
        key={day}
        className={`relative p-1 text-center text-sm font-semibold rounded-full cursor-pointer ${
          isToday(day) ? "bg-yellow-500 text-white" : "hover:bg-yellow-100"
        }`}
      >
        {hasEventOnDay(day) && (
          <div className="absolute inset-0 bg-[#FF7F7F] rounded-full opacity-30"></div>
        )}
        <span className="relative z-10">{day}</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-yellow-200 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-yellow-800">
          🗓 {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="text-yellow-600 text-xl">
            {"<"}
          </button>
          <button onClick={() => changeMonth(1)} className="text-yellow-600 text-xl">
            {">"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center gap-1 text-gray-600">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="font-bold">{d}</div>
        ))}
        {cells}
      </div>
    </div>
  );
};

export default MiniCalendar;
