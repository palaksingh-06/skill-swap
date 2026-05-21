



// import { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import ReviewModal from "../components/ReviewModal";

// const BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// function useTheme() {
//   useEffect(() => {
//     const saved = localStorage.getItem("theme") || "light";
//     document.documentElement.setAttribute("data-theme", saved);
//   }, []);
// }

// function Pill({ children }) {
//   return (
//     <span className="px-3 py-1 text-xs font-medium rounded-full bg-base-300/40 text-base-content border border-base-300/30 backdrop-blur-md">
//       {children}
//     </span>
//   );
// }

// function Card({ title, children }) {
//   return (
//     <div className="rounded-2xl p-6 flex flex-col gap-3 bg-base-100/70 backdrop-blur-xl border border-base-300/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
//       <h3 className="text-base-content/60 text-xs font-semibold uppercase tracking-widest">{title}</h3>
//       <div className="text-base-content/80 text-sm leading-relaxed">{children}</div>
//     </div>
//   );
// }

// function Skeleton() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200 font-sans">
//       <p className="text-base-content/60 animate-pulse text-lg">Generating your summary...</p>
//     </div>
//   );
// }

// function MoodBadge({ mood }) {
//   const config = { positive: "Positive", neutral: "Neutral", challenging: "Challenging", mixed: "Mixed" };
//   return <Pill>{config[mood?.toLowerCase()] || config.neutral}</Pill>;
// }

// // ─── Recording Card ───────────────────────────────────────
// function RecordingCard({ sessionId }) {
//   const [recording, setRecording]               = useState(null);
//   const [recordingLoading, setRecordingLoading] = useState(true);
//   const [copied, setCopied]                     = useState(false);

//   useEffect(() => {
//     if (!sessionId) { setRecordingLoading(false); return; }

//     const fetchRecording = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           console.warn("[RecordingCard] No auth token found in localStorage.");
//           setRecordingLoading(false);
//           return;
//         }

//         console.log("[RecordingCard] Fetching recording for sessionId:", sessionId);

//         const res = await axios.get(
//           `${BASE}/api/sessions/${sessionId}/recording`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setRecording(res.data);
//       } catch (e) {
//         const status = e.response?.status;
//         const msg    = e.response?.data?.message || e.message;

//         if (status === 403) {
//           console.warn("[RecordingCard] 403 Forbidden — token may be invalid/expired, or you don't own this session.", msg);
//         } else if (status === 404) {
//           console.warn("[RecordingCard] 404 — No recording found for this session.");
//         } else {
//           console.warn("[RecordingCard] Error fetching recording:", status, msg);
//         }
//       } finally {
//         setRecordingLoading(false);
//       }
//     };

//     fetchRecording();
//   }, [sessionId]);

//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(recording.recordingUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!sessionId) return null;

//   return (
//     <Card title="Session Recording">
//       {recordingLoading ? (
//         <div className="flex items-center gap-2 text-base-content/50">
//           <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//           <span className="text-sm">Checking for recording...</span>
//         </div>

//       ) : recording?.recordingUrl ? (
//         <div className="flex flex-col gap-3">
//           {/* Video player */}
//           <video
//             src={recording.recordingUrl}
//             controls
//             className="w-full rounded-xl border border-base-300/30"
//           />

//           {/* Metadata row */}
//           <div className="flex items-center justify-between flex-wrap gap-2">
//             <div className="flex gap-3 text-xs text-base-content/50">
//               {recording.duration && (
//                 <span>Duration: {Math.round(recording.duration / 60)} min</span>
//               )}
//               {recording.createdAt && (
//                 <span>Recorded: {new Date(recording.createdAt).toLocaleDateString()}</span>
//               )}
//             </div>

//             {/* Copy Link button */}
//             <button
//               onClick={handleCopyLink}
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
//                          bg-teal-500/15 text-teal-600 border border-teal-500/25
//                          hover:bg-teal-500/25 transition"
//             >
//               {copied ? (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   </svg>
//                   Copy Link
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//       ) : (
//         <div className="flex items-start gap-3 text-sm text-base-content/60">
//           <span className="text-lg shrink-0">🎬</span>
//           <div>
//             <p className="font-medium text-base-content/70">Recording is processing</p>
//             <p className="text-xs mt-0.5">
//               This usually takes 1–3 minutes after the session ends.
//               Refresh the page to check again.
//             </p>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }

