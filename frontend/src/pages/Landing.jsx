// import { Link } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import { DarkModeContext } from "../context/DarkModeContext";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { FaCrown } from "react-icons/fa";
// import { GiTrophyCup } from "react-icons/gi";
// import { MdWorkspacePremium } from "react-icons/md";
// import axios from "axios";

// import {
//   FaHandshake,
//   FaUsers,
//   FaStar,
//   FaClock,
//   FaUserGraduate,
//   FaGift,
// } from "react-icons/fa";

// /* ================= MEDAL FUNCTION ================= */
// // const getMedal = (rank) => {
// //   if (rank === 1) return "🥇";
// //   if (rank === 2) return "🥈";
// //   if (rank === 3) return "🥉";
// //   return `#${rank}`;
// // };
// const getRankStyle = (rank) => {
//   if (rank === 1)
//     return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105";
//   if (rank === 2)
//     return "bg-gradient-to-r from-slate-300 to-slate-400 text-white";
//   if (rank === 3)
//     return "bg-gradient-to-r from-amber-600 to-amber-500 text-white";
//   return "bg-slate-200 text-slate-700";
// };
// const TypingHeading = () => {
//   const text = "Learn Faster By Teaching Others";
//   const [displayedText, setDisplayedText] = useState("");
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     let timeout;

//     if (!isDeleting && displayedText === text) {
//       // Pause at full text, then start deleting
//       timeout = setTimeout(() => setIsDeleting(true), 2200);
//     } else if (isDeleting && displayedText === "") {
//       // Pause at empty, then start typing
//       timeout = setTimeout(() => setIsDeleting(false), 500);
//     } else {
//       timeout = setTimeout(() => {
//         setDisplayedText((prev) =>
//           isDeleting ? prev.slice(0, -1) : text.slice(0, prev.length + 1)
//         );
//       }, isDeleting ? 28 : 55);
//     }

//     return () => clearTimeout(timeout);
//   }, [displayedText, isDeleting]);

// return (
//   <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
//     {/* Part 1 (black text) */}
//     {displayedText.substring(0, 16)}

//     {/* Part 2 (teal text while typing) */}
//     <span className="text-teal-500">
//       {displayedText.substring(16)}
//     </span>

//     <span className="animate-pulse text-teal-500">|</span>
//   </h1>
// );
// };
// // ─── Add this component above Landing ───────────────────────────────────────

// const SkillBuddyPanel = ({ darkMode }) => {
//   const [step, setStep] = useState(0);

//   useEffect(() => {
//     const t1 = setTimeout(() => setStep(1), 300);
//     const t2 = setTimeout(() => setStep(2), 900);
//     const t3 = setTimeout(() => setStep(3), 1600);
//     return () => [t1, t2, t3].forEach(clearTimeout);
//   }, []);

//   const card = darkMode
//     ? "bg-slate-800 border-slate-700"
//     : "bg-white border-slate-200";
//   const msgCard = darkMode
//     ? "bg-slate-700 border-slate-600 text-slate-100"
//     : "bg-white border-slate-200 text-slate-800";
//   const inputBg = darkMode ? "bg-slate-700 text-slate-500" : "bg-[#f4f8f6] text-slate-400";
//   const chatBg  = darkMode ? "bg-slate-900/40" : "bg-[#f8fffc]";

//   return (
//     <div className="relative w-[420px] h-[460px]">

//       {/* Glow rings */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-teal-300/25 pointer-events-none" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-teal-500/20 pointer-events-none" />

//       {/* ── MAIN CHAT CARD ── */}
//       <motion.div
//         animate={{ y: [0, -8, 0] }}
//         transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
//         onClick={() => {/* navigate handled by parent */}}
//         className={`absolute top-[30px] left-[40px] w-[280px] rounded-[20px] overflow-hidden border shadow-[0_8px_32px_rgba(29,158,117,0.12),0_1px_4px_rgba(0,0,0,0.06)] ${card}`}
//       >
//         {/* Header */}
//         <div className="bg-[#0F6E56] px-4 py-3 flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-[10px] bg-[#085041] flex items-center justify-center flex-shrink-0">
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
//             </svg>
//           </div>
//           <div className="flex-1">
//             <p className="text-white text-[12px] font-bold leading-none tracking-wide" style={{fontFamily:"system-ui,sans-serif"}}>Skill Buddy</p>
//             <p className="text-teal-300 text-[10px] mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>AI Learning Assistant</p>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 block" />
//             <span className="text-teal-300 text-[10px]" style={{fontFamily:"system-ui,sans-serif"}}>Live</span>
//           </div>
//         </div>

