import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { AuthContext } from "../context/AuthContext";
import ScheduleModal from "../components/ScheduleModal";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
// ✅ Expired = 1 hour AFTER session start time
const isExpired = (date, time) => {
  if (!date || !time) return false;
  const sessionDateTime = new Date(`${date}T${time}`);
  const expiryTime = new Date(sessionDateTime.getTime() + 60 * 60 * 1000);
  return new Date() > expiryTime;
};

// ✅ Session has started = current time >= scheduled time
const hasStarted = (date, time) => {
  if (!date || !time) return false;
  const sessionDateTime = new Date(`${date}T${time}`);
  return new Date() >= sessionDateTime;
};

const Sessions = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const showOnlyActive = location.hash === "#active";
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/sessions/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const deleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete session", err);
      alert("Failed to delete session");
    }
  };

  const handleJoinCall = (session) => {
    if (session.videoCallLink) {
      const parts = session.videoCallLink.split("/video-call/");
      const roomId = parts[1];
      navigate(`/video-call/${roomId}`);
    } else {
      alert("No video call link available. Please reschedule the session.");
    }
  };

  const getDisplayStatus = (session) => {
    if (
      isExpired(session.date, session.time) &&
      (session.status === "upcoming" || session.status === "scheduled")
    ) {
      return "completed";
    }
    return session.status;
  };

  const canJoin = (session) => {
    const status = getDisplayStatus(session);
    if (!session.videoCallLink || !session.date || !session.time) return false;
    return (
      (status === "upcoming" || status === "scheduled") &&
      hasStarted(session.date, session.time) &&
      !isExpired(session.date, session.time)
    );
  };

  const filteredSessions = showOnlyActive
  ? sessions.filter((s) => ["upcoming", "scheduled"].includes(getDisplayStatus(s)))
  : sessions;

  const dm = darkMode;
  const bg     = dm ? "#0e1118" : "#f0f4f8";
  const card   = dm ? "#161c28" : "#ffffff";
  const card2  = dm ? "#1a2235" : "#f8fafb";
  const border = dm ? "#222a3a" : "#e2e8f0";
  const text1  = dm ? "#e6ecf5" : "#0f172a";
  const text2  = dm ? "#7a8aa0" : "#64748b";
  const accent = "#0d9488";

  const statusConfig = {
    pending:   { label: "Pending",   dot: "#f59e0b", bg: dm ? "rgba(245,158,11,0.12)"  : "rgba(245,158,11,0.08)",  text: "#d97706" },
    upcoming:  { label: "Upcoming",  dot: "#3b82f6", bg: dm ? "rgba(59,130,246,0.12)"  : "rgba(59,130,246,0.08)",  text: "#2563eb" },
    scheduled: { label: "Scheduled", dot: "#3b82f6", bg: dm ? "rgba(59,130,246,0.12)"  : "rgba(59,130,246,0.08)",  text: "#2563eb" },
    completed: { label: "Completed", dot: "#10b981", bg: dm ? "rgba(16,185,129,0.12)"  : "rgba(16,185,129,0.08)",  text: "#059669" },
    cancelled: { label: "Cancelled", dot: "#ef4444", bg: dm ? "rgba(239,68,68,0.12)"   : "rgba(239,68,68,0.08)",   text: "#dc2626" },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not scheduled";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Not scheduled";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  // summary counts
  const totalSessions    = sessions.length;
  const completedCount   = sessions.filter(s => getDisplayStatus(s) === "completed").length;
  const upcomingCount    = sessions.filter(s => ["upcoming","scheduled"].includes(getDisplayStatus(s))).length;
  const pendingCount     = sessions.filter(s => getDisplayStatus(s) === "pending").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sessions-page {
          min-height: 100vh;
          background: ${bg};
          font-family: 'DM Sans', system-ui, sans-serif;
          color: ${text1};
          padding: 48px 52px 80px;
        }

        /* ── Header ── */
        .sess-header { margin-bottom: 36px; }
        .sess-title {
          font-size: 48px; font-weight: 900; letter-spacing: -1.8px;
          line-height: 1.05; margin-bottom: 8px; color: ${text1};
        }
        .sess-title span { color: ${accent}; }
        .sess-subtitle { font-size: 18px; color: ${text2}; font-weight: 500; }

        /* ── Stats row ── */
        .sess-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 32px;
        }
        .sess-stat {
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 18px; padding: 24px 22px;
          display: flex; flex-direction: column; gap: 6px;
          box-shadow: 0 1px 4px rgba(15,23,42,0.05);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .sess-stat:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(13,148,136,0.10); }
        .sess-stat-lbl { font-size: 12px; font-weight: 800; color: ${text2}; text-transform: uppercase; letter-spacing: 1.4px; }
        .sess-stat-val { font-size: 44px; font-weight: 900; color: ${accent}; letter-spacing: -2px; line-height: 1; }
        .sess-stat-sub { font-size: 14px; color: ${text2}; font-weight: 500; }

        /* ── Session card ── */
        .sess-card {
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 1px 6px rgba(15,23,42,0.05);
          transition: transform 0.18s, box-shadow 0.18s;
          margin-bottom: 16px;
        }
        .sess-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(13,148,136,0.10); }

        /* left accent bar */
        .sess-card-inner {
          display: flex;
        }
        .sess-card-bar {
          width: 5px; flex-shrink: 0;
          background: ${accent};
          border-radius: 0;
        }
        .sess-card-bar.completed { background: #10b981; }
        .sess-card-bar.pending   { background: #f59e0b; }
        .sess-card-bar.cancelled { background: #ef4444; }

        .sess-card-body { flex: 1; padding: 28px 32px; }

        /* top row */
        .sess-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; margin-bottom: 22px;
          gap: 16px;
        }
        .sess-skill {
          font-size: 22px; font-weight: 900; color: ${text1};
          letter-spacing: -0.4px; margin-bottom: 5px; text-transform: capitalize;
        }
        .sess-partner { font-size: 14px; color: ${text2}; font-weight: 500; }
        .sess-partner-name { color: ${accent}; font-weight: 700; }

        /* status badge */
        .sess-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 50px;
          font-size: 13px; font-weight: 800;
          white-space: nowrap; flex-shrink: 0;
        }
        .sess-badge-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* meta row */
        .sess-meta {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 18px;
        }
        .sess-meta-item {
          background: ${card2}; border: 1px solid ${border};
          border-radius: 12px; padding: 14px 18px;
          display: flex; align-items: center; gap: 12px;
        }
        .sess-meta-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(13,148,136,0.10);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 16px;
        }
        .sess-meta-lbl { font-size: 11px; font-weight: 700; color: ${text2}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
        .sess-meta-val { font-size: 15px; font-weight: 700; color: ${text1}; }

        /* notes */
        .sess-notes {
          background: ${card2}; border: 1px solid ${border};
          border-radius: 12px; padding: 14px 18px; margin-bottom: 18px;
          font-size: 14px; color: ${text2}; line-height: 1.6;
        }
        .sess-notes strong { color: ${text1}; font-weight: 700; }

        /* hint */
        .sess-hint {
          font-size: 13px; color: #3b82f6; font-weight: 500;
          margin-bottom: 18px; display: flex; align-items: center; gap: 6px;
        }
        .sess-hint.expired { color: ${text2}; }

        /* divider */
        .sess-divider { height: 1px; background: ${border}; margin-bottom: 20px; }

        /* action buttons */
        .sess-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }

        .sess-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          border: none; cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: transform 0.14s, opacity 0.14s;
        }
        .sess-btn:hover { transform: translateY(-1px); opacity: 0.9; }
        .sess-btn:active { transform: translateY(0); }

        .sess-btn-schedule  { background: rgba(59,130,246,0.12);  color: #2563eb;  border: 1.5px solid rgba(59,130,246,0.25); }
        .sess-btn-reschedule{ background: rgba(245,158,11,0.12); color: #b45309;  border: 1.5px solid rgba(245,158,11,0.25); }
        .sess-btn-join      {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: #fff; border: none;
          box-shadow: 0 4px 14px rgba(13,148,136,0.35);
          animation: join-pulse 2s ease-in-out infinite;
        }
        .sess-btn-delete    { background: rgba(239,68,68,0.10); color: #dc2626; border: 1.5px solid rgba(239,68,68,0.20); }

        @keyframes join-pulse {
          0%,100% { box-shadow: 0 4px 14px rgba(13,148,136,0.35); }
          50%      { box-shadow: 0 4px 24px rgba(13,148,136,0.55); }
        }

        /* empty state */
        .sess-empty {
          text-align: center; padding: 80px 40px;
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 20px;
        }
        .sess-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(13,148,136,0.10);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin: 0 auto 20px;
        }
        .sess-empty-title { font-size: 22px; font-weight: 800; color: ${text1}; margin-bottom: 8px; }
        .sess-empty-sub   { font-size: 15px; color: ${text2}; font-weight: 500; }

        /* loading skeleton */
        .sess-skeleton {
          background: ${card}; border: 1.5px solid ${border};
          border-radius: 20px; padding: 28px 32px; margin-bottom: 16px;
        }
        .skel-line {
          border-radius: 8px; background: ${border};
          animation: shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,100% { opacity: 0.5; } 50% { opacity: 1; }
        }

        @media (max-width: 900px) {
          .sessions-page { padding: 36px 32px 60px; }
          .sess-stats { grid-template-columns: repeat(2, 1fr); }
          .sess-title { font-size: 36px; }
        }
        @media (max-width: 600px) {
          .sessions-page { padding: 24px 18px 60px; }
          .sess-stats { grid-template-columns: repeat(2, 1fr); }
          .sess-meta  { grid-template-columns: 1fr; }
          .sess-title { font-size: 28px; }
          .sess-stat-val { font-size: 34px; }
        }
      `}</style>

      <div className="sessions-page">

        {/* ── Header ── */}
        <div className="sess-header">
          <h1 className="sess-title">My <span>Sessions</span></h1>
          <p className="sess-subtitle">Track your upcoming and completed learning sessions</p>
        </div>

        {/* ── Stats ── */}
        {!loading && sessions.length > 0 && !showOnlyActive && (
  <div className="sess-stats">
            {[
              { label: "Total",     value: totalSessions,  sub: "all sessions"       },
              { label: "Upcoming",  value: upcomingCount,  sub: "scheduled soon"     },
              { label: "Completed", value: completedCount, sub: "sessions done"      },
              { label: "Pending",   value: pendingCount,   sub: "awaiting schedule"  },
            ].map((s, i) => (
              <div key={i} className="sess-stat">
                <p className="sess-stat-lbl">{s.label}</p>
                <p className="sess-stat-val">{s.value}</p>
                <p className="sess-stat-sub">{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <>
            {[1, 2].map(i => (
              <div key={i} className="sess-skeleton">
                <div className="skel-line" style={{ height: 22, width: "40%", marginBottom: 12 }} />
                <div className="skel-line" style={{ height: 14, width: "25%", marginBottom: 24 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="skel-line" style={{ height: 60, borderRadius: 12 }} />
                  <div className="skel-line" style={{ height: 60, borderRadius: 12 }} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Empty state ── */}
        {!loading && sessions.length === 0 && (
          <div className="sess-empty">
            <div className="sess-empty-icon">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3 9h18" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 2v3M16 2v3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 13h4M8 16h2" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
</div>
            <p className="sess-empty-title">No sessions yet</p>
            <p className="sess-empty-sub">Accept a skill request to create your first session</p>
          </div>
        )}
        {!loading && filteredSessions.length === 0 && (
  <div className="sess-empty">
    <div className="sess-empty-icon">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3 9h18" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 2v3M16 2v3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 13h4M8 16h2" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
</div>
    <p className="sess-empty-title">
      {showOnlyActive ? "No active sessions" : "No sessions yet"}
    </p>
    <p className="sess-empty-sub">
      {showOnlyActive
        ? "You have no upcoming or scheduled sessions right now"
        : "Accept a skill request to create your first session"}
    </p>
  </div>
)}

        {/* ── Session cards ── */}
        {!loading && filteredSessions.map((session) => {
          const partner = session.userA?._id === user?._id ? session.userB : session.userA;
          const displayStatus  = getDisplayStatus(session);
          const sessionCanJoin = canJoin(session);
          const hasSchedule    = session.date && session.time;
          const started        = hasSchedule && hasStarted(session.date, session.time);
          const fullyExpired   = hasSchedule && isExpired(session.date, session.time);
          const cfg = statusConfig[displayStatus] || statusConfig["pending"];
          const barClass = ["completed","pending","cancelled"].includes(displayStatus) ? displayStatus : "";

          return (
            <div key={session._id} className="sess-card">
              <div className="sess-card-inner">
                <div className={`sess-card-bar ${barClass}`} />
                <div className="sess-card-body">

                  {/* Top row */}
                  <div className="sess-top">
                    <div>
                      <p className="sess-skill">{session.skill}</p>
                      <p className="sess-partner">
                        With <span className="sess-partner-name">{partner?.name || "Unknown"}</span>
                      </p>
                    </div>
                    <div className="sess-badge" style={{ background: cfg.bg, color: cfg.text }}>
                      <div className="sess-badge-dot" style={{ background: cfg.dot }} />
                      {cfg.label}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="sess-meta">
                    <div className="sess-meta-item">
                      <div className="sess-meta-icon">
  <CalendarDays size={18} color={accent} />
</div>
                      <div>
                        <p className="sess-meta-lbl">Date</p>
                        <p className="sess-meta-val">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    <div className="sess-meta-item">
                      <div className="sess-meta-icon">
  <Clock size={18} color={accent} />
</div>
                      <div>
                        <p className="sess-meta-lbl">Time</p>
                        <p className="sess-meta-val">{formatTime(session.time)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {session.notes && (
                    <div className="sess-notes">
                      <strong>Notes — </strong>{session.notes}
                    </div>
                  )}

                  {/* Status hints */}
                  {hasSchedule && !started && displayStatus !== "completed" && (
                    <p className="sess-hint">
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block" }} /> Video call will be available at scheduled time
                    </p>
                  )}
                  {fullyExpired && displayStatus === "completed" && (
                    <p className="sess-hint expired">
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block" }} /> Session time has passed
                    </p>
                  )}

                  <div className="sess-divider" />

                  {/* Actions */}
                  <div className="sess-actions">
                    {!hasSchedule && displayStatus === "pending" && (
                      <button className="sess-btn sess-btn-schedule" onClick={() => setSelectedSession(session)}>
                        Schedule
                      </button>
                    )}
                    {hasSchedule && !started && displayStatus !== "completed" && (
                      <button className="sess-btn sess-btn-reschedule" onClick={() => setSelectedSession(session)}>
                        Reschedule
                      </button>
                    )}
                    {sessionCanJoin && (
                      <button className="sess-btn sess-btn-join" onClick={() => handleJoinCall(session)}>
                        Join Video Call
                      </button>
                    )}
                    <button className="sess-btn sess-btn-delete" onClick={() => deleteSession(session._id)}>
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedSession && (
        <ScheduleModal
          session={selectedSession}
          closeModal={() => setSelectedSession(null)}
          refreshSessions={fetchSessions}
        />
      )}
    </>
  );
};

export default Sessions;