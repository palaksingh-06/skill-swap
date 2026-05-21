import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";

const categoryInfo = {
  coding: {
    title: "Coding & Development",
    description: "Learn web & software development from real developers.",
    icon: "💻",
  },
  creative: {
    title: "Creative Arts",
    description: "Design, illustration, UI/UX and digital creativity.",
    icon: "🎨",
  },
  language: {
    title: "Language Exchange",
    description: "Practice languages with native speakers worldwide.",
    icon: "🌍",
  },
};

export default function SkillCategory() {
  const { category } = useParams();
  const { darkMode } = useContext(DarkModeContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const info = categoryInfo[category];

  useEffect(() => {
    fetchUsers();
  }, [category]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/users/by-skill?skill=${category}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/requests/send", {
        receiverId: id,
      });
      alert("Request sent successfully!");
    } catch (err) {
      alert("Failed to send request");
    }
  };

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Invalid category
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{info.icon}</span>
          <h1 className="text-3xl font-bold">{info.title}</h1>
        </div>

        <p className="text-slate-400 mb-10">{info.description}</p>

        {/* STATES */}
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && users.length === 0 && (
          <p className="text-slate-400">No users found for this skill yet.</p>
        )}

        {/* USERS GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className={`p-5 rounded-xl shadow ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {user.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-teal-500/10 text-teal-500 text-xs px-2 py-1 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={() => sendRequest(user._id)}
                className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