//         {/* Chat messages */}
//         <div className={`px-3.5 py-3 flex flex-col gap-2.5 ${chatBg}`}>
//           {step >= 1 && (
//             <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex gap-2 items-end">
//               <div className="w-6 h-6 rounded-lg bg-teal-600 flex-shrink-0 flex items-center justify-center">
//                 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
//                 </svg>
//               </div>
//               <div className={`rounded-xl rounded-bl-sm px-3 py-2 text-[11.5px] border max-w-[170px] leading-relaxed ${msgCard}`}>
//                 What would you like to master today?
//               </div>
//             </motion.div>
//           )}
//           {step >= 2 && (
//             <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex justify-end">
//               <div className="bg-teal-600 rounded-xl rounded-br-sm px-3 py-2 text-[11.5px] text-white max-w-[165px] leading-relaxed">
//                 Python for data science
//               </div>
//             </motion.div>
//           )}
//           {step >= 3 && (
//             <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex gap-2 items-end">
//               <div className="w-6 h-6 rounded-lg bg-teal-600 flex-shrink-0 flex items-center justify-center">
//                 <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
//                 </svg>
//               </div>
//               <div className={`rounded-xl rounded-bl-sm px-3 py-2.5 border ${msgCard}`}>
//                 <div className="flex gap-1 items-center">
//                   {[0,1,2].map(i => (
//                     <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-teal-500 block"
//                       animate={{opacity:[1,0.15,1]}}
//                       transition={{duration:1.4, repeat:Infinity, delay: i * 0.2}}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Input bar */}
//         <div className={`px-3 py-2.5 flex items-center gap-2 border-t ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
//           <div className={`flex-1 rounded-full px-3 py-1.5 text-[11px] ${inputBg}`}>
//             Ask anything...
//           </div>
//           <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
//             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/>
//             </svg>
//           </div>
//         </div>
//       </motion.div>

//       {/* ── STAT CARD — top right ── */}
//       <motion.div
//         animate={{ y: [0, -12, 0] }}
//         transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//         className={`absolute top-[14px] right-[10px] w-[118px] rounded-[16px] p-3.5 border shadow-[0_4px_20px_rgba(29,158,117,0.08)] ${card}`}
//       >
//         <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Learners</p>
//         <p className="text-2xl font-extrabold text-teal-700 leading-none" style={{fontFamily:"system-ui,sans-serif"}}>12.4k</p>
//         <div className="flex items-center gap-1 mt-1.5">
//           <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
//             <polyline points="2,9 6,3 10,9" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           <span className="text-[10px] text-teal-600 font-semibold" style={{fontFamily:"system-ui,sans-serif"}}>+18% this week</span>
//         </div>
//       </motion.div>

//       {/* ── SKILL PILLS — bottom left ── */}
//       <motion.div
//         animate={{ y: [0, -6, 0] }}
//         transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//         className="absolute bottom-[50px] left-[20px] flex flex-col gap-1.5"
//       >
//         <div className="flex gap-1.5">
//           {["Python","UI Design","React"].map((s,i) => (
//             <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
//               style={{
//                 background: ["#E1F5EE","#EEF2FF","#FEF3C7"][i],
//                 color: ["#0F6E56","#4338CA","#92400E"][i],
//                 fontFamily:"system-ui,sans-serif"
//               }}>
//               {s}
//             </span>
//           ))}
//         </div>
//         <div className="flex gap-1.5">
//           {["Data Science","DevOps"].map((s,i) => (
//             <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
//               style={{
//                 background: ["#FCE7F3","#ECFDF5"][i],
//                 color: ["#9D174D","#065F46"][i],
//                 fontFamily:"system-ui,sans-serif"
//               }}>
//               {s}
//             </span>
//           ))}
//         </div>
//       </motion.div>

//       {/* ── XP PROGRESS CARD — bottom right ── */}
//       <motion.div
//         animate={{ y: [0, -12, 0] }}
//         transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
//         className="absolute bottom-[40px] right-[8px] w-[130px] bg-[#0F6E56] rounded-[16px] p-3 shadow-[0_4px_20px_rgba(15,110,86,0.25)]"
//       >
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-[10px] font-bold text-teal-300 tracking-wider uppercase" style={{fontFamily:"system-ui,sans-serif"}}>XP Level</span>
//           <span className="text-[11px] font-extrabold text-white" style={{fontFamily:"system-ui,sans-serif"}}>Lv 7</span>
//         </div>
//         <div className="bg-[#085041] rounded-full h-1.5 overflow-hidden mb-1.5">
//           <div className="bg-teal-400 h-full rounded-full" style={{width:"68%"}} />
//         </div>
//         <p className="text-[10px] text-teal-300" style={{fontFamily:"system-ui,sans-serif"}}>3,420 / 5,000 XP</p>
//       </motion.div>

