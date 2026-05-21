import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import ReviewModal from "../components/ReviewModal";
import { Calendar, Clock, Star, CheckCircle } from "lucide-react";

const CompletedSessions = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [reviewing, setReviewing] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const navigate = useNavigate();

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sessions/completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data.sessions || res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load completed sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchReviewStatuses = useCallback(async (sessionList) => {
    if (!sessionList || sessionList.length === 0) return;
    const token = localStorage.getItem("token");
    const reviewed = new Set();
    await Promise.all(
      sessionList.map(async (s) => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/reviews/session/${s._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.hasReviewed) reviewed.add(s._id);
        } catch (_) {}
      })
    );
    setReviewedIds(reviewed);
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  useEffect(() => {
    if (sessions.length > 0) fetchReviewStatuses(sessions);
  }, [sessions, fetchReviewStatuses]);

  const handleReviewSubmitted = () => {
    setReviewedIds((prev) => new Set([...prev, reviewing._id]));
    setReviewing(null);
  };

  const filtered = sessions.filter((s) => {
    if (filter === "taught") return s.isTaught === true || s.role === "teacher";
    if (filter === "learned") return s.isTaught === false || s.role === "learner";
    return true;
  });

  const taughtCount = sessions.filter((s) => s.isTaught === true || s.role === "teacher").length;
  const learnedCount = sessions.filter((s) => s.isTaught === false || s.role === "learner").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (mins) => {
    if (!mins) return null;
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? `${mins % 60}m` : ""}`;
  };

  const dm = darkMode;

  return (
    <div className={`min-h-screen ${dm ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* BIG HEADING */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-teal-500">Completed</span>{" "}
            <span className={dm ? "text-white" : "text-slate-900"}>Sessions</span>
          </h1>

          <p className={`mt-3 text-sm ${dm ? "text-slate-400" : "text-slate-500"}`}>
            All the skills you’ve taught and learned through SkillSwap
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-3 mb-10">
          {[
            { key: "all", label: `All (${sessions.length})` },
            { key: "taught", label: `Taught (${taughtCount})` },
            { key: "learned", label: `Learned (${learnedCount})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filter === f.key
                  ? "bg-teal-500 text-white shadow-md"
                  : dm
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-teal-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className={`rounded-2xl p-16 text-center ${dm ? "bg-slate-800" : "bg-white shadow-sm"}`}>
            <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
            <p className="text-sm text-slate-400">Your completed sessions will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((session, idx) => (
              <SessionCard
                key={session._id || idx}
                session={session}
                darkMode={dm}
                formatDate={formatDate}
                formatDuration={formatDuration}
                hasReviewed={reviewedIds.has(session._id)}
                onReview={() => setReviewing(session)}
              />
            ))}
          </div>
        )}
      </main>

      {reviewing && (
        <ReviewModal
          session={reviewing}
          onClose={() => setReviewing(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

/* CARD */
const SessionCard = ({ session, darkMode: dm, formatDate, formatDuration, hasReviewed, onReview }) => {
  const isTaught = session.isTaught === true || session.role === "teacher";
  const partnerName = session.partnerName || "Unknown";
  const skillName = session.skillName || "Skill Exchange";
  const duration = formatDuration(session.duration || session.durationMinutes);

  // ✅ REAL AVATAR RESTORED
  const avatarSrc = session.partnerAvatar
    ? session.partnerAvatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=0d9488&color=fff&size=64`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl p-6 transition-all ${
        dm ? "bg-slate-800 border border-slate-700" : "bg-white shadow-sm"
      }`}
    >
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
        isTaught ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-700"
      }`}>
        {isTaught ? "Taught" : "Learned"}
      </span>

      <h3 className="mt-4 text-lg font-bold leading-snug">{skillName}</h3>

      {/* PARTNER BOX */}
      <div className={`mt-5 rounded-xl p-4 flex items-center gap-3 ${
        dm ? "bg-slate-700" : "bg-slate-50"
      }`}>
        <img
          src={avatarSrc}
          alt={partnerName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div>
          <p className="text-xs text-slate-400">{isTaught ? "Student" : "Teacher"}</p>
          <p className="text-sm font-semibold">{partnerName}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-5 text-sm text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar size={15} />
          {formatDate(session.scheduledAt || session.date || session.createdAt)}
        </div>

        {duration && (
          <div className="flex items-center gap-1.5">
            <Clock size={15} />
            {duration}
          </div>
        )}
      </div>

      {hasReviewed ? (
        <div className="flex items-center gap-2 mt-5 text-teal-500 text-sm font-semibold">
          <CheckCircle size={16} />
          Review submitted
        </div>
      ) : (
        <button
          onClick={onReview}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold py-2.5 rounded-xl transition"
        >
          <Star size={15} />
          Leave a Review
        </button>
      )}
    </motion.div>
  );
};

export default CompletedSessions;