// // ─── Main component ───────────────────────────────────────
// export default function SessionSummary() {
//   useTheme();

//   const { roomId, sessionId } = useParams();
//   const navigate  = useNavigate();
//   const location  = useLocation();

//   const [summary,      setSummary]      = useState(null);
//   const [loading,      setLoading]      = useState(true);
//   const [error,        setError]        = useState(null);
//   const [noTranscript, setNoTranscript] = useState(false);
//   const [reviewing,    setReviewing]    = useState(null);
//   const [hasReviewed,  setHasReviewed]  = useState(false);

//   const resolvedSessionId =
//     location.state?.sessionId || sessionId || roomId;

//   // ─── Fetch AI summary ─────────────────────────────────────
//   useEffect(() => {
//     const id = roomId || sessionId;
//     if (!id) { setError("Missing room ID."); setLoading(false); return; }

//     const token   = localStorage.getItem("token");
//     const headers = token ? { Authorization: `Bearer ${token}` } : {};
//     let attempts  = 0;
//     const MAX     = 3;

//     const fetchSummary = async () => {
//       attempts++;
//       try {
//         const res  = await axios.get(`${BASE}/api/video/summary/${id}`, { headers });
//         const data = res.data;
//         if (data.summary)      { setSummary(data.summary); setLoading(false); }
//         else if (data.message) { setNoTranscript(true);    setLoading(false); }
//         else if (attempts < MAX) setTimeout(fetchSummary, 8000);
//         else { setError("Summary could not be generated."); setLoading(false); }
//       } catch {
//         if (attempts < MAX) setTimeout(fetchSummary, 8000);
//         else { setError("Failed to load summary."); setLoading(false); }
//       }
//     };

//     fetchSummary();
//   }, [roomId, sessionId]);

//   // ─── Check if already reviewed ────────────────────────────
//   useEffect(() => {
//     if (!resolvedSessionId) return;
//     const token = localStorage.getItem("token");
//     axios
//       .get(`${BASE}/api/reviews/session/${resolvedSessionId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => { if (res.data.hasReviewed) setHasReviewed(true); })
//       .catch(() => {});
//   }, [resolvedSessionId]);

//   const handleReviewClick = () => {
//     setReviewing({
//       _id:           resolvedSessionId,
//       role:          location.state?.role         || "learner",
//       partnerName:   location.state?.partnerName  || "Your partner",
//       partnerAvatar: location.state?.partnerAvatar || null,
//       skillName:     location.state?.skillName    || summary?.title || "Skill Exchange",
//     });
//   };

//   const handleCopy = () => {
//     if (!summary) return;
//     navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
//   };

//   if (loading) return <Skeleton />;

//   return (
//     <div className="min-h-screen text-base-content font-sans bg-gradient-to-br from-base-200 via-base-300 to-base-200">
//       <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             {summary?.title || "Session Summary"}
//           </h1>
//         </div>

//         {/* Tags */}
//         <div className="flex flex-wrap gap-2">
//           {summary?.mood             && <MoodBadge mood={summary.mood} />}
//           {summary?.durationEstimate && <Pill>{summary.durationEstimate}</Pill>}
//           {summary                   && <Pill>AI Generated</Pill>}
//         </div>

//         {/* Alerts */}
//         {error        && <div className="alert alert-error text-sm">{error}</div>}
//         {noTranscript && <div className="alert alert-warning text-sm">No transcript recorded for this session.</div>}

//         {/* Recording card */}
//         <RecordingCard sessionId={resolvedSessionId} />

//         {/* AI Summary cards */}
//         {summary && (
//           <div className="flex flex-col gap-6">
//             {summary.overview && (
//               <Card title="Overview"><p>{summary.overview}</p></Card>
//             )}

//             {summary.keyTopics?.length > 0 && (
//               <Card title="Key Topics">
//                 <div className="flex flex-wrap gap-2">
//                   {summary.keyTopics.map((t, i) => <Pill key={i}>{t}</Pill>)}
//                 </div>
//               </Card>
//             )}