//     </div>
//   );
// };
// const SkillBuddyCard = ({ darkMode }) => {
//   const [step, setStep] = useState(0);

//   useEffect(() => {
//     const timers = [
//       setTimeout(() => setStep(1), 400),
//       setTimeout(() => setStep(2), 1100),
//       setTimeout(() => setStep(3), 1900),
//     ];
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   const cardBg = darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
//   const inputBg = darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400";
//   const msgBg = darkMode ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-800";

//   return (
//     <div className="relative w-[290px]">
//       {/* Decorative orbs */}
//       <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-teal-100 opacity-60 pointer-events-none" />
//       <div className="absolute -bottom-3 -left-6 w-16 h-16 rounded-full bg-teal-200 opacity-40 pointer-events-none" />

//       {/* Floating card */}
//       <motion.div
//         animate={{ y: [0, -10, 0] }}
//         transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
//         className={`relative rounded-2xl border overflow-hidden shadow-lg ${cardBg}`}
//       >
//         {/* Header */}
//         <div className="bg-teal-600 px-4 py-3 flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center flex-shrink-0">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
//               <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
//             </svg>
//           </div>
//           <div>
//             <p className="text-white text-sm font-semibold leading-none">Skill Buddy</p>
//             <p className="text-teal-200 text-xs mt-0.5">AI Learning Assistant</p>
//           </div>
//           <div className="ml-auto flex items-center gap-1.5">
//             <span className="w-2 h-2 rounded-full bg-emerald-300" />
//             <span className="text-teal-200 text-xs">Online</span>
//           </div>
//         </div>

//         {/* Chat body */}
//         <div className={`px-4 py-3 flex flex-col gap-3 min-h-[160px] ${darkMode ? "bg-slate-900/40" : "bg-teal-50/40"}`}>

//           {step >= 1 && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex gap-2 items-end"
//             >
//               <div className="w-6 h-6 rounded-md bg-teal-600 flex-shrink-0 flex items-center justify-center">
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
//                 </svg>
//               </div>
//               <div className={`rounded-xl rounded-bl-sm px-3 py-2 text-xs border max-w-[170px] leading-relaxed ${msgBg}`}>
//                 Hi! What skill would you like to learn today?
//               </div>
//             </motion.div>
//           )}

//           {step >= 2 && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex justify-end"
//             >
//               <div className="bg-teal-500 rounded-xl rounded-br-sm px-3 py-2 text-xs text-white max-w-[170px] leading-relaxed">
//                 I want to learn Python for data science
//               </div>
//             </motion.div>
//           )}

//           {step >= 3 && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="flex gap-2 items-end"
//             >
//               <div className="w-6 h-6 rounded-md bg-teal-600 flex-shrink-0 flex items-center justify-center">
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
//                   <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
//                 </svg>
//               </div>
//               <div className={`rounded-xl rounded-bl-sm px-3 py-2.5 border ${msgBg}`}>
//                 <div className="flex gap-1 items-center">
//                   {[0, 1, 2].map((i) => (
//                     <motion.span
//                       key={i}
//                       className="w-1.5 h-1.5 rounded-full bg-teal-500 block"
//                       animate={{ opacity: [1, 0.2, 1] }}
//                       transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Input bar */}
//         <div className={`px-3 py-2.5 flex items-center gap-2 border-t ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}>
//           <div className={`flex-1 rounded-full px-3 py-1.5 text-xs ${inputBg}`}>
//             Ask anything...
//           </div>
//           <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
//             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
//             </svg>
//           </div>
//         </div>
//       </motion.div>

//       <div className="mt-4 text-center">
//         <p className={`text-sm font-semibold ${darkMode ? "text-teal-400" : "text-teal-700"}`}>
//           Meet Skill Buddy
//         </p>
//         <p className="text-xs text-slate-500 mt-0.5">Your personal AI learning assistant · Click to start</p>
//       </div>
//     </div>
//   );
// };

// const Landing = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { darkMode } = useContext(DarkModeContext);

//   const [top5, setTop5] = useState([]);
//   const [leaderboardLoading, setLeaderboardLoading] = useState(true);

//   /* ================= CHECK LOGIN ================= */
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     setIsLoggedIn(!!user);
//   }, []);

//   /* ================= FETCH TOP 5 ================= */
//   useEffect(() => {
//     const fetchTop5 = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const { data } = await axios.get(
//           "http://localhost:5000/api/leaderboard",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         setTop5(data.slice(0, 5));
//       } catch (err) {
//         console.error("Leaderboard preview error:", err);
//       } finally {
//         setLeaderboardLoading(false);
//       }
//     };

