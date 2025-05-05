// ScheduleModal.jsx
import React from "react";

const ScheduleModal = ({ formData, setFormData, onSave, onCancel, error }) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getDayOfWeek = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const selectedDay = getDayOfWeek(selectedDate);

    if (formData.recurring) {
      setFormData({ ...formData, date: selectedDate, recurringDay: selectedDay });
    } else {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleRecurringChange = (e) => {
    const checked = e.target.checked;
    const selectedDay = getDayOfWeek(formData.date);

    setFormData({
      ...formData,
      recurring: checked,
      recurringDay: checked ? selectedDay : "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-2xl border-4 border-yellow-300">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
          ➕ {formData.id ? "Edit Schedule" : "Add Schedule"}
        </h2>

        {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Subject *"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          <input
            type="date"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.date}
            onChange={handleDateChange}
          />
          <input
            type="time"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
          <input
            type="time"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            className="p-3 border border-gray-300 rounded-lg col-span-2"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.classType}
            onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
          >
            <option value="">Select Type *</option>
            <option value="ONLINE">💻 Online</option>
            <option value="FACE_TO_FACE">🏫 Face-to-Face</option>
            <option value="HYBRID">🔀 Hybrid</option>
            <option value="EVENT">🎉 Event</option>
          </select>
          <input
            type="text"
            placeholder="Professor"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.professor || ""}
            onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
          />
          <input
            type="text"
            placeholder="Room"
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.room || ""}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg"
            value={formData.recurringDay || ""}
            disabled={!formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurringDay: e.target.value })}
          >
            <option value="">Day of Repetition (Optional)</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm mb-6 text-gray-600">
          <input
            type="checkbox"
            checked={formData.recurring}
            onChange={handleRecurringChange}
          />
          Recurring Schedule (Repeats Weekly)
        </label>

        <div className="flex justify-end gap-4">
          <button
            onClick={onSave}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
