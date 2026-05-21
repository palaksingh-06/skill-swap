import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";

const Search = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [skillsData, setSkillsData]       = useState([]);
  const [search, setSearch]               = useState("");
  const [loading, setLoading]             = useState(true);
  const [hiddenMentors, setHiddenMentors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hiddenMentors")) || [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/skills/all")
      .then((res) => {
        setSkillsData(res.data.skills || []);
      })
      .catch((err) => console.error("Failed to load skills", err))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- GROUP SKILLS + PROFILE UNDER EACH MENTOR ---------------- */
  const mentors = useMemo(() => {
    const map = {};

    if (!Array.isArray(skillsData)) return [];

    skillsData.forEach((skill) => {
      if (!Array.isArray(skill.mentors)) return;

      skill.mentors.forEach((mentor) => {
        if (!map[mentor.id]) {
          map[mentor.id] = {
            id:       mentor.id,
            name:     mentor.name,
            avatar:   mentor.avatar
              ? mentor.avatar
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name || "U")}&background=0d9488&color=fff&size=128`,
            // ✅ Extract profile fields from mentor object (adjust keys to match your API)
            bio:      mentor.bio      || mentor.about       || null,
            location: mentor.location || mentor.city        || null,
            rating:   mentor.rating   || mentor.avgRating   || null,
            sessions: mentor.sessions || mentor.sessionCount|| null,
            skills:   new Set(),
          };
        }
        map[mentor.id].skills.add(skill.name);
      });
    });

    return Object.values(map)
      .map((m) => ({
        id:       m.id,
        name:     m.name,
        avatar:   m.avatar,
        bio:      m.bio,
        location: m.location,
        rating:   m.rating,
        sessions: m.sessions,
        skills:   Array.from(m.skills),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [skillsData]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredMentors = useMemo(() => {
    const visible = mentors.filter((m) => !hiddenMentors.includes(m.id));
    if (!search.trim()) return visible;
    const query = search.toLowerCase();
    return visible.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(query) ||
        mentor.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }, [search, mentors, hiddenMentors]);

  /* ---------------- HIDE MENTOR ---------------- */
  const handleRemove = (id) => {
    const updated = [...hiddenMentors, id];
    setHiddenMentors(updated);
    localStorage.setItem("hiddenMentors", JSON.stringify(updated));
  };

  /* ---------------- RESET HIDDEN ---------------- */
  const handleResetHidden = () => {
    setHiddenMentors([]);
    localStorage.removeItem("hiddenMentors");
  };

  if (loading) {
    return (
      <p className={`p-10 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
        Loading skills...
      </p>
    );
  }

  return (
    <div
      className={`min-h-screen px-10 py-12 transition-colors ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* HERO */}
      <div className="max-w-6xl mx-auto mb-14">
        <h1 className={`text-5xl font-extrabold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
          Find your next <span className="text-teal-500">Mentor</span>
        </h1>
        <p className={`mt-4 max-w-xl ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
          Connect with peers who are eager to share skills and learn together.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className={`max-w-6xl mx-auto mb-10 rounded-full px-6 py-4 shadow-sm ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
        <input
          type="text"
          placeholder="Search by skill or mentor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full bg-transparent outline-none text-lg ${
            darkMode ? "text-white placeholder-slate-400" : "text-gray-900 placeholder-gray-400"
          }`}
        />
      </div>

      {/* RESULTS COUNT + RESET */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
          {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} found
        </p>
        {hiddenMentors.length > 0 && (
          <button onClick={handleResetHidden} className="text-sm text-teal-500 hover:underline">
            Show {hiddenMentors.length} hidden mentor{hiddenMentors.length !== 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* MENTOR CARDS */}
      {filteredMentors.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className={darkMode ? "text-slate-400" : "text-gray-500"}>
            No mentors found for "{search}"
          </p>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            Try a different skill or clear your search
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800 border border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-1"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* HIDE BUTTON */}
              <button
                onClick={() => handleRemove(mentor.id)}
                className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-lg font-bold"
                title="Hide this mentor"
              >
                ×
              </button>

              {/* AVATAR + NAME + RATING */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 flex-shrink-0"
                />
                <div>
                  <h3 className={`text-xl font-semibold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {mentor.name}
                  </h3>
                  {/* ✅ Rating — only shown if API provides it */}
                  {mentor.rating != null && (
                    <p className="text-xs text-teal-500 font-medium mt-0.5">
                      ⭐ {mentor.rating} · Tutor
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ PROFILE SECTION — bio, location, sessions */}
              {(mentor.bio || mentor.location || mentor.sessions != null) && (
                <div className={`rounded-xl p-3 mb-4 text-sm space-y-1.5 ${
                  darkMode ? "bg-slate-700/50" : "bg-teal-50/60"
                }`}>
                  {mentor.location && (
                    <p className={darkMode ? "text-slate-300" : "text-gray-600"}>
                      <span className={`font-semibold text-xs uppercase tracking-wide mr-2 ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                        Location
                      </span>
                      📍 {mentor.location}
                    </p>
                  )}
                  {mentor.sessions != null && (
                    <p className={darkMode ? "text-slate-300" : "text-gray-600"}>
                      <span className={`font-semibold text-xs uppercase tracking-wide mr-2 ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                        Sessions
                      </span>
                      🎓 {mentor.sessions} completed
                    </p>
                  )}
                  {mentor.bio && (
                    <p className={`line-clamp-2 ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                      <span className={`font-semibold text-xs uppercase tracking-wide mr-2 ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                        About
                      </span>
                      {mentor.bio}
                    </p>
                  )}
                </div>
              )}

              {/* TEACHES LABEL */}
              <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                darkMode ? "text-slate-400" : "text-gray-400"
              }`}>
                Teaches:
              </p>

              {/* SKILL TAGS */}
              <div className="flex flex-wrap gap-2 mb-5">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 text-sm rounded-full ${
                      darkMode
                        ? "bg-teal-900/40 text-teal-300 border border-teal-700/40"
                        : "bg-teal-50 text-teal-700 border border-teal-100"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* VIEW PROFILE BUTTON */}
              <button
                onClick={() => navigate(`/profile/${mentor.id}`)}
                className="w-full py-2 rounded-xl border text-teal-600 border-teal-400 hover:bg-teal-50 transition font-medium"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;