//     fetchTop5();
//   }, []);

//   return (
//     <div
//       className={`min-h-screen transition-colors ${
//         darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
//       }`}
//     >
//       {/* ================= HERO SECTION ================= */}
//       <section className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6 py-28 items-center">
//         {/* Glow Background */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-400/20 blur-[120px] rounded-full pointer-events-none"></div>

//         {/* LEFT CONTENT */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="relative z-10"
//         >
//           <TypingHeading />

//        <p
//   className={`mt-6 text-base ${
//     darkMode ? "text-slate-300" : "text-slate-600"
//   } max-w-md mb-8`}
// >
//             SkillSwap connects curious learners with passionate mentors.
//             Exchange knowledge, grow your network, and build real-world skills.
//           </p>

//           <div className="flex gap-4 flex-wrap">
//             {isLoggedIn ? (
//               <Link
//                 to="/profile"
//                 className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition"
//               >
//                 Go to Profile
//               </Link>
//             ) : (
//               <Link
//                 to="/login"
//                 className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition"
//               >
//                 Get Started
//               </Link>
//             )}

//             <a
//               href="#how-it-works"
//               className={`px-6 py-3 rounded-xl font-medium transition ${
//                 darkMode
//                   ? "bg-slate-700 hover:bg-slate-600 text-white"
//                   : "bg-slate-100 hover:bg-slate-200 text-slate-900"
//               }`}
//             >
//               How it Works
//             </a>
//           </div>
//         </motion.div>

//         {/* RIGHT IMAGE */}
//    {/* RIGHT IMAGE — Skill Buddy */}
// {/* RIGHT IMAGE — Skill Buddy */}
// <div className="flex justify-center md:justify-end">
//   <motion.div
//     onClick={() => navigate("/skill-buddy")}
//     className="cursor-pointer flex flex-col items-center select-none"
//     initial={{ opacity: 0, x: 40 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.6 }}
//     whileHover={{ scale: 1.03 }}
//   >
//     <SkillBuddyCard darkMode={darkMode} />
//   </motion.div>
// </div>
//       </section>

//       {/* ================= FEATURES ================= */}
//       <section className={`py-20 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="mb-10">
//             <h2 className="text-2xl font-bold">Why Choose SkillSwap?</h2>
//             <p
//               className={`text-sm ${
//                 darkMode ? "text-slate-300" : "text-slate-600"
//               }`}
//             >
//               Powerful features that make learning simple and collaborative.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {[
//               {
//                 title: "1-to-1 Skill Exchange",
//                 desc: "Teach what you know and learn what you need.",
//                 icon: <FaHandshake size={28} />,
//               },
//               {
//                 title: "Smart Matching",
//                 desc: "Find users who want your skills and offer what you need.",
//                 icon: <FaUsers size={28} />,
//               },
//               {
//                 title: "Verified Profiles",
//                 desc: "Real users with ratings and trusted profiles.",
//                 icon: <FaStar size={28} />,
//               },
//               {
//                 title: "Flexible Learning",
//                 desc: "Learn anytime based on your schedule.",
//                 icon: <FaClock size={28} />,
//               },
//               {
//                 title: "Peer to Peer Learning",
//                 desc: "Collaborate and grow with learners across the community.",
//                 icon: <FaUserGraduate size={28} />,
//               },
//               {
//                 title: "Completely Free",
//                 desc: "No payments, only knowledge exchange.",
//                 icon: <FaGift size={28} />,
//               },
//             ].map((item) => (
//               <motion.div
//                 key={item.title}
//                 whileHover={{ y: -6, scale: 1.02 }}
//                 className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition ${
//                   darkMode
//                     ? "bg-slate-800 hover:bg-slate-700"
//                     : "bg-white hover:bg-slate-100"
//                 }`}
//               >
//                 <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 text-white mb-4">
//                   {item.icon}
//                 </div>

//                 <h3 className="font-semibold mb-2">{item.title}</h3>
//                 <p className="text-sm text-slate-500">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= LEADERBOARD PREVIEW ================= */}
// {isLoggedIn && !leaderboardLoading && top5.length > 0 && (
//   <section className={`py-24 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
//     <div className="max-w-6xl mx-auto px-6">

//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-10">
//         <div>
//           <div className="flex flex-col gap-2">
//   <h2 className="text-4xl md:text-5xl font-extrabold leading-tight flex items-center gap-4">

//     <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-transparent bg-clip-text">
//       Top Learners
//     </span>

//     <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-xl shadow-md">
//       <GiTrophyCup />
//     </span>

//   </h2>

