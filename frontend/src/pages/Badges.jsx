



import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import imgFirstSteps      from "../assets/badges/first_steps.jpeg";
import imgExplorer        from "../assets/badges/explorer.jpeg";
import imgActiveLearner   from "../assets/badges/active_learner.jpeg";
import imgStarTeacher     from "../assets/badges/star_teacher.jpeg";
import imgMentor          from "../assets/badges/mentor.jpeg";
import imgExpert          from "../assets/badges/expert.jpeg";
import imgCommunityHelper from "../assets/badges/community_helper.jpeg";

// ── SVG Icons ─────────────────────────────────────────────
const IconZap = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconStar = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUser = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconTarget = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6"  stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2"  stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconSparkle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconGraduate = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconShare = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="6"  cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconCheck = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLock = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconTrophy = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 5h12v7a6 6 0 0 1-12 0V5z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 18v3M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconCopy = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconMedal = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="14" r="7" stroke="currentColor" strokeWidth="2"/>
    <path d="M8.5 3.5l1.5 4h4l1.5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11v6M9.5 13.5l2.5-2.5 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLevel = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 20h4v-6H2v6zM9 20h4V8H9v12zM16 20h4V4h-4v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Level config — all teal/emerald palette ───────────────
const LEVELS = [
  { min: 0,   max: 49,   level: 1, title: "Beginner", color: "from-teal-300 to-teal-400"       },
  { min: 50,  max: 149,  level: 2, title: "Explorer", color: "from-teal-400 to-teal-500"       },
  { min: 150, max: 299,  level: 3, title: "Learner",  color: "from-teal-500 to-emerald-500"    },
  { min: 300, max: 499,  level: 4, title: "Mentor",   color: "from-emerald-500 to-emerald-600" },
  { min: 500, max: 9999, level: 5, title: "Expert",   color: "from-emerald-600 to-teal-700"    },
];

const ALL_BADGES = [
  { id: "first_session",    title: "First Steps",      description: "Completed your very first skill exchange session", image: imgFirstSteps,      xpBonus: 25 },
  { id: "explorer",         title: "Explorer",         description: "Reached 100 XP on SkillSwap",                      image: imgExplorer,         xpBonus: 0  },
  { id: "five_sessions",    title: "Active Learner",   description: "Completed 10 skill exchange sessions",              image: imgActiveLearner,    xpBonus: 50 },
  { id: "star_teacher",     title: "Star Teacher",     description: "Received a 5-star review from 5 different learners",         image: imgStarTeacher,      xpBonus: 15 },
  { id: "mentor",           title: "Mentor",           description: "Reached 500 XP — a true skill mentor",            image: imgMentor,           xpBonus: 0  },
  { id: "expert",           title: "Expert",           description: "Reached 700 XP — SkillSwap Expert",               image: imgExpert,           xpBonus: 0  },
  { id: "community_helper", title: "Community Helper", description: "Received 20 or more reviews from the community",  image: imgCommunityHelper,  xpBonus: 30 },
];

// ── Updated XP values to match xpUtils.js ─────────────────
const XP_ACTIONS = [
  { action: "Complete a session",      xp: "+5 XP",  note: "Both users",    Icon: IconGraduate },
  { action: "Leave a review",          xp: "+3 XP",  note: "Per review",    Icon: IconStar     },
  { action: "Receive a 5-star review", xp: "+5 XP",  note: "Bonus",         Icon: IconStar     },
  { action: "Complete your profile",   xp: "+5 XP",  note: "One time",      Icon: IconUser     },
  { action: "First Session Schedule",  xp: "+8 XP",  note: "One time",      Icon: IconTarget   },
  { action: "Add a skill to teach",    xp: "+3 XP",  note: "Per new skill", Icon: IconSparkle  },
];

function getLevelFromXP(xp = 0) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) || LEVELS[0];
}
function getNextLevel(xp = 0) {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  return LEVELS[idx + 1] || null;
}