//             <div className="grid sm:grid-cols-2 gap-5">
//               {summary.actionItems?.length > 0 && (
//                 <Card title="Action Items">
//                   <ul className="space-y-2">
//                     {summary.actionItems.map((a, i) => <li key={i}>• {a}</li>)}
//                   </ul>
//                 </Card>
//               )}
//               {summary.highlights?.length > 0 && (
//                 <Card title="Highlights">
//                   <ul className="space-y-2">
//                     {summary.highlights.map((h, i) => <li key={i}>• {h}</li>)}
//                   </ul>
//                 </Card>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Action buttons */}
//         <div className="flex gap-3 flex-wrap pt-4">
//           {resolvedSessionId && (
//             hasReviewed ? (
//               <div className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-teal-500">
//                 ✓ Review submitted
//               </div>
//             ) : (
//               <button
//                 onClick={handleReviewClick}
//                 className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
//               >
//                 Leave Review
//               </button>
//             )
//           )}

//           <button
//             onClick={() => navigate("/sessions")}
//             className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
//           >
//             Back to Sessions
//           </button>

//           {summary && (
//             <button
//               onClick={handleCopy}
//               className="p-3 rounded-xl text-white bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
//               title="Copy Summary"
//             >
//               ⧉
//             </button>
//           )}
//         </div>

//         <p className="text-xs text-center text-base-content/50">Summary generated by AI</p>
//       </div>

//       {reviewing && (
//         <ReviewModal
//           session={reviewing}
//           onClose={() => setReviewing(null)}
//           onSubmitted={() => { setHasReviewed(true); setReviewing(null); }}
//         />
//       )}
//     </div>
//   );
// }


import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReviewModal from "../components/ReviewModal";

const BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

function useTheme() {
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);
}

function Pill({ children }) {
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-base-300/40 text-base-content border border-base-300/30 backdrop-blur-md">
      {children}
    </span>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-3 bg-base-100/70 backdrop-blur-xl border border-base-300/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-base-content/60 text-xs font-semibold uppercase tracking-widest">{title}</h3>
      <div className="text-base-content/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function MoodBadge({ mood }) {
  const config = { positive: "Positive", neutral: "Neutral", challenging: "Challenging", mixed: "Mixed" };
  return <Pill>{config[mood?.toLowerCase()] || config.neutral}</Pill>;
}