//   <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-base`}>
//     The most active learners on SkillSwap right now
//   </p>
// </div>
//           <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-sm`}>
//             The most active learners this week
//           </p>
//         </div>

//         <Link
//           to="/leaderboard"
//           className="text-teal-500 font-medium hover:underline"
//         >
//           View Full Leaderboard →
//         </Link>
//       </div>

//       {/* LIST */}
//       <div className="flex flex-col gap-4 max-w-3xl">

//         {top5.map((entry, index) => (
//           <motion.div
//             key={entry._id}
//             whileHover={{ scale: 1.02 }}
//             className={`flex items-center gap-5 p-5 rounded-3xl transition shadow-md ${
//               darkMode
//                 ? "bg-slate-800 hover:bg-slate-700"
//                 : "bg-white hover:shadow-lg"
//             }`}
//           >

//             {/* RANK BADGE */}
//             <div
//               className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankStyle(entry.rank)}`}
//             >
//               {entry.rank === 1 ? <FaCrown /> : entry.rank}
//             </div>

//             {/* AVATAR */}
//             <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold overflow-hidden text-lg">
//               {entry.profilePic ? (
//                 <img
//                   src={entry.profilePic}
//                   alt={entry.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 entry.name?.[0]?.toUpperCase()
//               )}
//             </div>

//             {/* USER INFO */}
//             <div className="flex-1">
//               <p className="font-semibold text-lg">{entry.name}</p>

//               <p className="text-sm text-slate-400 flex items-center gap-2">
//                 <MdWorkspacePremium className="text-yellow-500" />
//                 Level {entry.level} · {entry.badgeCount} badge
//                 {entry.badgeCount !== 1 ? "s" : ""}
//               </p>
//             </div>

//             {/* XP BOX */}
//             <div className="text-right">
//               <p className="text-xs text-slate-400">XP</p>
//               <p className="text-xl font-bold text-teal-500">
//                 {entry.xp}
//               </p>
//             </div>
//           </motion.div>
//         ))}

//       </div>
//     </div>
//   </section>
// )}
//       {/* ================= HOW IT WORKS ================= */}
//       <section
//         id="how-it-works"
//         className="max-w-5xl mx-auto px-6 py-24 text-center"
//       >
//         <h2 className="text-3xl font-bold mb-2">How It Works</h2>
//         <p className={`mb-16 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
//           Our simple process to start your learning journey.
//         </p>

//         <div className="space-y-12 text-left">
//           {[
//             {
//               title: "List Your Skills",
//               desc: "Add skills you can teach or want to learn. Create your professional profile in minutes.",
//             },
//             {
//               title: "Find a Match",
//               desc: "Get matched with users based on mutual interests and learning goals.",
//             },
//             {
//               title: "Start Swapping",
//               desc: "Schedule sessions, exchange feedback, and grow your network globally.",
//             },
//           ].map((step, i) => (
//             <div key={i} className="flex gap-6 items-start">
//               <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
//                 {i + 1}
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-1">{step.title}</h3>
//                 <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
//                   {step.desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       {!isLoggedIn && (
//         <section className="max-w-6xl mx-auto px-6 mb-24">
//           <div className="rounded-[32px] text-center py-20 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
//             <h2 className="text-3xl font-bold mb-4">
//               Ready to grow your skill set?
//             </h2>

//             <p className="text-teal-100 mb-8">
//               Join an active community of learners and mentors today.
//             </p>

//             <Link
//               to="/register"
//               className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition"
//             >
//               Create Your Account
//             </Link>
//           </div>
//         </section>
//       )}

//       {/* ================= FOOTER ================= */}
//       <footer
//         className={`border-t py-6 text-sm ${
//           darkMode
//             ? "text-slate-400 border-slate-700"
//             : "text-slate-500 border-slate-200"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           © 2026 SkillSwap · Learn by Sharing
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;





import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCrown } from "react-icons/fa";
import { GiTrophyCup } from "react-icons/gi";
import { MdWorkspacePremium } from "react-icons/md";
import axios from "axios";

import {
  FaHandshake,
  FaUsers,
  FaStar,
  FaClock,
  FaUserGraduate,
  FaGift,
} from "react-icons/fa";

/* ================= MEDAL FUNCTION ================= */
// const getMedal = (rank) => {
//   if (rank === 1) return "🥇";
//   if (rank === 2) return "🥈";
//   if (rank === 3) return "🥉";
//   return `#${rank}`;
// };
const getRankStyle = (rank) => {
  if (rank === 1)
    return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105";
  if (rank === 2)
    return "bg-gradient-to-r from-slate-300 to-slate-400 text-white";
  if (rank === 3)
    return "bg-gradient-to-r from-amber-600 to-amber-500 text-white";
  return "bg-slate-200 text-slate-700";
};
const TypingHeading = () => {
  const text = "Learn Faster By Teaching Others";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && displayedText === text) {
      // Pause at full text, then start deleting
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayedText === "") {
      // Pause at empty, then start typing
      timeout = setTimeout(() => setIsDeleting(false), 500);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting ? prev.slice(0, -1) : text.slice(0, prev.length + 1)
        );
      }, isDeleting ? 28 : 55);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting]);