async function shareBadge(badge, userName, setMsg) {
  const text = `I just earned the "${badge.title}" badge on SkillSwap!\n${badge.description}\n\n#SkillSwap #Badges #Learning`;
  if (navigator.share) {
    try { await navigator.share({ title: "SkillSwap Badge", text }); return; } catch (_) {}
  }
  try {
    await navigator.clipboard.writeText(text);
    setMsg(badge.id);
    setTimeout(() => setMsg(""), 2000);
  } catch (_) {}
}

const Badges = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { user }     = useContext(AuthContext);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://skill-swap-zkfd.onrender.com/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
      } catch {
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const xp             = profile?.xp || 0;
  const earnedBadgeIds = (profile?.badges || []).map((b) => b.id);
  const currentLevel   = getLevelFromXP(xp);
  const nextLevel      = getNextLevel(xp);
  const xpToNext       = nextLevel ? nextLevel.min - xp : 0;
  const progressPct    = nextLevel
    ? Math.round(((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
    : 100;
  const earnedCount = earnedBadgeIds.length;
  const dm = darkMode;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dm ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dm ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* ── HERO ── */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-10 py-16">
        <div className="max-w-5xl mx-auto text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <IconTrophy size={20} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold">My Badges & XP</h1>
          </div>
          <p className="text-teal-50 max-w-xl mb-10">
            Track your achievements and milestones as you master new skills and help the community grow.
          </p>

          {/* ── STAT BOXES inside hero ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Badges Earned */}
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <IconMedal size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  Badges Earned
                </p>
                <p className="text-white text-3xl font-bold leading-none">
                  {earnedCount}
                  <span className="text-white/50 text-lg font-medium ml-1">/ {ALL_BADGES.length}</span>
                </p>
              </div>
            </div>

            {/* Total XP */}
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <IconZap size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  Total XP
                </p>
                <p className="text-white text-3xl font-bold leading-none">
                  {xp}
                  <span className="text-white/50 text-lg font-medium ml-1">XP</span>
                </p>
              </div>
            </div>

            {/* Current Level */}
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <IconLevel size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  Current Level
                </p>
                <p className="text-white text-3xl font-bold leading-none">
                  Lv.{currentLevel.level}
                  <span className="text-white/70 text-lg font-medium ml-2">{currentLevel.title}</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* ── XP CARD ── */}
        <div className={`rounded-3xl p-8 shadow-md ${dm ? "bg-slate-800" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* Level circle */}
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${currentLevel.color} flex flex-col items-center justify-center shadow-lg shrink-0`}>
              <span className="text-white text-3xl font-bold">{currentLevel.level}</span>
              <span className="text-white/80 text-xs font-medium tracking-widest uppercase">LVL</span>
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-1">
                <h2 className={`text-2xl font-bold ${dm ? "text-white" : "text-slate-900"}`}>
                  {currentLevel.title}
                </h2>
                <div className="flex items-center gap-1.5 bg-teal-400/10 border border-teal-400/30 px-3 py-1 rounded-full">
                  <IconZap size={14} className="text-teal-400" />
                  <span className="text-teal-400 font-bold text-sm">{xp} XP</span>
                </div>
              </div>

              {nextLevel ? (
                <>
                  <p className={`text-sm mb-3 ${dm ? "text-slate-400" : "text-slate-500"}`}>
                    {xpToNext} XP to reach <strong>{nextLevel.title}</strong>
                  </p>
                  <div className={`h-3 rounded-full overflow-hidden ${dm ? "bg-slate-700" : "bg-slate-100"}`}>
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${currentLevel.color} transition-all duration-700`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-400">{currentLevel.min} XP</span>
                    <span className="text-xs text-slate-400">{nextLevel.min} XP</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <IconTrophy size={16} className="text-teal-400" />
                  <p className="text-sm text-teal-400 font-semibold">Max level reached — You're an Expert!</p>
                </div>
              )}

              {/* Level pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {LEVELS.map((l) => (
                  <div
                    key={l.level}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                      xp >= l.min
                        ? `bg-gradient-to-r ${l.color} text-white border-transparent`
                        : dm
                        ? "border-slate-600 text-slate-500"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    Lv.{l.level} {l.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW TO EARN XP ── */}
        <div className={`rounded-3xl p-6 shadow-md ${dm ? "bg-slate-800" : "bg-white"}`}>
          <div className="flex items-center gap-2 mb-5">
            <IconZap size={18} className="text-teal-500" />
            <h3 className={`font-semibold text-lg ${dm ? "text-white" : "text-slate-900"}`}>
              How to Earn XP
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {XP_ACTIONS.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl ${dm ? "bg-slate-700" : "bg-slate-50"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${dm ? "bg-slate-600" : "bg-teal-50"}`}>
                  <item.Icon size={16} className="text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${dm ? "text-white" : "text-slate-800"}`}>{item.action}</p>
                  <p className="text-xs text-slate-400">{item.note}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconZap size={12} className="text-teal-400" />
                  <span className="text-teal-400 font-bold text-sm">{item.xp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BADGES GRID ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${dm ? "text-white" : "text-slate-900"}`}>Badges</h2>
            <span className={`text-sm px-3 py-1 rounded-full border ${dm ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
              {earnedCount} / {ALL_BADGES.length} earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_BADGES.map((badge) => {
              const earned     = earnedBadgeIds.includes(badge.id);
              const earnedData = profile?.badges?.find((b) => b.id === badge.id);

              return earned ? (
                /* ✅ EARNED CARD */
                <div
                  key={badge.id}
                  className={`rounded-3xl p-6 shadow-md border border-teal-500/20 flex flex-col ${dm ? "bg-slate-800" : "bg-white"}`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center shadow-inner overflow-hidden">
                      <img src={badge.image} alt={badge.title} className="w-full h-full object-contain p-1" />
                    </div>
                  </div>

                  <div className="flex justify-center mb-3">
                    <span className="flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                      <IconCheck size={11} />
                      Earned
                    </span>
                  </div>

                  <h3 className={`text-lg font-bold text-center ${dm ? "text-white" : "text-slate-900"}`}>
                    {badge.title}
                  </h3>
                  <p className={`text-xs text-center mt-1 ${dm ? "text-slate-400" : "text-slate-500"}`}>
                    {badge.description}
                  </p>

                  {badge.xpBonus > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <IconZap size={12} className="text-teal-400" />
                      <span className="text-teal-400 text-xs font-semibold">+{badge.xpBonus} XP bonus</span>
                    </div>
                  )}

                  {earnedData?.earnedAt && (
                    <p className="text-center text-slate-400 text-xs mt-1">
                      {new Date(earnedData.earnedAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  )}

                  <button
                    onClick={() => shareBadge(badge, profile?.name, setCopiedId)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition active:scale-95"
                  >
                    {copiedId === badge.id ? (
                      <><IconCopy size={15} /> Copied</>
                    ) : (
                      <><IconShare size={15} /> Share</>
                    )}
                  </button>
                </div>
              ) : (
                /* LOCKED CARD */
                <div
                  key={badge.id}
                  className={`rounded-3xl p-6 border-2 border-dashed flex flex-col ${
                    dm ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden opacity-30">
                      <img src={badge.image} alt={badge.title} className="w-full h-full object-contain p-1" />
                    </div>
                  </div>

                  <div className="flex justify-center mb-3">
                    <span className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium ${dm ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                      <IconLock size={11} />
                      Locked
                    </span>
                  </div>

                  <h3 className={`text-base font-semibold text-center ${dm ? "text-slate-400" : "text-slate-600"}`}>
                    {badge.title}
                  </h3>
                  <p className={`text-xs text-center mt-1 ${dm ? "text-slate-500" : "text-slate-400"}`}>
                    {badge.description}
                  </p>

                  {badge.xpBonus > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <IconZap size={12} className="text-slate-400" />
                      <span className="text-slate-400 text-xs">+{badge.xpBonus} XP on unlock</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Badges;