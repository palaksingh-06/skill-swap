import { useState } from "react";
import axios from "axios";

const ScheduleModal = ({ session, closeModal, refreshSessions }) => {
  const [date, setDate] = useState(session.date || "");
  const [time, setTime] = useState(session.time || "");
  
  const [notes, setNotes] = useState(session.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
  if (!date || !time) {
    alert("Please select date and time");
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/sessions/${session._id}/schedule`,
      {
        date,
        time,
        notes
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    refreshSessions();
    closeModal();
  } catch (error) {
    console.error(error);
    alert("Failed to schedule session");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4">
          Schedule Session
        </h3>

        <div className="space-y-3">
          <input
            type="date"
            className="w-full border rounded-lg p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full border rounded-lg p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />


   

          <textarea
            placeholder="Notes (optional)"
            className="w-full border rounded-lg p-2"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSchedule}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
