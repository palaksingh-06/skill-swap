import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ScheduleSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Zoom");
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) {
      alert("Date and Time are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/sessions/${id}/schedule`,
        { date, time, mode, meetingLink, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/sessions"); // back to My Sessions
    } catch (err) {
      alert("Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Schedule Session</h2>

        <div className="space-y-4">
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

          <select
            className="w-full border rounded-lg p-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>Zoom</option>
            <option>Google Meet</option>
            <option>Custom</option>
          </select>

          <input
            type="text"
            placeholder="Meeting Link"
            className="w-full border rounded-lg p-2"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />

          <textarea
            placeholder="Notes (optional)"
            className="w-full border rounded-lg p-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate("/sessions")}
            className="px-4 py-2 rounded-lg bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
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

export default ScheduleSession;