// ─── XP Popup ─────────────────────────────────────────────
// This component is self-contained. It auto-dismisses after 5s.
// It sits at z-[9999] so nothing can cover it.
function XPPopup({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes xpBackdropIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes xpCardIn {
          0%   { opacity: 0; transform: scale(0.4) translateY(40px); }
          60%  { opacity: 1; transform: scale(1.08) translateY(-6px); }
          80%  { transform: scale(0.97) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes xpShine {
          0%   { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(300%) rotate(25deg); }
        }
        @keyframes xpStarSpin {
          from { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.3); }
          to   { transform: rotate(360deg) scale(1); }
        }
        @keyframes xpNumberPop {
          0%   { transform: scale(0); opacity: 0; }
          50%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes xpParticle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .xp-backdrop { animation: xpBackdropIn 0.3s ease forwards; }
        .xp-card     { animation: xpCardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .xp-shine    { animation: xpShine 1.2s ease 0.4s forwards; }
        .xp-number   { animation: xpNumberPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
        .xp-particle { animation: xpParticle 1s ease-out var(--delay) forwards; }
      `}</style>

      <div
        className="xp-backdrop fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={onDone}
      >
        {/* Particles */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360;
          const dist  = 120 + Math.random() * 80;
          const tx    = `${Math.cos((angle * Math.PI) / 180) * dist}px`;
          const ty    = `${Math.sin((angle * Math.PI) / 180) * dist}px`;
          const colors = ["#14b8a6","#10b981","#f59e0b","#f97316","#a78bfa","#38bdf8"];
          return (
            <div
              key={i}
              className="xp-particle absolute w-3 h-3 rounded-full pointer-events-none"
              style={{
                background: colors[i % colors.length],
                "--tx": tx, "--ty": ty,
                "--delay": `${0.2 + i * 0.04}s`,
                top: "50%", left: "50%",
                marginTop: "-6px", marginLeft: "-6px",
              }}
            />
          );
        })}

        {/* Card */}
        <div
          className="xp-card relative flex flex-col items-center gap-4 px-14 py-10 rounded-3xl overflow-hidden pointer-events-none select-none"
          style={{
            background: "linear-gradient(135deg,#0d9488 0%,#059669 50%,#0f766e 100%)",
            boxShadow: "0 0 60px rgba(20,184,166,0.5), 0 25px 50px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            className="xp-shine absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.25) 50%,transparent 60%)",
              width: "60%",
            }}
          />

          <div style={{ animation: "xpStarSpin 1.5s ease-in-out 0.1s both" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"
              />
            </svg>
          </div>

          <div className="xp-number flex items-baseline gap-1">
            <span style={{ fontSize:"4rem", fontWeight:900, color:"#fff", letterSpacing:"-2px", lineHeight:1, textShadow:"0 2px 20px rgba(0,0,0,0.3)" }}>
              +5
            </span>
            <span style={{ fontSize:"2rem", fontWeight:800, color:"rgba(255,255,255,0.85)", letterSpacing:"2px" }}>
              XP
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span style={{ color:"rgba(255,255,255,0.95)", fontSize:"1.1rem", fontWeight:700 }}>
              Session Complete!
            </span>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem" }}>
              Tap anywhere to continue
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Recording Card ───────────────────────────────────────
function RecordingCard({ sessionId }) {
  const [recording,        setRecording]        = useState(null);
  const [recordingLoading, setRecordingLoading] = useState(true);
  const [copied,           setCopied]           = useState(false);

  useEffect(() => {
    if (!sessionId) { setRecordingLoading(false); return; }
    const fetchRecording = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setRecordingLoading(false); return; }
        const res = await axios.get(
          `${BASE}/api/sessions/${sessionId}/recording`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecording(res.data);
      } catch (e) {
        console.warn("[RecordingCard]", e.response?.status, e.response?.data?.message || e.message);
      } finally {
        setRecordingLoading(false);
      }
    };
    fetchRecording();
  }, [sessionId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recording.recordingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sessionId) return null;

  return (
    <Card title="Session Recording">
      {recordingLoading ? (
        <div className="flex items-center gap-2 text-base-content/50">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Checking for recording...</span>
        </div>
      ) : recording?.recordingUrl ? (
        <div className="flex flex-col gap-3">
          <video src={recording.recordingUrl} controls className="w-full rounded-xl border border-base-300/30" />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-3 text-xs text-base-content/50">
              {recording.duration  && <span>Duration: {Math.round(recording.duration / 60)} min</span>}
              {recording.createdAt && <span>Recorded: {new Date(recording.createdAt).toLocaleDateString()}</span>}
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/15 text-teal-600 border border-teal-500/25 hover:bg-teal-500/25 transition"
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 text-sm text-base-content/60">
          <span className="text-lg shrink-0">🎬</span>
          <div>
            <p className="font-medium text-base-content/70">Recording is processing</p>
            <p className="text-xs mt-0.5">Usually takes 1–3 minutes. Refresh to check again.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Summary skeleton ─────────────────────────────────────
function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl p-6 bg-base-100/50 border border-base-300/30 h-24" />
      ))}
      <p className="text-center text-xs text-base-content/40">Generating your AI summary…</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function SessionSummary() {
  useTheme();

  const { roomId, sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [summary,      setSummary]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [noTranscript, setNoTranscript] = useState(false);
  const [reviewing,    setReviewing]    = useState(null);
  const [hasReviewed,  setHasReviewed]  = useState(false);

  // ✅ KEY FIX: useState lazy initialiser runs SYNCHRONOUSLY on first render,
  // before any useEffect, before any async work — the popup is decided
  // instantly and is completely independent of summary loading time.
  const [showXPPopup, setShowXPPopup] = useState(() => {
    const fromNav     = location.state?.sessionCompleted === true;
    const fromStorage = sessionStorage.getItem("xp_pending") === "true";
    if (fromNav || fromStorage) {
      sessionStorage.removeItem("xp_pending"); // clear immediately so refresh doesn't re-show
      return true;
    }
    return false;
  });

  const resolvedSessionId = location.state?.sessionId || sessionId || roomId;

  // ─── Fetch AI summary ─────────────────────────────────
  useEffect(() => {
    const id = roomId || sessionId;
    if (!id) { setError("Missing room ID."); setLoading(false); return; }

    const token   = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let attempts  = 0;
    const MAX     = 3;
    let cancelled = false;

    const fetchSummary = async () => {
      if (cancelled) return;
      attempts++;
      try {
        const res  = await axios.get(`${BASE}/api/video/summary/${id}`, { headers });
        if (cancelled) return;
        const data = res.data;
        if (data.summary)      { setSummary(data.summary); setLoading(false); }
        else if (data.message) { setNoTranscript(true);    setLoading(false); }
        else if (attempts < MAX) setTimeout(fetchSummary, 8000);
        else { setError("Summary could not be generated."); setLoading(false); }
      } catch {
        if (cancelled) return;
        if (attempts < MAX) setTimeout(fetchSummary, 8000);
        else { setError("Failed to load summary."); setLoading(false); }
      }
    };

    fetchSummary();
    return () => { cancelled = true; };
  }, [roomId, sessionId]);

  // ─── Check if already reviewed ────────────────────────
  useEffect(() => {
    if (!resolvedSessionId) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE}/api/reviews/session/${resolvedSessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => { if (res.data.hasReviewed) setHasReviewed(true); })
      .catch(() => {});
  }, [resolvedSessionId]);

  const handleReviewClick = () => {
    setReviewing({
      _id:           resolvedSessionId,
      role:          location.state?.role          || "learner",
      partnerName:   location.state?.partnerName   || "Your partner",
      partnerAvatar: location.state?.partnerAvatar || null,
      skillName:     location.state?.skillName     || summary?.title || "Skill Exchange",
    });
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
  };

  return (
    // ✅ Page always renders immediately — no full-page blocking skeleton
    <div className="min-h-screen text-base-content font-sans bg-gradient-to-br from-base-200 via-base-300 to-base-200">

      {/* ✅ XP Popup — rendered unconditionally at top of tree, z-[9999] */}
      {showXPPopup && <XPPopup onDone={() => setShowXPPopup(false)} />}

      <div className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">

        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {summary?.title || "Session Summary"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {summary?.mood             && <MoodBadge mood={summary.mood} />}
          {summary?.durationEstimate && <Pill>{summary.durationEstimate}</Pill>}
          {summary                   && <Pill>AI Generated</Pill>}
        </div>

        {error        && <div className="alert alert-error text-sm">{error}</div>}
        {noTranscript && <div className="alert alert-warning text-sm">No transcript recorded for this session.</div>}

        <RecordingCard sessionId={resolvedSessionId} />

        {/* Summary area — skeleton while loading, content when ready */}
        {loading ? (
          <SummarySkeleton />
        ) : summary ? (
          <div className="flex flex-col gap-6">
            {summary.overview && (
              <Card title="Overview"><p>{summary.overview}</p></Card>
            )}
            {summary.keyTopics?.length > 0 && (
              <Card title="Key Topics">
                <div className="flex flex-wrap gap-2">
                  {summary.keyTopics.map((t, i) => <Pill key={i}>{t}</Pill>)}
                </div>
              </Card>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              {summary.actionItems?.length > 0 && (
                <Card title="Action Items">
                  <ul className="space-y-2">
                    {summary.actionItems.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </Card>
              )}
              {summary.highlights?.length > 0 && (
                <Card title="Highlights">
                  <ul className="space-y-2">
                    {summary.highlights.map((h, i) => <li key={i}>• {h}</li>)}
                  </ul>
                </Card>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex gap-3 flex-wrap pt-4">
          {resolvedSessionId && (
            hasReviewed ? (
              <div className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-teal-500">
                ✓ Review submitted
              </div>
            ) : (
              <button
                onClick={handleReviewClick}
                className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Leave Review
              </button>
            )
          )}

          <button
            onClick={() => navigate("/sessions")}
            className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Back to Sessions
          </button>

          {summary && (
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl text-white bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
              title="Copy Summary"
            >
              ⧉
            </button>
          )}
        </div>

        <p className="text-xs text-center text-base-content/50">Summary generated by AI</p>
      </div>

      {reviewing && (
        <ReviewModal
          session={reviewing}
          onClose={() => setReviewing(null)}
          onSubmitted={() => { setHasReviewed(true); setReviewing(null); }}
        />
      )}
    </div>
  );
}