return (
  <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
    {/* Part 1 (black text) */}
    {displayedText.substring(0, 16)}

    {/* Part 2 (teal text while typing) */}
    <span className="text-teal-500">
      {displayedText.substring(16)}
    </span>

    <span className="animate-pulse text-teal-500">|</span>
  </h1>
);
};
// ─── Add this component above Landing ───────────────────────────────────────

const SkillBuddyPanel = ({ darkMode }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const card = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const msgCard = darkMode
    ? "bg-slate-700 border-slate-600 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";
  const inputBg = darkMode ? "bg-slate-700 text-slate-500" : "bg-[#f4f8f6] text-slate-400";
  const chatBg  = darkMode ? "bg-slate-900/40" : "bg-[#f8fffc]";

  return (
    <div className="relative w-[420px] h-[460px]">

      {/* Glow rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-teal-300/25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-teal-500/20 pointer-events-none" />

      {/* ── MAIN CHAT CARD ── */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {/* navigate handled by parent */}}
        className={`absolute top-[30px] left-[40px] w-[280px] rounded-[20px] overflow-hidden border shadow-[0_8px_32px_rgba(29,158,117,0.12),0_1px_4px_rgba(0,0,0,0.06)] ${card}`}
      >
        {/* Header */}
        <div className="bg-[#0F6E56] px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-[#085041] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-[12px] font-bold leading-none tracking-wide" style={{fontFamily:"system-ui,sans-serif"}}>Skill Buddy</p>
            <p className="text-teal-300 text-[10px] mt-0.5" style={{fontFamily:"system-ui,sans-serif"}}>AI Learning Assistant</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-[7px] h-[7px] rounded-full bg-emerald-400 block" />
            <span className="text-teal-300 text-[10px]" style={{fontFamily:"system-ui,sans-serif"}}>Live</span>
          </div>
        </div>

        {/* Chat messages */}
        <div className={`px-3.5 py-3 flex flex-col gap-2.5 ${chatBg}`}>
          {step >= 1 && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex gap-2 items-end">
              <div className="w-6 h-6 rounded-lg bg-teal-600 flex-shrink-0 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className={`rounded-xl rounded-bl-sm px-3 py-2 text-[11.5px] border max-w-[170px] leading-relaxed ${msgCard}`}>
                What would you like to master today?
              </div>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex justify-end">
              <div className="bg-teal-600 rounded-xl rounded-br-sm px-3 py-2 text-[11.5px] text-white max-w-[165px] leading-relaxed">
                Python for data science
              </div>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex gap-2 items-end">
              <div className="w-6 h-6 rounded-lg bg-teal-600 flex-shrink-0 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className={`rounded-xl rounded-bl-sm px-3 py-2.5 border ${msgCard}`}>
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(i => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-teal-500 block"
                      animate={{opacity:[1,0.15,1]}}
                      transition={{duration:1.4, repeat:Infinity, delay: i * 0.2}}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className={`px-3 py-2.5 flex items-center gap-2 border-t ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
          <div className={`flex-1 rounded-full px-3 py-1.5 text-[11px] ${inputBg}`}>
            Ask anything...
          </div>
          <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* ── STAT CARD — top right ── */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className={`absolute top-[14px] right-[10px] w-[118px] rounded-[16px] p-3.5 border shadow-[0_4px_20px_rgba(29,158,117,0.08)] ${card}`}
      >
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1" style={{fontFamily:"system-ui,sans-serif"}}>Learners</p>
        <p className="text-2xl font-extrabold text-teal-700 leading-none" style={{fontFamily:"system-ui,sans-serif"}}>12.4k</p>
        <div className="flex items-center gap-1 mt-1.5">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,9 6,3 10,9" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[10px] text-teal-600 font-semibold" style={{fontFamily:"system-ui,sans-serif"}}>+18% this week</span>
        </div>
      </motion.div>

      {/* ── SKILL PILLS — bottom left ── */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[50px] left-[20px] flex flex-col gap-1.5"
      >
        <div className="flex gap-1.5">
          {["Python","UI Design","React"].map((s,i) => (
            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: ["#E1F5EE","#EEF2FF","#FEF3C7"][i],
                color: ["#0F6E56","#4338CA","#92400E"][i],
                fontFamily:"system-ui,sans-serif"
              }}>
              {s}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          {["Data Science","DevOps"].map((s,i) => (
            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: ["#FCE7F3","#ECFDF5"][i],
                color: ["#9D174D","#065F46"][i],
                fontFamily:"system-ui,sans-serif"
              }}>
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── XP PROGRESS CARD — bottom right ── */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute bottom-[40px] right-[8px] w-[130px] bg-[#0F6E56] rounded-[16px] p-3 shadow-[0_4px_20px_rgba(15,110,86,0.25)]"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-teal-300 tracking-wider uppercase" style={{fontFamily:"system-ui,sans-serif"}}>XP Level</span>
          <span className="text-[11px] font-extrabold text-white" style={{fontFamily:"system-ui,sans-serif"}}>Lv 7</span>
        </div>
        <div className="bg-[#085041] rounded-full h-1.5 overflow-hidden mb-1.5">
          <div className="bg-teal-400 h-full rounded-full" style={{width:"68%"}} />
        </div>
        <p className="text-[10px] text-teal-300" style={{fontFamily:"system-ui,sans-serif"}}>3,420 / 5,000 XP</p>
      </motion.div>

    </div>
  );
};
const SkillBuddyCard = ({ darkMode }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const cardBg = darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const inputBg = darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400";
  const msgBg = darkMode ? "bg-slate-700 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-800";

  return (
    <div className="relative w-[290px]">
      {/* Decorative orbs */}
      <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-teal-100 opacity-60 pointer-events-none" />
      <div className="absolute -bottom-3 -left-6 w-16 h-16 rounded-full bg-teal-200 opacity-40 pointer-events-none" />

      {/* Floating card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className={`relative rounded-2xl border overflow-hidden shadow-lg ${cardBg}`}
      >
        {/* Header */}
        <div className="bg-teal-600 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Skill Buddy</p>
            <p className="text-teal-200 text-xs mt-0.5">AI Learning Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span className="text-teal-200 text-xs">Online</span>
          </div>
        </div>

        {/* Chat body */}
        <div className={`px-4 py-3 flex flex-col gap-3 min-h-[160px] ${darkMode ? "bg-slate-900/40" : "bg-teal-50/40"}`}>

          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 items-end"
            >
              <div className="w-6 h-6 rounded-md bg-teal-600 flex-shrink-0 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={`rounded-xl rounded-bl-sm px-3 py-2 text-xs border max-w-[170px] leading-relaxed ${msgBg}`}>
                Hi! What skill would you like to learn today?
              </div>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="bg-teal-500 rounded-xl rounded-br-sm px-3 py-2 text-xs text-white max-w-[170px] leading-relaxed">
                I want to learn Python for data science
              </div>
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 items-end"
            >
              <div className="w-6 h-6 rounded-md bg-teal-600 flex-shrink-0 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={`rounded-xl rounded-bl-sm px-3 py-2.5 border ${msgBg}`}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-teal-500 block"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input bar */}
        <div className={`px-3 py-2.5 flex items-center gap-2 border-t ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`}>
          <div className={`flex-1 rounded-full px-3 py-1.5 text-xs ${inputBg}`}>
            Ask anything...
          </div>
          <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 text-center">
        <p className={`text-sm font-semibold ${darkMode ? "text-teal-400" : "text-teal-700"}`}>
          Meet Skill Buddy
        </p>
        <p className="text-xs text-slate-500 mt-0.5">Your personal AI learning assistant · Click to start</p>
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode } = useContext(DarkModeContext);

  const [top5, setTop5] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  /* ================= CHECK LOGIN ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!user);
  }, []);

  /* ================= FETCH TOP 5 ================= */
  useEffect(() => {
    const fetchTop5 = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(
          "http://localhost:5000/api/leaderboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTop5(data.slice(0, 5));
      } catch (err) {
        console.error("Leaderboard preview error:", err);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchTop5();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors ${
        darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* ================= HERO SECTION ================= */}
      <section className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 px-6 py-28 items-center">
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-400/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <TypingHeading />

       <p
  className={`mt-6 text-base ${
    darkMode ? "text-slate-300" : "text-slate-600"
  } max-w-md mb-8`}
>
            SkillSwap connects curious learners with passionate mentors.
            Exchange knowledge, grow your network, and build real-world skills.
          </p>

          <div className="flex gap-4 flex-wrap">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition"
              >
                Go to Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition"
              >
                Get Started
              </Link>
            )}

            <a
              href="#how-it-works"
              className={`px-6 py-3 rounded-xl font-medium transition ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900"
              }`}
            >
              How it Works
            </a>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
   {/* RIGHT IMAGE — Skill Buddy */}
{/* RIGHT IMAGE — Skill Buddy */}
<div className="flex justify-center md:justify-end">
  <motion.div
    onClick={() => navigate("/skill-buddy")}
    className="cursor-pointer flex flex-col items-center select-none"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    whileHover={{ scale: 1.03 }}
  >
    <SkillBuddyCard darkMode={darkMode} />
  </motion.div>
</div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={`py-20 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold">Why Choose SkillSwap?</h2>
            <p
              className={`text-sm ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Powerful features that make learning simple and collaborative.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1-to-1 Skill Exchange",
                desc: "Teach what you know and learn what you need.",
                icon: <FaHandshake size={28} />,
              },
              {
                title: "Smart Matching",
                desc: "Find users who want your skills and offer what you need.",
                icon: <FaUsers size={28} />,
              },
              {
                title: "Verified Profiles",
                desc: "Real users with ratings and trusted profiles.",
                icon: <FaStar size={28} />,
              },
              {
                title: "Flexible Learning",
                desc: "Learn anytime based on your schedule.",
                icon: <FaClock size={28} />,
              },
              {
                title: "Peer to Peer Learning",
                desc: "Collaborate and grow with learners across the community.",
                icon: <FaUserGraduate size={28} />,
              },
              {
                title: "Completely Free",
                desc: "No payments, only knowledge exchange.",
                icon: <FaGift size={28} />,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 text-white mb-4">
                  {item.icon}
                </div>

                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERBOARD PREVIEW ================= */}
{isLoggedIn && !leaderboardLoading && top5.length > 0 && (
  <section className={`py-24 ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}>
    <div className="max-w-6xl mx-auto px-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex flex-col gap-2">
  <h2 className="text-4xl md:text-5xl font-extrabold leading-tight flex items-center gap-4">

    <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 text-transparent bg-clip-text">
      Top Learners
    </span>

    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-xl shadow-md">
      <GiTrophyCup />
    </span>

  </h2>

  <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-base`}>
    The most active learners on SkillSwap right now
  </p>
</div>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-sm`}>
            The most active learners this week
          </p>
        </div>

        <Link
          to="/leaderboard"
          className="text-teal-500 font-medium hover:underline"
        >
          View Full Leaderboard →
        </Link>
      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4 max-w-3xl">

        {top5.map((entry, index) => (
          <motion.div
            key={entry._id}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-5 p-5 rounded-3xl transition shadow-md ${
              darkMode
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-white hover:shadow-lg"
            }`}
          >

            {/* RANK BADGE */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankStyle(entry.rank)}`}
            >
              {entry.rank === 1 ? <FaCrown /> : entry.rank}
            </div>

            {/* AVATAR */}
            <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold overflow-hidden text-lg">
              {entry.profilePic ? (
                <img
                  src={entry.profilePic}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                entry.name?.[0]?.toUpperCase()
              )}
            </div>

            {/* USER INFO */}
            <div className="flex-1">
              <p className="font-semibold text-lg">{entry.name}</p>

              <p className="text-sm text-slate-400 flex items-center gap-2">
                <MdWorkspacePremium className="text-yellow-500" />
                Level {entry.level} · {entry.badgeCount} badge
                {entry.badgeCount !== 1 ? "s" : ""}
              </p>
            </div>

            {/* XP BOX */}
            <div className="text-right">
              <p className="text-xs text-slate-400">XP</p>
              <p className="text-xl font-bold text-teal-500">
                {entry.xp}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  </section>
)}
      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 py-24 text-center"
      >
        <h2 className="text-3xl font-bold mb-2">How It Works</h2>
        <p className={`mb-16 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          Our simple process to start your learning journey.
        </p>

        <div className="space-y-12 text-left">
          {[
            {
              title: "List Your Skills",
              desc: "Add skills you can teach or want to learn. Create your professional profile in minutes.",
            },
            {
              title: "Find a Match",
              desc: "Get matched with users based on mutual interests and learning goals.",
            },
            {
              title: "Start Swapping",
              desc: "Schedule sessions, exchange feedback, and grow your network globally.",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      {!isLoggedIn && (
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="rounded-[32px] text-center py-20 px-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to grow your skill set?
            </h2>

            <p className="text-teal-100 mb-8">
              Join an active community of learners and mentors today.
            </p>

            <Link
              to="/register"
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-50 transition"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer
        className={`border-t py-6 text-sm ${
          darkMode
            ? "text-slate-400 border-slate-700"
            : "text-slate-500 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          © 2026 SkillSwap · Learn by Sharing
        </div>
      </footer>
    </div>
  );
};

export default Landing;