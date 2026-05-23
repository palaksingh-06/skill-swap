
import { useEffect, useRef, useState, useContext } from "react";
import confetti from "canvas-confetti";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// ── Badge image imports ──────────────────────────────────
import expertImg          from "../assets/badges/expert.jpeg";
import starTeacherImg     from "../assets/badges/star_teacher.jpeg";
import activeLearnerImg   from "../assets/badges/active_learner.jpeg";
import firstStepsImg      from "../assets/badges/first_steps.jpeg";
import explorerImg        from "../assets/badges/explorer.jpeg";
import communityHelperImg from "../assets/badges/community_helper.jpeg";
import mentorImg          from "../assets/badges/mentor.jpeg";

const BADGE_IMAGES = {
  expert:             expertImg,
  star_teacher:       starTeacherImg,
  "star teacher":     starTeacherImg,
  active_learner:     activeLearnerImg,
  "active learner":   activeLearnerImg,
  first_steps:        firstStepsImg,
  "first steps":      firstStepsImg,
  explorer:           explorerImg,
  community_helper:   communityHelperImg,
  "community helper": communityHelperImg,
  mentor:             mentorImg,
};

function getBadgeImage(badge) {
  if (!badge) return null;
  const byId    = badge.id    && BADGE_IMAGES[String(badge.id).toLowerCase().replace(/ /g, "_")];
  const byTitle = badge.title && BADGE_IMAGES[badge.title.toLowerCase().replace(/_/g, " ")];
  return byId || byTitle || null;
}

function buildShareText(badge) {
  return `🏅 I just earned the "${badge.title}" badge on SkillSwap!\n${badge.description}\n\n#SkillSwap #Learning #Badges`;
}

const BadgeCelebration = () => {
  const { user }                = useContext(AuthContext);
  const [queue, setQueue]       = useState([]);
  const [current, setCurrent]   = useState(null);
  const [visible, setVisible]   = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const canvasRef  = useRef(null);
  const handlerRef = useRef(null);

  // Listen for badge events
  useEffect(() => {
    handlerRef.current = (e) => {
      const badge = e.detail;
      if (badge) setQueue((q) => [...q, badge]);
    };
    window.addEventListener("skillswap:badge-earned", handlerRef.current);
    return () => window.removeEventListener("skillswap:badge-earned", handlerRef.current);
  }, []);

  // On first load: check for unseen badges from previous sessions
  useEffect(() => {
    if (!user) return;
    const checkUnseen = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://skill-swap-zkfd.onrender.com/api/user/badges/unseen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unseen = res.data.badges || [];
        if (unseen.length > 0) setQueue((q) => [...q, ...unseen]);
      } catch (_) {}
    };
    checkUnseen();
  }, [user]);

  // Dequeue: show next badge when nothing is visible
  useEffect(() => {
    if (!visible && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrent(next);
      setVisible(true);
    }
  }, [queue, visible]);

  // Fire confetti when modal opens
  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#22c55e"],
    });

    const end = Date.now() + 3000;
    const frame = () => {
      myConfetti({ particleCount: 7, angle: 60,  spread: 55, origin: { x: 0 }, colors: ["#14b8a6", "#f59e0b"] });
      myConfetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#8b5cf6", "#ec4899"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    // Mark as seen
    (async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "https://skill-swap-zkfd.onrender.com/api/user/badges/mark-seen",
          { badgeId: current?.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (_) {}
    })();

    return () => myConfetti.reset();
  }, [visible]);

  const handleShare = async () => {
    const text = buildShareText(current);
    if (navigator.share) {
      try { await navigator.share({ title: "SkillSwap Badge", text }); return; } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareMsg("Copied to clipboard! 📋");
      setTimeout(() => setShareMsg(""), 2500);
    } catch (_) {
      setShareMsg("Could not copy — please copy manually.");
    }
  };

  const handleClose = () => {
    setVisible(false);
    setCurrent(null);
    setShareMsg("");
  };

  if (!visible || !current) return null;

  const badgeImage = getBadgeImage(current);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div
        className="relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-3xl max-w-sm w-full mx-4"
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(20,184,166,0.35)",
          boxShadow: "0 0 80px rgba(20,184,166,0.2), 0 30px 60px rgba(0,0,0,0.6)",
          animation: "badgePop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* Spotlight */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none opacity-60"
          style={{
            background:
              "conic-gradient(from 255deg at 50% 0%, transparent 12deg, rgba(20,184,166,0.15) 22deg, transparent 32deg, transparent 52deg, rgba(245,158,11,0.12) 62deg, transparent 72deg)",
            filter: "blur(3px)",
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-4 right-5 text-slate-500 hover:text-white text-xl transition"
        >
          ✕
        </button>

        <p className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase mb-5">SkillSwap</p>

        <p className="text-slate-400 text-sm mb-1">
          Dear <span className="text-white font-semibold">{user?.name || "Learner"}</span>
        </p>

        <h2 className="text-3xl font-extrabold text-amber-400 leading-snug">Congratulations</h2>
        <h3 className="text-xl font-bold text-amber-300 mb-6">{current.title} Badge!</h3>

        {/* Badge image */}
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center mb-5 select-none overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            border: "2px solid rgba(20,184,166,0.4)",
            boxShadow: "0 0 40px rgba(20,184,166,0.25)",
          }}
        >
          {badgeImage ? (
            <img
              src={badgeImage}
              alt={`${current.title} badge`}
              className="w-full h-full object-contain p-1"
              style={{ filter: "drop-shadow(0 0 6px rgba(20,184,166,0.4))" }}
            />
          ) : (
            <span className="text-5xl font-black text-teal-400">
              {current.title?.[0] ?? "🏅"}
            </span>
          )}
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-2 max-w-xs">{current.description}</p>

        {current.xpBonus > 0 && (
          <p className="text-yellow-400 font-bold text-sm mb-1">+{current.xpBonus} XP bonus awarded! ⚡</p>
        )}

        <p className="text-slate-600 text-xs uppercase tracking-widest mb-6 mt-2">Keep learning · Keep growing</p>

        <button
          onClick={handleShare}
          className="w-full py-3 rounded-xl font-bold text-white text-sm active:scale-95 hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(90deg, #14b8a6, #0ea5e9)", boxShadow: "0 4px 20px rgba(14,165,233,0.3)" }}
        >
          🚀 Share This Badge
        </button>

        {shareMsg && <p className="text-teal-400 text-xs mt-3">{shareMsg}</p>}

        <button onClick={handleClose} className="mt-4 text-slate-600 hover:text-slate-400 text-xs transition">
          Maybe later
        </button>
      </div>

      <style>{`
        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.65) translateY(40px); }
          70%  { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BadgeCelebration;